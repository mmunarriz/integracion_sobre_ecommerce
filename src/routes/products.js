import { Router } from 'express';
import Products from '../dao/dbManagers/products.js';

const productsManager = new Products();
const router = Router();

// Listar productos
router.get('/', async (req, res) => {
    try {
        let products = await productsManager.getAll();

        // Lee el valor del parámetro "limit" (si existe)
        const limit = req.query.limit;

        // Si se recibió el parámetro "limit", devuelve el número de productos solicitados
        if (limit) {
            products = products.slice(0, parseInt(limit));
        }

        res.send({ status: "success", payload: products });
    } catch (error) {
        res.status(500).send({ status: "error", error: "No se pudieron obtener productos debido a un error interno" });
    }
});

// Listar un producto específico por ID
router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productsManager.getProductById(productId);

        if (product) {
            res.status(200).send({ status: "success", payload: product });
        } else {
            res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }
    } catch (error) {
        // console.error(error); // Registrar el error en la consola para su diagnóstico
        res.status(500).send({ status: "error", error: "No se pudieron obtener productos debido a un error interno" });
    }
});

// Agregar un producto
router.post('/', async (req, res) => {
    try {
        // Recibe un objeto JSON con los datos del nuevo producto
        // Verifica que los campos obligatorios estén presentes
        const requiredFields = ["title", "description", "category", "price", "code", "stock"];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`El campo '${field}' es obligatorio.`);
            }
        }

        // Verifica si el "code" recibido ya existe en algún producto en la base de datos
        const newProductCode = req.body.code;
        const isCodeExist = await productsManager.isProductCodeExist(newProductCode);

        if (isCodeExist) {
            throw new Error("Ya existe un producto con el mismo código.");
        }

        const newProduct = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            code: req.body.code,
            stock: req.body.stock,
            thumbnails: req.body.thumbnails
        };

        // Agregar el nuevo producto a la base de datos
        const result = await productsManager.saveProduct(newProduct);

        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.message });
    }
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedProductData = req.body;

        // Verifica si el producto con el ID dado existe
        const existingProduct = await productsManager.getProductById(productId);

        if (!existingProduct) {
            return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }

        // Verifica si el código actualizado ya existe en otro producto (excepto el producto actual)
        if (updatedProductData.code !== existingProduct.code) {
            const isCodeExist = await productsManager.isProductCodeExist(updatedProductData.code);
            if (isCodeExist) {
                return res.status(400).send({ status: "error", error: "El código ya está en uso por otro producto" });
            }
        }

        // Actualiza el producto en la base de datos
        const result = await productsManager.updateProduct(productId, updatedProductData);

        res.status(200).send({ status: "success", message: "Producto actualizado exitosamente" });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.message });
    }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;

        // Verifica si el producto con el ID dado existe
        const existingProduct = await productsManager.getProductById(productId);

        if (!existingProduct) {
            return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }

        // Elimina el producto de la base de datos
        await productsManager.deleteProduct(productId);

        res.status(200).send({ status: "success", message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.message });
    }
});

export default router;
