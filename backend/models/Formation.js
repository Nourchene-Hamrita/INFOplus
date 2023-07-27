import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
)

const FormationSchema = new mongoose.Schema(
    {
        nom: { type: String },
        type: {
            type: String,
            enum: ["diplomante", "acceleree"],
        },
        description: { type: String },
        date_deb: {
            type: Date,
            required: true,
        },
        date_fin: {
            type: Date,
            required: true,
        },
        formationPicture: {
            type: String,
        },
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        duree: {
            type: Number,
            required: true,
        },
        prix: {
            type: Number,
        },
    },
    { timestamps: true }
);
const FormationDiplomanteSchema = new mongoose.Schema({
    diplomeObtenu: { type: String },
    programmeEtude: { type: [String] },
    niveauDiplome: { type: String },
});
const FormationAccelereeSchema = new mongoose.Schema({
    nbHeures: { type: Number },
});
export const Formation = mongoose.model("Formation", FormationSchema);

export const FormationDiplomante = Formation.discriminator(
    "FormationDiplomante",
    FormationDiplomanteSchema
);
export const FormationAcceleree = Formation.discriminator(
    "FormationAcceleree",
    FormationAccelereeSchema
);


