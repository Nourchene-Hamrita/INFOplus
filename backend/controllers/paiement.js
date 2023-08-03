import { Intern } from "../models/Intern.js";
import { Paiement } from "../models/Paiement.js";
import { Formation } from "../models/Formation.js";



export const createPayment = async (req, res) => {
    const { montant, internId, formationId } = req.body;

    try {
        // Check if the intern with the given internId exists in the 'Intern' model
        const intern = await Intern.find({ user: internId });
        if (!intern) {
            return res.status(404).json({ error: 'Intern not found. Please provide a valid internId.' });
        }

        // Check if the formation with the given formationId exists in the 'Formation' model
        const formation = await Formation.findById(formationId);
        if (!formation) {
            return res.status(404).json({ error: 'Formation not found. Please provide a valid formationId.' });
        }

        const newPaiement = new Paiement({
            montant: montant,
            intern: internId,
            formation: formationId,
        });

        const savedPaiement = await newPaiement.save();
        return res.status(201).json(savedPaiement);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create payment.' });
    }
};


export const getAllPayments = async (req, res, next) => {
    try {
        const payments = await Paiement.find().populate('intern').populate('formation');
        res.status(200).json(payments);
    } catch (err) {
        next(err);
    }
}

export const getPaymentById = async (req, res) => {
    try {
        const payment = await Paiement.findById(req.params.id);
        if (payment) {
            res.json(payment);
        } else {
            res.status(404).json({ message: "Payment not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getPaymentsByIntern = async (req, res) => {
    const { internId } = req.params;

    try {
        // Check if the intern with the given internId exists in the 'Intern' model
        const intern = await Intern.find({user:internId});
        if (!intern) {
            return res.status(404).json({ error: 'Intern not found. Please provide a valid internId.' });
        }

        const payments = await Paiement.find({ intern: internId }).populate('intern').populate('formation');
        return res.json(payments);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch payments.' });
    }
};


export const updatePaymentById = async (req, res, next) => {
    try {
        const updatedPayment = await Paiement.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedPayment);
    } catch (err) {
        next(err);
    }
};
export const deletePaymentById = async (req, res, next) => {
    try {
        await Paiement.findByIdAndDelete(req.params.id);
        res.status(200).json("Payment has been deleted.");
    } catch (err) {
        next(err);
    }
};

