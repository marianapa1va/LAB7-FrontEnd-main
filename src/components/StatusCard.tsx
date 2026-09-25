import type { LucideIcon } from 'lucide-react';
import { cn } from '../utils';

interface StatusCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  variant: 'success' | 'warning' | 'danger' | 'info';
  badge?: string;
}

export function StatusCard({ label, value, subtext, icon: Icon, variant, badge }: StatusCardProps) {
  const accent = {
    success: 'border-emerald-500/20 text-emerald-400',
    warning: 'border-amber-500/20 text-amber-400',
    danger: 'border-rose-500/20 text-rose-400',
    info: 'border-blue-500/20 text-blue-400'
  }[variant];

  return (
    <article className={cn('relative overflow-hidden rounded-lg border bg-slate-950/20 px-5 py-4 shadow-noc', accent)}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
            {badge && (
              <span className="rounded bg-slate-800/70 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-widest text-slate-400">
                {badge}
              </span>
            )}
          </div>
          <p className={cn('mt-2 text-[31px] font-semibold leading-none tracking-tight', variant === 'danger' ? 'text-rose-300' : 'text-slate-100')}>
            {value}
          </p>
          <p className="mt-2 text-[9px] text-slate-500">{subtext}</p>
        </div>
        <Icon className="mt-1 h-4 w-4 shrink-0 opacity-80" strokeWidth={1.8} />
      </div>
    </article>
  );
}
