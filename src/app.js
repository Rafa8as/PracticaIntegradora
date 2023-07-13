import express from "express";
import productsRoute from "./routes/products.router.js";
import cartsRoute from "./routes/carts.router.js";
import viewRoute from "./routes/views.router.js";
import products from "./data/products.json" assert {type: "json"};
import mongoose from "mongoose";
import {messageModel} from "./dao/mongo/messages.model.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import {Server} from "socket.io";


const app = express ();
const PORT = 8080;
const host = "0.0.0.0";


mongoose.set ('strictQuery',false)

const connection = mongoose.connect ('mongodb+srv://rafa8as:Odarita23@cluster0.mjxuonn.mongodb.net/?retryWrites=true&w=majority');

app.engine ('handlebars', handlebars.engine());
app.set ('views', __dirname + '/views');
app.set ('view engine', 'handlebars');
app.use (express.static (__dirname + '/public'));

app.use (express.urlencoded ({extended: true}));
app.use (express.json ());
app.use ('/api/products', productsRoute);
app.use ('/api/carts', cartsRoute);
app.use ('/', viewRoute);



const httpServer = app.listen (PORT, host, () => {console.log (`Server arriba en http://${host}: ${PORT}`);});

const io = new Server(httpServer);

const messages = [];

io.on ("connection", (socket)=> {
    console.log ("Cliente Conectado");
    socket.emit ("products", products);

    io.emit ("messagesLogs", messages);

    socket.on ("user", (data)=>{
        messages.push (data);
        io.emit ("messagesLogs", messages);

    });
    socket.on ("message", (data)=>{
        messages.push (data);
        io.emit ("messagesLogs", messages);
        messageModel.create ({
            user: data.user,
            message: data.message,
        });
    });
    socket.on ("disconnect", () => {
        console.log ("Client Disconnected")
    })
})