const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({  extended: true }));
app.use(express.static("public"));

async function main(){
    await mongoose.connect("mongodb://0.0.0.0:27017/wikiDB")
}

main().catch(err=>console.log(err))

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article",articleSchema)

// --------------(All Articles)-------------

app.route("/articles")

.get((req,res)=>{
    Article.find({})
    .then(foundarticle=>{
        res.send(foundarticle)
    })
    .catch(err=>{
        console.log(err)
    })
})

.post((req,res)=>{
    const title = req.body.title
    const content = req.body.content

    // console.log(title)
    // console.log(content)

    const article = new Article({
        title: title,
        content: content
    })

    article.save()
    .then(()=>{
        res.send("successfully saved")
    })
    .catch((err)=>{
        res.send(err)
    })
})

.delete((req,res)=>{
    Article.deleteMany({})
    .then((no)=>{
        res.send(`the number fields deleted are ${no.deletedCount}`)
    })
    .catch(err=>{
        res.send(err)
    })
})


// --------- Single Article ---------

app.route("/articles/:article")
.get((req,res)=>{
    const reqArticle = req.params.article

    Article.findOne({title:reqArticle})
    .then((foundarticle)=>{
        if (foundarticle){
            res.send(foundarticle)
            
        }else{
            res.send("NO entry is avaliable")
        }
        
    })
    .catch(err=>{
        res.send(err)
        
    })
})

.put((req,res)=>{
    Article.replaceOne({title: req.params.article},
        {title: req.body.title, content: req.body.content})
        .then(out=>{
            res.send("Successfully replaced it")
        })
        .catch(err=>{
            res.send(err)
        });
})

.patch((req,res)=>{
    Article.updateOne({title: req.params.article},
        req.body).then(doc=>{
            res.send('Successfully updated the article')
        }).catch(err=>{
            res.send(err)
        })
})

.delete((req,res)=>{
    Article.deleteOne({title: req.params.article}).then(obj=>{
        res.send("Successfully deleted the article")
    }).catch(err=>{
        res.send(err)
    })
})





app.listen(3000,()=>{
    console.log("server is listening on port 3000");
})