const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Route to get all services
router.get('/', serviceController.getAllServices);

// Route to get a specific service by ID
router.get('/:id', serviceController.getServiceById);

// Route to create a new service
router.post('/', serviceController.createService);

// Route to update an existing service by ID
router.put('/:id', serviceController.updateService);

// Route to delete a service by ID
router.delete('/:id', serviceController.deleteService);

// Route to book a service
router.post('/:id/book', serviceController.bookService);

module.exports = router;