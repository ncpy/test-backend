const router = require("express").Router()
const Product = require("../models/Product")

const fs = require('fs')
const axios = require('axios');
const path = require('path');

const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

router.get("/test", (req,res) => {
    res.send("product works")
    res.json({ message: "Hello from server!" });
})


//
const multer  = require('multer')
const sharp = require("sharp");


//PHOTO CREATE to server
let foto_url = ""
let foto_name = ""
router.post("/foto/:id", async(req,res) => { ///foto/:id
    var date_id = req.params.id

    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './uploads'); //TODO kişiye özgü/id sine özgü dosya oluşturulabilir.
		},
		filename : function(req, file, callback) { //TODO kaydedilen foto özel ad
            console.log("sonunda ", file)

            var temp_file_arr = file.originalname.split(".");
			var temp_file_name = temp_file_arr[0];
			var temp_file_extension = temp_file_arr[1];
			callback(null, temp_file_name + '-' + date_id + '.' + temp_file_extension);
			//callback(null, file.originalname );
		}
	});
    
    var upload = multer({storage: storage}).single('sample_image');
    
    upload(req, res, async function(error){
        if(error){
            //console.log("hataa",error)
			return res.end('Error Uploading File');
		}else {
            foto_url = req.file?.path
            foto_name = req.file?.filename
            console.log("dosya konumu",foto_url)
            console.log("dosya foto_name",foto_name)

            var temp_file_arr = req.file?.filename.split(".");
			var temp_file_name = temp_file_arr[0];
			var temp_file_extension = temp_file_arr[1];

            try {
                await sharp(req.file.path)
                        .resize({ width:200, /* height:150 */ })
                        .toFile("./uploads/" + temp_file_name + "-200x" + '.' + temp_file_extension) //TODO width ne ise dosya adını da ona göre düzenle.. d,ğer yerlerde de
                console.log("image resized")
            } catch (error) {
                console.log("image ",error)
            }

			//req.flash('success', req.file.filename);
			//res.redirect("/fileupload");
            //res.send({"success": req.file})
            res.send('<h1>File ' + req.file?.filename + ' successfully uploaded</h1>'); //TODO aslında buradan frontende dosya ismini göndrebilirsek, bunu yukarıdaki fonks. da olduğu gibi tarih ile birlikte unique hale getirebiliriz.
		}
	});

})

router.get("/uploads/:id", async(req,res) => {
    var filename = req.params.id

    //console.log("buradadada", req.params)
    //console.log("buradadada", foto_name)

    await Product.find({ filename }).then(result => {
    //await Product.find({ "icerik_adi" : "çay" }).then(result => {
        console.log("başarım ")
        //res.send(result)
        res.sendFile(`./uploads/${filename}`, { root: "./" }) //TODO kişiye özgü/id sine özgü dosya oluşturulabilir.

    }).catch(err => {
        console.log("hata: ",err)
        return res.send(err)
    })

})

//foto sil
//router.post("/foto_rm", async(req,res) => {
router.post("/foto_rm", async(req,res) => { //TODO gereksiz foto olmaması için iyi çalışması gerekir
    fs.unlink(`./uploads/${req.body.delete_file}`, err => {
        console.log("dosya silindi")

        if(err && err.code == 'ENOENT')
            // file doens't exist
            console.info("Dosya yok, yani kaldırılamıyor.");
        else if (err)// other errors, e.g. maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
        else
            console.info(`removed`);
    })
    res.end(`complete`)
})

//foto download denemeleri, ve buna gerek kalmadı :)
router.post("/download", async(req,res) => {
    const { name, myurl } = req.body

    async function downloadImage(url, filepath)  {
        await axios({
            url,
            //method: "GET",
            responseType: "stream",
            headers: {"content-type":"application/octet-stream"}
        }).then(
            response => 
                new Promise((resolve,reject) => {
                response.data.pipe(fs.createWriteStream(filepath))
                    .on("error", reject)
                    .once("close", () => resolve(filepath))
                })
        )
    }
    
    const filePath = path.join(__dirname, '/mypictures');
    console.log("filepathh:", filePath)

    //downloadImage(myurl, `./downl/${name}` )
    downloadImage(myurl, `${__dirname}/${name}` )

    return res.send("yaptı oldu")
})


//CREATE PRODUCT
router.post("/", async (req,res) => {
    console.log("req.body ",req.body)
    //console.log("req.body.içerik adı ",req.body.icerik_adi)
    console.log("req.body tarih",req.body.paylasim_tarihi)
    //const newProduct = new Product(req.body)
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    } catch (err) {
        console.log("error: ",err)
        res.status(500).json(err)
    }
})

//GET ALL PRODUCTS
router.get("/", async (req,res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})

//GET USER-BASED PRODUCTS
router.get("/:id", async(req,res) => { //TODO product/user/:id olsa daha iyi olur
    console.log("get product by id user_id")
    try {
        const product = await Product.find({ "user_uid": req.params.id })
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)        
    }    
})

//UPDATE PRODUCT with their _id
router.put("/update/:id", async(req,res) => {
    try {
        //const updatedProduct = await Product.findOneAndUpdate(req.params.id,
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true }
        )
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
    console.log("get product by id")
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch(err){
        res.status(500).json(err)
        console.log(err)
    }
})

router.delete("/delete/:id", async(req, res) => {
    console.log("ürün silindi")
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted..")
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router