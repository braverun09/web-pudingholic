"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import NextImage from "next/image";

const FRAME_COUNT = 192;

export default function SequenceScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);

    // Preload images into an array for fast drawing
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            // Pad to 3 digits e.g. 001
            const index = i.toString().padStart(3, '0');
            img.src = `/sequence/ezgif-frame-${index}.jpg`;

            // Load event is handled if we want progress,
            // but for pure arrays we can just store the Image object
            // and let the browser cache handle it loading in the background.
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);

    useEffect(() => {
        const unsubscribe = frameIndex.on("change", (latest) => {
            drawFrame(Math.round(latest));
        });

        return () => unsubscribe();
    }, [frameIndex, images]);

    const drawFrame = (index: number) => {
        if (index < 1 || index > FRAME_COUNT) return;
        const img = images[index - 1];
        const canvas = canvasRef.current;

        // Check if the image has fully loaded before trying to draw it
        if (!canvas || !img || !img.complete || img.naturalHeight === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Handle "cover" scaling
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw background color first to avoid flicker with transparent edges
        ctx.fillStyle = "#F5EEDB";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Resize canvas to window dimensions
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                // High DPI canvas
                const dpr = window.devicePixelRatio || 1;
                canvasRef.current.width = window.innerWidth * dpr;
                canvasRef.current.height = window.innerHeight * dpr;
                // Restore logical size
                canvasRef.current.style.width = window.innerWidth + "px";
                canvasRef.current.style.height = window.innerHeight + "px";

                drawFrame(Math.round(frameIndex.get()));
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial setup

        // Need a timeout to draw the first frame when it's ready if no scroll happens immediately
        const checkFirstFrame = setInterval(() => {
            if (images[0]?.complete && images[0]?.naturalHeight > 0) {
                drawFrame(Math.round(frameIndex.get()));
                clearInterval(checkFirstFrame);
            }
        }, 100);

        return () => {
            window.removeEventListener("resize", handleResize);
            clearInterval(checkFirstFrame);
        };
    }, [frameIndex, images]);

    // Overlay Opacities based on scroll
    const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
    const leftTextOpacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45], [0, 1, 0]);
    const rightTextOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75], [0, 1, 0]);
    const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

    // Dynamic translations for nice enters
    const leftTextY = useTransform(scrollYProgress, [0.25, 0.35], [50, 0]);
    const rightTextY = useTransform(scrollYProgress, [0.55, 0.65], [50, 0]);
    const ctaY = useTransform(scrollYProgress, [0.85, 0.95], [50, 0]);

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-background w-full" id="hero">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

                <div className="absolute inset-0 z-10 p-6 md:p-12 pointer-events-none">
                    {/* 0% Scroll: Centered hero title */}
                    <motion.div
                        style={{ opacity: heroOpacity }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
                    >
                        <div className="relative h-40 w-80 md:h-72 md:w-[700px] lg:h-96 lg:w-[1080px]">
                            <NextImage src="/images/logo.png" alt="Pudingholic Logo" fill sizes="(max-width: 768px) 320px, (max-width: 1024px) 700px, 1080px" className="object-contain drop-shadow-sm" />
                        </div>
                        <p className="mt-2 md:mt-4 text-xl md:text-2xl font-medium tracking-wide text-foreground/80 max-w-lg uppercase">
                            Puding Rumahan Premium
                        </p>
                    </motion.div>

                    {/* 30% Scroll: Left aligned text */}
                    <motion.div
                        style={{ opacity: leftTextOpacity, y: leftTextY }}
                        className="absolute inset-y-0 left-6 md:left-24 flex items-center justify-start text-left max-w-lg md:max-w-2xl px-4"
                    >
                        <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-foreground leading-tight">
                            Lembut. <br />
                            Creamy. <br />
                            <span className="text-secondary-1">Dibuat Segar Setiap Hari.</span>
                        </h2>
                    </motion.div>

                    {/* 60% Scroll: Right aligned text */}
                    <motion.div
                        style={{ opacity: rightTextOpacity, y: rightTextY }}
                        className="absolute inset-y-0 right-6 md:right-24 flex items-center justify-end text-right max-w-lg md:max-w-2xl px-4 ml-auto"
                    >
                        <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-foreground leading-tight">
                            Tersedia <br />
                            Berbagai <br />
                            <span className="text-secondary-2">Rasa Lezat.</span>
                        </h2>
                    </motion.div>

                    {/* 90% Scroll: Centered CTA */}
                    <motion.div
                        style={{ opacity: ctaOpacity, y: ctaY }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
                    >
                        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-foreground mb-8">
                            Nikmati manisnya hari ini.
                        </h2>
                        <div className="pointer-events-auto">
                            <a
                                href="#order"
                                className="px-8 py-4 bg-foreground text-background text-lg md:text-xl font-medium rounded-2xl hover:bg-secondary-1 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 block"
                            >
                                Lihat Opsi Pemesanan
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
