"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface Product {
    id?: string;
    name: string;
    description: string;
    image: string;
    colspan: string;
}

export default function FlavorSection({ products }: { products: Product[] }) {
    return (
        <section className="py-24 md:py-32 px-6 md:px-12 bg-background text-foreground" id="flavors">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16 md:mb-24"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                        Simfoni Rasa.
                    </h2>
                    <p className="text-lg md:text-xl opacity-80 max-w-2xl">
                        Setiap cup dibuat dengan cermat untuk memastikan keseimbangan sempurna antara rasa manis dan tekstur.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {products.map((flavor, index) => (
                        <motion.div
                            key={flavor.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`group relative overflow-hidden rounded-3xl bg-[#EBE3D0] aspect-square md:aspect-auto ${flavor.colspan
                                } ${flavor.colspan === "col-span-1 md:col-span-2" ? "md:min-h-[400px]" : "md:h-[400px]"}`}
                        >
                            <div className="absolute inset-0 w-full h-full">
                                <Image
                                    src={flavor.image}
                                    alt={flavor.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                            {/* Lighting highlight on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white z-10">
                                <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {flavor.name}
                                </h3>
                                <p className="text-sm md:text-base opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                    {flavor.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
