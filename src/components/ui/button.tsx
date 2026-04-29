import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "default" | "pending" | "accepted";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const baseStyles =
  "inline-flex min-h-12 items-center justify-center border-[3px] border-ink px-5 py-2 text-lg tracking-wide text-ink shadow-sketch transition-all duration-100 disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-white hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-marker hover:text-white hover:shadow-sketch-press active:translate-x-1 active:translate-y-1 active:shadow-none",
  pending:
    "bg-mutedPaper hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-pen hover:text-white hover:shadow-sketch-press active:translate-x-1 active:translate-y-1 active:shadow-none",
  accepted:
    "bg-[#fff9c4] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-pen hover:text-white hover:shadow-sketch-press active:translate-x-1 active:translate-y-1 active:shadow-none"
};

export function Button({
  children,
  variant = "default",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
      {...props}
    >
      {children}
    </button>
  );
}
