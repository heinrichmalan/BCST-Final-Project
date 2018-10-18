var express = require('express');
var patientRouter = express.Router();
const db = require('../../Database/models'); // new require for db object  

// Get all patients
patientRouter.get('/', function(req,res) {
    return db.Patient.findAll()
    .then((patients) => res.send(patients))
    .catch((err) => {
      console.log('There was an error querying contacts', JSON.stringify(err))
      return res.send(err)
    });
});

// Get current patients
patientRouter.get('/current', function(req,res) {
    return db.Patient.findAll({
        where: {
            is_archived: false,
        }
      })
    .then((patients) => res.send(patients))
    .catch((err) => {
      console.log('There was an error querying contacts', JSON.stringify(err))
      return res.send(err)
    });
});

// Get archived patients
patientRouter.get('/archived', function(req,res) {
    return db.Patient.findAll({
        where: {
            is_archived: true,
        }
      })
    .then((patients) => res.send(patients))
    .catch((err) => {
      console.log('There was an error querying contacts', JSON.stringify(err))
      return res.send(err)
    });
});

// Get patient with specific mrn
patientRouter.get("/mrn/:mrn", function(req, res) {
    console.log(req.params.mrn)
    return db.Patient.findById(req.params.mrn)
    .then((patient) => {
        if (patient == null) {
            res.send({error: "No patient with this mrn"})
        } else {
            res.send(patient)
        }
    })
    .catch((err) => {
        console.log('There was an error querying contacts', JSON.stringify(err))
      return res.send(err)
    });
 });

 patientRouter.post("/checkPatient", function(req, res) {
     let body = req.body.userInfo;
     return db.Patient.findOne({where: {MRN:body.mrn, first_name: body.firstName.trim(), last_name: body.lastName.trim()}})
     .then(data => {
        console.log(data.dataValues);
        res.status(200)
        res.send(data.dataValues);
     }).catch(err => {
         console.log(error)
        res.status(400);
        res.end()
     })
 })

 patientRouter.post("/addPatient", function(req, res) {
     let body = req.body.patientInfo;
     return db.Patient.findOrCreate({where: {MRN: body.mrn}, defaults: {first_name: body.firstName, last_name: body.lastName, ward:body.ward, age:body.age, sex: body.gender}})
     .then(data => {
        let isNewRecord = data[0].isNewRecord;
        res.status(200);
        if (isNewRecord) {
            res.send({okay: "Patient added"})
        } else {
            res.send({error: "Patient with this mrn already exists"});
        }
     }).catch(err => {
         res.status(400)
         res.send({error: "Error with the database"});
         console.log(err);
     })
 })

// 404 not found
patientRouter.get('*', function(req,res) {
    res.status(404).send('404 not found')
});

module.exports = patientRouter;