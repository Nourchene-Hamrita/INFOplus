import { Reclamation } from "../models/Reclamation.js";
import { User } from "../models/User.js";
import { Intern } from "../models/Intern.js";

// Create a new reclamation
export const createReclamation = async (req, res) => {
  try {
    const { description, date, intern, subject, state } = req.body;

    // Check if the intern exists in the 'Intern' model
    const existingUser = await User.findById(intern);
    if (!existingUser) {
      return res.status(404).json({ message: "user not found" });
    }
    if (existingUser.role != "intern") {
      return res.status(404).json({ message: "role not intern" });
    }

    // Find the associated intern based on the user ID and role
    const internn = await Intern.findOne({ user: existingUser._id });
    if (!internn) {
      return res
        .status(404)
        .json({ message: "Intern not found for the given user" });
    }

    // Create a new reclamation object with the provided data
    const reclamation = new Reclamation({
      description,
      date,
      intern: internn.user,
      subject,
      state: state || "Pending", // Set default state to 'Pending' if not provided in the request body
    });

    // Save the reclamation to the database
    const newReclamation = await reclamation.save();

    res.status(201).json(newReclamation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create reclamation", error: error.message });
  }
};

// Get all reclamations
export const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find().populate("intern");

    res.status(200).json(reclamations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reclamations", error: error.message });
  }
};

// Get a single reclamation by ID
export const getReclamationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reclamation = await Reclamation.findById(id).populate("intern");

    if (!reclamation) {
      return res.status(404).json({ message: "Reclamation not found" });
    }

    res.status(200).json(reclamation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reclamation", error: error.message });
  }
};

// Update a reclamation by ID
export const updateReclamation = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, date, intern, subject, state, response } = req.body; // Updated field name to "subject"

    const reclamation = await Reclamation.findById(id);

    if (!reclamation) {
      return res.status(404).json({ message: "Reclamation not found" });
    }

    reclamation.description = description;
    reclamation.date = date;
    reclamation.intern = intern;
    reclamation.subject = subject; // Updated field name to "subject"
    reclamation.state = state || "Pending"; // Set default state to 'Pending' if not provided in the request body
    reclamation.response = response || ""; // Set the "response" field or leave it empty if not provided

    const updatedReclamation = await reclamation.save();

    res.status(200).json(updatedReclamation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update reclamation", error: error.message });
  }
};

// Delete a reclamation by ID
export const deleteReclamation = async (req, res) => {
  try {
    const { id } = req.params;

    const reclamation = await Reclamation.findByIdAndDelete(id);

    if (!reclamation) {
      return res.status(404).json({ message: "Reclamation not found" });
    }

    res.status(200).json({ message: "Reclamation deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete reclamation", error: error.message });
  }
};

// Get reclamations by user ID
export const getReclamationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Modification ici pour récupérer le userId à partir des paramètres de l'URL

    // Check if the user exists in the 'User' model
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the associated intern based on the user ID and role
    const intern = await Intern.findOne({ user: existingUser._id });
    if (!intern) {
      return res
        .status(404)
        .json({ message: "Intern not found for the given user" });
    }

    // Find reclamations associated with the intern ID
    const reclamations = await Reclamation.find({ intern: intern.user });

    res.status(200).json(reclamations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reclamations", error: error.message });
  }
};



