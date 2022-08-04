

//express tools and configuring
let express = require("express")
let app = express()
let cors = require("cors") /////to remove later
const multer  = require("multer") 
let bodyParser = require('body-parser')
let cookieParser = require("cookie-parser")
let mongodb = require("mongodb").MongoClient  ///mongodb atlas
let { ObjectID } = require("bson") 
let fs = require("fs")

app.use(cookieParser())
app.use(cors())    /////to remove 
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
require("dotenv").config()


let cloudinary = require("cloudinary")
const { Console } = require("console")

cloudinary.config({ 
    cloud_name: process.env.CL_NAME, 
    api_key: process.env.CL_API_KEY, 
    api_secret: process.env.CL_SECRET,
    // secure: true 
});

////////// pages to send
app.use(express.static("./public-imgs"))
app.use("/", express.static("./home"))

/////////auth admin

// app.use("/admin",(req, res, next)=>{
//     if(req.cookies.tModeAuth){
//         ////send the full page
//         console.log(req.cookies.token)
//         if(req.cookies.tModeAuth == process.env.MODEAUTH){
//             console.log("will send the full page")
//             next()
//         }else{
            
//         }
//     }else{
//         ////send the cred making 
//         res.send(`    <input type="text" name="" id="em" placeholder="em">
//         <button onclick="fetch('/checkmode', {
//             method:'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 em: document.querySelector('#em').value,
//             })
//         })
//     ">send</button>
//     `)
//     }
// }, express.static("./mode"))


// app.post("/checkmode", (req, res)=>{
//     console.log("check mode .......",req.body)
//     /////check if true auth to give a set the cookie
//     if(req.body.em == process.env.MODEAUTH){
//         res.cookie("tModeAuth", process.env.MODEAUTH);
//         // res.redirect("/mode") ///make a reload instead
//         res.redirect(req.get("/admin"))
//     }else{
//         res.sendStatus(400)
//     }
// })

///////////////non auth admin
app.use("/admin", express.static("./mode"))


//////multer; middleware to reset the imgs container 
////make it valid for both finished and unfinished; condition the filedname
let beforeImgs = []
let afterImgs = []

let newBImgs= []
let newAImgs = []

// let newPath
let basicStoringPlan = multer.diskStorage({
    destination: "./public-imgs",
    // destination: async (req, file, cb)=>{
    //     console.log(file)
    //     cloudinary.uploader.upload(file, result =>{
    //         console.log(result)
    //     })
    //     cb(null, "./public-imgs")
    // },


    filename: async (req, file, cb)=>{
        console.log(file)

        if(file.fieldname == "bImgs"){
            let path = await new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
            beforeImgs.push(path)

            // let newPath = "./public-imgs" + path
            // cloudinary.uploader.upload("./public-imgs" + path, result =>console.log(result))

            cb(null, path)
        }
        if(file.fieldname == "aImgs"){
            let path = await new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
            afterImgs.push(path)
            cb(null, path)
        }
    }
})
const fileFilter = (req, file, cb)=>{
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true)
    }else{
        cb({message: "not valid file type"}, false)
    }
}
let multerBasic = multer({
    storage: basicStoringPlan, 
    limits: {fileSize: 1024 * 1024}, 
    fileFilter: fileFilter
})



////getting map api key; 

app.get("/map-api-key", (req, res)=>{
    res.send({apiKey: process.env.MAPAPIKEY})
})


///////plan; 
///geting  
app.get("/con-finished", async (req, res)=>{
    console.log("............get con-finished.........")
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    let dbb = client.db()
    let result = await dbb.collection("con-finished").find({}).toArray()
    res.send(result)
    })
})

app.get("/con-unfinished", async (req, res)=>{
    console.log("............get con-unfinished..........")
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    let dbb = client.db()
    let result = await dbb.collection("con-unfinished").find({}).toArray()
    res.send(result)
    })
})

app.get("/uncon-finished",(req, res)=>{
    ///check if valid token 
    // if(req.cookies.modeAuth == process.env.MODEAUTH){
        mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
            let dbb = client.db()
            let result = await dbb.collection("uncon-finished").find().toArray()
            res.send(result)
        })
    // }else{
        // res.sendStatus(401)
    // }
})

app.get("/uncon-unfinished",(req, res)=>{
        // if(req.cookies.modeAuth == process.env.MODEAUTH){
            mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
                let dbb = client.db()
                let result = await dbb.collection("uncon-unfinished").find().toArray()
                res.send(result)
            })
        // }else{
            // res.sendStatus(401)
        // }
})

app.get("/make-finished", (req, res)=>{
    // if(req.cookies.modeAuth == process.env.MODEAUTH){
        mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
            let dbb = client.db()
            let result = await dbb.collection("finishing").find().toArray()
            res.send(result)
        })
    // }else{
        // res.sendStatus(401)
    // }
})


/////post; home (uncon)

app.post("/uncon-finished", (req, res, next)=>{beforeImgs= []; afterImgs = []; next()},multerBasic.any(), async (req, res)=>{

    console.log(req.body)
    console.log(beforeImgs)
    console.log(afterImgs)

        ///////cloudinary
        newBImgs= []
        newAImgs = []
    
        if(beforeImgs[0]){
            for await(let e of beforeImgs) {
                await cloudinary.uploader.upload("./public-imgs/" + e, result=>newBImgs.push(result.secure_url))
            }    
        }
    
        if(afterImgs[0]){
            for await(let e of afterImgs) {
                await cloudinary.uploader.upload("./public-imgs/" + e, result=>newAImgs.push(result.secure_url))
            }    
        }
    
        beforeImgs = newBImgs
        afterImgs = newAImgs
    
    

    ////if mode save it in con; else in uncon 
        if(typeof beforeImgs[0] == "string" &&typeof afterImgs[0] == "string" ){
            console.log("valid data")

            mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
                let dbb = client.db()
                await dbb.collection("uncon-finished").insertOne({
                    coords: req.body.coords.split(","),
                    bName: [], 
                    beforeImgs: beforeImgs,
                    afterImgs: afterImgs, 
                    aNames: req.body.names.split(","),
                    moreDetails: req.body.moreDetails,
                    dateOfPlanting: req.body.dateOfPlanting,
                })
                })
            res.sendStatus(200)
        }else{
            res.sendStatus(400)
        }
})

app.post("/uncon-unfinished", (req, res, next)=>{beforeImgs= []; afterImgs = []; next()}, multerBasic.any(), async (req, res)=>{
    console.log(req.body)

        ///////cloudinary
        newBImgs= []
        newAImgs = []
    
        if(beforeImgs[0]){
            for await(let e of beforeImgs) {
                await cloudinary.uploader.upload("./public-imgs/" + e, result=>newBImgs.push(result.secure_url))
            }    
        }
    
        if(afterImgs[0]){
            for await(let e of afterImgs) {
                await cloudinary.uploader.upload("./public-imgs/" + e, result=>newAImgs.push(result.secure_url))
            }    
        }
    
        beforeImgs = newBImgs
        afterImgs = newAImgs
    
    

    ////if mode save it in con; else in uncon 
        if(typeof beforeImgs[0] == "string"){
            console.log("valid data")

            mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
                let dbb = client.db()
                await dbb.collection("uncon-unfinished").insertOne({
                    coords: req.body.coords.split(","),
                    bName: req.body.names, 
                    beforeImgs: beforeImgs,
                    afterImgs: afterImgs, 
                    aNames: []
                })
                })
            res.sendStatus(200)
        }else{
            res.sendStatus(400)
        }
})


/////post; mode (con)

app.post("/con-unfinished", (req, res, next)=>{beforeImgs= []; afterImgs = []; next()}, multerBasic.array("bImgs"), async (req, res)=>{
    console.log(req.body)

    ///////cloudinary
    newBImgs= []
    newAImgs = []

    if(beforeImgs[0]){
        for await(let e of beforeImgs) {
            await cloudinary.uploader.upload("./public-imgs/" + e, result=>newBImgs.push(result.secure_url))
        }    
    }

    if(afterImgs[0]){
        for await(let e of afterImgs) {
            await cloudinary.uploader.upload("./public-imgs/" + e, result=>newAImgs.push(result.secure_url))
        }    
    }

    beforeImgs = newBImgs
    afterImgs = newAImgs


    ////if mode save it in con; else in uncon 
    // if(req.cookies.modeAuth == process.env.MODEAUTH){
        if(typeof beforeImgs[0] == "string"){
            console.log("valid data of the con unfinished...")


            mongodb.connect(process.env.MONGOKEY, async (err, client)=>{


                        let dbb = client.db()
                        dbb.collection("con-unfinished").insertOne({
                            coords: req.body.coords.split(","),
                            bName: req.body.names, 
                            beforeImgs: beforeImgs,
                            afterImgs: afterImgs, 
                            aNames: [], 
                            next: false
                        })
                })
            res.sendStatus(200)
        }else{
            res.sendStatus(400)
        }
    // }else{
        // res.sendStatus(401)
    // }
})

app.post("/con-finished", (req, res, next)=>{beforeImgs= []; afterImgs = []; next()},multerBasic.any(), async (req, res)=>{
    console.log(req.body)
    console.log(beforeImgs)
    console.log(afterImgs)

    ////////cloudinary
        ///////cloudinary
        newBImgs= []
        newAImgs = []
    
        if(beforeImgs[0]){
            for await(let e of beforeImgs) {
                await cloudinary.uploader.upload("./public-imgs/" + e, result=>newBImgs.push(result.secure_url))
            }    
        }
    
        if(afterImgs[0]){
            for await(let e of afterImgs) {
                await cloudinary.uploader.upload("./public-imgs/" + e, result=>newAImgs.push(result.secure_url))
            }    
        }
    
        beforeImgs = newBImgs
        afterImgs = newAImgs
    

    ////if mode save it in con; else in uncon 
    // if(req.cookies.modeAuth == process.env.MODEAUTH){
        if(typeof beforeImgs[0] == "string" &&typeof afterImgs[0] == "string" ){
            console.log("valid data")

            mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
                let dbb = client.db()
                await dbb.collection("con-finished").insertOne({
                    coords: req.body.coords.split(","),
                    bName: [], 
                    beforeImgs: newBImgs,
                    afterImgs: newAImgs, 
                    moreDetails: req.body.moreDetails,
                    dateOfPlanting: req.body.dateOfPlanting,
                    aNames: req.body.names.split(",")
                })
                })
            res.sendStatus(200)
        }else{
            res.sendStatus(400)
        }
    // }else{
        // res.sendStatus(401)
    // }
})




///mode; confirm and delete; finish and definish 

app.post("/send-mode", async (req, res)=>{
    console.log("...........send mode.............")
    console.log(req.body)
    console.log(typeof req.body.toDelete)
    // if(req.cookies.modeAuth == process.env.MODEAUTH){



    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()

        req.body.toDelete.forEach(async e=>{
            if(await dbb.collection("finishing").findOne({_id: ObjectID(e)})){
                let deFinish = await dbb.collection("finishing").findOne({_id: ObjectID(e)})

                await dbb.collection("con-unfinished").insertOne({
                    coords: deFinish.coords,
                    bName: deFinish.bName, 
                    beforeImgs: deFinish.beforeImgs,
                    afterImgs: [], 
                    moreDetails: "",
                    dateOfPlanting: "",
                    aNames: []
                })

                deFinish.afterImgs.forEach(ee=>{
                    try{
                        fs.unlinkSync("./public-imgs/"+ e)
                    }catch (err){
                        console.log("in catch; "+err)
                    }
                })
                await dbb.collection("finishing").findOneAndDelete({_id: ObjectID(e)})
                res.sendStatus(200)

            }
            let todel 

            if(await dbb.collection("uncon-unfinished").findOne({_id: ObjectID(e)})){
                todel = "uncon-unfinished"
            }else if(await dbb.collection("uncon-finished").findOne({_id: ObjectID(e)})){
                todel = "uncon-finished"
            }else if(await dbb.collection("con-unfinished").findOne({_id: ObjectID(e)})){
                todel = "con-unfinished"
            }else if(await dbb.collection("con-finished").findOne({_id: ObjectID(e)})){
                todel = "con-finished"
            }

            //////////remove the img from the server storage
            let result = await dbb.collection(todel).findOne({_id: ObjectID(e)})
            result.beforeImgs.forEach(e=>{
                console.log("the imgs to be deleted from server store; "+ e)
                try{
                    fs.unlinkSync("./public-imgs/"+ e)
                    console.log("in fs")
                }catch (err){
                    console.log("in catch; "+err)
                }
            })
            if(result.afterImgs[0]){
                result.afterImgs.forEach(e=>{
                    try{
                        fs.unlinkSync(e)
                        console.log("in fs")
                    }catch (err){
                        console.log("in catch; "+err)
                    }
                })
            }

            console.log("send mode route; " + todel + result)
            await dbb.collection(todel).findOneAndDelete({_id: ObjectID(e)})

        })


        /////to confirm 
                    /////inserting image to cloudinary; 

        newBImgs = []
        newAImgs = []

                function changeBImgsUrl(beforeImgs){
                    if(beforeImgs[0]){
                        console.log("will console log the before imgs elements")
                        beforeImgs.forEach(i=>{
                            console.log(i)
                            cloudinary.uploader.upload("./public-imgs/" + i, {folder: "home/treeing"}, result =>{
                                console.log(result)
                                newBImgs.push(result.secure_url)
                            })
                        })
                    }
                }

                function changeAImgsUrl(afterImgs){
                    if(afterImgs[0]){
                        console.log("will console log the before imgs elements")
                        afterImgs.forEach(i=>{
                            console.log(i)
                            cloudinary.uploader.upload("./public-imgs/" + i, {folder: "home/treeing"}, result =>{
                                console.log(result)
                                newBImgs.push(result.secure_url)
                            })
                        })
                    }
                }



        req.body.toConfirm.forEach(async e =>{

            // newBImgs = []
            // newAImgs = []

            if(await dbb.collection("uncon-unfinished").findOne({_id: ObjectID(e)})){
                console.log("found in uncon-unfinished")
                let toCon = await dbb.collection("uncon-unfinished").findOne({_id: ObjectID(e)})

////////cloudniary image storing implementing; 
                // changeBImgsUrl(toCon.beforeImgs)
                // toCon.beforeImgs = newBImgs

                
    ///////cloudinary
    newBImgs= []
    // newAImgs = []

    if(toCon.beforeImgs[0]){
        for await(let e of toCon.beforeImgs) {
            await cloudinary.uploader.upload("./public-imgs/" + e, result=>newBImgs.push(result.secure_url))
        }    
    }

    // if(afterImgs[0]){
    //     for await(let e of afterImgs) {
    //         await cloudinary.uploader.upload("./public-imgs/" + e, result=>newAImgs.push(result.secure_url))
    //     }    
    // }

    toCon.beforeImgs = newBImgs
    // afterImgs = newAImgs



                await dbb.collection("con-unfinished").insertOne(toCon)
                await dbb.collection("uncon-unfinished").findOneAndDelete({_id: ObjectID(e)})
            }else if(await dbb.collection("uncon-finished").findOne({_id: ObjectID(e)})){
                console.log("found in uncon-finished")
                let toCon = await dbb.collection("uncon-finished").findOne({_id: ObjectID(e)})

                // changeAImgsUrl(toCon.afterImgs)
                // changeBImgsUrl(toCon.beforeImgs)
                // toCon.beforeImgs = newBImgs
                // toCon.afterImgs = newAImgs

                
    ///////cloudinary
    newBImgs= []
    newAImgs = []

    if(toCon.beforeImgs[0]){
        for await(let e of toCon.beforeImgs) {
            await cloudinary.uploader.upload("./public-imgs/" + e, result=>newBImgs.push(result.secure_url))
        }    
    }

    if(toCon.afterImgs[0]){
        for await(let e of toCon.afterImgs) {
            await cloudinary.uploader.upload("./public-imgs/" + e, result=>newAImgs.push(result.secure_url))
        }    
    }

    toCon.beforeImgs = newBImgs
    toCon.afterImgs = newAImgs



                await dbb.collection("con-finished").insertOne(toCon)
                await dbb.collection("uncon-finished").findOneAndDelete({_id: ObjectID(e)})
            }else if(await dbb.collection("finishing").findOne({_id: ObjectID(e)})){
                let deFinish = await dbb.collection("finishing").findOne({_id: ObjectID(e)})

                // changeAImgsUrl(deFinish.afterImgs)
                // deFinish.afterImgs = newAImgs

                
    ///////cloudinary
    // newBImgs= []
    newAImgs = []

    // if(beforeImgs[0]){
    //     for await(let e of beforeImgs) {
    //         await cloudinary.uploader.upload("./public-imgs/" + e, result=>newBImgs.push(result.secure_url))
    //     }    
    // }

    if(deFinish.afterImgs[0]){
        for await(let e of deFinish.afterImgs) {
            await cloudinary.uploader.upload("./public-imgs/" + e, result=>newAImgs.push(result.secure_url))
        }    
    }

    // beforeImgs = newBImgs
    deFinish.afterImgs = newAImgs



                await dbb.collection("con-finished").insertOne({
                    coords: deFinish.coords,
                    bName: deFinish.bName, 
                    beforeImgs: deFinish.beforeImgs,
                    afterImgs: deFinish.afterImgs, 
                    moreDetails: deFinish.moreDetails,
                    dateOfPlanting: deFinish.dateOfPlanting,
                    aNames: deFinish.aNames
                })
                await dbb.collection("finishing").findOneAndDelete({_id: ObjectID(e)})
            }
        })

        if(req.body.nextCamp){
            let preValue = await dbb.collection("con-unfinished").findOne({_id: ObjectID(req.body.nextCamp)})
            console.log("........prev value........")
            console.log(preValue)
            dbb.collection("con-unfinished").findOneAndUpdate({_id: ObjectID(req.body.nextCamp)},{$set:{next: !preValue.next}})
        }
    })
// }


})


////finish the loc
/////con unfinished uncon finished 

app.post("/make-finishing", (req, res, next)=>{beforeImgs= []; afterImgs = []; next()},multerBasic.any(),(req, res)=>{
    console.log("...........make finished..........")
    console.log(req.body)

        ////if mode save it in con; else in uncon 
            if(typeof afterImgs[0] == "string" ){
                console.log("valid data")
                mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
                let dbb = client.db()

            if(req.cookies.modeAuth == process.env.MODEAUTH){
                let found = await dbb.collection("con-unfinished").findOne({_id: ObjectID(req.body.id)})

                await dbb.collection("con-finished").insertOne({
                    coords: found.coords,
                    bName: found.bName, 
                    beforeImgs: found.beforeImgs,
                    afterImgs: afterImgs, 
                    moreDetails: req.body.moreDetails,
                    dateOfPlanting: req.body.dateOfPlanting,
                    aNames: req.body.names.split(",")
                })
                await dbb.collection("con-unfinished").findOneAndDelete({_id: ObjectID(req.body.id)})
            
            }else{

                    let found = await dbb.collection("con-unfinished").findOne({_id: ObjectID(req.body.id)})

                    await dbb.collection("finishing").insertOne({
                        coords: found.coords,
                        bName: found.bName, 
                        beforeImgs: found.beforeImgs,
                        afterImgs: afterImgs, 
                        moreDetails: req.body.moreDetails,
                        dateOfPlanting: req.body.dateOfPlanting,
                        aNames: req.body.names.split(",")
                    })
                    await dbb.collection("con-unfinished").findOneAndDelete({_id: ObjectID(req.body.id)})

            }
    
    
    
                    })

                res.sendStatus(200)
            }else{
                res.sendStatus(402)
            }
})


////////get the lines from the coaster route project 
///MONGOKEY2

app.get("/confirmed", (req, res)=>{
    console.log(".......get confirmed lines.....")

    mongodb.connect(process.env.MONGOKEY2, async (err, client)=>{
        let dbb = client.db()
    let results = await dbb.collection("confirmed").find().toArray()
    res.send(results)
    console.log(results)
    })
})



///////////test code
// mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
//             let dbb = client.db()
// })





////////cloudniary image storing implementing; 
// newBImgs= []
// newAImgs = []

//                     /////inserting image to cloudinary; 
//                     if(beforeImgs[0]){
//                         console.log("will console log the before imgs elements")
//                         beforeImgs.forEach(i=>{
//                             console.log(i)
//                             cloudinary.uploader.upload("./public-imgs/" + i, {folder: "home/treeing"}, result =>{
//                                 console.log(result)
//                                 newBImgs.push(result.secure_url)
//                             })
                            
//                         })
//                     }

//                     if(afterImgs[0]){
//                         console.log("will console log the before imgs elements")
//                         afterImgs.forEach(i=>{
//                             console.log(i)
//                             cloudinary.uploader.upload("./public-imgs/" + i, {folder: "home/treeing"}, result =>{
//                                 console.log(result)
//                                 newAImgs.push(result.secure_url)
//                             })
                            
//                         })
//                     }



app.listen(process.env.PORT || 2000, ()=>console.log(`listening on port 2000`))


