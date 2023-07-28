import express from "express";
import productsRoute from "./routes/products.router.js";
import cartsRoute from "./routes/carts.router.js";
import viewsRoute from "./routes/views.router.js";
import messagesRoute from "./routes/messages.router.js"
import cookiesRoute from "./routes/cookies.router.js"
import sessionsRoute from "./routes/sessions.router.js"
import products from "./data/products.json" assert {type: "json"};
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";

import {messageModel} from "./dao/mongo/messages.model.js";
import { productModel } from "./dao/mongo/product.model.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import {Server} from "socket.io";





const app = express ();
const PORT = 8080;
const host = "0.0.0.0";


mongoose.set ('strictQuery',false)

const connection = mongoose.connect ('mongodb+srv://rafa8as:Odarita23@cluster0.mjxuonn.mongodb.net/?retryWrites=true&w=majority');
const mongoUrl = "mongodb+srv://rafa8as:Odarita23@cluster0.mjxuonn.mongodb.net/?retryWrites=true&w=majority"
app.use(session({
    store: MongoStore.create({mongoUrl}),
    secret: "<SECRET>",
    resave: false,
    saveUninitialized: true,
}))

import passport from "passport";
import initializePassport from "./config/passport.config.js";
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.engine ('handlebars', handlebars.engine());
app.set ('views', __dirname + '/views');
app.set ('view engine', 'handlebars');
app.use (express.static ( __dirname + "/public"));

app.use (express.urlencoded ({extended: true}));
app.use (express.json ());
app.use ('/api/products', productsRoute);
app.use ('/api/carts', cartsRoute);
app.use ('/api/cookies', cookiesRoute);
app.use ('/api/sessions', sessionsRoute);
app.use ('/api/messages', messagesRoute);
app.use ('/', viewsRoute);



const httpServer = app.listen (PORT, host, () => {console.log (`Server arriba en http://${host}: ${PORT}`);});

const io = new Server(httpServer);

io.on( "connection", async socket => {
    console.log (`Cliente ${socket.id} conectado`);


    const products = await productModel.find().lean();
    io.emit ("products", products);

    productModel.watch().on("change", async change => {
        const products = await productModel.find().lean();
        io.emit ("products", products);
    });


const messages = [];

socket.on("user", async data => {
    await messageModel.create ({
        user: data.user,
        message: data.messages,
    });
    const messagesLogs = await messageModel.find();
    io.emit ("messagesLogs", messagesLogs);
});

  
    socket.on ("message", async data =>{
        await messageModel.create ({
            user: data.user,
            message: data.message,
        });

        const messagesLogs = await messageModel.find();
       
        io.emit ("messagesLogs", messagesLogs);
        
    });
    socket.on ("disconnect", () => {
        console.log (`Client ${socket.id} disconnected`);
    });
});