import moment from 'moment';

export interface MetricStat {
  min: number;
  max: number;
  avg: number;
}

export interface DailyAirQuality {
  date: string; // YYYY-MM-DD in Asia/Ho_Chi_Minh
  pm25: MetricStat | null;
  pm10: MetricStat | null;
  aqi: MetricStat | null;
}

export type MetricKey = 'pm25' | 'pm10' | 'aqi';

export type Bucket = 'day' | 'week' | 'month';

// District 1, Ho Chi Minh City
const LATITUDE = 10.7769;
const LONGITUDE = 106.7009;

// Open-Meteo serves CAMS reanalysis/forecast data; request from the earliest
// plausible year and let unavailable years fail gracefully.
const EARLIEST_YEAR = 2013;

const CACHE_KEY = 'hcmc-air-quality-daily-v1';

// Require a minimum number of hourly samples before trusting a daily stat
const MIN_HOURS_PER_DAY = 6;

interface CachePayload {
  fetchedAt: string;
  days: DailyAirQuality[];
}

interface HourlyResponse {
  time: string[];
  pm2_5: Array<number | null>;
  pm10: Array<number | null>;
  us_aqi: Array<number | null>;
}

function buildUrl(startDate: string, endDate: string): string {
  const params = new URLSearchParams({
    latitude: String(LATITUDE),
    longitude: String(LONGITUDE),
    hourly: 'pm2_5,pm10,us_aqi',
    start_date: startDate,
    end_date: endDate,
    timezone: 'Asia/Bangkok',
  });
  return `https://air-quality-api.open-meteo.com/v1/air-quality?${params}`;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function computeStat(values: number[]): MetricStat | null {
  if (values.length < MIN_HOURS_PER_DAY) return null;
  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
    sum += value;
  }
  return { min: round1(min), max: round1(max), avg: round1(sum / values.length) };
}

function aggregateHourly(hourly: HourlyResponse): DailyAirQuality[] {
  const byDate = new Map<string, { pm25: number[]; pm10: number[]; aqi: number[] }>();
  hourly.time.forEach((time, i) => {
    const date = time.slice(0, 10);
    let entry = byDate.get(date);
    if (!entry) {
      entry = { pm25: [], pm10: [], aqi: [] };
      byDate.set(date, entry);
    }
    const pm25 = hourly.pm2_5?.[i];
    const pm10 = hourly.pm10?.[i];
    const aqi = hourly.us_aqi?.[i];
    if (typeof pm25 === 'number') entry.pm25.push(pm25);
    if (typeof pm10 === 'number') entry.pm10.push(pm10);
    if (typeof aqi === 'number') entry.aqi.push(aqi);
  });
  return Array.from(byDate.entries()).map(([date, values]) => ({
    date,
    pm25: computeStat(values.pm25),
    pm10: computeStat(values.pm10),
    aqi: computeStat(values.aqi),
  }));
}

async function fetchRange(
  startDate: string,
  endDate: string,
): Promise<DailyAirQuality[]> {
  const res = await fetch(buildUrl(startDate, endDate));
  if (!res.ok) {
    throw new Error(
      `Open-Meteo request failed for ${startDate}–${endDate} (${res.status})`,
    );
  }
  const json = await res.json();
  if (!json.hourly?.time?.length) return [];
  return aggregateHourly(json.hourly);
}

function hasAnyData(day: DailyAirQuality): boolean {
  return Boolean(day.pm25 || day.pm10 || day.aqi);
}

function mergeDays(...groups: DailyAirQuality[][]): DailyAirQuality[] {
  const byDate = new Map<string, DailyAirQuality>();
  for (const group of groups) {
    for (const day of group) {
      byDate.set(day.date, day);
    }
  }
  const days = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
  // Trim leading/trailing days with no data at all
  let start = 0;
  let end = days.length;
  while (start < end && !hasAnyData(days[start])) start++;
  while (end > start && !hasAnyData(days[end - 1])) end--;
  return days.slice(start, end);
}

function readCache(): CachePayload | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.days) || typeof parsed?.fetchedAt !== 'string')
      return null;
    return parsed as CachePayload;
  } catch {
    return null;
  }
}

function writeCache(days: DailyAirQuality[]): void {
  try {
    const payload: CachePayload = { fetchedAt: moment().format('YYYY-MM-DD'), days };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage may be full or unavailable; the dashboard still works
  }
}

export type ProgressCallback = (done: number, total: number) => void;

async function fetchAllYears(onProgress?: ProgressCallback): Promise<DailyAirQuality[]> {
  const today = moment();
  const currentYear = today.year();
  const years: number[] = [];
  for (let year = EARLIEST_YEAR; year <= currentYear; year++) years.push(year);

  const results: DailyAirQuality[][] = [];
  let done = 0;
  const queue = [...years];

  async function worker() {
    while (queue.length) {
      const year = queue.shift()!;
      const start = `${year}-01-01`;
      const end = year === currentYear ? today.format('YYYY-MM-DD') : `${year}-12-31`;
      try {
        results.push(await fetchRange(start, end));
      } catch {
        // Years outside the archive's coverage are simply skipped
      }
      done++;
      onProgress?.(done, years.length);
    }
  }

  await Promise.all([worker(), worker(), worker()]);
  const days = mergeDays(...results);
  if (!days.length) {
    throw new Error('No air quality data could be loaded from Open-Meteo.');
  }
  return days;
}

/**
 * Load the full daily history, using localStorage as a cache. The first visit
 * fetches every year of hourly data; subsequent visits only top up the days
 * since the last fetch.
 */
export async function loadDailyData(
  onProgress?: ProgressCallback,
): Promise<DailyAirQuality[]> {
  const today = moment().format('YYYY-MM-DD');
  const cached = readCache();

  if (cached?.days.length) {
    if (cached.fetchedAt === today) return cached.days;
    try {
      const lastDate = cached.days[cached.days.length - 1].date;
      const topUpStart = moment.min(moment(lastDate).subtract(3, 'days'), moment(today));
      const fresh = await fetchRange(topUpStart.format('YYYY-MM-DD'), today);
      const merged = mergeDays(cached.days, fresh);
      writeCache(merged);
      return merged;
    } catch {
      return cached.days;
    }
  }

  const days = await fetchAllYears(onProgress);
  writeCache(days);
  return days;
}

/**
 * Aggregate daily stats into weekly or monthly buckets so long date ranges
 * stay readable: min of mins, max of maxes, mean of daily averages.
 */
export function bucketDays(days: DailyAirQuality[], bucket: Bucket): DailyAirQuality[] {
  if (bucket === 'day') return days;
  const byKey = new Map<string, DailyAirQuality[]>();
  for (const day of days) {
    const key =
      bucket === 'week'
        ? moment(day.date).startOf('isoWeek').format('YYYY-MM-DD')
        : `${day.date.slice(0, 7)}-01`;
    const group = byKey.get(key);
    if (group) group.push(day);
    else byKey.set(key, [day]);
  }
  return Array.from(byKey.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, group]) => ({
      date,
      pm25: combineStats(group.map(d => d.pm25)),
      pm10: combineStats(group.map(d => d.pm10)),
      aqi: combineStats(group.map(d => d.aqi)),
    }));
}

function combineStats(stats: Array<MetricStat | null>): MetricStat | null {
  const present = stats.filter((s): s is MetricStat => s !== null);
  if (!present.length) return null;
  return {
    min: round1(Math.min(...present.map(s => s.min))),
    max: round1(Math.max(...present.map(s => s.max))),
    avg: round1(present.reduce((sum, s) => sum + s.avg, 0) / present.length),
  };
}

export interface AqiLevel {
  max: number;
  name: string;
  color: string;
}

export const AQI_LEVELS: AqiLevel[] = [
  { max: 50, name: 'Good', color: '#22c55e' },
  { max: 100, name: 'Moderate', color: '#eab308' },
  { max: 150, name: 'Unhealthy for Sensitive Groups', color: '#f97316' },
  { max: 200, name: 'Unhealthy', color: '#ef4444' },
  { max: 300, name: 'Very Unhealthy', color: '#a855f7' },
  { max: Infinity, name: 'Hazardous', color: '#9f1239' },
];

export function aqiLevel(value: number): AqiLevel {
  return AQI_LEVELS.find(level => value <= level.max)!;
}
