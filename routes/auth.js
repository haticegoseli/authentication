const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcrypt');

router.get('/register',  (req, res) => {
    res.send(req.body);
})

// /api/user/register olunca çalışacak
router.post('/register', async (req,res) => {

    //LETS VALIDATE THE DATA BEFORE WE MAKE A USER
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    //Checking if the user is already in th db
    const emailExist = await User.findOne({email : req.body.email});
    if(emailExist) return res.status(400).send("Email already exist!");

    //Hash passwords
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // We create a new user
    const user = await new User({
       name : req.body.name,
       email : req.body.email,
       password : hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user : user._id});
    }catch (err){
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {

    //LETS VALIDATE THE DATA BEFORE WE MAKE A USER
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    //Checking if the user is already in th db
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send("Email is not found!!");

    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password!')

    //CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({_id : user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});

module.exports = router;