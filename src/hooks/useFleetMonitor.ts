import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Category, FleetVehicle, LinkId } from '../data/fleet';
import {
  CATEGORIES,
  connectivityLinks,
  fleetCategories
} from '../data/fleet';

export interface SystemLog {
  id: string;
  time: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  method: 'GET' | 'POST' | 'PUT';
  route: string;
  status: number;
  latency: number;
  message: string;
  traceId: string;
}

export interface TelemetryPoint {
  time: string;
  value: number;
}

// ============================================================
// STATUS INICIAL DOS LINKS
// ============================================================

const initialStatus: Record<LinkId, boolean> = {
  vsat: true,
  bgan: true,
  ospf: true,
  bgp: true,
  lte: true
};

// ============================================================
// DEPENDÊNCIA ENTRE LINKS E CATEGORIAS
// ============================================================
//
// VSAT:
// Carro e SUV
//
// BGAN:
// Caminhão
//
// BGP:
// Ônibus
//
// LTE:
// Moto
//
// OSPF:
// Caminhonete, Van, Esportivo, Trator e Ambulância
//
// Isso faz com que o botão "CORE OSPF OFFLINE"
// realmente afete as categorias correspondentes.
//

const categoryDependencies: Partial<Record<Category, LinkId>> = {
  Carro: 'vsat',
  SUV: 'vsat',

  Caminhão: 'bgan',
  Ônibus: 'bgp',
  Moto: 'lte',

  Caminhonete: 'ospf',
  Van: 'ospf',
  Esportivo: 'ospf',
  Trator: 'ospf',
  Ambulância: 'ospf'
};

// ============================================================
// CONFIGURAÇÕES DA FROTA
// ============================================================

const VEHICLES_PER_CATEGORY = 10000;
const BASE_OFFLINE_PER_CATEGORY = 16;

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function newTraceId() {
  return Math.random()
    .toString(16)
    .slice(2, 10)
    .toUpperCase();
}

function clock(date = new Date()) {
  return date.toLocaleTimeString('pt-BR', {
    hour12: false
  });
}

function newTelemetryPoint(
  value: number,
  date = new Date()
): TelemetryPoint {
  return {
    time: date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    value
  };
}

function apiLatency() {
  return Math.floor(8 + Math.random() * 42);
}

// ============================================================
// GERAÇÃO DOS 100.000 VEÍCULOS
// ============================================================

function generateFleetVehicles(): FleetVehicle[] {
  const vehicles: FleetVehicle[] = [];

  let counter = 1;

  for (const category of fleetCategories) {
    for (
      let index = 0;
      index < VEHICLES_PER_CATEGORY;
      index += 1
    ) {
      const base = CATEGORIES.indexOf(category.name);

      const speed = Math.max(
        25,
        category.avgSpeed +
          ((index * 7 + base * 3) % 17) -
          8
      );

      // Primeiros 16 veículos de cada categoria são usados
      // como reserva de simulação offline.
      const status =
        index < BASE_OFFLINE_PER_CATEGORY
          ? 'OFFLINE'
          : 'ONLINE';

      // Se a categoria possui uma dependência definida,
      // utiliza aquele link.
      //
      // Caso contrário, utiliza OSPF como padrão.
      const link =
        categoryDependencies[category.name] ??
        'ospf';

      vehicles.push({
        id: `V-${String(counter).padStart(6, '0')}`,
        category: category.name,
        speed,
        status,
        consumption: Math.max(
          35,
          Math.min(
            100,
            category.consumption +
              ((index + base) % 7) -
              3
          )
        ),
        link
      });

      counter += 1;
    }
  }

  return vehicles;
}

// ============================================================
// HOOK PRINCIPAL
// ============================================================

export function useFleetMonitor() {
  // Estado completo dos 100.000 veículos.
  //
  // A interface não renderiza todos os veículos,
  // somente uma pequena amostra.
  const [fleetVehicles] = useState<FleetVehicle[]>(
    generateFleetVehicles
  );

  // Estado dos cinco links.
  const [linksStatus, setLinksStatus] =
    useState<Record<LinkId, boolean>>(
      initialStatus
    );

  // Logs do sistema.
  const [logs, setLogs] =
    useState<SystemLog[]>([]);

  // Velocidade média atual.
  const [velocity, setVelocity] =
    useState(64.9);

  // Histórico da telemetria.
  const [telemetry, setTelemetry] =
    useState<TelemetryPoint[]>(() => {
      const base = [
        63.8,
        64.5,
        64.1,
        65.0,
        64.6,
        64.9,
        65.2,
        64.7,
        65.1,
        64.8
      ];

      const now = new Date();

      return base.map((value, index) => {
        const date = new Date(
          now.getTime() -
            (base.length - index - 1) *
              2.5 *
              60 *
              1000
        );

        return newTelemetryPoint(
          value,
          date
        );
      });
    });

  // ============================================================
  // SISTEMA DE LOG
  // ============================================================

  const addLog = useCallback(
    (
      level: SystemLog['level'],
      method: SystemLog['method'],
      route: string,
      message: string,
      status = 200,
      latency = apiLatency()
    ) => {
      const traceId = newTraceId();

      const entry: SystemLog = {
        id: `${Date.now()}-${traceId}-${Math.random()}`,
        time: clock(),
        level,
        method,
        route,
        status,
        latency,
        message,
        traceId
      };

      setLogs(
        (current: SystemLog[]) =>
          [entry, ...current].slice(0, 24)
      );

      console.log(
        `[OTel] TraceID: ${traceId} - ${message} | ` +
          `${method} ${route} ${status} ${latency}ms`
      );
    },
    []
  );

  // ============================================================
  // ATUALIZAÇÃO CONTÍNUA DA TELEMETRIA
  // ============================================================

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        // Atualiza velocidade média.
        setVelocity((current: number) =>
          Number(
            Math.max(
              42,
              Math.min(
                78,
                current +
                  (Math.random() - 0.5) * 3.2
              )
            ).toFixed(1)
          )
        );

        // Adiciona novo ponto ao gráfico.
        setTelemetry(
          (items: TelemetryPoint[]) => {
            const previous =
              items[items.length - 1]?.value ??
              64.9;

            const next = Number(
              Math.max(
                42,
                Math.min(
                  78,
                  previous +
                    (Math.random() - 0.5) *
                      3.2
                )
              ).toFixed(1)
            );

            return [
              ...items.slice(-23),
              newTelemetryPoint(next)
            ];
          }
        );
      }, 2500);

    return () =>
      window.clearInterval(interval);
  }, []);

  // ============================================================
  // OBSERVABILIDADE
  // ============================================================

  // Cada mudança de telemetria cria um TraceID.
  useEffect(() => {
    addLog(
      'INFO',
      'GET',
      '/api/telemetry/stream',
      'Atualizando telemetria da frota...'
    );
  }, [velocity, addLog]);

  // ============================================================
  // VERIFICA SE A CATEGORIA ESTÁ ONLINE
  // ============================================================

  const isCategoryOnline = useCallback(
    (category: Category) => {
      const dependency =
        categoryDependencies[category];

      // Se a categoria possui uma dependência,
      // consulta o status daquele link.
      if (dependency) {
        return linksStatus[dependency];
      }

      // Sem dependência específica,
      // considera operacional.
      return true;
    },
    [linksStatus]
  );

  // ============================================================
  // VERIFICA SE O VEÍCULO ESTÁ ONLINE
  // ============================================================

  const isVehicleOnline = useCallback(
    (vehicle: FleetVehicle) => {
      // O veículo pode estar offline por sua condição própria.
      if (vehicle.status === 'OFFLINE') {
        return false;
      }

      // Se a categoria depende de algum link,
      // verifica o status daquele link.
      const dependency =
        categoryDependencies[
          vehicle.category
        ];

      if (dependency) {
        return linksStatus[dependency];
      }

      return true;
    },
    [linksStatus]
  );

  // ============================================================
  // DADOS DAS CATEGORIAS
  // ============================================================

  const categoryData = useMemo(() => {
    const onlineByCategory =
      CATEGORIES.reduce<Record<Category, number>>(
        (counts, category) => {
          counts[category] = 0;
          return counts;
        },
        {} as Record<Category, number>
      );

    // Percorre os 100.000 veículos.
    for (const vehicle of fleetVehicles) {
      if (
        vehicle.status === 'ONLINE' &&
        isCategoryOnline(
          vehicle.category
        )
      ) {
        onlineByCategory[
          vehicle.category
        ] += 1;
      }
    }

    return fleetCategories.map(
      (category) => ({
        ...category,

        online:
          onlineByCategory[
            category.name
          ],

        operational:
          isCategoryOnline(
            category.name
          )
      })
    );
  }, [
    fleetVehicles,
    isCategoryOnline
  ]);

  // ============================================================
  // TOTAL DE VEÍCULOS ONLINE
  // ============================================================

  const onlineVehicles = useMemo(
    () =>
      categoryData.reduce(
        (total, category) =>
          total + category.online,
        0
      ),
    [categoryData]
  );

  // ============================================================
  // TOTAL DE LINKS ONLINE
  // ============================================================

  const activeLinks = useMemo(
    () =>
      Object.values(
        linksStatus
      ).filter(Boolean).length,
    [linksStatus]
  );

  // ============================================================
  // MÉTRICAS GERAIS
  // ============================================================

  const totalVehicles =
    fleetVehicles.length;

  const alerts =
    totalVehicles - onlineVehicles;

  // ============================================================
  // AMOSTRA DA TABELA
  // ============================================================
  //
  // Primeiro procura um veículo online.
  //
  // Isso evita o problema em que os primeiros 16
  // veículos de cada categoria eram escolhidos e
  // apareciam todos OFFLINE.
  //
  // Se a categoria realmente estiver offline por
  // causa do link, o fallback será usado.
  //

  const sampleVehicles = useMemo(
    () =>
      fleetCategories
        .map((category) => {
          const onlineVehicle =
            fleetVehicles.find(
              (item) =>
                item.category ===
                  category.name &&
                isVehicleOnline(item)
            );

          const fallbackVehicle =
            fleetVehicles.find(
              (item) =>
                item.category ===
                category.name
            );

          const vehicle =
            onlineVehicle ??
            fallbackVehicle;

          if (!vehicle) {
            return null;
          }

          return {
            ...vehicle,

            status: isVehicleOnline(
              vehicle
            )
              ? 'ONLINE'
              : 'OFFLINE'
          };
        })
        .filter(
          (
            vehicle
          ): vehicle is FleetVehicle =>
            vehicle !== null
        ),
    [
      fleetVehicles,
      isVehicleOnline
    ]
  );

  // ============================================================
  // ALTERAR DISPONIBILIDADE DO LINK
  // ============================================================

  const setLinkAvailability =
    useCallback(
      (
        id: LinkId,
        online: boolean,
        message: string,
        level: SystemLog['level'] =
          'INFO'
      ) => {
        const link =
          connectivityLinks.find(
            (item) =>
              item.id === id
          );

        // Atualiza o estado do link.
        setLinksStatus(
          (
            current: Record<
              LinkId,
              boolean
            >
          ) => ({
            ...current,
            [id]: online
          })
        );

        // Registra o evento.
        addLog(
          level,
          'POST',
          `/api/connectivity/${id}/${
            online
              ? 'restore'
              : 'link-down'
          }`,
          `${
            link?.title ?? id
          }: ${message}`
        );
      },
      [addLog]
    );

  // ============================================================
  // BOTÃO GENÉRICO DE TOGGLE
  // ============================================================

  const toggleLink = useCallback(
    (id: LinkId) => {
      const currentOnline =
        linksStatus[id];

      setLinkAvailability(
        id,
        !currentOnline,
        currentOnline
          ? 'LINK OFFLINE'
          : 'LINK ONLINE',
        currentOnline
          ? 'WARN'
          : 'INFO'
      );
    },
    [
      linksStatus,
      setLinkAvailability
    ]
  );

  // ============================================================
  // RESTAURAR TODOS OS LINKS
  // ============================================================

  const restoreAll = useCallback(
    () => {
      setLinksStatus({
        ...initialStatus
      });

      addLog(
        'INFO',
        'POST',
        '/api/connectivity/restore-all',
        'Restauração total: todos os 5 links operacionais'
      );
    },
    [addLog]
  );

  // ============================================================
  // DERRUBAR CORE OSPF
  // ============================================================

  const dropOspf = useCallback(
    () => {
      setLinkAvailability(
        'ospf',
        false,
        'LINK OFFLINE - Core OSPF derrubado pelo operador',
        'ERROR'
      );
    },
    [setLinkAvailability]
  );

  // ============================================================
  // DERRUBAR VSAT
  // ============================================================

  const dropVsat = useCallback(
    () => {
      setLinkAvailability(
        'vsat',
        false,
        'LINK OFFLINE - VSAT D2 derrubado; Carro e SUV afetados',
        'ERROR'
      );
    },
    [setLinkAvailability]
  );

  // ============================================================
  // RANDOMIZAR LINKS
  // ============================================================

  const randomizeLinks =
    useCallback(() => {
      const next =
        (
          Object.keys(
            initialStatus
          ) as LinkId[]
        ).reduce(
          (
            result,
            id
          ) => {
            result[id] =
              Math.random() >
              0.25;

            return result;
          },
          {} as Record<
            LinkId,
            boolean
          >
        );

      setLinksStatus(next);

      addLog(
        'WARN',
        'POST',
        '/api/simulation/randomize',
        'Estado dos links alterado aleatoriamente'
      );
    }, [addLog]);

  // ============================================================
  // RETORNO
  // ============================================================

  return {
    linksStatus,
    categoryData,
    sampleVehicles,
    totalVehicles,
    onlineVehicles,
    activeLinks,
    alerts,
    velocity,
    telemetry,
    logs,
    toggleLink,
    restoreAll,
    dropOspf,
    dropVsat,
    randomizeLinks,
    isCategoryOnline
  };
}