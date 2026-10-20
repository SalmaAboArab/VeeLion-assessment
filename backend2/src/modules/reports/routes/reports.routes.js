const express = require('express');
const reportsController = require('../controllers/reports.controller');

const router = express.Router();
// Keep the original endpoint and expose the explicit assessment endpoint.
router.get('/', reportsController.getTasksSummary);
router.get('/tasks-summary', reportsController.getTasksSummary);

module.exports = router;
