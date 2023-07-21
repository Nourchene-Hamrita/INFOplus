import mongoose from "mongoose";
const CompanySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    business_sector: { type: String },
    description: { type: String }

}, { timestamps: true }


);
export const Company = mongoose.model("Company", CompanySchema);