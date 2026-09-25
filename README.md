# MONITORAMENTO DE FROTA — LAB 7

Projeto independente inspirado no NOC Command Center e ajustado para seguir a organização visual do modelo apresentado, sem carregar funcionalidades desnecessárias do Lab 6.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- lucide-react
- Recharts
- clsx
- tailwind-merge

## Estrutura do Lab 7

```text
src/
├── components/
│   ├── StatusCard.tsx
│   ├── TelemetryChart.tsx
│   ├── ConnectivityLink.tsx
│   └── FleetTable.tsx
├── data/
│   └── fleet.ts
├── hooks/
│   └── useFleetMonitor.ts
├── App.tsx
├── index.css
└── main.tsx
```

## O que a tela simula

- 100.000 veículos rastreados.
- Veículos online e alertas de frota.
- Cinco links de telecomunicação.
- Queda e restauração dos links.
- Dependência do VSAT para Carro e SUV.
- Telemetria global da frota atualizada em ciclo contínuo.
- Gráfico de velocidade média com histórico estável.
- Distribuição das 10 categorias de frota.
- Tabela operacional com amostra dos veículos.
- Logs de sistema em formato de terminal, com rotas HTTP, status, latência e TraceID.

## Lab 7

O laboratório pede React + TypeScript + Tailwind, componentes com responsabilidade única, o hook `useFleetMonitor.ts` para centralizar as regras de monitoramento e observabilidade simulada com TraceID/OTel.

## Executar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Aderência ao Laboratório 7

- O `useFleetMonitor.ts` mantém uma frota simulada completa de 100.000 veículos em estado, mas a interface renderiza apenas uma amostra de 10 veículos para preservar desempenho.
- A regra de dependência `VSAT -> Carro/SUV` está centralizada no Custom Hook, conforme o exemplo do laboratório.
- A telemetria é atualizada a cada 2,5 segundos e o TraceID simulado é gerado diretamente a cada mudança de telemetria.
- Os componentes principais estão separados em `StatusCard.tsx`, `TelemetryChart.tsx`, `ConnectivityLink.tsx` e `FleetTable.tsx`.
"# LAB7-FrontEnd" 
"# LAB7-FrontEnd" 
