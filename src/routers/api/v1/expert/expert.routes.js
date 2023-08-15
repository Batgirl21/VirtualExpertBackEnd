const expertRefreshTokenController = require('../../../../controllers/v1/expert/expertRefreshToken.controller');
const expertDashboardController = require('../../../../controllers/v1/expert/expertDashboard.controller');
const { ExpertAuth } = require('../../../../middleware/expertauth.middleware');
const createExpert = require('../../../../controllers/v1/expert/createExpert.controller');
const expertLoginController = require('../../../../controllers/v1/expert/expert.Login.controller');
const expertLogout = require('../../../../controllers/v1/expert/expertLogout.controller');

const router = require('express').Router();

router.get('/', function (req, res) {
    res.send('Expert Routes');
});

router.post('/createexpert', createExpert);
router.get('/Expertdashboard', ExpertAuth, expertDashboardController);
router.get('/gettoken', expertRefreshTokenController);
router.post('/login', expertLoginController);
router.patch('/logout', ExpertAuth, expertLogout);

module.exports = router;