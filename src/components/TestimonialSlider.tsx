"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Testimonial {
    id?: string;
    quote: string;
    author: string;
    role: string;
}

export default function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!testimonials || testimonials.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen bg-background text-foreground flex items-center overflow-hidden" id="testimonials">
            {/* Decorative background element */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                <div className="text-[40vw] font-bold leading-none select-none">"</div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="flex flex-col items-center text-center"
                    >
                        {testimonials && testimonials.length > 0 ? (
                            <>
                                <p className="text-3xl md:text-5xl lg:text-7xl font-medium tracking-tight max-w-5xl leading-tight mb-12">
                                    "{testimonials[current]?.quote}"
                                </p>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-xl md:text-2xl font-semibold text-secondary-1">
                                        {testimonials[current]?.author}
                                    </span>
                                    <span className="text-sm md:text-base tracking-widest uppercase opacity-60">
                                        {testimonials[current]?.role}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className="text-xl opacity-50">Mohon tunggu, memuat ulasan...</p>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Indicators */}
                <div className="absolute bottom-12 left-0 right-0 gap-4 flex justify-center z-20">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-1 transition-all duration-500 ease-out rounded-full ${current === i ? "w-12 bg-secondary-1" : "w-4 bg-foreground/20"
                                }`}
                        >
                            <span className="sr-only">Go to slide {i + 1}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
