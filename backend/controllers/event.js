import Event from "../models/Event.js";

export const createEvent = async (req, res, next) => {
    // Destructure the eventPicture array from the request body
    const { eventPicture, ...eventData } = req.body;

    // Create a new Event object with the eventData (excluding eventPicture)
    const newEvent = new Event(eventData);

    try {
        // Add the eventPicture array to the eventPictures property
        newEvent.eventPictures = eventPicture;

        // Save the new event to the database
        const savedEvent = await newEvent.save();
        res.status(200).json(savedEvent);
    } catch (err) {
        next(err);
    }
};

export const updateEvent = async (req, res, next) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedEvent);
    } catch (err) {
        next(err);
    }
};
export const deleteEvent = async (req, res, next) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json("Event has been deleted.");
    } catch (err) {
        next(err);
    }
};
export const getEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        res.status(200).json(event);
    } catch (err) {
        next(err);
    }
};
export const getEvents = async (req, res, next) => {
    const { min, max, ...others } = req.query;
    try {
        const events = await Event.find({
            ...others,
            price: { $gt: min | 1, $lt: max || 999 },
        }).limit(req.query.limit);
        res.status(200).json(events);
    } catch (err) {
        next(err);
    }
};
export const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        next(err);
    }
}
export const countByLocation = async (req, res, next) => {
    const locations = req.query.locations.split(",");
    try {
        const list = await Promise.all(
            locations.map((location) => {
                return Hotel.countDocuments({ location: location });
            })
        );
        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
};
export const countByType = async (req, res, next) => {
    try {
        const freeEventCount = await Event.countDocuments({ type: "Free Event" });
        const paidEventCount = await Event.countDocuments({ type: "Paid Event" });
        const onlineEventCount = await Event.countDocuments({ type: "Online Event" });


        res.status(200).json([
            { type: "Free Event", count: freeEventCount },
            { type: "Paid Event", count: paidEventCount },
            { type: "Online Event", count: onlineEventCount },

        ]);
    } catch (err) {
        next(err);
    }
};

