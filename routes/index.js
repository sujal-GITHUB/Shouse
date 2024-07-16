const express = require('express')
const router = express.Router()
const userModel = require('../models/user-model')
const isLoggedin = require('../middlewares/isLoggedin')
const productModel = require('../models/product-model')
const ownerModel = require('../models/owner-model')
const upload = require('../config/multer-config')

router.get('/',(req,res)=>{
    let error = req.flash('error')
    res.render('index',{error, loggedin: false})
})

router.get('/shop',isLoggedin,async (req,res)=>{
    let products = await productModel.find() 
    let success = req.flash('success')
    let error = req.flash('error')
    res.render('shop',{products,success,error})
})

router.get('/owners',async (req,res)=>{
    let owner = await ownerModel.find() 
    let success = req.flash('success')
    let error = req.flash('error')
    res.render('owner-login',{success,error,owner})
})

router.get('/cart',isLoggedin,async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email}).populate('cart')
    let bill = 0;
    let tdiscount = 0;
    let amount = 0;
    user.cart.forEach(product => {
        const itemPrice = Number(product.price);
        const itemDiscount = Number(product.discount || 0); 
        
        let discount = (itemDiscount * itemPrice / 100)
        const totalForProduct = itemPrice - discount;
    
        bill += totalForProduct;
        tdiscount += discount
        amount += itemPrice;
    });
    if(bill>0){
        bill += 20;
    }

    const objectIdCounts = countObjectIdOccurrences(user.cart)
    res.render('cart',{user, bill, tdiscount, amount, objectIdCounts})
    }) 

    function countObjectIdOccurrences(obj) {
        const countMap = {};
    
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            const stringKey = value._id;
    
            countMap[stringKey] = (countMap[stringKey] || 0) + 1;
        });
    
        return countMap;
    }

    router.get('/addtocart/:productid',isLoggedin,async (req,res)=>{
        let user = await userModel.findOne({email: req.user.email})
        user.cart.push(req.params.productid)
        await user.save()
        req.flash('success',"Added to cart")
        res.redirect('/shop')
    })

    router.get('/delete/:productid',isLoggedin,async (req,res)=>{
        let user = await userModel.findOne({email: req.user.email})
        let index = user.cart.indexOf(req.params.productid);
        if (index !== -1) {
            user.cart.splice(index, 1);
        }

        await user.save()
        res.redirect('/cart')
    })


    router.get('/add/:productid',isLoggedin,async (req,res)=>{
        let user = await userModel.findOne({email: req.user.email})
        user.cart.push(req.params.productid)
        await user.save()
        res.redirect('/cart')
    })

    router.get('/admin',isLoggedin,async (req,res)=>{
        let user = await userModel.findOne({email: req.user.email}) 
        let success = req.flash('success')
        let error = req.flash('error')
        res.render('admin',{success,error,user})
    })

    router.post('/admin/uploadimage',isLoggedin,upload.single('image'),async (req,res)=>{
        try {
            let user = await userModel.findOneAndUpdate(
                { email: req.user.email },
                { $set: { image: req.file.buffer } },
            );
            req.flash('success','Image updated successfully')
            return res.status(200).redirect('/admin');
        } catch (error) {
            req.flash('error','Something went wrong')
            return res.status(501).redirect('/admin');
        }
    })

module.exports = router;