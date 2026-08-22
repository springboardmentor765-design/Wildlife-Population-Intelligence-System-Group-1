"use client";

import { ArrowUpRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "quiet"
  | "outline";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  arrow?: boolean;
};

const styles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#263746] text-white shadow-[0_10px_22px_rgba(38,55,70,.18)] hover:bg-[#1d5360] hover:shadow-[0_14px_28px_rgba(38,55,70,.22)] active:translate-y-0 active:shadow-sm",

  secondary:
    "border border-[#d8ddd7] bg-[#fffdf8] text-[#263746] shadow-sm hover:border-[#9bc9c3] hover:bg-[#eef6f3] hover:shadow-md",

  quiet:
    "bg-transparent text-[#315c4b] hover:bg-[#e3efec]",

  outline:
    "border border-[#d4ddd8] bg-transparent text-[#263746] hover:border-[#9bc9c3] hover:bg-[#eef6f3]",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  arrow = false,
  type = "button",
  onClick,
  ...props
}: Props) {
  const label =
    typeof children === "string" ? children : "";

  const destination =
    label === "Explore the platform"
      ? "/login"
      : label === "Request access"
      ? "/register"
      : undefined;

  const handleClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] =
    (event) => {
      onClick?.(event);

      if (!event.defaultPrevented && destination) {
        window.location.assign(destination);
      }
    };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-full
        px-5
        py-3
        text-sm
        font-semibold
        transition-all
        duration-200
        hover:-translate-y-0.5
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${styles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}

      {arrow && (
        <ArrowUpRight
          size={16}
          strokeWidth={2.2}
        />
      )}
    </button>
  );
}
