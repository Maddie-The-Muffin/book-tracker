import {
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

// Shared form-field look for text inputs, selects, and textareas so the
// BookForm and the /add search box stay visually consistent.
const fieldStyles =
  "w-full rounded-lg border border-border bg-surface p-2 text-ink placeholder:text-ink-muted focus:border-terracotta focus:outline-none disabled:cursor-not-allowed disabled:bg-cream disabled:text-ink-muted";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldStyles} ${className}`} {...props} />;
}

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${fieldStyles} ${className}`} {...props} />;
}

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldStyles} ${className}`} {...props} />;
}
