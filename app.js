var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var methodOverride  = require('method-override'); // for DELETE request


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));  //for DELETE request 

app.set('view engine','ejs');
app.use(express.static('public'));
//setup database
mongoose.connect('mongodb://127.0.0.1/bloqDB',{useMongoClient:true});
//create schema
var blogSchema = new mongoose.Schema({
    title   : String,
    body    : String,
    image   : String
});
//compile to model
var Blog = mongoose.model("Blog",blogSchema);

//ROUTES

app.get("/",function(req,res){
    res.render("index");
});
app.get("/blogs",function(req,res){
    //retrieve all blogs from db
    var blogs = Blog.find({},function(err,foundBlogs){
        if(err){
            console.log(err);
        }else{
            res.render("blogs",{blogs:foundBlogs});
        }
    });
});
app.get("/blogs/new",function(req,res){
    //redirect to a new form
    res.render("newBlog");
});
app.post("/blogs",function(req,res){
    //Escape script input by sanitizer

    //get info from form 
        var title   = req.body.title;
        var body    = req.body.body;
        var image   = req.body.image;
        var date    = Date.now;
        
    // //save into DB
    Blog.create({
        title   : title,
        body    : body,
        image   : image,
        date    : date
    },function(err,createBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});
app.get("/blogs/:id",function(req,res){
    //get info of blog from id
    var id = req.params.id;
    //find blog in DB
    Blog.findById(id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            //redirect to page with blog info
            res.render("blogDetails",{bloginfo:foundBlog});
        }
    });
    
});
app.delete("/blogs/:id",function(req,res){
    //delete particular blog
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
    //redirect to blogs page
//    res.redirect("/blogs");
});
app.put("/blogs/:id",function(req,res){
    //Escape script input by sanitizer

    // get update information
    var blog = req.body.blog;
    // update info into database
    Blog.findByIdAndUpdate(req.params.id,blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+updatedBlog._id);
        }
    });
});
app.get("/blogs/:id/edit",function(req,res){
    var id = req.params.id;
        Blog.findById(id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            //redirect to page with blog info
            res.render("edit",{bloginfo:foundBlog});
        }
    });
});
app.get("*",function(req,res){
    res.send("No such page!");
})

//start server
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Blog server has started");
});
