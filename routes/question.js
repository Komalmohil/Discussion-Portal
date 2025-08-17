const express = require("express");
const router = express.Router();
const { getQuestions,getQuestionById,createQuestion,addResponse,resolveQuestion,likeResponse,dislikeResponse }=require("../controllers/questionController");

const auth = require("../middleware/auth");

router.get("/", getQuestions);
router.get("/:id", getQuestionById);

router.post("/", auth, createQuestion);
router.post("/:id/response",auth,addResponse);
router.post("/:id/resolve",auth,resolveQuestion);
router.post("/:id/response/:rid/like",auth,likeResponse);
router.post("/:id/response/:rid/dislike",auth, dislikeResponse);

module.exports = router;
