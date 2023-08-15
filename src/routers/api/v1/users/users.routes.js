const userRefreshTokenController = require('../../../../controllers/v1/users/userRefreshToken.controller');
const userDashboardController = require('../../../../controllers/v1/users/userDashboard.controller');
const { UserAuth } = require('../../../../middleware/auth.middleware');
const createUser = require('../../../../controllers/v1/users/createUser.controller');
const userLoginController = require('../../../../controllers/v1/users/user.Login.controller');
const userLogout = require('../../../../controllers/v1/users/userLogout.controller');

const router = require('express').Router();

router.get('/', function (req, res) {
    res.send('Users Routes');
});

router.post('/createuser', createUser);
router.get('/dashboard', UserAuth, userDashboardController);
router.get('/gettoken', userRefreshTokenController);
router.post('/login', userLoginController);
router.patch('/logout', UserAuth, userLogout);

module.exports = router;