const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Route to create a new user profile
router.post('/profiles', profileController.createProfile);

// Route to get a user profile by ID
router.get('/profiles/:id', profileController.getProfileById);

// Route to update a user profile by ID
router.put('/profiles/:id', profileController.updateProfile);

// Route to delete a user profile by ID
router.delete('/profiles/:id', profileController.deleteProfile);

// Route to get all user profiles
router.get('/profiles', profileController.getAllProfiles);

module.exports = router;