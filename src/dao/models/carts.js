import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartsSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 0,
            },
        },
    ],
});

const cartsModel = mongoose.model(cartCollection, cartsSchema);
export default cartsModel;
