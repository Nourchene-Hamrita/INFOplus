import { User } from "../models/User.js";
import { Intern } from "../models/Intern.js";
import { Parent } from "../models/Parent.js";
import { Teacher } from "../models/Teacher.js";
import { Company } from "../models/Company.js";

export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        // Check the role of the user and handle updates in related collections
        if (updatedUser.role === "intern") {
            // Update the intern collection
            const intern = await Intern.findOneAndUpdate(
                { user: updatedUser._id },
                { $set: { level: req.body.level, promotion: req.body.promotion } },
                { new: true }
            );
            if (!intern) {
                // Handle if the intern document is not found
                return res.status(404).json({ message: "Intern not found" });
            }
        } else if (updatedUser.role === "parent") {
            // Update the parent collection
            const parent = await Parent.findOneAndUpdate(
                { user: updatedUser._id },
                { $set: { /* Update parent-specific fields here */ } },
                { new: true }
            );
            if (!parent) {
                // Handle if the parent document is not found
                return res.status(404).json({ message: "Parent not found" });
            }
        } else if (updatedUser.role === "teacher") {
            // Update the teacher collection
            const teacher = await Teacher.findOneAndUpdate(
                { user: updatedUser._id },
                { $set: { /* Update teacher-specific fields here */ } },
                { new: true }
            );
            if (!teacher) {
                // Handle if the teacher document is not found
                return res.status(404).json({ message: "Teacher not found" });
            }
        } else if (updatedUser.role === "company") {
            // Update the company collection
            const company = await Company.findOneAndUpdate(
                { user: updatedUser._id },
                { $set: { /* Update company-specific fields here */ } },
                { new: true }
            );
            if (!company) {
                // Handle if the company document is not found
                return res.status(404).json({ message: "Company not found" });
            }
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check the role of the user and handle deletions in related collections
        if (user.role === "intern") {
            // Delete from the intern collection
            await Intern.findOneAndDelete({ user: user._id });
        } else if (user.role === "parent") {
            // Delete from the parent collection
            await Parent.findOneAndDelete({ user: user._id });
        } else if (user.role === "teacher") {
            // Delete from the teacher collection
            await Teacher.findOneAndDelete({ user: user._id });
        } else if (user.role === "company") {
            // Delete from the company collection
            await Company.findOneAndDelete({ user: user._id });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}