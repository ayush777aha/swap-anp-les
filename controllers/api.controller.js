const Choice = require("../models/choices.models")
const Question = require("../models/questions.model")
const Earning = require("../models/earning.model")
const Milestone = require("../models/milestones")
const Reward = require("../models/rewards.models")
// Create a new item
exports.getChoiceData = async (req, res) => {
  try {
    const choices = await Choice.find({});
    console.log('Choices fetched successfully.');
    res.json({
      status: true,
      data: choices,
    });
  } catch (err) {
    console.error('Error while fetching choices:', err);
    res.status(500).json({
      error: 'An error occurred while fetching choices.',
      status: false,
    });
  }
}

exports.getQuestions = async (req, res) => {
  try {
    const { subject, chapter, page, limit } = req.query;

    // Define a query object based on the provided query parameters
    const query = {};
    if (subject) query.subject = subject;
    if (chapter) query.chapter = chapter;

    // Calculate skip and limit for pagination
    const skip = (page - 1) * limit;

    const questions = await Question.find(query)
      .skip(skip)
      .limit(Number(limit))
      .exec();
    shuffleArray(questions)
    console.log('Questions fetched successfully.');
    res.json({
      status: true,
      data: questions,
    });
  } catch (err) {
    console.error('Error while fetching questions:', err);
    res.status(500).json({
      error: 'An error occurred while fetching questions.',
      status: false,
    });
  }
}

exports.getMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({});
    console.log('Milestones fetched successfully.');
    res.json({
      status: true,
      data: milestones,
    });
  } catch (err) {
    console.error('Error while fetching Milestones:', err);
    res.status(500).json({
      error: 'An error occurred while fetching Milestones.',
      status: false,
    });
  }
}


exports.getRandomRewardAndSave = async (req, res) => {
  const userId = req.params.userId;
  try {
    const randomReward = await Reward.aggregate([{ $sample: { size: 1 } }]);

    if (!randomReward || randomReward.length === 0) {
      return res.status(404).json({
        error: 'No random reward found',
        status: false,
        data: null,
      });
    }

    await addRewards(userId, randomReward[0]);

    res.json({
      status: true,
      data: randomReward[0],
    });
  } catch (error) {
    console.error('Error while fetching random reward:', error);
    res.status(500).json({
      error: 'An error occurred while fetching the random reward',
      status: false,
    });
  }
};


async function addRewards(userId, reward) {
  try {
    const existingEarning = await Earning.findOne({ userId });

    if (!existingEarning) {
      throw new Error("earning not found")
    }


    existingEarning.rewards.push({ ...reward })

    // const { _id,type, count, name, code, description } = reward;

    // switch (type) {
    //   case 'diamond':
    //     existingEarning.diamonds += count;
    //     break;
    //   case 'skip':
    //     existingEarning.skip += count;
    //     break;
    //   case 'hint':
    //     existingEarning.hint += count;
    //     break;
    //   case 'pw_coins':
    //     existingEarning.pw_coins += count;
    //     break;
    //   case 'pw_discount_coupons':
    //     existingEarning.pw_coupons++;
    //     existingEarning.pw_coupons_details.push({ name, code, description,couponId:_id });
    //     break;

    // }

    await existingEarning.save();
  } catch (error) {
    console.error('Error updating Earning document:', error);
  }
}


exports.getUserEarning = async (req, res) => {
  const userId = req.params.userId;

  try {
    let earningWithLookup = await Earning.findOne({ userId })
      .populate({
        path: 'pw_coupons_details rewards',
        model: 'rewards', // Reference to the 'Reward' model
      })// Populate related collections

    if (!earningWithLookup) {
      // Create a new Earning document with default entries
      earningWithLookup = new Earning({ userId });
      await earningWithLookup.save();
    }

    res.status(200).json({
      status: true,
      data: earningWithLookup
    });
  } catch (error) {
    console.error('Error fetching Earning document:', error);
    res.status(500).json({
      error: 'An error occurred while fetching earnings.',
      status: false,
    });
  }

}


exports.scratchTheCard = async (req, res) => {
  const userId = req.params.userId;
  const scratchId = req.body.scratchId;
  try {
    let existingEarning = await Earning.findOne({ userId })
    const reward = await Reward.findById(scratchId);
    if (!existingEarning || !reward) {
      throw new Error("earning doc does not exist")
    }
    await saveScratchCard(existingEarning, reward, userId, scratchId)
    res.status(200).json({
      status: true,
    });
  } catch (error) {
    console.error('Error updating Earning document:', error);
    res.status(500).json({
      error: 'An error occurred while updating earnings.',
      status: false,
    });
  }
}

async function saveScratchCard(existingEarning, reward, userId, scratchId) {
  const { type, count, _id } = reward;

  switch (type) {
    case 'diamond':
      existingEarning.diamonds += count;
      break;
    case 'skip':
      existingEarning.skip += count;
      break;
    case 'hint':
      existingEarning.hint += count;
      break;
    case 'pw_coins':
      existingEarning.pw_coins += count;
      break;
    case 'pw_discount_coupons':
      existingEarning.pw_coupons++;
      existingEarning.pw_coupons_details.push({ _id });
      break;

  }

  await Earning.findOneAndUpdate(
    { userId, 'rewards._id': scratchId },
    { $set: { 'rewards.$.isScratch': true } },
    { new: true }
  )
  await existingEarning.save();
}




// API to fetch or create an entry by userId
// async function saveDetails(userId, reward) {
//   try {
//     const existingEarning = await Earning.findOne({ userId });

//     if (!existingEarning) {
//       throw new Error("earning doc does not exist")
//     }

//     const { _id,type, count, name, code, description } = reward;

//     switch (type) {
//       case 'diamond':
//         existingEarning.diamonds += count;
//         break;
//       case 'skip':
//         existingEarning.skip += count;
//         break;
//       case 'hint':
//         existingEarning.hint += count;
//         break;
//       case 'pw_coins':
//         existingEarning.pw_coins += count;
//         break;
//       case 'pw_discount_coupons':
//         existingEarning.pw_coupons++;
//         existingEarning.pw_coupons_details.push({ name, code, description,couponId:_id });
//         break;

//     }

//     await existingEarning.save();
//   } catch (error) {
//     console.error('Error updating Earning document:', error);
//   }
// }

exports.updateData = async (req, res) => {
  const userId = req.params.userId;
  const data = req.body

  try {
    // Find the Earning document by userId
    const existingEarning = await Earning.findOne({ userId });

    if (!existingEarning) {
      return res.status(404).json({ error: 'Earning document not found' });
    }

    const result = await Earning.findOneAndUpdate({ userId }, { $set: data })

    return res.status(200).json({
      data: result,
      status: true,
    });

  } catch (error) {
    console.error('Error updating max_streak:', error);
    return res.status(500).json({
      error: 'An error occurred while updating earnings.',
      status: false,
    });
  }
};















function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}




// https://drive.google.com/file/d/1UHt-9whEeweLCJot98D0VnxxH3By8zrr/view?usp=drive_link					
// https://drive.google.com/file/d/1hvOIiP2wAouRSDAczNgU9CA6KHrc2iXL/view?usp=drive_link					
// https://drive.google.com/file/d/17OMCqy2ZgprH0POWB8GX4_vSfUg6cNDn/view?usp=drive_link					
// https://drive.google.com/file/d/1wD7DSX1pKX5eJuuwoGlXKuMYO4DlpjYx/view?usp=drive_link					
// https://drive.google.com/file/d/1Evnqlvw8_6dpR4gZX8-SxD9u9Dh6gtf2/view?usp=drive_link					
// https://drive.google.com/file/d/1ejXbxNwA7VYtJyPPqHloVrLaJHWfatpZ/view?usp=drive_link					
// https://drive.google.com/file/d/1ipc7MAU8-DM93L-2ltDjnYUdtp-wBUAO/view?usp=drive_link					
// https://drive.google.com/file/d/1Gdt3bn0Llt5EWRvgSUjX3WLJ8UGHMH_s/view?usp=drive_link					
// https://drive.google.com/file/d/1DbqlSPF_pAfTzNItYo3UfrDDdFkjtsAM/view?usp=drive_link					
// https://drive.google.com/file/d/115ok_zJtkZAew9WRNxAFTmDbsBsDHieU/view?usp=drive_link					
// https://drive.google.com/file/d/1mcb0G2XvbAElWBF_akXHw4cuR2zBjoaG/view?usp=drive_link					