"use client";

import { motion } from "framer-motion";
import { Instagram, MessageCircle, Music2 } from "lucide-react";
import Image from "next/image";

export default function CTASection() {
    return (
        <section className="relative py-32 md:py-48 px-6 md:px-12 bg-background flex items-center justify-center overflow-hidden" id="order">

            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-8xl font-bold tracking-tighter text-foreground mb-8"
                >
                    Siap mencoba puding terbaik?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-foreground/80 mb-12 max-w-2xl"
                >
                    Puding rumahan premium kami dibuat sesuai pesanan. Pesan melalui DM Instagram untuk mengamankan porsi Anda hari ini.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                >
                    <a
                        href="https://instagram.com/pudingholic.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 justify-center w-full sm:w-auto px-8 py-4 bg-[#E1306C] text-white text-lg font-medium rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md hover:bg-[#C13584] transition-all duration-300"
                    >
                        <MessageCircle size={20} />
                        Pesan via DM Instagram
                    </a>

                    <a
                        href="https://instagram.com/pudingholic.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 justify-center w-full sm:w-auto px-8 py-4 bg-white text-foreground text-lg font-medium rounded-2xl shadow-sm border border-foreground/10 hover:-translate-y-1 hover:shadow-md hover:bg-secondary-1 hover:text-white transition-all duration-300"
                    >
                        <Instagram size={20} />
                        Ikuti Instagram
                    </a>

                    <a
                        href="https://www.tiktok.com/@pudingholic.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 justify-center w-full sm:w-auto px-8 py-4 bg-white text-foreground text-lg font-medium rounded-2xl shadow-sm border border-foreground/10 hover:-translate-y-1 hover:shadow-md hover:bg-secondary-1 hover:text-white transition-all duration-300"
                    >
                        <Music2 size={20} />
                        Ikuti TikTok
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
