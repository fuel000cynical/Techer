express = require('express');
router = express.Router();



router.get('/login', (req, res) => {})

router.post('/login/teacher', (req, res) => {})

router.post('/login/student', (req, res) => {})



router.get('/classes/:idType/:id', (req, res) => {})

router.get('/classroom/:idType/:id/:classId/:where', (req, res) => {})



router.get('/add/:what/:idType/:id', (req, res) => {})

router.post('/add/:what/:idType/:id', (req, res) => {})



router.get('/update/:what/:idType/:id/:whatId', (req, res) => {})

router.post('/update/:what/:idType/:id/:whatId', (req, res) => {})



router.get('/delete/:what/:idType/:id/:whatId', (req, res) => {})

router.post('/delete/:what/:idType/:id/:whatId', (req, res) => {})


module.exports = router;