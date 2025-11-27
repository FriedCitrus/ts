
//Створення типів товарів
type BaseProduct = {
id: number;
name: string;
price: number;
description: string;
stackable: boolean;
};

type Product = Electronics | Clothing;

type Electronics = BaseProduct & {
category: 'electronics';
voltage: number;
battery: boolean;
model: string;
};

type ClothingSeaon = "Autunm" | "Winter" | "Spring" | "Summer"
type ClothingPiece = "Hat" | "T-shirt" | "Shoes" | "Pants" | "Jacket"

type Clothing = BaseProduct & {
category: 'clothing';
material: string;
season: ClothingSeaon;
piece: ClothingPiece;
};

//Створення функцій для пошуку товарів

const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
    return products.find(product => product.id === id);
};

const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
    return products.filter(product => product.price <= maxPrice);
};

//Створення кошика

type CartItem<T> = {
product: T;
quantity: number;
};

const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {

    const existing = cart.find(item => item.product.id === product.id);

    if (existing) {
        //оновлення кількості
        return cart.map(item =>
            item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
        );
    }

    //додавання нового товару
    return [...cart, { product, quantity }];
};

const CalculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
    return cart.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);
};


//Використання функцій

const electronics: Electronics[] = [
    {
        id: 1,
        name: "Телефон",
        price: 10000,
        description: "Смартфон Samsung",
        stackable: false,
        category: 'electronics',
        voltage: 25,
        battery: true,
        model: "Samsung phone S"
    },
    {
        id:2,
        name:"TV",
        price: 5000,
        description: "OLED TV",
        stackable: false,
        category:'electronics',
        voltage: 75,
        battery: false,
        model:"LGTV 5"
    }
];
const clothing: Clothing[] = [
    {
        id: 3,
        name: "Капелюх",
        price: 1000,
        description: "стильний зимовий капелюх",
        stackable:true,
        category: 'clothing',
        season: "Winter",
        piece: "Hat",
        material: "wool"
    }
]

//тестування функцій

let cart: CartItem<Product>[] = [];

const phone = findProduct(electronics, 1);
const hat = findProduct(clothing, 3);

if (phone) cart = addToCart(cart, phone, 1);
if (hat) cart = addToCart(cart, hat, 2);

console.log(CalculateTotal(cart));


