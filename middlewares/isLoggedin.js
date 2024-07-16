const jwt = require('jsonwebtoken')
const userModel = require('../models/user-model')
const cookieParser = require('cookie-parser')

module.exports = async (req,res,next)=>{
    if(!req.cookies.token){
        req.flash('Error, You need to login first!')
        return res.redirect('/')
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
        let user = await userModel
        .findOne({email: decoded.email})
        .select("-password")

        if (!user) {
            req.flash('Error', 'User not found!');
            return res.redirect('/');
        }

        req.user = user
        next()

    } catch (err) {
        req.flash('Error, Something went wrong!')
        return res.redirect('/')
    }
}