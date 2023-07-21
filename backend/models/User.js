import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        login: { type: String, required: true, unique: true },
        email: {
            type: String,
            trim: true,
            required: [true, 'Please add a E-mail'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid E-mail']
        },
        password: {
            type: String,
            trim: true,
            required: [true, 'Please add a Password'],
            // minlength: [6, 'password must have at least six(6) characters'],
            // match: [
            //     /^(?=.*\d)(?=.*[@#\-_$%^&+=§!\?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=§!\?]+$/,
            //     'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters'
            // ]
        },
        firstName: { type: String },
        lastName: { type: String },
        mobile: { type: Number },
        address: { type: String },
        age: { type: String },
        gender: { type: String },
        profilePic: { type: String, default: "" },
        role: {
            type: String,
            default: "client",
            enum: ["admin", "intern", "parent", "teacher", "company", "client"]
        },
        // isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
