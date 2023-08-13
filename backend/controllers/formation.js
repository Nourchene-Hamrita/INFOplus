import { Formation, FormationAcceleree, FormationDiplomante } from "../models/Formation.js";
import asyncHandler from 'express-async-handler';
import { Intern } from "../models/Intern.js";
import { Teacher } from "../models/Teacher.js";
import { getUser } from "../index.js";
const BASE_URL = "http://192.168.137.1:8800/api"

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

        // Since the new Formation model has a classes array,
        // you can initialize it as an empty array here
        formation.classes = [];

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


// Create a Class for a Formation
export const createClass = asyncHandler(async (req, res) => {
    const { formationId } = req.params;
    const { name, level, subjects, interns } = req.body; // Add interns field

    try {
        const formation = await Formation.findById(formationId);

        if (!formation) {
            res.status(404).json({ message: 'Formation not found' });
            return;
        }

        // Check if the class with the same name already exists
        const existingClass = formation.classes.find((cls) => cls.name === name);
        if (existingClass) {
            res.status(400).json({ message: 'Class with the same name already exists' });
            return;
        }

        const newClass = {
            name,
            level,
            subjects,
            assignments: [],
            announcements: [],
            interns: interns || [], // Add interns array to the new class
            teacher: req.user._id, // Include teacher's ID
        };

        formation.classes.push(newClass);
        await formation.save();

        // Get the newly created class
        const createdClass = formation.classes.find((cls) => cls.name === name);

        // Update the teacher's assignedClasses array with the new class information
        const teacher = await Teacher.findOne({ user: req.user._id });
        if (teacher) {
            teacher.assignedClasses.push({
                classId: createdClass._id, // Use the created class's _id
                subjects: subjects || [], // Add subjects if available
            });
            await teacher.save();
        }

        res.status(201).json(formation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//update a class 
export const updateClass = asyncHandler(async (req, res) => {
    const { formationId, className } = req.params;

    try {
        const formation = await Formation.findById(formationId);

        if (!formation) {
            res.status(404).json({ message: 'Formation not found' });
            return;
        }

        // Find the class by name
        const classInfo = formation.classes.find(cls => cls.name === className);

        if (!classInfo) {
            res.status(404).json({ message: 'Class not found in formation' });
            return;
        }

        // Store the original teacher ID and subjects
        const originalTeacherId = classInfo.teacher;
        const originalSubjects = classInfo.subjects || [];

        // Update the class fields based on the provided updateFields
        Object.assign(classInfo, req.body);

        await formation.save();

        // If the teacher or subjects are updated, also update the corresponding teacher model
        if (classInfo.teacher.toString() !== originalTeacherId.toString() ||
            JSON.stringify(classInfo.subjects) !== JSON.stringify(originalSubjects)) {
            const teacher = await Teacher.findOne({ user: originalTeacherId });

            if (teacher) {
                // Find the assigned class information and update it
                const assignedClass = teacher.assignedClasses.find(
                    cls => cls.classId.toString() === classInfo._id.toString()
                );

                if (assignedClass) {
                    assignedClass.subjects = classInfo.subjects || [];
                }

                await teacher.save();
            }
        }

        res.status(200).json(formation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});







// Create Assignment for a Class
// Import necessary modules and dependencies

export const createAssignment = asyncHandler(async (req, res) => {
    const io = req.app.get('io'); // Get the io instance from app settings
    const { formationId, className } = req.params;
    const { title, description, dueDate, subject } = req.body;

    try {
        const formation = await Formation.findById(formationId);

        if (!formation) {
            res.status(404).json({ message: "Formation not found" });
            return;
        }

        // Find the class by name
        const classInfo = formation.classes.find(cls => cls.name === className);

        if (!classInfo) {
            res.status(404).json({ message: "Class not found in formation" });
            return;
        }

        const assignment = {
            title,
            description,
            dueDate,
            subject,
            teacher: req.user._id, // Include the teacher's ID
        };

        // Check if a file was uploaded
        if (req.file) {
            assignment.attachmentOriginalName = req.file.originalname; // Store original file name
            assignment.attachment = req.file.buffer; // Store file buffer
            assignment.attachmentMimeType = req.file.mimetype;
        }

        classInfo.assignments.push(assignment); // Add assignment to the array

        await formation.save();

        // Get the assignment that was just added to the array
        const addedAssignment = classInfo.assignments[classInfo.assignments.length - 1];

        // Generate attachment URL based on your URL generation logic using the assignment's _id
        if (addedAssignment.attachmentOriginalName && addedAssignment.attachment) {
            addedAssignment.attachmentUrl = `${BASE_URL}assignments/${formationId}/classes/${className}/assignments/${addedAssignment._id}/attachment`;
            // Remove the attachment field from the assignment object
            delete addedAssignment.attachment;
        }

        await formation.save();

        // Notify associated interns about the new assignment
        const classIds = [formation._id]; // Formation ID as an array
        const interns = await Intern.find({
            "formations.formation": { $in: classIds },
        });

        const teacher = await Teacher.findOne({ user: req.user._id }); // Get the teacher
        if (teacher) {
            interns.forEach((intern) => {
                const receiver = getUser(intern.user.username);
                if (receiver) {
                    console.log(`Sending notification to ${receiver.username}`);
                    io.to(receiver.socketId).emit("getNotification", {
                        senderName: teacher.user.username,
                        type: "assignment",
                    });
                }
            });
        }

        console.log("Assignment created successfully and notifications sent.");
        res.status(201).json(formation);
    } catch (error) {
        console.error("Error creating assignment:", error);
        res.status(400).json({ message: error.message });
    }
});



// Create Announcement for a Class
export const createAnnouncement = asyncHandler(async (req, res) => {
    const { formationId, className } = req.params;
    const { title, content } = req.body;

    try {
        const formation = await Formation.findById(formationId);

        if (!formation) {
            res.status(404).json({ message: "Formation not found" });
            return;
        }

        // Find the class by name
        const classInfo = formation.classes.find(cls => cls.name === className);

        if (!classInfo) {
            res.status(404).json({ message: "Class not found in formation" });
            return;
        }

        const teacherId = req.user._id; // Get the teacher's ID from the request

        const announcement = {
            title,
            content,
            teacher: teacherId, // Include the teacher's ID
        };

        classInfo.announcements.push(announcement);

        await formation.save();



        res.status(201).json(formation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Assignments for a Class
export const getClassAssignments = asyncHandler(async (req, res) => {
    const { formationId, className } = req.params; // Update to use className

    try {
        const formation = await Formation.findById(formationId);

        if (!formation) {
            res.status(404).json({ message: "Formation not found" });
            return;
        }

        // Find the class by name
        const classInfo = formation.classes.find(cls => cls.name === className);

        if (!classInfo) {
            res.status(404).json({ message: "Class not found in formation" });
            return;
        }

        // Populate teacher information before sending the response
        await Formation.populate(classInfo, { path: 'assignments.teacher' });

        const filteredAssignments = classInfo.assignments.map(({ _id, title, description, dueDate, subject, attachmentOriginalName, attachmentUrl, teacher }) => ({
            _id,
            title,
            description,
            dueDate,
            subject,
            attachmentOriginalName,
            attachmentUrl,
            teacher, // Include teacher information
        }));

        res.status(200).json(filteredAssignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const getAssignmentById = asyncHandler(async (req, res) => {
    const { formationId, className, assignmentId } = req.params;

    try {
        const formation = await Formation.findById(formationId);

        if (!formation) {
            res.status(404).json({ message: "Formation not found" });
            return;
        }

        const classInfo = formation.classes.find(cls => cls.name === className);

        if (!classInfo) {
            res.status(404).json({ message: "Class not found in formation" });
            return;
        }

        const assignment = classInfo.assignments.find(assignment => assignment._id.toString() === assignmentId);

        if (!assignment) {
            res.status(404).json({ message: "Assignment not found in class" });
            return;
        }
        // Populate teacher information before sending the response
        await Formation.populate(classInfo, { path: 'assignments.teacher' });

        const { _id, title, description, dueDate, subject, attachmentOriginalName, attachmentUrl, teacher, createdAt, updatedAt } = assignment;

        res.status(200).json({
            _id,
            title,
            description,
            dueDate,
            subject,
            attachmentOriginalName,
            attachmentUrl,
            teacher,
            createdAt,
            updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get Announcements for a Class
export const getClassAnnouncements = asyncHandler(async (req, res) => {
    const { formationId, className } = req.params;

    try {
        const formation = await Formation.findById(formationId);

        if (!formation) {
            res.status(404).json({ message: "Formation not found" });
            return;
        }

        // Find the class by name
        const classInfo = formation.classes.find(cls => cls.name === className);

        if (!classInfo) {
            res.status(404).json({ message: "Class not found in formation" });
            return;
        }

        // Retrieve announcement IDs
        const announcementIds = classInfo.announcements.map(announcement => announcement._id);

        // Populate teacher information for announcements
        const populatedAnnouncements = await Formation.populate(classInfo, {
            path: 'announcements',
            select: 'title content teacher',
            populate: {
                path: 'teacher',
                select: 'firstName lastName',
            },
        });

        // Construct the response
        const announcements = populatedAnnouncements.announcements.map(announcement => ({
            _id: announcement._id,
            title: announcement.title,
            content: announcement.content,
            teacher: {
                id: announcement.teacher._id,
                firstName: announcement.teacher.firstName,
                lastName: announcement.teacher.lastName
            },
        }));

        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get Assignments and Announcements for a Student's Level
export const getStudentLevelContent = asyncHandler(async (req, res) => {
    const { internId } = req.params;

    try {
        const intern = await Intern.findOne({ user: internId });

        if (!intern) {
            res.status(404).json({ message: "Intern not found" });
            return;
        }

        const studentLevel = intern.level;
        const assignments = [];
        const announcements = [];
        const formationsDetails = [];

        // Find assignments and announcements for the student's level
        const formations = await Formation.find({
            "classes.level": studentLevel,
        })
            .populate({
                path: 'classes.assignments.teacher',
                select: 'firstName lastName login',
            }).populate({
                path: 'classes.announcements.teacher',
                select: 'firstName lastName login',
            }); // Populate teacher for announcements as well

        console.log('studentLevel:', studentLevel);

        formations.forEach((formation) => {
            console.log('Formation:', formation);

            const filteredClasses = formation.classes.filter(classInfo =>
                classInfo.level.trim().toLowerCase() === studentLevel.trim().toLowerCase()
            );

            filteredClasses.forEach((classInfo) => {
                console.log('classInfo.level:', classInfo.level);

                const filteredAssignments = classInfo.assignments.map(({ _id, title, description, dueDate, subject, attachmentOriginalName, attachmentUrl, teacher, createdAt, updatedAt }) => ({
                    _id,
                    title,
                    description,
                    dueDate,
                    subject,
                    attachmentOriginalName,
                    attachmentUrl,
                    teacher,
                    createdAt,
                    updatedAt,
                    formation: { id: formation._id, name: formation.nom }, // Add formation information
                    class: { id: classInfo._id, name: classInfo.name }, // Add class information
                }));
                assignments.push(...filteredAssignments);

                // Populate teacher information in announcements
                const populatedAnnouncements = classInfo.announcements.map(announcement => ({
                    ...announcement.toObject(),
                    teacher: announcement.teacher,
                }));
                announcements.push(...populatedAnnouncements);

                formationsDetails.push({
                    formation: {
                        id: formation._id, // Add the formation ID
                        name: formation.nom,
                    },
                    class: {
                        id: classInfo._id, // Add the class ID
                        name: classInfo.name,
                    },
                });
            });
        });

        console.log('Assignments:', assignments);
        console.log('Announcements:', announcements);

        res.status(200).json({ assignments, announcements });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export const getInternsAttendanceSummary = async (req, res) => {
    const { formationId, classId } = req.params;

    try {
        // Find the formation and populate its classes and class's teacher
        const formation = await Formation.findById(formationId)
            .populate({
                path: 'classes',
                populate: {
                    path: 'teacher',
                    select: 'name', // Assuming 'name' is the field representing teacher's name
                },
            });

        if (!formation) {
            return res.status(404).json({ success: false, message: 'Formation not found' });
        }

        // Find the class within the formation's classes array
        const selectedClass = formation.classes.find(cls => cls._id.toString() === classId.toString());

        if (!selectedClass) {
            return res.status(404).json({ success: false, message: 'Class not found in formation' });
        }

        // Get attendance summary for each intern in the class
        const internSummaries = [];
        for (const internObj of selectedClass.interns) {
            const intern = await Intern.findOne({ user: internObj.intern });

            if (!intern) {
                // Skip interns not found
                continue;
            }

            const attendanceData = intern.formations.find(formationObj => formationObj.formation.toString() === formationId)
                .attendance;

            const daysPresent = attendanceData.filter(att => att.isPresent && selectedClass.subjects.includes(att.subject)).length;
            const totalDays = attendanceData.length;
            const attendancePercentage = totalDays === 0 ? 0 : (daysPresent / totalDays) * 100;

            const internSummary = {
                internId: intern.user,
                formationId: formationId,
                formationName: formation.nom, // Adding the formation name
                classId: classId,
                className: selectedClass.name, // Adding the class name
                subject: selectedClass.subjects,
                totalDays: totalDays,
                daysPresent: daysPresent,
                attendancePercentage: attendancePercentage,
            };

            internSummaries.push(internSummary);
        }

        return res.status(200).json({ success: true, internSummaries });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

