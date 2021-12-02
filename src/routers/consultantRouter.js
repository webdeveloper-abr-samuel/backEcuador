const express = require('express');
const router = express.Router();
const consultant = require('../controllers').consultant;

router.post("/login", consultant.login);
router.post("/clients", consultant.client);
router.post("/sellers", consultant.sellers);
router.get("/storage", consultant.storages);
router.post("/products", consultant.products);
router.post("/saveOrder", consultant.saveOrder);


module.exports = router;