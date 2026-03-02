import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-accent-primary text-white hover:bg-opacity-90 shadow-lg shadow-accent-primary/20",
    secondary: "bg-bg-surface border border-text-secondary/20 text-text-primary hover:bg-bg-primary",
    danger: "bg-alert-error text-white hover:bg-opacity-90",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-primary",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg font-semibold",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-accent-primary/50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("bg-bg-surface border border-text-secondary/10 rounded-2xl p-6 shadow-xl", className)}>
      {children}
    </div>
  );
}

export function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-text-secondary ml-1">{label}</label>}
      <input
        className={cn(
          "w-full bg-bg-surface border border-text-secondary/20 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary transition-all",
          error && "border-alert-error focus:ring-alert-error/30 focus:border-alert-error"
        )}
        {...props}
      />
      {error && <p className="text-xs text-alert-error ml-1 font-medium">{error}</p>}
    </div>
  );
}
