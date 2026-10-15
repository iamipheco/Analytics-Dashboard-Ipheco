import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowDown2, TickCircle } from "iconsax-react";

const VARIANTS = {
    // Rounded pill for toolbars and filters.
    pill: "rounded-full px-3 py-2 md:py-1.5 text-xs",
    // Full-width field for forms, matching the text inputs.
    field: "rounded-lg px-3 py-2 text-sm",
};

const MAX_LIST_HEIGHT = 256;
const GAP = 6;

const normalize = (options) => options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));

/**
 * Drop-in replacement for <select>: same value/onChange idea, but styled to match the app
 * and fully keyboard accessible (arrows, Home/End, Enter, Escape, type-to-jump).
 * onChange receives the option's value, not an event.
 */
const Select = ({ value, onChange, options: rawOptions, variant = "field", className = "", "aria-label": ariaLabel, id }) => {
    const options = normalize(rawOptions);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const [position, setPosition] = useState(null);
    const buttonRef = useRef(null);
    const listRef = useRef(null);
    const typeahead = useRef({ text: "", timer: null });
    const listId = useId();

    const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
    const selected = options[selectedIndex];

    const close = useCallback((refocus = true) => {
        setOpen(false);
        if (refocus) buttonRef.current?.focus();
    }, []);

    const openList = (index = selectedIndex) => {
        setActive(index);
        setOpen(true);
    };

    const choose = (index) => {
        const option = options[index];
        if (option && option.value !== value) onChange(option.value);
        close();
    };

    // The list lives in a portal so modals and scroll areas can't clip it; keep it pinned to the button.
    useLayoutEffect(() => {
        if (!open) return undefined;
        const place = () => {
            const rect = buttonRef.current.getBoundingClientRect();
            const below = window.innerHeight - rect.bottom - GAP;
            const above = rect.top - GAP;
            const flip = below < Math.min(MAX_LIST_HEIGHT, options.length * 40) && above > below;
            setPosition({
                left: Math.min(rect.left, window.innerWidth - Math.max(rect.width, 180) - 8),
                width: Math.max(rect.width, 180),
                top: flip ? undefined : rect.bottom + GAP,
                bottom: flip ? window.innerHeight - rect.top + GAP : undefined,
                maxHeight: Math.min(MAX_LIST_HEIGHT, (flip ? above : below) - 8),
            });
        };
        place();
        window.addEventListener("resize", place);
        window.addEventListener("scroll", place, true);
        return () => {
            window.removeEventListener("resize", place);
            window.removeEventListener("scroll", place, true);
        };
    }, [open, options.length]);

    useEffect(() => {
        if (!open) return undefined;
        listRef.current?.focus({ preventScroll: true });
        const onMouseDown = (e) => {
            if (!buttonRef.current?.contains(e.target) && !listRef.current?.contains(e.target)) close(false);
        };
        document.addEventListener("mousedown", onMouseDown);
        return () => document.removeEventListener("mousedown", onMouseDown);
    }, [open, close]);

    useEffect(() => {
        if (open) listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
    }, [open, active]);

    const jumpTo = (key) => {
        const t = typeahead.current;
        clearTimeout(t.timer);
        t.text += key.toLowerCase();
        t.timer = setTimeout(() => (t.text = ""), 600);
        const match = options.findIndex((o) => String(o.label).toLowerCase().startsWith(t.text));
        if (match >= 0) return match;
        return -1;
    };

    const onButtonKeyDown = (e) => {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
            e.preventDefault();
            openList();
        } else if (e.key.length === 1) {
            const match = jumpTo(e.key);
            if (match >= 0) openList(match);
        }
    };

    const onListKeyDown = (e) => {
        const last = options.length - 1;
        const moves = {
            ArrowDown: () => setActive((i) => Math.min(last, i + 1)),
            ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
            Home: () => setActive(0),
            End: () => setActive(last),
            Enter: () => choose(active),
            " ": () => choose(active),
            Escape: () => close(),
            Tab: () => close(),
        };
        if (moves[e.key]) {
            if (e.key !== "Tab") e.preventDefault();
            // Keep Escape from also closing a surrounding modal.
            e.stopPropagation();
            moves[e.key]();
        } else if (e.key.length === 1) {
            const match = jumpTo(e.key);
            if (match >= 0) setActive(match);
        }
    };

    return (
        <>
            <button
                ref={buttonRef}
                id={id}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={open ? listId : undefined}
                aria-label={ariaLabel ? `${ariaLabel}: ${selected?.label ?? ""}` : undefined}
                onClick={() => (open ? close() : openList())}
                onKeyDown={onButtonKeyDown}
                className={`flex min-w-0 items-center justify-between gap-2 border bg-white text-left outline-none transition dark:bg-slate-800 ${
                    VARIANTS[variant]
                } ${
                    open
                        ? "border-[#34CAA5] ring-2 ring-[#34CAA5]/20"
                        : "border-[#DADDDD] hover:border-[#34CAA5] focus-visible:border-[#34CAA5] focus-visible:ring-2 focus-visible:ring-[#34CAA5]/20 dark:border-slate-500"
                } ${className}`}
            >
                <span className="truncate">{selected?.label}</span>
                <ArrowDown2 size="14" color="#697689" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open &&
                position &&
                createPortal(
                    <ul
                        ref={listRef}
                        id={listId}
                        role="listbox"
                        tabIndex={-1}
                        aria-label={ariaLabel}
                        aria-activedescendant={`${listId}-${active}`}
                        onKeyDown={onListKeyDown}
                        style={position}
                        className="fixed z-[60] overflow-y-auto scroll-thin rounded-xl bg-white p-1 text-sm text-[#26282C] shadow-lg outline-none ring-1 ring-black/5 animate-pop-in dark:bg-slate-700 dark:text-white dark:ring-white/10"
                    >
                        {options.map((o, i) => {
                            const isSelected = o.value === value;
                            return (
                                <li
                                    key={o.value}
                                    id={`${listId}-${i}`}
                                    data-index={i}
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseEnter={() => setActive(i)}
                                    onClick={() => choose(i)}
                                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 ${
                                        i === active ? "bg-slate-100 dark:bg-slate-600" : ""
                                    } ${isSelected ? "font-medium text-[#34CAA5]" : ""}`}
                                >
                                    <span className="truncate">{o.label}</span>
                                    {isSelected && <TickCircle size="16" color="#34CAA5" variant="Bold" className="shrink-0" />}
                                </li>
                            );
                        })}
                    </ul>,
                    document.body
                )}
        </>
    );
};

export default Select;
