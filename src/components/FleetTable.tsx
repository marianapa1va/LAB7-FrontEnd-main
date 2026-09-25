import { Signal } from 'lucide-react';
import type { FleetVehicle } from '../data/fleet';
import { cn } from '../utils';

interface FleetTableProps { vehicles: FleetVehicle[]; }

export function FleetTable({ vehicles }: FleetTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-xs">
        <thead>
          <tr className="border-b border-slate-800 text-[9px] uppercase tracking-[0.2em] text-slate-600">
            <th className="px-4 py-3">Veículo</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Vel. média</th>
            <th className="px-4 py-3">Consumo médio</th>
            <th className="px-4 py-3">Conectividade</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="border-b border-slate-900/80 last:border-0">
              <td className="px-4 py-3 font-mono font-semibold text-slate-200">{vehicle.id}</td>
              <td className="px-4 py-3 text-slate-400">{vehicle.category}</td>
              <td className="px-4 py-3 text-slate-200">{vehicle.speed} km/h</td>
              <td className="px-4 py-3 text-slate-300">{vehicle.consumption}%</td>
              <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-slate-500"><Signal className="h-3 w-3" /> {vehicle.link.toUpperCase()}</span></td>
              <td className="px-4 py-3">
                <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-semibold', vehicle.status === 'ONLINE' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-rose-500/20 bg-rose-500/5 text-rose-400')}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', vehicle.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-rose-400')} />
                  {vehicle.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {vehicles.length === 0 && <div className="flex h-40 items-center justify-center text-sm text-slate-500">Nenhum veículo disponível na amostra.</div>}
    </div>
  );
}
