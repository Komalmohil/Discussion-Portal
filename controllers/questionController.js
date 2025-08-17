const Question = require("../models/Question");

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ resolved: false });
    res.json(questions);
  } catch (err) {
    console.error("Error loading questions:", err);
    res.status(500).json({ error: "Failed to load questions" });
  }
};

exports.createQuestion = async (req, res) => {
   if (!req.user) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  const { title, description } = req.body;
  try {
    const newQuestion = new Question({ title, description });
    await newQuestion.save();
    res.json(newQuestion);
  } catch (err) {
    console.error("Error saving question:", err);
    res.status(500).json({ error: "Failed to save question" });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.json(question);
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ error: "Failed to fetch question" });
  }
};

exports.addResponse = async (req, res) => {
  const { name, answer } = req.body;
  const { id } = req.params;

  try {
    const question = await Question.findById(id);
    question.responses.push({ name, answer });
    question.updatedAt = new Date();
    await question.save();
    res.json(question);
  } catch (err) {
    console.error("Error adding response:", err);
    res.status(500).json({ error: "Failed to add response" });
  }
};

exports.resolveQuestion = async (req, res) => {
  try {
    await Question.findByIdAndUpdate(req.params.id, { resolved: true });
    res.json({ success: true });
  } catch (err) {
    console.error("Error resolving question:", err);
    res.status(500).json({ error: "Failed to resolve question" });
  }
};

exports.likeResponse = async (req, res) => {
  const { id, rid } = req.params;
  try {
    const question = await Question.findById(id);
    const response = question.responses.id(rid);
    response.like += 1;
    question.updatedAt = new Date();
    await question.save();
    res.json({ like: response.like });
  } catch (err) {
    console.error("Error liking response:", err);
    res.status(500).json({ error: "Failed to like response" });
  }
};

exports.dislikeResponse = async (req, res) => {
  const { id, rid } = req.params;
  try {
    const question = await Question.findById(id);
    const response = question.responses.id(rid);
    response.dislike += 1;
    question.updatedAt = new Date();
    await question.save();
    res.json({ dislike: response.dislike });
  } catch (err) {
    console.error("Error disliking response:", err);
    res.status(500).json({ error: "Failed to dislike response" });
  }
};
