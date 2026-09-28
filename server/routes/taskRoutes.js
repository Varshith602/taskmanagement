const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// All task routes require JWT authentication
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.get('/stats', getTaskStats);
router.post('/:id/dismiss-reminder', require('../controllers/taskController').dismissReminder);

router.route('/:id')

  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
