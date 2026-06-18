'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
        gold: 'btn-gold',
    };

    const sizes = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg',
    };

    return (
        <button
            className={cn(variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            suppressHydrationWarning
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {!loading && icon && <span className="w-4 h-4">{icon}</span>}
            {children}
        </button>
    );
}

// ─── Card ───

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'calm' | 'primary' | 'gold';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, variant = 'default', padding = 'md' }: CardProps) {
    const paddings = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const variants = {
        default: 'card',
        calm: 'card-calm',
        primary: 'card-calm',
        gold: 'card-gold',
    };

    return (
        <div className={cn(variants[variant], paddings[padding], className)}>
            {children}
        </div>
    );
}

// ─── Input ───

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helpText, icon, className, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="label">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'input',
                            icon && 'pl-10',
                            error && 'input-error',
                            className
                        )}
                        suppressHydrationWarning
                        {...props}
                    />
                </div>
                {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
                {helpText && !error && <p className="mt-1 text-xs text-surface-500">{helpText}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';

// ─── Textarea ───

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="label">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={cn('input min-h-[100px] resize-y', error && 'input-error', className)}
                    suppressHydrationWarning
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

// ─── Badge ───

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'accent' | 'razzmatazz' | 'gold' | 'wine' | 'ochre' | 'warning' | 'danger' | 'success';
    className?: string;
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
    const variants = {
        primary: 'badge-primary',
        accent: 'badge-accent',
        razzmatazz: 'badge-accent',
        gold: 'badge-gold',
        wine: 'badge-wine',
        ochre: 'badge-ochre',
        warning: 'badge-warning',
        danger: 'badge-danger',
        success: 'badge-success',
    };

    return <span className={cn(variants[variant], className)}>{children}</span>;
}

// ─── Progress Bar ───

interface ProgressBarProps {
    value: number;
    max?: number;
    variant?: 'primary' | 'accent' | 'gold' | 'ochre';
    showLabel?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
    value,
    max = 100,
    variant = 'primary',
    showLabel = false,
    className,
    size = 'md',
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const fills = {
        primary: 'progress-bar-fill-primary',
        accent: 'progress-bar-fill-accent',
        gold: 'progress-bar-fill-gold',
        ochre: 'progress-bar-fill-ochre',
    };
    const sizes = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between mb-1">
                    <span className="text-xs text-velvet-600">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={cn('progress-bar', sizes[size])}>
                <div
                    className={cn(fills[variant])}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                />
            </div>
        </div>
    );
}

// ─── Empty State ───

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn('empty-state', className)}>
            {icon && <div className="empty-state-icon">{icon}</div>}
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-text">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

// ─── Divider ───

export function Divider({ className, variant }: { className?: string; variant?: 'default' | 'mandala' }) {
    if (variant === 'mandala') {
        return <hr className={cn('mandala-divider', className)} />;
    }
    return <hr className={cn('divider', className)} />;
}

// ─── Spinner ───

export function Spinner({ className }: { className?: string }) {
    return (
        <svg className={cn('animate-spin h-5 w-5 text-surface-400', className)} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );
}

// ─── Switch / Toggle ───

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
    return (
        <label className="inline-flex items-center gap-3 cursor-pointer">
            <button
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                    checked ? 'bg-primary-600' : 'bg-surface-300',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <span
                    className={cn(
                        'inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200',
                        checked ? 'translate-x-6' : 'translate-x-1'
                    )}
                />
            </button>
            {label && <span className="text-sm text-velvet-700">{label}</span>}
        </label>
    );
}

// ─── Select ───

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className, id, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={selectId} className="label">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={cn('input appearance-none cursor-pointer', error && 'input-error', className)}
                    suppressHydrationWarning
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
            </div>
        );
    }
);
Select.displayName = 'Select';

// ─── Checkbox ───

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
    return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
            />
            {label && <span className="text-sm text-velvet-700">{label}</span>}
        </label>
    );
}

// ─── Mandala Decorative Section ───

interface MandalaSectionProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'gold' | 'razz' | 'dots' | 'rangoli' | 'paisley';
}

export function MandalaSection({ children, className, variant = 'primary' }: MandalaSectionProps) {
    const patterns = {
        primary: 'mandala-blob-primary',
        gold: 'mandala-blob-gold',
        razz: 'mandala-blob-razz',
        dots: 'mandala-pattern-dots',
        rangoli: 'mandala-pattern-rangoli',
        paisley: 'mandala-pattern-paisley',
    };

    return (
        <div className={cn('relative overflow-hidden', patterns[variant], className)}>
            {children}
        </div>
    );
}