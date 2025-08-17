const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

router.get('/', async (req, res) => {
    try{const questions = await Question.find({ resolved: false });
    res.json(questions);}catch(err){
      console.log("error loading");
    }
});

router.post('/', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newQuestion = new Question({ title, description });
    await newQuestion.save();
    //console.log("newQuestion saved");
    res.json(newQuestion); 
  } catch (err) {
    console.error('Error saving question:', err);
    res.json({ error: 'Failed to save question' });
  }
});

router.get('/:id', async (req, res) => {
    const question = await Question.findById(req.params.id);
    res.json(question);
 
});


router.post("/:id/response", async (req, res) => {
  const { name, answer } = req.body;
  const {id} = req.params;

    const question = await Question.findById(id);
    question.responses.push({name,answer});
    question.updatedAt=new Date();
    await question.save();
    //console.log("New response saved");
  res.json(question);
 
});


router.post('/:id/resolve', async(req, res) => {
    const q= await Question.findByIdAndUpdate(req.params.id, {resolved: true });
    console.log("resolved");
    res.json({success:true});
});
 
router.post('/:id/response/:rid/like', async(req,res)=>{
  const {id,rid}=req.params;
     const question= await Question.findById(id);
     const response = question.responses.id(rid)
     response.like = response.like+1;
    question.updatedAt=new Date()
     await question.save()
     res.json({like:response.like});
  }
);

router.post('/:id/response/:rid/dislike', async(req,res)=>{
  const {id,rid}=req.params;
     const question= await Question.findById(id);
     const response = question.responses.id(rid)
     response.dislike= (response.dislike)+1;
     await question.save()
     res.json({dislike:response.dislike});
  }
);


module.exports = router;
