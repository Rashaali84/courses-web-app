'use strict'

const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const config = require('../config');
const util = require('util');

// some helper functions you can use
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);
const deleteFile = util.promisify(fs.unlink);

const DATA_DIR = path.join(__dirname, '/..', config.DATA_DIR, '/courses.json');

const controllers = {
  hello: (req, res) => {
    res.json({ api: 'courses!' });
  },
  getAll: (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    // get the course from db courses.json use fs
    readFile(DATA_DIR, 'utf-8')
      .then((contents) => { res.send(JSON.parse(contents)); })
      .catch((err) => { res.status(404).send(err); });
  },
  courseById: (req, res) => {
    // get the course from db courses.json use fs
    readFile(DATA_DIR, 'utf-8')
      .then((contents) => {
        const parsedContent = JSON.parse(contents);
        if (parsedContent[req.params.id]) {
          res.send(JSON.parse('{"' + req.params.id + '":"' + parsedContent[req.params.id] + '"}'));
        }
        else {
          return res.status(404).send('the course with the given id was not found ... ');
        }
      })
      .catch((err) => { res.status(404).send(err); })
  },
  addCourse: (req, res) => {
    //do some input validation to the name inputs
    if (!req.body.name) {
      res.status(400).send('Name is required .. ')
      return;
    }
    // here comes npm joi to validation !!!
    //npm i joi  npm i joi@13.1.0
    const { error } = validateCourse(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    readFile(DATA_DIR, 'utf-8')
      .then((contents) => {

        let parsedContent = JSON.parse(contents); //now it an object
        console.log(parsedContent.courses);
        const course = {
          id: parsedContent.courses.length + 1,
          name: req.body.name
        };
        parsedContent.courses.push(course);
        let json = JSON.stringify(parsedContent); //convert it back to string

        writeFile(DATA_DIR, json, 'utf8')
          .then(() => { res.status(200).send('addition is done successfully..') })
          .catch((err) => {
            res.status(404).send(err);
          });
      })
      .catch((err) => res.status(404).send(err));

  },

  updateCourse: (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    readFile(DATA_DIR, 'utf-8')
      .then((contents) => {
        const parsedContent = JSON.parse(contents);
        const course = parsedContent.courses.find(c => c.id === parseInt(req.params.id));
        if (course) {
          course.name = req.body.name;
          let json = JSON.stringify(parsedContent); //convert it back to json
          writeFile(DATA_DIR, json, 'utf8')
            .then(() => { res.send('update is done successfully..') })
            .catch((err) => {
              res.status(404).send(err);
              res.send(json);
            });
        }
        else {
          return res.status(404).send('the course with the given id was not found ... ');
        }
      })
      .catch((err) => { if (err) res.status(404).send(err); })
  },
  deleteCourse: (req, res) => {
    readFile(DATA_DIR, 'utf-8')
      .then((contents) => {
        const parsedContent = JSON.parse(contents);
        const course = parsedContent.courses.find(c => c.id === parseInt(req.params.id));
        if (course) {
          const index = parsedContent.courses.indexOf(course);
          parsedContent.courses.splice(index, 1);
          console.log(parsedContent);
          const toWrite = JSON.stringify(parsedContent, null, '  ');
          //now write the data again
          writeFile(DATA_DIR, toWrite)
            .then(() => { res.send('deletion is done successfully..') })
            .catch((err) => {
              res.status(404).send(err);
              res.send(parsedContent);
            })
        }
        else {
          throw err;
        }
      })
      .catch((err) => {
        return res.status(404).send('the course with the given id was not found ... ');
      });

  }
}

function validateCourse(course) {
  const schema = { name: Joi.string().min(2).required() };//schema for Joi to validate input 
  return Joi.validate(course, schema);
}
module.exports = controllers;
