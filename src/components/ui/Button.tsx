import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

// Primary = filled terracotta (main actions like Save/Search).
// Secondary = outline on cream (lower-emphasis actions like Add).
const variantStyles = {
  primary: "bg-terracotta text-surface hover:bg-terracotta-hover disabled:bg-terracotta/50",
  secondary: "border border-border text-ink hover:bg-cream disabled:opacity-60",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
