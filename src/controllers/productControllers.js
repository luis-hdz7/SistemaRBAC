import { prisma } from "../config/dbConnect.js";
export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.status(200).json({
            status: "success",
            data: {
                products,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
}
export const createProduct = async (req, res) => {
    try {
        const { name, price, stock, image } = req.body;
        if (!name || price===undefined || stock===undefined) {
            return res.status(400).json({
                status: "error",
                message: "Name, price, and stock are required",
            });
        }
        const product = await prisma.product.create({
            data: {
                name,
                price,
                stock,
                image,
            },
        });
        res.status(201).json({
            status: "success",
            data: {
                product,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
}
export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: {
                id_product: id,
            },
        });
        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                product,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
}
export const updateProduct = async (req, res) => {
    try {
        const productId =req.params.id;
        const { name, price, stock, image } = req.body;
        // Validar que al menos venga un campo
        if (
            name === undefined &&
            price === undefined &&
            stock === undefined &&
            image === undefined
        ) {
            return res.status(400).json({
                status: "error",
                message: "At least one field is required",
            });
        }

        const productExists = await prisma.product.findUnique({
            where: {
                id_product: productId,
            },
        });

        if (!productExists) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }

        const product = await prisma.product.update({
            where: {
                id_product: productId,
            },
            data: {
                ...(name !== undefined && { name }),
                ...(price !== undefined && { price }),
                ...(stock !== undefined && { stock }),
                ...(image !== undefined && { image }),
            },
        });

        return res.status(200).json({
            status: "success",
            data: {
                product,
            },
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: {
                id_product: id,
            },
        });
        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }
        await prisma.product.delete({
            where: {
                id_product: id,
            },
        });
        res.status(200).json({
            status: "success",
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
}