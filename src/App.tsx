import { useEffect, useMemo, useState } from 'react';
import {
  CarFront,
  CheckCircle2,
  Clock3,
  Database,
  Gauge,
  ServerCog,
  ShieldAlert,
  Truck,
  Wifi,
  Zap
} from 'lucide-react';
import { StatusCard } from './components/StatusCard';
import { ConnectivityLink } from './components/ConnectivityLink';
import { TelemetryChart } from './components/TelemetryChart';
import { FleetTable } from './components/FleetTable';
import { connectivityLinks } from './data/fleet';
import { useFleetMonitor } from './hooks/useFleetMonitor';

const categoryShort = ['Ônibus', 'Caminhão', 'Moto', 'Carro', 'Caminhonete', 'Van', 'SUV', 'Esportivo', 'Trator', 'Ambulância'];

export default function App() {
  const monitor = useFleetMonitor();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const uptime = `${Math.round((monitor.activeLinks / 5) * 100)}%`;
  const fleetPercent = ((monitor.onlineVehicles / monitor.totalVehicles) * 100).toFixed(1);
  const alertLabel = monitor.alerts === 0 ? 'Nenhum incidente ativo' : 'Falhas de sinal e conectividade';

  const recentIncidents = useMemo(
    () => monitor.logs.filter((item) => item.level !== 'INFO').slice(0, 5),
    [monitor.logs]
  );

  const apiLogs = monitor.logs.slice(0, 12);

  return (
    <main className="min-h-screen bg-noc-bg text-slate-200">
      <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-5 border-b border-slate-800/80 pb-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 shadow-glow">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,.9)]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[14px] font-bold tracking-wide text-slate-100">NOC COMMAND CENTER</h1>
                  <span className="text-slate-600">|</span>
                  <span className="text-[14px] font-semibold text-slate-400">MONITORAMENTO DE FROTA</span>
                </div>
                <p className="mt-1 text-[8px] uppercase tracking-[0.26em] text-slate-700">Big Data • Telemetria • Conectividade • OTel</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.18em]">
              <span className="rounded-md border border-blue-500/20 bg-blue-500/5 px-3 py-2 text-blue-300">100.000 veículos rastreados</span>
              <span className="inline-flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
                SISTEMA OPERACIONAL ({uptime})
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2 text-slate-500">
                <Clock3 className="h-3 w-3" />
                {now.toLocaleTimeString('pt-BR', { hour12: false })} UTC-3
              </span>
            </div>
          </div>
        </header>

        <section className="mb-5 rounded-xl border border-slate-800/80 bg-slate-900/35 p-4 shadow-noc">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">Controle de Simulação</h2>
              <p className="mt-1 text-[8px] text-slate-600">Altere a conectividade e observe o efeito nas métricas, telemetria e logs.</p>
            </div>
            <span className="text-[8px] uppercase tracking-[0.18em] text-slate-700">LAB 7 • SIMULAÇÃO</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={monitor.randomizeLinks} className="sim-button">Alternar Links Aleatórios</button>
            <button
              onClick={monitor.dropOspf}
              disabled={!monitor.linksStatus.ospf}
              className="sim-button sim-button-danger disabled:cursor-not-allowed disabled:opacity-50"
            >
              {monitor.linksStatus.ospf ? 'Derrubar Core OSPF (Link 3)' : 'Core OSPF OFFLINE'}
            </button>
            <button
              onClick={monitor.dropVsat}
              disabled={!monitor.linksStatus.vsat}
              className="sim-button sim-button-warning disabled:cursor-not-allowed disabled:opacity-50"
            >
              {monitor.linksStatus.vsat ? 'Derrubar VSAT D2 (Link 1)' : 'VSAT D2 OFFLINE'}
            </button>
            <button onClick={monitor.restoreAll} className="sim-button sim-button-success">Restaurar Todos (100%)</button>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            label="Veículos Rastreados"
            value={monitor.totalVehicles.toLocaleString('pt-BR')}
            subtext="10 categorias integradas em tempo real"
            icon={Truck}
            variant="info"
          />
          <StatusCard
            label="Veículos Online"
            value={monitor.onlineVehicles.toLocaleString('pt-BR')}
            subtext={`${fleetPercent}% da frota com telemetria ativa`}
            icon={CheckCircle2}
            variant="success"
            badge="STATUS SUCESSO"
          />
          <StatusCard
            label="Links de Telecom"
            value={`${monitor.activeLinks} / 5`}
            subtext={monitor.activeLinks === 5 ? '5 ativos / 0 falhas' : `${5 - monitor.activeLinks} link(s) com indisponibilidade`}
            icon={Wifi}
            variant={monitor.activeLinks === 5 ? 'success' : 'warning'}
            badge="ATIVOS / FALHAS"
          />
          <StatusCard
            label="Alertas de Frota"
            value={monitor.alerts}
            subtext={alertLabel}
            icon={ShieldAlert}
            variant={monitor.alerts > 0 ? 'danger' : 'success'}
            badge="CRÍTICO / ALTO"
          />
        </section>

        <section className="mt-7">
          <div className="mb-3 flex items-end justify-between border-l-2 border-blue-500 pl-3">
            <div>
              <h2 className="section-title">Monitoramento de Conectividade &amp; Links</h2>
              <p className="section-subtitle">Telemetria • latency • status</p>
            </div>
            <span className="text-[8px] uppercase tracking-[0.18em] text-slate-600">{monitor.activeLinks} / 5 ativos</span>
          </div>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
            {connectivityLinks.map((link) => (
              <ConnectivityLink
                key={link.id}
                link={link}
                online={monitor.linksStatus[link.id]}
                onToggle={monitor.toggleLink}
              />
            ))}
          </div>
        </section>

        <section className="mt-7 rounded-xl border border-slate-800/80 bg-slate-900/35 p-4 shadow-noc">
          <div className="mb-4 flex items-end justify-between border-l-2 border-cyan-400 pl-3">
            <div>
              <h2 className="section-title">Telemetria da Frota por Categoria &amp; Big Data</h2>
              <p className="section-subtitle">100.000 veículos • regra de dependência ativa</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] uppercase tracking-[0.18em] text-slate-600">Velocidade média global da frota (km/h)</p>
              <p className="mt-1 text-2xl font-semibold text-cyan-300">{monitor.velocity.toFixed(1)} <span className="text-xs text-slate-500">km/h</span></p>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_335px]">
            <div className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/30 px-3 py-2">
              <div className="mb-1 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">Velocidade média global da frota (km/h)</p>
                  <p className="mt-1 text-[8px] text-slate-700">Atualização simulada de telemetria a cada 2,5 segundos</p>
                </div>
                <Gauge className="h-4 w-4 text-blue-400" />
              </div>
              <TelemetryChart data={monitor.telemetry} />
            </div>

            <aside className="min-w-0">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">Status por categoria</span>
                <span className="text-[8px] uppercase tracking-[0.16em] text-slate-700">10 categorias</span>
              </div>
              <div className="max-h-[285px] space-y-2 overflow-auto pr-1 custom-scroll">
                {monitor.categoryData.map((category) => {
                  const sample = monitor.sampleVehicles.find((vehicle) => vehicle.category === category.name);
                  const link = sample?.link ?? 'ospf';
                  return (
                    <div key={category.name} className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CarFront className="h-3.5 w-3.5 text-blue-400" />
                          <span className="text-[11px] font-semibold text-slate-200">{category.name}</span>
                        </div>
                        <span className={category.operational ? 'status-ok' : 'status-off'}>
                          {category.operational ? 'SINAL OK' : 'OFFLINE'}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <span className="metric-label">VEL. MÉDIA</span>
                          <p className="mt-1 text-sm font-semibold text-slate-200">
                            {category.avgSpeed} <span className="text-[8px] text-slate-600">km/h</span>
                          </p>
                        </div>
                        <div>
                          <span className="metric-label">CONS. MÉDIO</span>
                          <p className="mt-1 text-sm font-semibold text-emerald-300">{category.consumption}%</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[7px] uppercase tracking-widest text-slate-700">
                        <span>LINK #{link.toUpperCase()}</span>
                        <span>{category.online.toLocaleString('pt-BR')} ONLINE</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-7 rounded-xl border border-slate-800/80 bg-slate-900/35 p-4 shadow-noc">
          <div className="mb-4 flex items-end justify-between border-l-2 border-blue-500 pl-3">
            <div>
              <h2 className="section-title">Distribuição de Veículos por Categoria (Volume Ativo)</h2>
              <p className="section-subtitle">Cada categoria representa 10.000 veículos no cenário de Big Data</p>
            </div>
            <span className="text-[8px] uppercase tracking-[0.18em] text-slate-700">CATALOGAÇÃO 100%</span>
          </div>
          <div className="grid h-[250px] grid-cols-5 gap-2 sm:grid-cols-10">
            {monitor.categoryData.map((item, index) => {
              const height = `${Math.max(8, Math.min(100, (item.online / item.total) * 100))}%`;
              return (
                <div key={item.name} className="group flex min-w-0 flex-col items-center justify-end gap-2">
                  <span className="text-[8px] font-mono text-slate-600">{(item.online / 1000).toFixed(1)}k</span>
                  <div className="relative flex h-[185px] w-full items-end rounded-t-sm bg-slate-950/30">
                    <div
                      className={`w-full rounded-t-sm border border-blue-300/20 bg-gradient-to-t ${index % 2 === 0 ? 'from-blue-700 via-blue-500 to-blue-400' : 'from-cyan-700 via-cyan-500 to-cyan-300'} transition-all duration-700`}
                      style={{ height }}
                      title={`${item.name}: ${item.online.toLocaleString('pt-BR')} online`}
                    />
                    <div className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[8px] text-slate-300 shadow-lg group-hover:block">
                      {item.name}: {item.online.toLocaleString('pt-BR')} veículos
                    </div>
                  </div>
                  <span className="w-full truncate text-center text-[7px] text-slate-600">{categoryShort[index]}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-7 rounded-xl border border-slate-800/80 bg-slate-900/35 p-4 shadow-noc">
          <div className="mb-3 flex items-end justify-between border-l-2 border-blue-500 pl-3">
            <div>
              <h2 className="section-title">Frota Rastreada</h2>
              <p className="section-subtitle">Amostra operacional da frota • 100.000 registros simulados</p>
            </div>
            <Database className="h-4 w-4 text-blue-400" />
          </div>
          <FleetTable vehicles={monitor.sampleVehicles} />
        </section>

        <section className="mt-7 rounded-xl border border-slate-800/80 bg-slate-900/35 p-4 shadow-noc">
          <div className="mb-4 flex items-end justify-between border-l-2 border-rose-400 pl-3">
            <div>
              <h2 className="section-title">Incidentes de Frota &amp; Logs de Sistema (Node.js Engine)</h2>
              <p className="section-subtitle">Observabilidade simulada • HTTP • TraceID • eventos de conectividade</p>
            </div>
            <ServerCog className="h-4 w-4 text-rose-300" />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
            <div className="min-h-[300px] rounded-lg border border-slate-800 bg-[#05070d] p-3 font-mono text-[9px] leading-5 shadow-inner">
              <div className="mb-3 flex items-center gap-2 border-b border-slate-900 pb-2 text-slate-600">
                <span className="text-rose-400">●</span><span className="text-amber-400">●</span><span className="text-emerald-400">●</span>
                <span className="ml-2">api-gateway-service: telemetry_stream.ts</span>
              </div>

              <div className="space-y-0.5">
                {apiLogs.map((log) => (
                  <div key={log.id} className="grid grid-cols-[52px_34px_1fr] gap-2 border-b border-slate-900/70 py-0.5">
                    <span className="text-slate-600">{log.time.slice(0, 8)}</span>
                    <span className={log.level === 'ERROR' ? 'text-rose-400' : log.level === 'WARN' ? 'text-amber-300' : 'text-cyan-400'}>{log.method}</span>
                    <span className="truncate text-slate-400">
                      <span className="text-slate-600">{log.route}</span> {log.status} <span className="text-slate-700">({log.latency}ms)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">Incidentes recentes de frota</span>
                <span className="text-[8px] text-slate-600">{recentIncidents.length} alertas</span>
              </div>
              <div className="max-h-[300px] space-y-2 overflow-auto pr-1 custom-scroll">
                {recentIncidents.length === 0 ? (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-300">
                    Nenhum incidente crítico registrado. Sistema estável.
                  </div>
                ) : (
                  recentIncidents.map((log) => (
                    <div key={log.id} className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={log.level === 'ERROR' ? 'text-[9px] font-semibold text-rose-300' : 'text-[9px] font-semibold text-amber-300'}>
                          [{log.level}]
                        </span>
                        <span className="text-[8px] text-slate-600">{log.time}</span>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-400">{log.message}</p>
                      <p className="mt-2 font-mono text-[7px] text-slate-700">TRACE {log.traceId}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 py-4 text-[8px] uppercase tracking-[0.18em] text-slate-700">
          <span>MONITORAMENTO DE FROTA • LAB 7 • REACT + TYPESCRIPT + TAILWIND</span>
          <span className="inline-flex items-center gap-2"><Zap className="h-3 w-3 text-cyan-500" /> Observabilidade simulada ativa</span>
        </footer>
      </div>
    </main>
  );
}
