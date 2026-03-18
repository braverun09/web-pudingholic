"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, MessageCircle, Music2 } from "lucide-react"; // Music2 for TikTok icon fallback
import Image from "next/image";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuLinks = [
        { name: "Beranda", href: "#hero" },
        { name: "Varian Rasa", href: "#flavors" },
        { name: "Tentang Kami", href: "#about" },
        { name: "Testimoni", href: "#testimonials" },
        { name: "Pesan Sekarang", href: "#order" },
    ];

    const socialLinks = [
        { name: "Instagram", href: "https://instagram.com/pudingholic.id", icon: <Instagram size={24} /> },
        { name: "TikTok", href: "https://www.tiktok.com/@pudingholic.id", icon: <Music2 size={24} /> },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-cream px-6 py-8 md:px-12 flex justify-between items-center pointer-events-none">
                <a href="#hero" onClick={() => setIsOpen(false)} className="pointer-events-auto block relative h-24 w-72 md:h-32 md:w-[400px] transition-opacity hover:opacity-80">
                    <Image src="/images/logo.png" alt="Pudingholic Logo" fill sizes="(max-width: 768px) 300px, 400px" className="object-contain object-left drop-shadow-md" />
                </a>
                <button
                    onClick={toggleMenu}
                    className="text-sm font-medium tracking-widest uppercase pointer-events-auto hover:opacity-70 transition-opacity text-white"
                >
                    {isOpen ? "Tutup" : "Menu"}
                </button>
            </header>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-40 bg-background text-foreground flex flex-col justify-between px-6 py-24 md:px-12 md:py-32"
                    >
                        <nav className="flex flex-col gap-4 md:gap-8 mt-12">
                            {menuLinks.map((link, i) => (
                                <div key={link.name} className="overflow-hidden">
                                    <motion.a
                                        href={link.href}
                                        onClick={toggleMenu}
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "100%" }}
                                        transition={{
                                            duration: 0.8,
                                            ease: [0.76, 0, 0.24, 1],
                                            delay: 0.1 * i,
                                        }}
                                        className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter hover:text-accent-sage transition-colors block w-fit"
                                    >
                                        {link.name}
                                    </motion.a>
                                </div>
                            ))}
                        </nav>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 overflow-hidden">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="text-sm md:text-base max-w-sm"
                            >
                                Puding rumahan premium, lembut dan creamy, dibuat segar setiap hari.
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                                className="flex gap-6"
                            >
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-accent-sage transition-colors flex items-center gap-2"
                                    >
                                        {social.icon} <span className="sr-only">{social.name}</span>
                                    </a>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
