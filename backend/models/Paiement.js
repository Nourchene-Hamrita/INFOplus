import mongoose from 'mongoose';

const PaiementSchema = new mongoose.Schema(
    {
        montant: {
            type: Number,
            required: true,
        },

        intern: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Intern", required: true
        }, // Reference to the Intern model
        formation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Formation", required: true
        }, // Reference to the Formation model
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const Paiement = mongoose.model("Paiement", PaiementSchema);
