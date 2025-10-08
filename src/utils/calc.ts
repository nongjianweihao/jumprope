import type { FitnessQuality, Student } from '../types/models';
import { getSpeedThresholds } from '../store/publicLibrary';

export function evalSpeedRank(best30Single: number) {
  const thresholds = getSpeedThresholds();
  let rank = 0;
  for (let i = 0; i < thresholds.length; i += 1) {
    if (best30Single >= thresholds[i]) {
      rank = i + 1;
    }
  }
  return rank;
}

export function maybeUpgradeRank(student: Student, best30Single: number) {
  const next = evalSpeedRank(best30Single);
  if (next > (student.currentRank ?? 0)) {
    student.currentRank = next;
  }
  return student;
}

export interface BenchmarkEntry {
  quality: FitnessQuality;
  age: number;
  gender?: 'M' | 'F';
  p25: number;
  p50: number;
  p75: number;
}

export function normalizeByBenchmark(
  value: number,
  benchmark?: BenchmarkEntry
): { score: number; ref?: BenchmarkEntry } {
  if (!benchmark) {
    return { score: 0 };
  }
  const { p25, p50, p75 } = benchmark;
  let score = 0;
  if (value <= p25) {
    score = 60 * (value / Math.max(1, p25));
  } else if (value <= p50) {
    score = 60 + 15 * ((value - p25) / Math.max(1, p50 - p25));
  } else if (value <= p75) {
    score = 75 + 15 * ((value - p50) / Math.max(1, p75 - p50));
  } else {
    score = 90 + 10 * ((value - p75) / Math.max(1, p75));
  }
  return { score: Math.max(0, Math.min(100, score)), ref: benchmark };
}
