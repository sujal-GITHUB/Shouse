const userModel = require('../models/user-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {generateToken} = require('../utils/generateToken')

module.exports.registerUser = async (req,res)=>{
    try{
        let {email,password,fullname,contact} = req.body

        let user = await userModel.findOne({email: email})
        if(user) {
            req.flash('error','You already have a account, Please login!')
            return res.status(401).redirect('/')}

        bcrypt.genSalt(10, (err,salt)=>{
            if (err) {
                req.flash('error', 'Soemthing went wrong!');
                return res.status(500).redirect('/');
            }

            bcrypt.hash(password, salt,async (err,hash)=>{
                if(err)
                    {req.flash('error', 'Something went wrong!');
                    return res.status(500).redirect('/')}
                else
                {
                    let user = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                        contact,
                    })
                    
                    let token = generateToken(user)
                    res.cookie('token',token)
                    return res.status(201).redirect('/shop');
                }
            })
        })
    }
    catch(err){
        req.flash('error', err.message);
        return res.status(500).redirect('/');
    }
}


module.exports.loginUser = async (req,res)=>{
    let {email, password} = req.body;

    try {
    let user = await userModel.findOne({email: email})
    if(!user)
        {req.flash('error','Email or Password incorrect!')
        return res.status(401).redirect('/');}
    
    bcrypt.compare(password, user.password, (err, result)=>{
        if(result){
            let token = generateToken(user)
            res.cookie('token', token)
            req.flash('success','You are logged in')
            return res.redirect('/shop');
        }
        else{
            req.flash('error','Email or Password incorrect!')
            return res.status(401).redirect('/');
        }
    })
    } catch (err) {
        req.flash('error', 'An error occurred during login');
        return res.status(500).redirect('/');
    }
}

module.exports.logout = (req,res) => {
    res.cookie('token', "", { expires: new Date(0) });
    req.flash('error', 'Logged out successfully');
    return res.redirect('/');
}