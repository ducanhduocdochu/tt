require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Message = require("./models/message");
const Folder = require("./models/folder");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Routes
app.post("/api/folders", async (req, res) => {
  console.log(req.body);
  const { name } = req.body;
  try {
    const folder = new Folder({ name });
    await folder.save();
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ error: "Failed to create folder" });
  }
});

app.get("/api/folders", async (req, res) => {
  try {
    const folders = await Folder.find().sort({ createdAt: -1 });
    res.status(200).json(folders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch folders" });
  }
});

app.post("/api/messages", async (req, res) => {
  const { folderId, isAi, value } = req.body;
  try {
    const message = new Message({ folderId, isAi, value });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to create message" });
  }
});

app.get("/api/messages/:folderId", async (req, res) => {
  const { folderId } = req.params;
  try {
    const messages = await Message.find({ folderId });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
