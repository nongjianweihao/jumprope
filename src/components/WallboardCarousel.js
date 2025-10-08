import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
export function WallboardCarousel({ slides, interval = 8000 }) {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const id = window.setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, interval);
        return () => window.clearInterval(id);
    }, [slides.length, interval]);
    if (!slides.length) {
        return _jsx("div", { className: "flex h-full items-center justify-center text-xl text-white/60", children: "\u6682\u65E0\u58C1\u677F\u5185\u5BB9" });
    }
    const slide = slides[index];
    return (_jsxs("div", { className: "flex h-full flex-col items-start justify-center gap-4 p-8 text-white", children: [_jsx("div", { className: "text-sm uppercase tracking-[0.4em] text-white/60", children: "Wallboard" }), _jsx("h2", { className: "text-4xl font-black tracking-wide", children: slide.title }), _jsx("p", { className: "max-w-2xl text-2xl text-white/90", children: slide.description })] }));
}
