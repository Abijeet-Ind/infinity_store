const mongoose = require('mongoose');
const { promisify } = require('util');

const productSchema = mongoose.Schema({
    product: {
        type: String,
        require: ['true', 'A PRODUCT MUST HAVE A NAME'],
    },
    description: {
        type: String,
        require: [true, 'A PRODUCT MUST HAVE TOUR DESCRIPTION']
    },
    price: {
        type: Number,
        require: [true, 'A PRODUCT MUST HAVE A PRICE']
    },
    image: {
        type: String,
        require: [true, 'A PRODUCT MUST HAVE AN IMAGE']
    },
    secondary_image: {
        type: [String],
        require: [true, 'A PRODUCT MUST HAVE AN IMAGE']
    },
    slug: String,
    tags: {
        type: [String],
        require: [true, 'THIS HELPS TO INDEX YOUR SEARCH RESULT']
    },
    common: {
        type: String,
        require: [true, 'ENTER COMMON WORD SO WE COULD RANK YOUR PRODUCT IN SEARCH RESULT']
    },
    productUploader: String,
})

productSchema.pre('save', function (next) {
    this.slug = this.product.replaceAll(' ', '-').toLowerCase();
    next();
})

productSchema.pre('save', function (next) {
    this.tags.forEach((el, i) => {
        this.tags[i] = el.toLowerCase();
    });
    next();
})



const product = new mongoose.model('product', productSchema);
module.exports = product;