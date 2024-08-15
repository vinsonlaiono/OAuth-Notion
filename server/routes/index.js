const router = require('express').Router();
//importing middleware
const {ensureAuth, ensureGuest} = require('../../middleware/auth');

router.get('/', ensureGuest, (req, res) => {
    res.render('login');
});

router.get('/log', ensureAuth, async (req, res) => {
    res.render('index', {userinfo: req.user});
});


router.get('/', (req, res) => {
    res.render('index')
})
module.exports = router;