export const SPEED_THRESHOLDS = [60, 70, 80, 100, 110, 120, 150, 160, 170];
export function evalSpeedRank(best30Single) {
    let rank = 0;
    for (let i = 0; i < SPEED_THRESHOLDS.length; i += 1) {
        if (best30Single >= SPEED_THRESHOLDS[i]) {
            rank = i + 1;
        }
    }
    return rank;
}
export function maybeUpgradeRank(student, best30Single) {
    const next = evalSpeedRank(best30Single);
    if (next > (student.currentRank ?? 0)) {
        student.currentRank = next;
    }
    return student;
}
export function normalizeByBenchmark(value, benchmark) {
    if (!benchmark) {
        return { score: 0 };
    }
    const { p25, p50, p75 } = benchmark;
    let score = 0;
    if (value <= p25) {
        score = 60 * (value / Math.max(1, p25));
    }
    else if (value <= p50) {
        score = 60 + 15 * ((value - p25) / Math.max(1, p50 - p25));
    }
    else if (value <= p75) {
        score = 75 + 15 * ((value - p50) / Math.max(1, p75 - p50));
    }
    else {
        score = 90 + 10 * ((value - p75) / Math.max(1, p75));
    }
    return { score: Math.max(0, Math.min(100, score)), ref: benchmark };
}
