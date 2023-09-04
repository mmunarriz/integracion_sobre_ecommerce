import { Router } from 'express';
import Products from '../dao/fileManagers/products.js';

const productsManager = new Products();
const router = Router();

// Listar productos
router.get('/', async (req, res) => {
    try {
        let products = await productsManager.getAll();
        if (!products) return res.status(500).send({ status: "error", error: "No se pudieron obtener productos debido a un error interno" });

        // Lee el valor del parámetro "limit" (si existe)
        const limit = req.query.limit;

        // Si se recibió el parámetro "limit", devuelve el número de productos solicitados
        if (limit) {
            products = products.slice(0, parseInt(limit));
        }

        res.send({ status: "success", payload: products });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.message });
    }
});

// Listar un producto específico por ID
router.get('/:pid', async (req, res) => {
    try {
        const products = await productsManager.getAll();
        if (!products) return res.status(500).send({ status: "error", error: "No se pudieron obtener productos debido a un error interno" });

        const pid = parseInt(req.params.pid);

        const producto = products.find((item) => item.id === pid);

        if (producto) {
            res.status(200).send(producto);
        } else {
            res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(400).send({ status: "error", error: error.message });
    }
});


// Agregar un producto
router.post('/', async (req, res) => {
    try {
        const products = await productsManager.getAll();
        if (!products) return res.status(500).send({ status: "error", error: "No se pudieron obtener productos debido a un error interno" });

        // Recibe un objeto JSON con los datos del nuevo producto
        // Verifica que los campos obligatorios estén presentes
        const requiredFields = ["title", "description", "category", "price", "code", "stock"];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`El campo '${field}' es obligatorio.`);
            }
        }

        // Verifica si el "code" recibido ya existe en algún producto
        const newProductCode = req.body.code;
        const isCodeExist = products.some(product => product.code === newProductCode);

        if (isCodeExist) {
            throw new Error("Ya existe un producto con el mismo código.");
        }

        // Busca el último id existente y genera el nuevo id
        const lastProductId = products.length > 0 ? products[products.length - 1].id : 0;
        const newId = lastProductId + 1;

        // Crear el nuevo objeto del producto
        const newProduct = {
            id: newId,
            status: true,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            code: req.body.code,
            stock: req.body.stock,
        };

        // Verifica si se envió 'thumbnails' (campo no obligatorio), si no se envió asigna un array vacío
        if (!req.body.thumbnails) {
            newProduct.thumbnails = [];
        }

        products.push(newProduct);

        // Guardar los datos en el archivo JSON
        await productsManager.saveProduct(products);

        res.status(200).send({ status: "success", message: "Producto agregado exitosamente" });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.message });
    }
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const products = await productsManager.getAll();
        if (!products) return res.status(500).send({ status: "error", error: "No se pudieron obtener productos debido a un error interno" });

        // Encontrar el índice del producto en la lista por su "id"
        const index = products.findIndex((item) => item.id === pid);

        if (index === -1) {
            return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }

        // Obtener el producto actual
        const existingProduct = products[index];

        // Verificar si el "code" recibido ya existe en otro producto (excepto el producto actual)
        const codeExists = products.some((product, i) => i !== index && product.code === req.body.code);
        if (codeExists) {
            return res.status(400).send({ status: "error", error: "El código ya está en uso por otro producto" });
        }

        // Actualizar campos del producto con los valores del body
        const updatedProduct = {
            ...existingProduct,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            status: req.body.status,
            price: req.body.price,
            code: req.body.code,
            stock: req.body.stock,
            thumbnails: req.body.thumbnails,
        };

        // Reemplazar el producto existente con el producto actualizado
        products[index] = updatedProduct;

        // Guardar los datos actualizados en el archivo JSON
        await productsManager.saveProduct(products);

        res.status(200).send({ status: "success", message: "Producto actualizado exitosamente" });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.message });
    }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const products = await productsManager.getAll();
        if (!products) return res.status(500).send({ status: "error", error: "No se pudieron obtener productos debido a un error interno" });

        // Encontrar el índice del producto en la lista por su "id"
        const index = products.findIndex((item) => item.id === pid);

        if (index === -1) {
            return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }

        // Eliminar el producto de la lista
        const deletedProduct = products.splice(index, 1)[0];

        // Guardar los datos actualizados en el archivo JSON
        await productsManager.saveProduct(products);

        res.status(200).send({ status: "success", message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(400).send({ status: "error", error: error.message });
    }
});

export default router;
