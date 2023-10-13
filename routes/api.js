const express = require('express');
const router = express.Router();
const controller = require('../controllers/api.controller');

router.get('/choiceData', controller.getChoiceData);
router.get('/questions', controller.getQuestions);
//router.get('/milestones', controller.getMilestones);
router.get('/earnings/:userId', controller.getUserEarning);
router.get('/rewards/:userId', controller.getRandomRewardAndSave);
router.put('/updateData/:userId', controller.updateData);
router.post('/scratchCard/:userId', controller.scratchTheCard);



module.exports = router;
