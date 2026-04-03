

const chai = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
} = require('../controllers/authController');

const { expect } = chai;

describe('RegisterUser Function Test', () => {
  it('should register a new user successfully', async () => {
    const req = {
      body: {
        name: 'Eddie',
        email: 'eddie@test.com',
        password: '123456',
      },
    };

    const createdUser = {
      id: new mongoose.Types.ObjectId().toString(),
      name: 'Eddie',
      email: 'eddie@test.com',
    };

    const findOneStub = sinon.stub(User, 'findOne').resolves(null);
    const createStub = sinon.stub(User, 'create').resolves(createdUser);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await registerUser(req, res);

    expect(findOneStub.calledOnceWith({ email: req.body.email })).to.be.true;
    expect(
      createStub.calledOnceWith({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })
    ).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    findOneStub.restore();
    createStub.restore();
  });

  it('should return 400 if user already exists', async () => {
    const req = {
      body: {
        name: 'Eddie',
        email: 'eddie@test.com',
        password: '123456',
      },
    };

    const existingUser = {
      _id: new mongoose.Types.ObjectId(),
      email: 'eddie@test.com',
    };

    const findOneStub = sinon.stub(User, 'findOne').resolves(existingUser);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await registerUser(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'User already exists' })).to.be.true;

    findOneStub.restore();
  });
});

describe('LoginUser Function Test', () => {
  it('should login successfully with correct email and password', async () => {
    const req = {
      body: {
        email: 'eddie@test.com',
        password: '123456',
      },
    };

    const mockUser = {
      id: new mongoose.Types.ObjectId().toString(),
      name: 'Eddie',
      email: 'eddie@test.com',
      password: 'hashedpassword',
    };

    const findOneStub = sinon.stub(User, 'findOne').resolves(mockUser);
    const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await loginUser(req, res);

    expect(findOneStub.calledOnceWith({ email: req.body.email })).to.be.true;
    expect(compareStub.calledOnceWith(req.body.password, mockUser.password)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    findOneStub.restore();
    compareStub.restore();
  });

  it('should return 401 for invalid email or password', async () => {
    const req = {
      body: {
        email: 'eddie@test.com',
        password: 'wrongpassword',
      },
    };

    const mockUser = {
      id: new mongoose.Types.ObjectId().toString(),
      name: 'Eddie',
      email: 'eddie@test.com',
      password: 'hashedpassword',
    };

    const findOneStub = sinon.stub(User, 'findOne').resolves(mockUser);
    const compareStub = sinon.stub(bcrypt, 'compare').resolves(false);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await loginUser(req, res);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Invalid email or password' })).to.be.true;

    findOneStub.restore();
    compareStub.restore();
  });
});

describe('GetProfile Function Test', () => {
  it('should get profile successfully', async () => {
    const userId = new mongoose.Types.ObjectId();

    const mockUser = {
      _id: userId,
      name: 'Eddie',
      email: 'eddie@test.com',
      university: 'QUT',
      address: 'Brisbane',
    };

    const findByIdStub = sinon.stub(User, 'findById').resolves(mockUser);

    const req = {
      user: { id: userId },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getProfile(req, res);

    expect(findByIdStub.calledOnceWith(req.user.id)).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if user is not found while getting profile', async () => {
    const findByIdStub = sinon.stub(User, 'findById').resolves(null);

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getProfile(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'User not found' })).to.be.true;

    findByIdStub.restore();
  });
});

describe('UpdateUserProfile Function Test', () => {
  it('should update profile successfully', async () => {
    const userId = new mongoose.Types.ObjectId();

    const mockUser = {
      _id: userId,
      id: userId.toString(),
      name: 'Old Name',
      email: 'old@test.com',
      university: 'Old Uni',
      address: 'Old Address',
      save: sinon.stub().resolvesThis(),
    };

    const findByIdStub = sinon.stub(User, 'findById').resolves(mockUser);

    const req = {
      user: { id: userId },
      body: {
        name: 'New Name',
        email: 'new@test.com',
        university: 'QUT',
        address: 'Brisbane',
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateUserProfile(req, res);

    expect(mockUser.name).to.equal('New Name');
    expect(mockUser.email).to.equal('new@test.com');
    expect(mockUser.university).to.equal('QUT');
    expect(mockUser.address).to.equal('Brisbane');
    expect(res.json.calledOnce).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if user is not found while updating profile', async () => {
    const findByIdStub = sinon.stub(User, 'findById').resolves(null);

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        name: 'New Name',
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateUserProfile(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'User not found' })).to.be.true;

    findByIdStub.restore();
  });
});