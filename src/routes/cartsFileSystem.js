import { Router } from 'express';
import Carts from '../dao/fileManagers/carts.js';
import Products from '../dao/fileManagers/products.js';

const cartsManager = new Carts();
const productsManager = new Products();
const router = Router();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        // Obtener todos los carritos existentes
        const carritos = await cartsManager.getAll();

        // Inicializar un array vacío para los productos
        const productsArray = [];

        // Buscar el último id existente y generar el nuevo id
        const lastCarritoId = carritos.length > 0 ? carritos[carritos.length - 1].id : 0;
        const newId = lastCarritoId + 1;

        // Crear el nuevo objeto del carrito
        const newCarrito = { id: newId, products: productsArray };

        // Agregar el nuevo carrito a la lista de carritos
        carritos.push(newCarrito);

        // Guardar la lista de carritos actualizada
        await cartsManager.saveCart(carritos);

        res.status(200).send({ message: "Carrito agregado exitosamente" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Listar los productos de un carrito específico
router.get("/:cid", async (req, res) => {
    try {
        // Obtener el ID del carrito de los parámetros de la ruta
        const cid = parseInt(req.params.cid);

        // Obtener todos los carritos existentes
        const carritos = await cartsManager.getAll();

        // Buscar el carrito por su ID
        const carrito = carritos.find(item => item.id === cid);

        // Si el carrito existe lo devuelve, si no devuelve un mensaje de error
        if (carrito) {
            res.status(200).send(carrito);
        } else {
            res.status(404).send({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Agregar producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        // Obtener el ID del producto de los parámetros de la ruta
        const productId = parseInt(req.params.pid);

        // Verificar si el producto existe en el archivo de productos
        const products = await productsManager.getAll();
        const existingProduct = products.find(prod => prod.id === productId);

        if (!existingProduct) {
            return res.status(404).send({ message: "Producto inexistente" });
        }

        // Obtener el ID del carrito de los parámetros de la ruta
        const carritoId = parseInt(req.params.cid);

        // Obtener la cantidad del producto
        const { quantity } = req.body;

        // Obtener todos los carritos existentes
        const carritos = await cartsManager.getAll();

        // Buscar el carrito por su ID
        const carrito = carritos.find(item => item.id === carritoId);

        if (!carrito) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }

        // Agregar un nuevo objeto de producto al arreglo "products" dentro del carrito
        // Verificar si el producto ya existe en el carrito
        const existingProductInCart = carrito.products.find(prod => prod.product === productId);

        if (existingProductInCart) {
            // Si el producto ya existe, incrementar el campo quantity
            existingProductInCart.quantity += quantity;
        } else {
            // Si el producto no existe, agregarlo al carrito
            carrito.products.push({ product: productId, quantity });
        }

        // Guardar los datos en el archivo JSON
        await cartsManager.saveCart(carritos);

        res.status(200).send({ message: "Producto agregado al carrito exitosamente" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router;
