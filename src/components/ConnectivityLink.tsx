import { CircleDot, RadioTower } from 'lucide-react';
import type { ConnectivityLink as LinkData, LinkId } from '../data/fleet';
import { cn } from '../utils';

interface ConnectivityLinkProps {
  key?: string;
  link: LinkData;
  online: boolean;
  onToggle: (id: LinkId) => void;
}

export function ConnectivityLink({ link, online, onToggle }: ConnectivityLinkProps) {
  return (
    <article className={cn(
      'rounded-lg border px-4 py-3.5 shadow-noc transition',
      online
        ? 'border-slate-800/80 bg-slate-950/20 hover:border-blue-500/25'
        : 'border-rose-500/30 bg-rose-950/10 shadow-[0_0_18px_rgba(244,63,94,.06)]'
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[8px] uppercase tracking-[0.2em] text-slate-600">LINK #{link.id === 'vsat' ? '01' : link.id === 'bgan' ? '02' : link.id === 'ospf' ? '03' : link.id === 'bgp' ? '04' : '05'}</p>
          <h3 className="mt-1 truncate text-[11px] font-semibold text-slate-200">{link.title}</h3>
          <p className="mt-1 truncate text-[8px] text-slate-600">{link.target}</p>
        </div>
        <span className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[8px] font-semibold uppercase tracking-widest',
          online
            ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
            : 'border-rose-500/30 bg-rose-500/5 text-rose-400'
        )}>
          <span className={cn('h-1.5 w-1.5 rounded-full', online ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]' : 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,.8)]')} />
          {online ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[8px] uppercase tracking-widest text-slate-600">Latência</p>
          <p className={cn('mt-1 text-sm font-semibold', online ? 'text-slate-200' : 'text-rose-300')}>
            {online ? `${link.latency}ms` : '--'}
          </p>
        </div>
        <div>
          <p className="text-[8px] uppercase tracking-widest text-slate-600">Tráfego Telemetria</p>
          <p className="mt-1 text-sm font-semibold text-slate-200">{online ? `${link.traffic}%` : '0%'}</p>
        </div>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            online ? 'bg-gradient-to-r from-blue-700 via-cyan-400 to-blue-300' : 'bg-rose-500/50'
          )}
          style={{ width: `${online ? link.traffic : 0}%` }}
        />
      </div>

      <button
        type="button"
        onClick={() => onToggle(link.id)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 py-1.5 text-[8px] font-semibold uppercase tracking-widest text-slate-500 transition hover:text-slate-200"
      >
        <RadioTower className="h-3 w-3" />
        {online ? 'Derrubar Link' : 'Restaurar Link'}
      </button>
    </article>
  );
}
