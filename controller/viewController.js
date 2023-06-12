const catchAsync = require('../utils/catchAsync');
const productModel = require('./../model/productModel');

exports.home = catchAsync(async (req, res) => {
    const products = await productModel.find().limit(5);
    console.log(products.length)
    res.status(200).render('overview', {
        products
    })
})

exports.login = catchAsync(async (req, res) => {
    res.status(200).render('login')
})

exports.signup = catchAsync(async (req, res) => {
    res.status(200).render('signup')
})

exports.getOne = catchAsync(async (req, res) => { 
    let queryParameter = req.params;
    console.log(req.params)
    let holder;
    let alternative
    const queryProduct = await productModel.findOne(req.params);
    // console.log(q)
    // console.log(queryProduct.common)

    if(req.params){

         alternative = await productModel.find({
            common: queryProduct.common
        })
        
        console.log(alternative)
        
        alternative.forEach((el, i) => {
            if (el.product === queryProduct.product) {
                alternative.splice(i, 1);
            }else{
                console.log(el)
                // holder.push[el]
            }
        });
        // console.log('ALT',alternative);
    }

    res.status(200).render('product', {
        queryProduct, alternative
    })
})

