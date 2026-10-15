import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft2, Messages1, Send2 } from "iconsax-react";
import { autoReplies, initialConversations } from "../../data/messagesData";
import { useApp } from "../../context/AppContext";

const STORAGE_KEY = "messages";
const FILTERS = ["All", "Unread"];

// Conversations are kept in this browser so replies survive a reload.
const loadConversations = () => {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(stored)) return stored;
    } catch {
        // storage unavailable or corrupt: fall back to the demo data
    }
    return initialConversations;
};

const relativeTime = (iso) => {
    const diff = (Date.now() - new Date(iso)) / 60000;
    if (diff < 1) return "now";
    if (diff < 60) return `${Math.floor(diff)}m`;
    if (diff < 24 * 60) return `${Math.floor(diff / 60)}h`;
    if (diff < 7 * 24 * 60) return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const clockTime = (iso) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const dayLabel = (iso) => {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
};

const Avatar = ({ person, size = "h-10 w-10" }) =>
    person.image ? (
        <img src={person.image} alt="" className={`${size} shrink-0 rounded-full object-cover`} />
    ) : (
        <span aria-hidden="true" className={`${size} flex shrink-0 items-center justify-center rounded-full bg-[#34CAA5]/15 text-xs font-semibold text-[#34CAA5]`}>
            {person.name
                .split(" ")
                .map((w) => w[0])
                .join("")}
        </span>
    );

const ConversationList = ({ conversations, selectedId, onSelect, filter, setFilter, searchQuery }) => (
    <div className="flex min-h-0 flex-col">
        <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
            <h2 className="card-title">Inbox</h2>
            <div className="flex rounded-full bg-slate-100 dark:bg-slate-600 p-0.5 text-xs">
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        className={`rounded-full px-3 py-1 transition-colors ${
                            filter === f
                                ? "bg-white dark:bg-slate-800 shadow-sm font-medium text-[#26282C] dark:text-white"
                                : "text-[#737373] dark:text-slate-300"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto scroll-thin px-2 pb-2">
            {conversations.map((c) => {
                const last = c.messages[c.messages.length - 1];
                const active = c.id === selectedId;
                return (
                    <li key={c.id}>
                        <button
                            type="button"
                            onClick={() => onSelect(c.id)}
                            aria-current={active ? "true" : undefined}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                                active ? "bg-[#34CAA5]/10" : "hover:bg-slate-50 dark:hover:bg-slate-600/50"
                            }`}
                        >
                            <Avatar person={c} />
                            <span className="min-w-0 flex-1">
                                <span className="flex items-baseline justify-between gap-2">
                                    <span className={`truncate text-sm ${c.unread ? "font-semibold" : "font-medium"}`}>{c.name}</span>
                                    <span className="shrink-0 text-[11px] text-[#A3A3A3]">{relativeTime(last.time)}</span>
                                </span>
                                <span className="mt-0.5 flex items-center justify-between gap-2">
                                    <span className={`truncate text-xs ${c.unread ? "text-[#26282C] dark:text-white" : "text-[#737373] dark:text-slate-300"}`}>
                                        {last.from === "me" && "You: "}
                                        {last.text}
                                    </span>
                                    {c.unread > 0 && (
                                        <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-[#34CAA5] px-1 text-[10px] font-semibold text-white">
                                            {c.unread}
                                        </span>
                                    )}
                                </span>
                            </span>
                        </button>
                    </li>
                );
            })}
            {conversations.length === 0 && (
                <li className="px-3 py-10 text-center text-xs text-[#A3A3A3]">
                    {searchQuery ? `No conversations match “${searchQuery}”.` : "No unread messages 🎉"}
                </li>
            )}
        </ul>
    </div>
);

const Thread = ({ conversation, typing, onBack, onSend }) => {
    const [draft, setDraft] = useState("");
    const endRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ block: "end" });
    }, [conversation.messages.length, typing]);

    useEffect(() => {
        setDraft("");
        inputRef.current?.focus({ preventScroll: true });
    }, [conversation.id]);

    const send = (e) => {
        e?.preventDefault();
        const text = draft.trim();
        if (!text) return;
        onSend(text);
        setDraft("");
    };

    let lastDay = null;

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-3 border-b border-[#EDF2F6] dark:border-slate-600 px-4 py-3">
                <button
                    type="button"
                    aria-label="Back to inbox"
                    onClick={onBack}
                    className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-[#697689] hover:bg-slate-100 dark:hover:bg-slate-600 lg:hidden"
                >
                    <ArrowLeft2 size="18" color="currentColor" />
                </button>
                <Avatar person={conversation} />
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{conversation.name}</p>
                    <p className="truncate text-xs text-[#737373] dark:text-slate-300">{typing ? "typing…" : conversation.email}</p>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto scroll-thin px-4 py-4">
                <ol className="flex flex-col gap-2">
                    {conversation.messages.map((m) => {
                        const day = dayLabel(m.time);
                        const showDay = day !== lastDay;
                        lastDay = day;
                        const mine = m.from === "me";
                        return (
                            <li key={m.id} className="flex flex-col">
                                {showDay && (
                                    <span className="my-2 self-center rounded-full bg-slate-100 dark:bg-slate-600 px-3 py-1 text-[11px] text-[#737373] dark:text-slate-300">
                                        {day}
                                    </span>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                                        mine
                                            ? "self-end rounded-br-md bg-[#34CAA5] text-white"
                                            : "self-start rounded-bl-md bg-slate-100 text-[#26282C] dark:bg-slate-600 dark:text-white"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                                    <p className={`mt-1 text-right text-[10px] ${mine ? "text-white/75" : "text-[#A3A3A3]"}`}>{clockTime(m.time)}</p>
                                </div>
                            </li>
                        );
                    })}
                    {typing && (
                        <li aria-label={`${conversation.name} is typing`} className="flex self-start gap-1 rounded-2xl rounded-bl-md bg-slate-100 dark:bg-slate-600 px-4 py-3">
                            {[0, 150, 300].map((delay) => (
                                <span key={delay} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A3A3A3]" style={{ animationDelay: `${delay}ms` }} />
                            ))}
                        </li>
                    )}
                </ol>
                <div ref={endRef} />
            </div>

            <form onSubmit={send} className="flex items-end gap-2 border-t border-[#EDF2F6] dark:border-slate-600 p-3">
                <textarea
                    ref={inputRef}
                    rows={1}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) send(e);
                    }}
                    placeholder={`Message ${conversation.name.split(" ")[0]}…`}
                    aria-label="Message"
                    className="max-h-32 min-h-[40px] flex-1 resize-none rounded-2xl border border-[#DADDDD] dark:border-slate-500 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none transition focus:border-[#34CAA5] focus:ring-2 focus:ring-[#34CAA5]/20 placeholder:text-[#A3A3A3]"
                />
                <button
                    type="submit"
                    aria-label="Send"
                    disabled={!draft.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#34CAA5] text-white transition-colors hover:bg-[#2bb592] disabled:opacity-40"
                >
                    <Send2 size="18" color="currentColor" variant="Bold" />
                </button>
            </form>
        </div>
    );
};

const Messages = () => {
    const { searchQuery } = useApp();
    const [conversations, setConversations] = useState(loadConversations);
    const [selectedId, setSelectedId] = useState(null);
    const [filter, setFilter] = useState("All");
    const [typingId, setTypingId] = useState(null);
    const timers = useRef([]);
    const selectedRef = useRef(selectedId);
    selectedRef.current = selectedId;

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
        } catch {
            // ignore
        }
    }, [conversations]);

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const visible = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return conversations
            .filter(
                (c) =>
                    (filter === "All" || c.unread > 0) &&
                    (!q || c.name.toLowerCase().includes(q) || c.messages.some((m) => m.text.toLowerCase().includes(q)))
            )
            .sort((a, b) => b.messages[b.messages.length - 1].time.localeCompare(a.messages[a.messages.length - 1].time));
    }, [conversations, filter, searchQuery]);

    const selected = conversations.find((c) => c.id === selectedId);

    const select = (id) => {
        setSelectedId(id);
        setConversations((list) => list.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    };

    const append = (id, from, text) =>
        setConversations((list) =>
            list.map((c) =>
                c.id === id
                    ? {
                          ...c,
                          // A reply to a conversation you're not looking at counts as unread.
                          unread: from === "them" && selectedRef.current !== id ? c.unread + 1 : c.unread,
                          messages: [...c.messages, { id: `${Date.now()}-${from}`, from, text, time: new Date().toISOString() }],
                      }
                    : c
            )
        );

    // Simulate the customer writing back so the inbox feels alive.
    const send = (text) => {
        const id = selectedId;
        append(id, "me", text);
        const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        timers.current.push(
            setTimeout(() => setTypingId(id), 800),
            setTimeout(() => {
                setTypingId(null);
                append(id, "them", reply);
            }, 2600)
        );
    };

    return (
        <div className="card flex h-[calc(100dvh-7.5rem)] min-h-[480px] overflow-hidden">
            <aside
                className={`${selected ? "hidden lg:flex" : "flex"} w-full flex-col border-[#EDF2F6] dark:border-slate-600 lg:w-80 lg:shrink-0 lg:border-r`}
            >
                <ConversationList
                    conversations={visible}
                    selectedId={selectedId}
                    onSelect={select}
                    filter={filter}
                    setFilter={setFilter}
                    searchQuery={searchQuery}
                />
            </aside>

            {selected ? (
                <Thread conversation={selected} typing={typingId === selected.id} onBack={() => setSelectedId(null)} onSend={send} />
            ) : (
                <div className="hidden flex-1 flex-col items-center justify-center gap-3 p-6 text-center lg:flex">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#34CAA5]/10">
                        <Messages1 size="26" color="#34CAA5" variant="Bulk" />
                    </span>
                    <p className="font-semibold">Pick a conversation</p>
                    <p className="max-w-xs text-xs text-[#737373] dark:text-slate-300">Choose a customer from the inbox to read and reply to their messages.</p>
                </div>
            )}
        </div>
    );
};

export default Messages;
