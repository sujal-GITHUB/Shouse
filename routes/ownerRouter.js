const express = require('express')
const router = express.Router()
const ownerModel = require('../models/owner-model')

    router.post('/create',async (req,res)=>{
        try {
            let {email, password} = req.body

            let owner = await ownerModel.findOne({email: email})
            if(!owner){
            req.flash('error','Something went wrong!')
            return res.redirect('/owners');}

            else if(password === owner.password){
            req.flash('success','You are logged in')
            res.status(200).redirect('/owners/create')}

            else{
            req.flash('error','Something went wrong!')
            return res.status(401).redirect('/owners');}
        } catch (error) {
            req.flash('error','Something went wrong!')
            return res.status(401).redirect('/owners');
        }
    })

router.get('/',(req,res)=>{
    res.render('owner-login')
})


router.get('/create',(req,res)=>{
    try {
        let success = req.flash("success")
        let error = req.flash("error")
        res.render('createproducts',{success,error})
    } catch (err) {
        return res.status(401).redirect('/owners');
    }
})

module.exports = router;