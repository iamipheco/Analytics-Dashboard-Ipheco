import { useEffect } from "react";
import { CloseCircle } from "iconsax-react";

const Modal = ({ open, onClose, title, children, footer, size = "max-w-md" }) => {
    useEffect(() => {
        if (!open) return undefined;
        const handleKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={`relative flex max-h-[calc(100dvh-2rem)] w-full flex-col ${size} rounded-2xl bg-white dark:bg-slate-700 dark:text-white shadow-xl animate-pop-in`}
            >
                <div className="flex items-center justify-between px-5 pt-5">
                    <h2 className="font-semibold text-[#26282C] dark:text-white">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="text-[#697689] hover:text-[#34CAA5] transition-colors"
                    >
                        <CloseCircle size="22" color="currentColor" variant="Broken" />
                    </button>
                </div>
                <div className="min-h-0 overflow-y-auto scroll-thin px-5 py-4 text-sm">{children}</div>
                {footer && <div className="flex justify-end gap-2 px-5 pb-5">{footer}</div>}
            </div>
        </div>
    );
};

export const Button = ({ variant = "primary", className = "", ...props }) => {
    const styles = {
        primary: "bg-[#34CAA5] text-white hover:bg-[#2bb592]",
        ghost: "border border-slate-200 dark:border-slate-500 text-[#3A3F51] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600",
        danger: "bg-[#ED544E] text-white hover:bg-[#d8443e]",
    };
    return (
        <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
            {...props}
        />
    );
};

export default Modal;
