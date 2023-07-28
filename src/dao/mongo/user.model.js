import mongoose from "mongoose";
const userCollection = 'User';
const userSchema = new mongoose.Schema ({
    first_name: {
       type: String,
       require: true,
    },
    last_name: {
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,

    },
    password:{
        type: String,
        require: true,
    },
    role:{
        type: String,
        default: "user",
        require: true,
    },
});

export const userModel = mongoose.model(userCollection, userSchema);