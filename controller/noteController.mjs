import Note from "../models/note.js";

const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.userId }).populate("user", "email");
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const addNotes = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = new Note({ title, content, user: req.userId });
        await note.save();
        res.json(note);
    }
    catch {
        res.json({ message: "Something went wrong" });
    }
};

export default { getNotes, addNotes };

