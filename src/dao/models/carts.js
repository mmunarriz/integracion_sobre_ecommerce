import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartsSchema = mongoose.Schema({
    quantity: {
        type: Number,
    }
})

const cartsModel = mongoose.model(cartCollection, cartsSchema);
export default cartsModel;