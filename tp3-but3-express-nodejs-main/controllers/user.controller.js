import { User } from '../models/user.model.js';

// Get all users - only accessible by admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Create a new user - only accessible by admin
const createUser = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'user'
        });

        // Remove password from output
        newUser.password = undefined;

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Get user by ID - only accessible by admin or the user themselves
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'No user found with that ID'
            });
        }

        // Check if user is admin or the owner of the data
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Update user - only accessible by admin or the user themselves
const updateUser = async (req, res) => {
    try {
        // Don't allow password updates through this route
        if (req.body.password) {
            return res.status(400).json({
                status: 'fail',
                message: 'This route is not for password updates.'
            });
        }

        // Check if user is admin or the owner of the data
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }

        // Don't allow role changes unless the user is an admin
        if (req.body.role && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to change roles'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: 'fail',
                message: 'No user found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

export { getAllUsers, updateUser, createUser, getUserById }
