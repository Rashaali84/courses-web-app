const controllers = require('./controllers.js');
const express = require('express');

const router = express.Router();

router.get('/', controllers.hello);
// write your routes
// add routes to router
router.get('/courses', controllers.getAll);
// read a file
//  called by action: fetchAndLoadFile
router.get('/courses/:id', controllers.courseById);
//post a course
router.post('/courses', controllers.addCourse);
//update a course
router.put('/courses/:id', controllers.updateCourse);
//http delete request 
router.delete('/courses/:id', controllers.deleteCourse);


module.exports = router;
