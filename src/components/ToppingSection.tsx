"use client";

import { motion } from "framer-motion";
import { toppings } from "@/data/products";

export default function ToppingSection() {
    return (
        <section className="py-24 px-6 md:px-12 bg-background border-t border-foreground/10 text-foreground" id="toppings">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-12 md:mb-16 flex flex-col items-center text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Tambahan Topping.
                    </h2>
                    <p className="text-base md:text-lg opacity-80 max-w-xl">
                        Kreasikan pudingmu dengan berbagai pilihan topping lezat yang kami sediakan.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {toppings.map((topping, index) => (
                        <motion.div
                            key={topping.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center text-center border border-foreground/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-secondary-1/20 flex items-center justify-center mb-4 text-3xl">
                                {topping.emoji}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{topping.name}</h3>
                            <p className="text-sm opacity-70 leading-relaxed">{topping.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
