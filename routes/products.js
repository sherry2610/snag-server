var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var crypto = require("crypto")

const authenticate = require('../authenticate');
var User = require('../models/user');
var passport = require('passport');
const Product = require('../models/product');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/products');
    },
    filename: (req, file, cb) => {
        const code = crypto.randomBytes(4).toString('hex');
        cb(null, `img_${code}.${file.originalname.split('.')[1]}`);
    }
});

const imageFileFilter = (req, file, cb) => {
    console.log(file)
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|bmp)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});



router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    var products = await Product.find({});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, products: products});
});

router.get('/add', async(req, res, next) => {
    var html = fs.readFileSync('./html/add_products.html', 'utf8')
    res.statusCode = 200;
    res.send(html);
})

router.post('/add-product', upload.single('imageFile'), (req, res, next) => {
    console.log(req.file);
    var a = req.file.path.split('public/')[1];
    var final = [];
    if (req.body.Snacks === "true"){
        final.push("Snacks");
    }
    if (req.body.Drink === "true"){
        final.push("Drink");
    }
    if (req.body.New === "true"){
        final.push("New");
    }
    if (req.body.TopSeller === "true"){
        final.push("TopSeller");
    }
    if (req.body.Food === "true"){
        final.push("Food");
    }
    if (req.body.Candy === "true"){
        final.push("Candy");
    }
    if (req.body.Nicotine === "true"){
        final.push("Nicotine");
    }
    Product.create({name: req.body.name, description: req.body.desc, image: a, price: req.body.price, category: final})
    .then(product => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, product: product});
    });
})

router.get('/category/:cat', async (req, res, next) => {
    var products = await Product.find({category: req.params.cat});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, products: products});
})

module.exports = router;
