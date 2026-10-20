const reportsService = require('../services/reports.service');
const asyncHandler = require('../../../middleware/asyncHandler');

const getTasksSummary = asyncHandler(async (req, res) => {
  const summary = await reportsService.getTasksSummary();
  console.log("summary", summary);
  
  res.status(200).json(summary);
});

module.exports = {
  getTasksSummary
};
