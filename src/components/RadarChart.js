import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Radar, RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
export function RadarChart({ data, baselineP50 }) {
    const chartData = Object.entries(data).map(([key, value]) => ({
        quality: key,
        score: value,
        baseline: baselineP50?.[key] ?? 0
    }));
    return (_jsx(ResponsiveContainer, { width: "100%", height: 320, children: _jsxs(ReRadarChart, { data: chartData, outerRadius: "80%", children: [_jsx(PolarGrid, {}), _jsx(PolarAngleAxis, { dataKey: "quality", tick: { fontSize: 12 } }), _jsx(PolarRadiusAxis, { domain: [0, 100], tick: { fontSize: 10 } }), _jsx(Radar, { name: "\u5F53\u524D", dataKey: "score", stroke: "#4A6CF7", fill: "#4A6CF7", fillOpacity: 0.4 }), _jsx(Radar, { name: "\u540C\u9F84 P50", dataKey: "baseline", stroke: "#94A3B8", fill: "#94A3B8", fillOpacity: 0.2 }), _jsx(Tooltip, {})] }) }));
}
