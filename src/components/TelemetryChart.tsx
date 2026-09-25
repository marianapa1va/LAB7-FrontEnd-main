import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface TelemetryPoint {
  time: string;
  value: number;
}

interface TelemetryChartProps {
  data: TelemetryPoint[];
}

export function TelemetryChart({ data }: TelemetryChartProps) {
  const safeData = data.length > 1 ? data : [{ time: '--:--', value: 0 }, ...data];

  return (
    <div className="h-[280px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={safeData}
          margin={{ top: 18, right: 14, left: -18, bottom: 4 }}
        >
          <CartesianGrid
            stroke="#1e293b"
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: '#64748b', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            minTickGap={20}
          />
          <YAxis
            domain={[40, 80]}
            tick={{ fill: '#64748b', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            width={34}
            tickFormatter={(value: number) => `${value}`}
          />
          <Tooltip
            cursor={{ stroke: '#334155', strokeDasharray: '3 3' }}
            contentStyle={{
              background: '#0b1220',
              border: '1px solid #1e293b',
              borderRadius: 8,
              fontSize: 11
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value: unknown) => [`${Number(value).toFixed(1)} km/h`, 'Velocidade média']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#35a8ff"
            strokeWidth={2.5}
            dot={{ r: 2.5, strokeWidth: 0, fill: '#60a5fa' }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: '#0b1220', fill: '#67e8f9' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
