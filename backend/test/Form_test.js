const chai = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Form = require('../models/Form');
const {
  createForm,
  getMyForms,
  getFormById,
  updateForm,
  deleteForm,
} = require('../controllers/formController');

const { expect } = chai;

describe('CreateForm Function Test', () => {
  it('should create a new form successfully', async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        title: 'Event Feedback Form',
        description: 'Please give your feedback',
        questions: [
          {
            questionText: 'How was the event?',
            questionType: 'text',
            options: [],
          },
        ],
      },
    };

    const createdForm = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
      createdBy: req.user._id,
    };

    const createStub = sinon.stub(Form, 'create').resolves(createdForm);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createForm(req, res);

    expect(
      createStub.calledOnceWith({
        title: req.body.title,
        description: req.body.description,
        questions: req.body.questions,
        createdBy: req.user._id,
      })
    ).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdForm)).to.be.true;

    createStub.restore();
  });

  it('should return 500 if an error occurs while creating a form', async () => {
    const createStub = sinon.stub(Form, 'create').throws(new Error('DB Error'));

    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        title: 'Event Feedback Form',
        description: 'Please give your feedback',
        questions: [],
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createForm(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    createStub.restore();
  });
});

describe('GetMyForms Function Test', () => {
  it('should return only forms created by the logged-in user', async () => {
    const userId = new mongoose.Types.ObjectId();

    const mockSort = sinon.stub().resolves([
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Form 1',
        createdBy: userId,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Form 2',
        createdBy: userId,
      },
    ]);

    const findStub = sinon.stub(Form, 'find').returns({ sort: mockSort });

    const req = { user: { _id: userId } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getMyForms(req, res);

    expect(findStub.calledOnceWith({ createdBy: userId })).to.be.true;
    expect(mockSort.calledOnceWith({ createdAt: -1 })).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;

    findStub.restore();
  });

  it('should return 500 if an error occurs while getting forms', async () => {
    const findStub = sinon.stub(Form, 'find').throws(new Error('DB Error'));

    const req = { user: { _id: new mongoose.Types.ObjectId() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getMyForms(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findStub.restore();
  });
});

describe('GetFormById Function Test', () => {
  it('should return a form successfully when the owner requests it', async () => {
    const userId = new mongoose.Types.ObjectId();
    const formId = new mongoose.Types.ObjectId();

    const form = {
      _id: formId,
      title: 'Event Feedback Form',
      createdBy: userId,
    };

    const findByIdStub = sinon.stub(Form, 'findById').resolves(form);

    const req = {
      params: { id: formId.toString() },
      user: { _id: userId },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getFormById(req, res);

    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(form)).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if the form is not found', async () => {
    const findByIdStub = sinon.stub(Form, 'findById').resolves(null);

    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { _id: new mongoose.Types.ObjectId() },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getFormById(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Form not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 403 if another user tries to view the form', async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const otherUserId = new mongoose.Types.ObjectId();

    const form = {
      _id: new mongoose.Types.ObjectId(),
      title: 'Event Feedback Form',
      createdBy: ownerId,
    };

    const findByIdStub = sinon.stub(Form, 'findById').resolves(form);

    const req = {
      params: { id: form._id.toString() },
      user: { _id: otherUserId },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getFormById(req, res);

    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ message: 'Not authorized to view this form' })).to.be.true;

    findByIdStub.restore();
  });
});

describe('UpdateForm Function Test', () => {
  it('should update a form successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    const formId = new mongoose.Types.ObjectId();

    const existingForm = {
      _id: formId,
      title: 'Old Title',
      description: 'Old Description',
      questions: [
        {
          questionText: 'Old Question',
          questionType: 'text',
          options: [],
        },
      ],
      createdBy: userId,
      save: sinon.stub().resolvesThis(),
    };

    const findByIdStub = sinon.stub(Form, 'findById').resolves(existingForm);

    const req = {
      params: { id: formId.toString() },
      user: { _id: userId },
      body: {
        title: 'New Title',
        description: 'New Description',
        questions: [
          {
            questionText: 'New Question',
            questionType: 'multiple-choice',
            options: ['Yes', 'No'],
          },
        ],
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateForm(req, res);

    expect(existingForm.title).to.equal('New Title');
    expect(existingForm.description).to.equal('New Description');
    expect(existingForm.questions[0].questionType).to.equal('multiple-choice');
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if the form to update is not found', async () => {
    const findByIdStub = sinon.stub(Form, 'findById').resolves(null);

    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { _id: new mongoose.Types.ObjectId() },
      body: {},
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateForm(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Form not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 403 if another user tries to update the form', async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const otherUserId = new mongoose.Types.ObjectId();

    const form = {
      _id: new mongoose.Types.ObjectId(),
      title: 'Event Feedback Form',
      description: 'Please give feedback',
      questions: [],
      createdBy: ownerId,
      save: sinon.stub().resolvesThis(),
    };

    const findByIdStub = sinon.stub(Form, 'findById').resolves(form);

    const req = {
      params: { id: form._id.toString() },
      user: { _id: otherUserId },
      body: { title: 'Hacked Title' },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateForm(req, res);

    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ message: 'Not authorized to update this form' })).to.be.true;

    findByIdStub.restore();
  });
});

describe('DeleteForm Function Test', () => {
  it('should delete a form successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    const formId = new mongoose.Types.ObjectId();

    const form = {
      _id: formId,
      createdBy: userId,
      deleteOne: sinon.stub().resolves(),
    };

    const findByIdStub = sinon.stub(Form, 'findById').resolves(form);

    const req = {
      params: { id: formId.toString() },
      user: { _id: userId },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteForm(req, res);

    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(form.deleteOne.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ message: 'Form deleted successfully' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if the form is not found', async () => {
    const findByIdStub = sinon.stub(Form, 'findById').resolves(null);

    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { _id: new mongoose.Types.ObjectId() },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteForm(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Form not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 403 if another user tries to delete the form', async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const otherUserId = new mongoose.Types.ObjectId();

    const form = {
      _id: new mongoose.Types.ObjectId(),
      createdBy: ownerId,
      deleteOne: sinon.stub().resolves(),
    };

    const findByIdStub = sinon.stub(Form, 'findById').resolves(form);

    const req = {
      params: { id: form._id.toString() },
      user: { _id: otherUserId },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteForm(req, res);

    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ message: 'Not authorized to delete this form' })).to.be.true;

    findByIdStub.restore();
  });
});