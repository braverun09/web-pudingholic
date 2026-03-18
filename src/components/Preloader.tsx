"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Lock scroll while loading
        document.body.style.overflow = "hidden";

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 10) + 5;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                setTimeout(() => setLoading(false), 500);
            }
            setProgress(currentProgress);
        }, 60);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                document.body.style.overflow = "";
            }, 800);
        }
    }, [loading]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    key="preloader"
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground"
                >
                    <div className="overflow-hidden flex flex-col items-center">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="relative h-[30vh] w-[80vw] md:h-[500px] md:w-[800px]"
                        >
                            <Image src="/images/logo.png" alt="Pudingholic Logo" fill sizes="100vw" className="object-contain drop-shadow-2xl" />
                        </motion.div>
                        <div className="mt-8 w-64 h-[2px] bg-foreground/10 relative overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-secondary-1"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.2 }}
                            />
                        </div>
                        <div className="mt-4 text-xs tracking-[0.3em] font-mono text-foreground/60">
                            {progress < 100 ? "MENYIAPKAN" : "SIAP"} • {progress}%
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
