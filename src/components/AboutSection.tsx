"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const text = "Pudingholic dibuat dengan bahan berkualitas untuk menghadirkan dessert sederhana yang terasa spesial.";

export default function AboutSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"],
    });

    const words = text.split(" ");

    return (
        <section
            ref={containerRef}
            className="py-32 md:py-48 px-6 md:px-12 bg-foreground text-background min-h-screen flex items-center justify-center"
            id="about"
        >
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="sr-only">About Pudingholic</h2>
                <p className="text-4xl md:text-6xl lg:text-8xl flex flex-wrap justify-center gap-[0.2em] font-medium tracking-tight">
                    {words.map((word, i) => {
                        const start = i / words.length;
                        const end = start + (1 / words.length);
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);

                        return (
                            <span key={i} className="relative">
                                <motion.span style={{ opacity }}>
                                    {word}
                                </motion.span>
                                <span className="absolute left-0 top-0 opacity-10">
                                    {word}
                                </span>
                            </span>
                        );
                    })}
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="mt-20 flex justify-center"
                >
                    <div className="w-16 h-[1px] bg-background/50" />
                </motion.div>
            </div>
        </section>
    );
}
