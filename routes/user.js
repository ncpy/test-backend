const router = require("express").Router()
const User = require("../models/User");

router.get("/test", (req,res) => {
    res.send("product works")
    res.json({ message: "Hello from server!" });
})

//kayıt ol
router.post("/signup", async(req,res) => {
    // email alınmış mı //TODO bunun işlevselliği için Register.js de 
    const userN = await User.findOne({ name: req.body.name })
    if(userN) {
        console.log("Kullanıcı adı alınmış")
        //return res.status(401).send("Kullanıcı adı alınmış")
        return res.status(401).json({mesaj: "Kullanıcı adı alınmış"})
    }

    const user_id = await User.findOne({ uid: req.body.uid })
    if(user_id) {
        console.log("Bu kullanıcı zaten var")
        return res.status(401).send("Bu kullanıcı zaten var")
    }

    try {
        const newUser = new User(req.body).save()
        return res.status(200).json(newUser)
    } catch (error) {
        console.log(error)
    }

})

//tüm kullanıcıları getir
router.get("/alluser", async(req,res) => {
    try {
        const users = await User.find()
        console.log(users)
        res.status(200).json(users)
    } catch (error) { }
})

//login / giriş
router.post("/login", async(req,res) => {
    const user = await User.findOne({ uid: req.body.uid })
    if(!user) {
        console.log("Geçersiz Giriş..")
        return res.status(401).send("Geçersiz Giriş")
    }
    console.log("Login yaptınız: ", user)
    res.status(200).json(user)
})

//logout
router.post("/logout", async(req,res) => {
    console.log("Logged OUT")
    res.status(200).json("LOGGED OUT")
})


/*// ürün oluşturma çabaları.. kullanıcı ve ürünleri tek çatı altında göstermek için..
router.post("/", async (req,res) => {
    console.log("req,bodyyy", req.body.uid)
    console.log("req,bodyyy p", req.body.products)
    ///const user = await User.findOneAndUpdate({ uid: req.body.uid }, { $set: { products: req.body.products } }, { new: true })
    //const user = await User.updateMany({ uid: req.body.uid }, { $set: { products2: req.body.products } }, { multi:true, upsert: false })
    const user = await User.findOneAndUpdate({ uid: req.body.uid }, (err, doc)=> {
        if(err)
            return done(err)
        console.log("findoenene")
        
        doc.products.push(req.body.products)
        doc.save(done)
    })
    //const user = await User.findOne({ uid: req.body.uid })
    if(user){
        console.log("prod ürün kaydedildi")
        res.status(200).json(user)
    }
    else {
        console.log("prod kullanıcı bulunamadı")
    }
})*/




module.exports = router