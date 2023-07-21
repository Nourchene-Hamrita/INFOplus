import mongoose from "mongoose";
const ParentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    intern: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },


}, { timestamps: true }


);
export const Parent = mongoose.model("Parent", ParentSchema);