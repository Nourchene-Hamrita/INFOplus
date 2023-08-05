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

            // Save the new user first
            newUser = await newUser.save();

            // Create a new intern and associate it with the user
            newIntern = new Intern({
                user: newUser._id, // Associate intern user with user document
                level: req.body.level,
                promotion: req.body.promotion,
            });

            // Check if formationIds are provided in the request body
            if (req.body.formationIds && Array.isArray(req.body.formationIds)) {
                for (const formationId of req.body.formationIds) {
                    const formation = await Formation.findById(formationId);

                    if (!formation) {
                        return res.status(404).json({ message: `Formation with ID ${formationId} not found` });
                    }

                    // Push the formation and initialize the attendance array
                    newIntern.formations.push({
                        formation: formationId,
                        attendance: [],
                    });
                }
            }

            // Save the new intern
            await newIntern.save();
        } else if (req.body.role === 'parent') {
            // Create parent user
            newUser = new User({
                ...req.body,
                password: hash,
            });

            // Save the new user first
            newUser = await newUser.save();

            // Create new parent and associate it with the user
            newParent = new Parent({
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

            // Save the new user first
            newUser = await newUser.save();

            newTeacher = new Teacher({
                user: newUser._id, // Associate teacher user with user document
                salary: req.body.salary,
                specialty: req.body.specialty,
                profil: req.body.profil,
                levels: req.body.levels, // Add the levels data to the teacher document
            });

            await newTeacher.save();
        } else if (req.body.role === 'company') {
            // Create company user
            newUser = new User({
                ...req.body,
                password: hash,
            });

            // Save the new user first
            newUser = await newUser.save();

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

        res.status(200).send('User has been created.');
    } catch (err) {
        next(err);
    }
};



export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ login: req.body.login });
        if (!user) return next(createError(404, "User not found!"));

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect)
            return next(createError(400, "Incorrect password or username!"));

        let details = { ...user._doc };
        if (user.role === "intern") {
            const intern = await Intern.findOne({ user: user._id })
                .populate({
                    path: "formations.formation", // Populate the nested formation field in the intern document
                    model: "Formation",
                })
                .exec();

            if (intern) {
                details = {
                    ...details,
                    level: intern.level,
                    promotion: intern.promotion,
                    formations: intern.formations.map((item) => item.formation), // Extract the populated formation data
                };
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
