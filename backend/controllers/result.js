
import { Intern } from "../models/Intern.js";
import { Result } from "../models/Result.js";



// Create a new result
export const addResult = async (req, res) => {
    try {
        const { scores, internId, formationId } = req.body;

        // Check if the intern exists in the 'Intern' model
        const existingIntern = await Intern.findOne({
            user: internId,
        });
        if (!existingIntern) {
            return res.status(404).json({ message: "Intern not found" });
        }

        const newResult = new Result({
            scores: scores,
            intern: existingIntern.user,
            formation: formationId,
            teacher: req.user._id,
        });

        // Validate the model before saving
        const validationError = newResult.validateSync();
        if (validationError) {
            throw new Error("Validation error: " + validationError.message);
        }

        const savedResult = await newResult.save();
        res.status(201).json(savedResult);
    } catch (error) {
        res.status(500).json({
            message: "Error adding result",
            error: error.message,
        });
    }
};

// Update an existing result using findOneAndUpdate
export const updateResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { scores, internId, formationId, teacherId } = req.body;

        // Find the existing intern 
        const existingIntern = await Intern.findOne({
            user: internId,
        });

        if (!existingIntern) {
            return res.status(404).json({ message: "Intern not found" });
        }

        // Get the existing result
        const existingResult = await Result.findById(id);

        if (!existingResult) {
            return res.status(404).json({ message: "Result not found" });
        }

        // Create an object with the updated result data
        const updatedResultData = {
            scores: scores !== null ? scores : existingResult.scores,
            intern: existingIntern._id,
            formation: formationId,
            teacher: teacherId,
        };

        // Use findOneAndUpdate to update the result
        const updatedResult = await Result.findOneAndUpdate(
            { _id: id },
            updatedResultData,
            { new: true } // Return the updated result after the update
        );

        if (!updatedResult) {
            return res.status(404).json({ message: "Result not found" });
        }

        res
            .status(200)
            .json({ message: "Result updated successfully", result: updatedResult });
    } catch (error) {
        res.status(500).json({
            message: "Error updating result",
            error: error.message,
        });
    }
};
export const deleteResult = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the result by its ID
        const deletedResult = await Result.findByIdAndDelete(id);

        if (!deletedResult) {
            return res.status(404).json({ message: "Result not found" });
        }

        res.status(200).json({ message: "Result deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting result",
            error: error.message,
        });
    }
};

// Retrieve result for a specific intern and formation
export const getResultInternFormation = async (req, res) => {
    try {
        const { internId, formationId } = req.params;

        // Find the intern by their unique identifier
        const existingIntern = await Intern.findOne({ user: internId });
        if (!existingIntern) {
            return res.status(404).json({ message: "Intern not found" });
        }

        const result = await Result.findOne({
            intern: internId,
            formation: formationId,
        }).populate({
            path: 'intern',
            select: 'firstName lastName login',
        }).populate({
            path: 'teacher',
            select: 'firstName lastName login',
        }).populate({
            path: 'formation',
            select: 'nom',
        });

        if (!result) {
            return res
                .status(200)
                .json({
                    message: "No result found for this intern and formation",
                });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving result",
            error: error.message,
        });
    }
};

// Retrieve results for a specific formation and populate intern and teacher fields
export const getResultByFormation = async (req, res) => {
    try {
        const { formationId } = req.params;

        // Find results for the given formation and populate intern and user fields
        const results = await Result.find({ formation: formationId })
            .populate({
                path: 'intern',
                select: 'firstName lastName login',
            }).populate({
                path: 'teacher',
                select: 'firstName lastName login',
            }).populate({
                path: 'formation',
                select: 'nom',
            });

        if (!results || results.length === 0) {
            return res
                .status(404)
                .json({ message: "No results found for this formation" });
        }

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving results",
            error: error.message,
        });
    }
};
// Search for results based on keywords (intern names or subject names)
export const searchResults = async (req, res) => {
    try {
        const { keywords } = req.query;

        // Find results that match the keywords
        const results = await Result.find({
            $or: [
                { 'intern.firstName': { $regex: keywords, $options: 'i' } },
                { 'intern.lastName': { $regex: keywords, $options: 'i' } },
                { 'scores.subject': { $regex: keywords, $options: 'i' } },
            ],
        }).populate({
            path: 'intern',
            select: 'firstName lastName login',
        }).populate({
            path: 'teacher',
            select: 'firstName lastName login',
        }).populate({
            path: 'formation',
            select: 'nom',
        });

        if (!results || results.length === 0) {
            return res.status(404).json({ message: "No results found" });
        }

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({
            message: "Error searching for results",
            error: error.message,
        });
    }
};

