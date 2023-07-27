import bcrypt from "bcryptjs";
import { createError } from "../utils/errors.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Intern } from "../models/Intern.js";
import { Parent } from "../models/Parent.js";
import { Teacher } from "../models/Teacher.js";
import { Company } from "../models/Company.js";
import { Formation } from '../models/Formation.js';

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        let newUser;
        let newIntern;
        let newParent;
        let newTeacher;
        let newCompany;
        let newFormation;



        if (req.body.role === 'admin') {
            // Create admin user
            newUser = new User({
                ...req.body,
                password: hash,
            });
        } else if (req.body.role === 'intern') {
            // Create intern user
            newUser = new User({
                ...req.body,
                password: hash,
            });

            // Create a new intern and associate it with the user
            newIntern = new Intern({
                user: newUser._id, // Associate intern user with user document
                level: req.body.level,
                promotion: req.body.promotion,
            });

            // Create a new formation and associate it with the intern
            newFormation = new Formation({
                nom: "Formation Name", // Set the name of the formation
                type: "acceleree", // Set the type of the formation (acceleree or diplomante)
                description: "Formation description", // Set the description of the formation
                date_deb: new Date(), // Set the start date of the formation
                date_fin: new Date(), // Set the end date of the formation
                // Add other properties of the formation as needed
                reviews: [], // Initialize reviews as an empty array
                rating: 0, // Initialize the rating as 0
                numReviews: 0, // Initialize the number of reviews as 0
                duree: 0, // Set the duration of the formation
                prix: 0, // Set the price of the formation
            });

            // Associate the formation with the intern
            newIntern.formations.push(newFormation._id);

            // Save the new intern and the new formation
            await newIntern.save();
            await newFormation.save();
        } else if (req.body.role === 'parent') {
            // Create parent user
            newUser = new User({
                ...req.body,
                password: hash,
            });
            newIntern = new Parent({
                user: newUser._id, // Associate parent user with user document
                intern: newIntern.user,

            });

            await newParent.save();
        } else if (req.body.role === 'teacher') {
            // Create teacher user
            newUser = new User({
                ...req.body,
                password: hash,
            });
            newTeacher = new Teacher({
                user: newUser._id, // Associate teacher user with user document
                salary: req.body.salary,
                specialty: req.body.specialty,
                profil: req.body.profil,
            });
            await newTeacher.save();
        } else if (req.body.role === 'company') {
            // Create company user
            newUser = new User({
                ...req.body,
                password: hash,
            });
            newCompany = new Company({
                user: newUser._id, // Associate company user with user document
                business_sector: req.body.business_sector,
                description: req.body.description,
            });
            await newCompany.save();
        } else {
            // Handle invalid role
            return res.status(400).json({ message: 'Invalid role' });
        }

        await newUser.save();
        res.status(200).send('User has been created.');
    } catch (err) {
        next(err);
    }
};
export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ login: req.body.login });
        if (!user) return next(createError(404, "Utilisateur non trouvé !"));

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect)
            return next(createError(400, "Mot de passe ou nom d'utilisateur erronés!"));

        let details = { ...user._doc };
        if (user.role === "intern") {
            const intern = await Intern.findOne({ user: user._id }).populate(
                "formations" // Populate the formations field in the intern document
            );
            details = {
                ...details,
                level: intern.level,
                promotion: intern.promotion,
                formations: intern.formations, // Include the formations information in the response
            }
        } else if (user.role === 'parent') {
            // Fetch additional data for parent role
            // Add code to retrieve parent-specific data and append it to the details object
        } else if (user.role === 'teacher') {
            const teacher = await Teacher.findOne({ user: user._id });
            details = { ...details, salary: teacher.salary, specialty: teacher.specialty, profil: teacher.profil };
        } else if (user.role === 'company') {
            const company = await Company.findOne({ user: user._id });
            details = { ...details, business_sector: company.business_sector, description: company.description };
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT
        );

        const { password, role, ...otherDetails } = details;
        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json({ details: { ...otherDetails }, role });
    } catch (err) {
        next(err);
    }
};

