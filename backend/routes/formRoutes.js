const express = require('express');
const {
  createForm,
  getMyForms,
  getFormById,
  updateForm,
  deleteForm
} = require('../controllers/formController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createForm);
router.get('/my', protect, getMyForms);
router.get('/:id', protect, getFormById);
router.put('/:id', protect, updateForm);
router.delete('/:id', protect, deleteForm);

module.exports = router;