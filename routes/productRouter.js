const express = require('express')
const router = express.Router()
const upload = require('../config/multer-config')
const productModel = require('../models/product-model')

router.post('/create',upload.single("image"),async (req,res)=>{
    try {
    let  {name,price,discount,bgcolor,panelcolor,textcolor} = req.body

    let product = await productModel.create({
        image: req.file.buffer,
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor,
    })

    if (user) {
        res.status(200).json({ message: 'User image updated successfully', user });
    } else {
        res.status(404).json({ message: 'Something went wrong' });
    }
    } catch (err) {
        req.flash('error', "Something went wrong!");
        res.redirect('/owners/admin');
    }
})

router.get('/owners/admin', (req, res) => {  
    res.render('createproducts');
});


module.exports = router;
