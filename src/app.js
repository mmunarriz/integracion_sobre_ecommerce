import express from "express";
import __dirname from './utils.js';
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js'
import viewsRouter from './routes/views.js'
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from "socket.io";
import Message from './dao/models/message.js';

const app = express();
const PORT = 8080;
const connection = mongoose.connect('mongodb+srv://mmunarriz:C0d3r@cluster0.hymhndd.mongodb.net/ecommerce')

// Template engine
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', viewsRouter)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const server = app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

const io = new Server(server)

let messages = [];

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', data => {
        messages.push(data);

        // Crea un nuevo mensaje usando el messageSchema y lo guarda en MongoDB
        const newMessage = new Message({
            user: data.user,
            message: data.message,
        });

        newMessage.save()
            .then(() => {
                io.emit('messageLogs', messages);
            })
            .catch(error => {
                console.error('Error al guardar el mensaje en MongoDB:', error);
            });
    });

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data);
    });
});

