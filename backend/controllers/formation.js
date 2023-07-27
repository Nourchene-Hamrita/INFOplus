import { Formation, FormationAcceleree, FormationDiplomante } from "../models/Formation.js";
import asyncHandler from 'express-async-handler';

// Obtenir tous les formation
export const getAllFormations = async (req, res) => {
    try {
        const formations = await Formation.find();
        res.json(formations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un formation par son ID
export const getFormationById = async (req, res) => {
    try {
        const formation = await Formation.findById(req.params.id);
        if (formation) {
            res.json(formation);
        } else {
            res.status(404).json({ message: "Formation not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Créer une nouvelle formation
export const createFormation = async (req, res) => {
    try {
        const { type, ...rest } = req.body;

        let formation;
        if (type === "diplomante") {
            formation = new FormationDiplomante({ ...rest });
        } else if (type === "acceleree") {
            formation = new FormationAcceleree({ ...rest });
        } else {
            return res.status(400).json({ message: "Invalid formation type" });
        }

        const newFormation = await formation.save();
        res.status(201).json(newFormation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const UpdateFormation = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, ...rest } = req.body;

        if (!id) {
            return res.status(401).send({ error: "Formation ID not provided" });
        }

        let UpdatedFormation;
        if (type === "diplomante") {
            UpdatedFormation = FormationDiplomante;
        } else if (type === "acceleree") {
            UpdatedFormation = FormationAcceleree;
        } else {
            return res.status(400).json({ message: "Invalid formation type" });
        }

        // Update the data based on the formation type
        const updatedFormation = await UpdatedFormation.findOneAndUpdate(
            { _id: id },
            { $set: rest },
            { new: true }
        );

        if (updatedFormation) {
            return res.status(201).json({ msg: "Record Updated...!", updatedFormation });
        } else {
            return res.status(404).send({ error: "Formation Not Found...!" });
        }
    } catch (error) {
        return res.status(401).send({ error });
    }
};

// Supprimer une formation
export const deleteFormation = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Formation.findByIdAndDelete(id);
        if (!data) {
            return res.status(404).json({ message: "Formation not found" });
        }
        res.status(200).json({ message: "Formation deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createFormationReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    const formation = await Formation.findById(req.params.id)

    if (formation) {
        const alreadyReviewed = formation.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        )

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Formation is already reviewed');
        }

        const review = {
            name: req.user.firstName + ' ' + req.user.lastName, // Automatically populate the name field based on user information
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        formation.reviews.push(review)

        formation.numReviews = formation.reviews.length

        formation.rating =
            formation.reviews.reduce((acc, item) => item.rating + acc, 0) /
            formation.reviews.length

        await formation.save()
        res.status(201).json({ message: 'Review added' })
    } else {
        res.status(404)
        throw new Error('Formation not found')
    }
});
