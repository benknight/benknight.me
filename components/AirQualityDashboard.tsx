import moment from 'moment';
import React from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AQI_LEVELS,
  aqiLevel,
  Bucket,
  bucketDays,
  DailyAirQuality,
  loadDailyData,
  MetricKey,
} from '../lib/airQuality';

interface MetricConfig {
  label: string;
  unit: string;
  color: string;
  description: string;
  guideline?: { value: number; label: string };
}

const METRICS: Record<MetricKey, MetricConfig> = {
  aqi: {
    label: 'US AQI',
    unit: '',
    color: '#8b5cf6',
    description:
      'US EPA Air Quality Index, computed from hourly pollutant concentrations',
  },
  pm25: {
    label: 'PM2.5',
    unit: 'µg/m³',
    color: '#0ea5e9',
    description: 'Fine particulate matter smaller than 2.5 microns',
    guideline: { value: 15, label: 'WHO 24h guideline (15)' },
  },
  pm10: {
    label: 'PM10',
    unit: 'µg/m³',
    color: '#f59e0b',
    description: 'Particulate matter smaller than 10 microns',
    guideline: { value: 45, label: 'WHO 24h guideline (45)' },
  },
};

const METRIC_KEYS: MetricKey[] = ['aqi', 'pm25', 'pm10'];

const PRESETS: Array<{ id: string; label: string; days?: number }> = [
  { id: '1m', label: '1M', days: 30 },
  { id: '6m', label: '6M', days: 183 },
  { id: '1y', label: '1Y', days: 365 },
  { id: '5y', label: '5Y', days: 1826 },
  { id: 'all', label: 'All' },
];

const AQI_SHORT_NAMES: Record<string, string> = {
  'Unhealthy for Sensitive Groups': 'Sensitive',
};

interface ChartPoint {
  ts: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  range: [number, number] | null;
}

type Status = 'loading' | 'error' | 'ready';

export default function AirQualityDashboard() {
  const [status, setStatus] = React.useState<Status>('loading');
  const [progress, setProgress] = React.useState({ done: 0, total: 0 });
  const [days, setDays] = React.useState<DailyAirQuality[]>([]);
  const [metric, setMetric] = React.useState<MetricKey>('aqi');
  const [preset, setPreset] = React.useState('all');
  const [range, setRange] = React.useState({ start: '', end: '' });
  const [reloadCount, setReloadCount] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setProgress({ done: 0, total: 0 });
    loadDailyData((done, total) => {
      if (!cancelled) setProgress({ done, total });
    })
      .then(loaded => {
        if (cancelled) return;
        setDays(loaded);
        setRange({ start: loaded[0].date, end: loaded[loaded.length - 1].date });
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  const dataStart = days[0]?.date ?? '';
  const dataEnd = days[days.length - 1]?.date ?? '';

  const applyPreset = (id: string) => {
    const presetConfig = PRESETS.find(p => p.id === id)!;
    const start = presetConfig.days
      ? moment
          .max(moment(dataStart), moment(dataEnd).subtract(presetConfig.days, 'days'))
          .format('YYYY-MM-DD')
      : dataStart;
    setPreset(id);
    setRange({ start, end: dataEnd });
  };

  const setCustomRange = (partial: Partial<{ start: string; end: string }>) => {
    setPreset('custom');
    setRange(prev => ({ ...prev, ...partial }));
  };

  const filteredDays = React.useMemo(
    () => days.filter(d => d.date >= range.start && d.date <= range.end),
    [days, range],
  );

  const spanDays =
    range.start && range.end ? moment(range.end).diff(moment(range.start), 'days') : 0;
  const bucket: Bucket = spanDays > 1460 ? 'month' : spanDays > 540 ? 'week' : 'day';

  const chartData = React.useMemo<ChartPoint[]>(() => {
    const buckets = bucketDays(filteredDays, bucket);
    const points: ChartPoint[] = [];
    const step = bucket === 'day' ? 86400000 : bucket === 'week' ? 7 * 86400000 : 0;
    let prevTs: number | null = null;
    for (const day of buckets) {
      const stat = day[metric];
      const ts = Date.parse(day.date);
      // Break the line across gaps in the data instead of bridging them
      if (prevTs !== null && step && ts - prevTs > step) {
        points.push({ ts: prevTs + step, min: null, max: null, avg: null, range: null });
      }
      points.push({
        ts,
        min: stat?.min ?? null,
        max: stat?.max ?? null,
        avg: stat?.avg ?? null,
        range: stat ? [stat.min, stat.max] : null,
      });
      prevTs = ts;
    }
    return points;
  }, [filteredDays, bucket, metric]);

  const summary = React.useMemo(() => {
    const withData = filteredDays.filter(d => d[metric]);
    if (!withData.length) return null;
    const latest = withData[withData.length - 1];
    let best = withData[0];
    let worst = withData[0];
    let sum = 0;
    for (const day of withData) {
      const avg = day[metric]!.avg;
      sum += avg;
      if (avg < best[metric]!.avg) best = day;
      if (avg > worst[metric]!.avg) worst = day;
    }
    return { latest, average: sum / withData.length, best, worst };
  }, [filteredDays, metric]);

  if (status === 'loading') {
    return <LoadingState progress={progress} />;
  }

  if (status === 'error') {
    return (
      <div className="py-20 text-center">
        <p className="mb-4">
          Couldn’t load air quality data from Open-Meteo. Check your connection and try
          again.
        </p>
        <button
          className="px-4 py-2 rounded-lg bg-stone-800 text-white dark:bg-white dark:text-stone-900 text-sm font-medium"
          onClick={() => setReloadCount(count => count + 1)}
        >
          Retry
        </button>
      </div>
    );
  }

  const config = METRICS[metric];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          options={METRIC_KEYS.map(key => ({ id: key, label: METRICS[key].label }))}
          value={metric}
          onChange={id => setMetric(id as MetricKey)}
        />
        <SegmentedControl
          options={PRESETS.map(p => ({ id: p.id, label: p.label }))}
          value={preset}
          onChange={applyPreset}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <DateInput
          label="From"
          value={range.start}
          min={dataStart}
          max={range.end}
          onChange={start => setCustomRange({ start })}
        />
        <DateInput
          label="To"
          value={range.end}
          min={range.start}
          max={dataEnd}
          onChange={end => setCustomRange({ end })}
        />
        <span className="text-xs text-black/40 dark:text-white/40 ml-auto">
          {bucket === 'day' ? 'Daily' : bucket === 'week' ? 'Weekly' : 'Monthly'}{' '}
          aggregates
        </span>
      </div>

      {summary ? (
        <>
          <SummaryCards summary={summary} metric={metric} />
          <div className="rounded-2xl bg-stone-100 dark:bg-stone-800/60 p-3 sm:p-5">
            <AirQualityChart
              data={chartData}
              metric={metric}
              bucket={bucket}
              spanDays={spanDays}
            />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-black/50 dark:text-white/50">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-4 h-0.5 rounded"
                  style={{ backgroundColor: config.color }}
                />
                Average
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-4 h-2.5 rounded-sm opacity-30"
                  style={{ backgroundColor: config.color }}
                />
                Min–max range
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="py-20 text-center text-black/50 dark:text-white/50">
          No {config.label} data available for this date range.
        </div>
      )}

      <p className="text-xs leading-relaxed text-black/40 dark:text-white/40">
        {config.description}. Each point shows the minimum, maximum, and average of hourly
        values from the{' '}
        <a className="underline" href="https://open-meteo.com/en/docs/air-quality-api">
          Open-Meteo Air Quality API
        </a>{' '}
        (CAMS model data) for central Ho Chi Minh City (10.78°N, 106.70°E). Data available
        from {moment(dataStart).format('LL')} to {moment(dataEnd).format('LL')}. Fetched
        in your browser and cached locally, so the first visit takes a moment.
      </p>
    </div>
  );
}

function LoadingState({ progress }: { progress: { done: number; total: number } }) {
  const percent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  return (
    <div className="py-20 flex flex-col items-center text-center">
      <svg
        className="animate-spin h-6 w-6 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <p className="mb-3">Loading a decade of hourly air quality data&hellip;</p>
      <div className="w-64 max-w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-stone-500 dark:bg-stone-300 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-black/40 dark:text-white/40">
        This only happens on your first visit — results are cached in your browser.
      </p>
    </div>
  );
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: Array<{ id: string; label: string }>;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex rounded-lg bg-stone-200/70 dark:bg-stone-800 p-1 self-start">
      {options.map(option => (
        <button
          key={option.id}
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            value === option.id
              ? 'bg-white dark:bg-stone-600 shadow font-semibold text-black dark:text-white'
              : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
          }`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function DateInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: string;
  min: string;
  max: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-black/40 dark:text-white/40">
        {label}
      </span>
      <input
        type="date"
        className="rounded-md border border-stone-300 dark:border-stone-600 bg-transparent px-2 py-1 text-sm dark:[color-scheme:dark]"
        value={value}
        min={min}
        max={max}
        onChange={event => {
          if (event.target.value) onChange(event.target.value);
        }}
      />
    </label>
  );
}

function SummaryCards({
  summary,
  metric,
}: {
  summary: {
    latest: DailyAirQuality;
    average: number;
    best: DailyAirQuality;
    worst: DailyAirQuality;
  };
  metric: MetricKey;
}) {
  const latestStat = summary.latest[metric]!;
  const cards = [
    {
      label: 'Latest',
      value: latestStat.avg,
      sub: moment(summary.latest.date).format('ll'),
    },
    {
      label: 'Period average',
      value: summary.average,
      sub: 'of daily averages',
    },
    {
      label: 'Cleanest day',
      value: summary.best[metric]!.avg,
      sub: moment(summary.best.date).format('ll'),
    },
    {
      label: 'Worst day',
      value: summary.worst[metric]!.avg,
      sub: moment(summary.worst.date).format('ll'),
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(card => (
        <div
          key={card.label}
          className="rounded-2xl bg-stone-100 dark:bg-stone-800/60 px-4 py-3"
        >
          <div className="text-[0.65rem] uppercase tracking-wider text-black/40 dark:text-white/40">
            {card.label}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-black dark:text-white">
              {formatValue(card.value, metric)}
            </span>
            {metric !== 'aqi' && (
              <span className="text-xs text-black/40 dark:text-white/40">µg/m³</span>
            )}
          </div>
          {metric === 'aqi' ? (
            <AqiBadge value={card.value} sub={card.sub} />
          ) : (
            <div className="text-xs text-black/40 dark:text-white/40">{card.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function AqiBadge({ value, sub }: { value: number; sub: string }) {
  const level = aqiLevel(value);
  return (
    <div className="text-xs text-black/40 dark:text-white/40 flex items-center gap-1.5 flex-wrap">
      <span
        className="flex items-center gap-1 font-medium"
        style={{ color: level.color }}
      >
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: level.color }}
        />
        {AQI_SHORT_NAMES[level.name] ?? level.name}
      </span>
      <span>· {sub}</span>
    </div>
  );
}

function formatValue(value: number, metric: MetricKey): string {
  return metric === 'aqi' ? String(Math.round(value)) : value.toFixed(1);
}

function AirQualityChart({
  data,
  metric,
  bucket,
  spanDays,
}: {
  data: ChartPoint[];
  metric: MetricKey;
  bucket: Bucket;
  spanDays: number;
}) {
  const config = METRICS[metric];

  const yMax = React.useMemo(() => {
    let max = 0;
    for (const point of data) {
      if (point.max !== null && point.max > max) max = point.max;
    }
    if (config.guideline) max = Math.max(max, config.guideline.value);
    const step = max > 250 ? 50 : max > 100 ? 25 : 10;
    return Math.max(step, Math.ceil((max * 1.05) / step) * step);
  }, [data, config]);

  const ticks = React.useMemo(() => {
    const withData = data.filter(point => point.avg !== null);
    if (withData.length < 2) return withData.map(point => point.ts);
    const count = Math.min(6, withData.length);
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
      const index = Math.round((i * (withData.length - 1)) / (count - 1));
      result.push(withData[index].ts);
    }
    return Array.from(new Set(result));
  }, [data]);

  const formatTick = (ts: number) =>
    spanDays > 1095
      ? moment(ts).format('YYYY')
      : spanDays > 270
      ? moment(ts).format('MMM ’YY')
      : moment(ts).format('MMM D');

  return (
    <div className="h-72 sm:h-96 text-stone-400 dark:text-stone-500">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 5, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
          <XAxis
            dataKey="ts"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            ticks={ticks}
            tickFormatter={formatTick}
            tick={{ fill: 'currentColor', fontSize: 12 }}
            stroke="currentColor"
            strokeOpacity={0.3}
            tickMargin={8}
          />
          <YAxis
            domain={[0, yMax]}
            width={42}
            tick={{ fill: 'currentColor', fontSize: 12 }}
            stroke="currentColor"
            strokeOpacity={0.3}
          />
          {metric === 'aqi' &&
            AQI_LEVELS.map((level, i) => {
              const y1 = i === 0 ? 0 : AQI_LEVELS[i - 1].max;
              if (y1 >= yMax) return null;
              const y2 = Math.min(level.max, yMax);
              return (
                <ReferenceArea
                  key={level.name}
                  y1={y1}
                  y2={y2}
                  fill={level.color}
                  fillOpacity={0.07}
                  stroke="none"
                  label={{
                    value: AQI_SHORT_NAMES[level.name] ?? level.name,
                    position: 'insideTopRight',
                    fill: level.color,
                    fontSize: 10,
                    opacity: 0.8,
                  }}
                />
              );
            })}
          {config.guideline && (
            <ReferenceLine
              y={config.guideline.value}
              stroke="#14b8a6"
              strokeDasharray="5 4"
              label={{
                value: config.guideline.label,
                position: 'insideTopRight',
                fill: '#14b8a6',
                fontSize: 11,
              }}
            />
          )}
          <Area
            dataKey="range"
            type="monotone"
            fill={config.color}
            fillOpacity={0.22}
            stroke="none"
            isAnimationActive={false}
            activeDot={false}
          />
          <Line
            dataKey="avg"
            type="monotone"
            stroke={config.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            isAnimationActive={false}
          />
          <Tooltip
            content={<ChartTooltip metric={metric} bucket={bucket} />}
            cursor={{ stroke: 'currentColor', strokeOpacity: 0.35 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartTooltip(props: any) {
  const { active, payload, metric, bucket } = props as {
    active?: boolean;
    payload?: Array<{ payload: ChartPoint }>;
    metric: MetricKey;
    bucket: Bucket;
  };
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  if (point.avg === null) return null;
  const config = METRICS[metric];
  const label =
    bucket === 'month'
      ? moment(point.ts).format('MMMM YYYY')
      : bucket === 'week'
      ? `Week of ${moment(point.ts).format('ll')}`
      : moment(point.ts).format('ddd, ll');
  const unit = config.unit ? ` ${config.unit}` : '';
  return (
    <div className="rounded-lg border border-stone-200 dark:border-stone-700 bg-white/95 dark:bg-stone-900/95 px-3 py-2 text-sm shadow-lg">
      <div className="font-semibold text-black dark:text-white">{label}</div>
      <div style={{ color: config.color }} className="font-medium">
        Avg {formatValue(point.avg, metric)}
        {unit}
      </div>
      <div className="text-xs text-black/50 dark:text-white/50">
        Range {formatValue(point.min!, metric)}–{formatValue(point.max!, metric)}
        {unit}
      </div>
      {metric === 'aqi' && (
        <div className="text-xs font-medium" style={{ color: aqiLevel(point.avg).color }}>
          {aqiLevel(point.avg).name}
        </div>
      )}
    </div>
  );
}
