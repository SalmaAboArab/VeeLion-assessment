const express = require('express');
const asyncHandler = require('../../../middleware/asyncHandler');
const activityController = require('../controllers/activity.controller');

const activityRouter = express.Router();
activityRouter.get('/', asyncHandler(activityController.getAllActivity));
activityRouter.post('/', asyncHandler(activityController.createActivity));

module.exports = activityRouter;
