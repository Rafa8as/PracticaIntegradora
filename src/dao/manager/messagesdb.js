import { messageModel } from "../mongo/messages.model.js";


export default class messages {
    constructor (){
        console.log ("Mensajes para mongoDb");

    }
    async getAll (){
        let message = await messageModel.find ().lean ();
        return message;
    }
    async saveMessage (message){
        let result = await messageModel.create(message);
        return result;
    }
}