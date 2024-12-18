const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Get dropdown options
router.get('/api/semesters', courseController.getSemesters);
router.get('/api/branches', courseController.getBranches);
router.get('/api/regulations', courseController.getRegulations);
router.get('/api/courses',courseController.getCourses)
router.get('/api/courses', courseController.addCourse)


// Course CRUD operations
router.get('/courses', courseController.getCourses);
router.post('/courses', courseController.addCourse);
router.put('/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);



module.exports = router;