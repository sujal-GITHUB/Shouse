const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')
const path = require('path')
const db = require('./config/mongoose-connection')
const ownerRouter = require('./routes/ownerRouter')
const productRouter = require('./routes/productRouter')
const userRouter = require('./routes/userRouter')
const index = require('./routes/index')
const expressSession = require('express-session')
const flash = require('connect-flash')
require('dotenv').config();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
}))
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine','ejs')

app.use('/',index)
app.use('/owners',ownerRouter)
app.use('/users',userRouter)
app.use('/products',productRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});