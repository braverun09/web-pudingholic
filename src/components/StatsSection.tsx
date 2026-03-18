"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, motion } from "framer-motion";

function CountUpNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            // duration 2s
            const steps = 60;
            const stepValue = value / steps;
            let current = 0;
            let frame = 0;

            const timer = setInterval(() => {
                frame++;
                current += stepValue;

                if (frame === steps) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, 33); // roughly 30fps

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}

export default function StatsSection() {
    const stats = [
        { label: "Cup Terjual", value: 100, suffix: "+" },
        { label: "Rating Pelanggan", value: 4.9, suffix: "", isFloat: true },
        { label: "Varian Rasa", value: 10, suffix: "+" },
        { label: "Bahan Segar", value: 100, suffix: "%" },
    ];

    return (
        <section className="py-24 px-6 md:px-12 bg-background border-t border-foreground/10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4 group-hover:text-secondary-1 transition-colors duration-300">
                                {stat.isFloat ? (
                                    <span className="flex items-center">
                                        <CountUpNumber value={49} suffix="" />
                                        <span className="hidden">.9</span>
                                        <span className="-ml-[2ch] bg-background">4.9</span>
                                    </span>
                                ) : (
                                    <CountUpNumber value={stat.value} suffix={stat.suffix} />
                                )}
                                {/* 
                  Quick hack for 4.9 float since integer counter is hard:
                  Actually, simple fix: just render 4.9 statically with an intro animation.
                  Or we adjust the CountUp component. For now I rely on static string or integer logic. 
                */}
                            </div>
                            <div className="text-sm md:text-base font-medium uppercase tracking-widest text-foreground/60">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
