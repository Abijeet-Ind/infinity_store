const express = require('express');
const app = express();
const path = require('path')
const morgan = require('morgan');
const cookieParser = require('cookie-parser')

const userRouter = require('./router/userRotuer');
const productRouter = require('./router/productRouter');
const viewRouter = require('./router/viewsRouter');

app.use(morgan('dev')); // this shows which route is been hitted

app.set('view engine', 'pug'); // defining to use pug as static engine
app.set('views', path.join(__dirname, 'views')); // defining where the views file is been located
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({
    limit: '10kb'
}));
app.use(express.urlencoded({
    extended: true,
    limit: '10kb'
}))

app.use(cookieParser()); // ALLOWS COOKIES TO SEND FROM BACKEND TO BROWSER
app.use((req, res, next) => {
    console.log('COOKIES', req.cookies);
    next();
})

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter); // defining the router
app.use('/api/v1/product', productRouter);

app.use('*', (req, res, next) => {
    res.status(400).json({
        status: 'ERROR ON ROUTER',
        message: `cannot find the url ${req.originalUrl}`
    })
})

module.exports = app;