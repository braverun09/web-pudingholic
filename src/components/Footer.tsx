import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-background text-foreground border-t border-foreground/10 py-16 px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                <div className="flex flex-col gap-6">
                    <div className="relative h-32 w-80 md:h-48 md:w-[600px]">
                        <Image src="/images/logo.png" alt="Pudingholic Logo" fill sizes="(max-width: 768px) 350px, 600px" className="object-contain object-left drop-shadow-md" />
                    </div>
                    <p className="max-w-xs opacity-70">
                        Puding rumahan premium, lembut dan creamy, dibuat segar setiap hari.
                    </p>
                </div>

                <div className="flex flex-col md:text-right gap-6">
                    <ul className="flex flex-wrap md:justify-end gap-6 opacity-80 uppercase tracking-widest text-sm font-medium">
                        <li>
                            <a href="https://instagram.com/pudingholic.id" className="hover:text-accent-sage transition-colors">
                                Instagram
                            </a>
                        </li>
                        <li>
                            <a href="https://www.tiktok.com/@pudingholic.id" className="hover:text-accent-sage transition-colors">
                                TikTok
                            </a>
                        </li>
                    </ul>

                    <div className="opacity-50 text-sm">
                        &copy; {new Date().getFullYear()} Pudingholic. Hak Cipta Dilindungi Penuh.
                    </div>
                </div>
            </div>
        </footer>
    );
}
