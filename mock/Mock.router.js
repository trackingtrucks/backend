const express = require('express');
const router = express.Router();

const { root } = require('./Mock.functions')


router.get('/', root); 

module.exports = router;