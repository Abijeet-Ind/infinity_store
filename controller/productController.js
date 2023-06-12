const productModel = require('../model/productModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllProduct = catchAsync(async (req, res, next) => {
    var productFind;
    if(!req.query.search){
        productFind = await productModel.find();
    } else{
        const searchItem = req.query.search;
        productFind = await productModel.find({
            tags: searchItem
        });
    }

    res.status(200).json({
        status: 'success',
        count: productFind.length,
        productFind
    })
})

// PRICE FILTER
exports.priceFiler = catchAsync(async (req, res, next) => {
    // LINK WITH AXIOS AND AFTER CONNECTING IMMEDIATELY REMOVE THE LINK BY REMOVING THE PARAMETERS 
    const low = req.params.min * 1;
    const high = req.params.max * 1;
    const sort = req.params.sort * 1;

    const productFind = await productModel.aggregate([{
        $match: {
            price: {
                $gte: low,
                $lte: high
            },
        },
    }, {
        $sort: {
            price: sort
        }
    }])

    res.status(200).json({
        status: 'success',
        count: productFind.length,
        productFind
    })
})

exports.getOne = catchAsync(async (req, res, next) => {
    console.log(req.params.slug)
    const productFind = await productModel.find({
        slug: req.params.slug
    });

    res.status(200).json({
        status: 'sucess',
        productFind
    })
})

exports.addProduct = catchAsync(async (req, res, next) => {
    const createProduct = await productModel.create({
        product: req.body.product,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        secondary_image: req.body.secondary_image
    });

    res.status(200).json({
        status: 'success',
        createProduct
    })
})

exports.updateProduct = catchAsync(async (req, res, next) => {
    
    const updateProdct = await productModel.create();

    res.status(200).json({
        status: 'success',
        updateProdct
    })
})

exports.updateProduct = catchAsync(async (req, res, next) => {
    // LETS UPDATE THE USER BY ADDING THE USERID TO THE LOCAL STORAGE
    /*
        1. EXTRACT THE USER INFORMATION FORM PROTECT MIDDLEWARE
        2. INSERT ASK THE USER EMAIL WHILE UPLOADING DATA
        3. COMPARE THE USER EMIAL
        4. IF IT'S SAME THEN ALLOW 
    */

    res.status(200).json({
        status: 'success'
    })
})