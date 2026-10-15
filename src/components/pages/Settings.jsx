import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Camera, Moon, Sun1 } from "iconsax-react";
import UserProfPic from "../../assets/img/user-prof.jpg";
import { DEFAULT_PREFERENCES, DEFAULT_PROFILE } from "../../data/settingsData";
import { useApp } from "../../context/AppContext";
import Modal, { Button } from "../Modal";

const AVATAR_SIZE = 256;
const MAX_UPLOAD_MB = 5;

const inputClass =
    "w-full rounded-lg border border-[#DADDDD] dark:border-slate-500 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none transition focus:border-[#34CAA5] focus:ring-2 focus:ring-[#34CAA5]/20";

// Shrink the photo to a small square so it fits comfortably in browser storage.
const resizeImage = (file) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const side = Math.min(img.width, img.height);
            const canvas = Object.assign(document.createElement("canvas"), { width: AVATAR_SIZE, height: AVATAR_SIZE });
            canvas
                .getContext("2d")
                .drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("unreadable image"));
        };
        img.src = url;
    });

const Section = ({ title, description, children }) => (
    <section className="card grid gap-4 p-5 lg:grid-cols-3 lg:gap-8">
        <div>
            <h2 className="card-title">{title}</h2>
            <p className="mt-1 text-xs text-[#737373] dark:text-slate-300">{description}</p>
        </div>
        <div className="lg:col-span-2">{children}</div>
    </section>
);

const Field = ({ label, error, children }) => (
    <label className="block">
        <span className="mb-1 block text-xs font-medium text-[#525252] dark:text-slate-300">{label}</span>
        {children}
        {error && <span className="mt-1 block text-xs text-[#ED544E]">{error}</span>}
    </label>
);

const Toggle = ({ checked, onChange, label, description }) => (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3">
        <span>
            <span className="block text-sm font-medium">{label}</span>
            <span className="block text-xs text-[#737373] dark:text-slate-300">{description}</span>
        </span>
        <span className="relative mt-0.5 shrink-0">
            <input type="checkbox" role="switch" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <span className="block h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-[#34CAA5] peer-focus-visible:ring-2 peer-focus-visible:ring-[#34CAA5]/40 dark:bg-slate-600" />
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
        </span>
    </label>
);

const ProfileSection = () => {
    const { profile, setProfile } = useApp();
    const [form, setForm] = useState(profile);
    const [errors, setErrors] = useState({});
    const fileRef = useRef(null);

    // Pick up outside changes, e.g. after "Reset demo data".
    useEffect(() => setForm(profile), [profile]);

    const dirty = form.name !== profile.name || form.email !== profile.email || form.avatar !== profile.avatar;

    const pickPhoto = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Choose an image file.");
        if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return toast.error(`Photos must be under ${MAX_UPLOAD_MB} MB.`);
        try {
            const avatar = await resizeImage(file);
            setForm((f) => ({ ...f, avatar }));
        } catch {
            toast.error("That image couldn't be read.");
        }
    };

    const save = (e) => {
        e.preventDefault();
        const next = {};
        if (!form.name.trim()) next.name = "Enter your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
        setErrors(next);
        if (Object.keys(next).length) return;
        const saved = { ...form, name: form.name.trim(), email: form.email.trim() };
        setProfile(saved);
        setForm(saved);
        toast.success("Profile updated.");
    };

    return (
        <Section title="Profile" description="Your name, email and photo appear in the header and on invoices.">
            <form onSubmit={save} noValidate className="space-y-4">
                <div className="flex items-center gap-4">
                    <img src={form.avatar || UserProfPic} alt="" className="h-16 w-16 rounded-full object-cover" />
                    <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" onClick={() => fileRef.current?.click()}>
                            <Camera size="14" color="currentColor" /> Change photo
                        </Button>
                        {form.avatar && (
                            <Button variant="ghost" onClick={() => setForm((f) => ({ ...f, avatar: null }))}>
                                Remove
                            </Button>
                        )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickPhoto} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" error={errors.name}>
                        <input className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    </Field>
                    <Field label="Email" error={errors.email}>
                        <input
                            className={inputClass}
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        />
                    </Field>
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        disabled={!dirty}
                        onClick={() => {
                            setForm(profile);
                            setErrors({});
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!dirty}>
                        Save profile
                    </Button>
                </div>
            </form>
        </Section>
    );
};

const AppearanceSection = () => {
    const { isDarkMode, setIsDarkMode } = useApp();
    const options = [
        { dark: false, label: "Light", icon: Sun1 },
        { dark: true, label: "Dark", icon: Moon },
    ];
    return (
        <Section title="Appearance" description="Choose how the dashboard looks on this device.">
            <div role="radiogroup" aria-label="Theme" className="grid max-w-sm grid-cols-2 gap-3">
                {options.map(({ dark, label, icon: Icon }) => {
                    const active = isDarkMode === dark;
                    return (
                        <button
                            key={label}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setIsDarkMode(dark)}
                            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-colors ${
                                active
                                    ? "border-[#34CAA5] bg-[#34CAA5]/5"
                                    : "border-[#EDF2F6] dark:border-slate-600 hover:border-[#34CAA5]/50"
                            }`}
                        >
                            <Icon size="22" color={active ? "#34CAA5" : "#697689"} variant={active ? "Bold" : "Linear"} />
                            {label}
                        </button>
                    );
                })}
            </div>
        </Section>
    );
};

const NOTIFICATION_OPTIONS = [
    { key: "newOrders", label: "New orders", description: "When a customer places an order." },
    { key: "refunds", label: "Refund requests", description: "When a customer asks for a refund." },
    { key: "lowStock", label: "Low stock alerts", description: "When a product drops to 10 or fewer in stock." },
    { key: "weeklyReport", label: "Weekly report", description: "A summary of sales every Monday by email." },
];

const NotificationsSection = () => {
    const { preferences, setPreferences } = useApp();
    return (
        <Section title="Notifications" description="Pick what you want to hear about. Changes save automatically.">
            <div className="divide-y divide-[#EDF2F6] dark:divide-slate-600">
                {NOTIFICATION_OPTIONS.map((o) => (
                    <Toggle
                        key={o.key}
                        label={o.label}
                        description={o.description}
                        checked={preferences[o.key]}
                        onChange={(on) => setPreferences((p) => ({ ...p, [o.key]: on }))}
                    />
                ))}
            </div>
        </Section>
    );
};

const EMPTY_PASSWORDS = { current: "", next: "", confirm: "" };

const PasswordSection = () => {
    const [form, setForm] = useState(EMPTY_PASSWORDS);
    const [errors, setErrors] = useState({});

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const submit = (e) => {
        e.preventDefault();
        const next = {};
        if (!form.current) next.current = "Enter your current password.";
        if (form.next.length < 8) next.next = "Use at least 8 characters.";
        else if (form.next === form.current) next.next = "Choose a password you haven't used here.";
        if (form.confirm !== form.next) next.confirm = "Passwords don't match.";
        setErrors(next);
        if (Object.keys(next).length) return;
        setForm(EMPTY_PASSWORDS);
        toast.success("Password changed.");
    };

    return (
        <Section title="Password" description="Use at least 8 characters. You'll stay signed in on this device.">
            <form onSubmit={submit} noValidate className="space-y-4">
                <Field label="Current password" error={errors.current}>
                    <input className={inputClass} type="password" autoComplete="current-password" value={form.current} onChange={set("current")} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="New password" error={errors.next}>
                        <input className={inputClass} type="password" autoComplete="new-password" value={form.next} onChange={set("next")} />
                    </Field>
                    <Field label="Confirm new password" error={errors.confirm}>
                        <input className={inputClass} type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} />
                    </Field>
                </div>
                <div className="flex justify-end">
                    <Button type="submit">Update password</Button>
                </div>
            </form>
        </Section>
    );
};

const ResetSection = () => {
    const { setProfile, setPreferences } = useApp();
    const [confirming, setConfirming] = useState(false);

    const reset = () => {
        try {
            ["products", "messages", "tickets", "tips-done", "billing"].forEach((key) => localStorage.removeItem(key));
        } catch {
            // ignore
        }
        setProfile(DEFAULT_PROFILE);
        setPreferences(DEFAULT_PREFERENCES);
        setConfirming(false);
        toast.success("Demo data restored.");
    };

    return (
        <Section title="Reset demo data" description="Undo your product edits, message replies, support requests, tip progress and billing changes, and restore the original profile and notification settings.">
            <Button variant="danger" onClick={() => setConfirming(true)}>
                Reset demo data
            </Button>
            <Modal
                open={confirming}
                onClose={() => setConfirming(false)}
                title="Reset demo data?"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setConfirming(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={reset}>
                            Reset
                        </Button>
                    </>
                }
            >
                <p className="text-[#737373] dark:text-slate-300">
                    Products go back to the original list, your replies, support requests, tip progress and billing
                    changes are cleared, and your profile and
                    notification settings are restored. This can&apos;t be undone.
                </p>
            </Modal>
        </Section>
    );
};

const Settings = () => (
    <div className="flex flex-col gap-4 lg:gap-5 [&>*]:min-w-0">
        <ProfileSection />
        <AppearanceSection />
        <NotificationsSection />
        <PasswordSection />
        <ResetSection />
        <footer className="py-2 text-center text-xs text-[#A3A3A3]">© {new Date().getFullYear()} FASTA. All rights reserved.</footer>
    </div>
);

export default Settings;
