export interface Product {
    name: string;
    description: string;
    image: string;
    colSpan: string;
}

export const products: Product[] = [
    {
        name: "Caramel Holic",
        description: "The classic taste that started it all. Smooth vanilla custard with rich caramel syrup.",
        image: "/images/products/OriginalCaramel.jpeg",
        colSpan: "col-span-1 md:col-span-2",
    },
    {
        name: "Vanilla Holic",
        description: "Pure Madagascar vanilla bean creates a speckled, fragrant delicacy.",
        image: "/images/products/CreamyVanilla.jpeg",
        colSpan: "col-span-1",
    },
    {
        name: "Choco Holic",
        description: "Decadent dark chocolate layered with milk chocolate silk.",
        image: "/images/products/BelgianChocolate.jpeg",
        colSpan: "col-span-1",
    },
    {
        name: "Matcha Holic",
        description: "Premium ceremonial grade matcha imported from Japan.",
        image: "/images/products/KyotoMatcha.jpeg",
        colSpan: "col-span-1 md:col-span-2",
    },
];

export interface Topping {
    name: string;
    description: string;
    emoji: string;
}

export const toppings: Topping[] = [
    { name: "Oreo Crumb", description: "Crumble biskuit Oreo klasik yang renyah.", emoji: "🍪" },
    { name: "Lotus Biscoff", description: "Remahan biskuit karamel premium.", emoji: "🤎" },
    { name: "Keju Parut", description: "Taburan keju cheddar merah yang gurih.", emoji: "🧀" },
    { name: "Milo Powder", description: "Bubuk cokelat malt yang manis manis legit.", emoji: "🍫" },
];
