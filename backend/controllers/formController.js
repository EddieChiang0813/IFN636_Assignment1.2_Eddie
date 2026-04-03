const Form = require('../models/Form');

const createForm = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const form = await Form.create({
      title,
      description,
      questions,
      createdBy: req.user._id
    });

    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyForms = async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this form' });
    }

    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateForm = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this form' });
    }

    form.title = title || form.title;
    form.description = description || form.description;
    form.questions = questions || form.questions;

    const updatedForm = await form.save();
    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this form' });
    }

    await form.deleteOne();
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createForm,
  getMyForms,
  getFormById,
  updateForm,
  deleteForm
};