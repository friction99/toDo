import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://aman-kumar:Pj6YytrF7G77BW9y@cluster0.blwthgk.mongodb.net/toDo");
const dataSchema = {
    name:String
}
const Item = mongoose.model("item",dataSchema);
const eat = new Item({
    name : "eat"
});
const feed = new Item({
    name: "feed"
});
const greet = new Item({
    name:"greet"
});
const defaultItems = [eat,feed,greet];
const listSchema = {
    name:String,
    items:[dataSchema]
}
const List = mongoose.model("List",listSchema);
app.get('/',(req,res)=>{
    Item.find({})
    .then((iterates)=>{
        if(iterates.length===0){
            Item.insertMany(defaultItems)
            .then(()=>{
                console.log("Inserted");
            })
            .catch((err)=>{
                console.log(err);
            });
            res.redirect("/");
        }
        else res.render('index.ejs',{work:iterates,Date:"Today",listTitle:"Today"});
    })
    .catch((err)=>{
        console.log(err);
    });
});
app.post('/submit',(req,res)=>{
    const newItemText = req.body.title;
    const listName = req.body.list;
    const newItem = new Item({
        name:newItemText
    });
    try{
        if(listName==="Today"){
            newItem.save();
            res.redirect("/");
        }
        else{
            List.findOne({name:listName})
            .then((obj)=>{
                if(obj){
                    obj.items.push(newItem);
                    obj.save();
                    res.redirect("/"+listName);
                }
                else{
                    console.log("List not found");
                }
            })
        }
    }catch(err){
        console.log(err);
    }
});
app.post("/delete",(req,res)=>{
    const id = req.body.checkbox;
    const title = req.body.list;
    try{
        if(title==="Today"){
            Item.deleteOne({_id:id})
            .then(()=>{
                console.log("Deleted successfuly")
                res.redirect("/");
            })
            .catch((err)=>{
                console.log(err);
            })
        }
        else{
            List.findOneAndUpdate({name:title},{$pull:{items:{_id:id}}})
            .then(()=>{
                console.log("Deleted successfuly");
                res.redirect("/"+title);
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    }catch(err){
        console.log(err);
    }
});
app.post('/reset',(req,res)=>{
    if(req.body.check==="workList") arr2.length=0;
    else arr.length=0;
    res.render('index.ejs',{work:arr,Date:"Today"});
});
app.get('/:customListName',(req,res)=>{
    const CustomListName = _.capitalize(req.params.customListName);
    List.findOne({name:CustomListName})
    .then((result)=>{
        res.render("index.ejs",{work:result.items,Date:result.name,listTitle:CustomListName});
    })
    .catch((error)=>{
        const list = new List({
            name:CustomListName,
            items:defaultItems
        })
        list.save();
        res.redirect(req.params.customListName);
    });
});
app.listen(3000,()=>{
    console.log("The server is up and running on port 3000");
});
//aman-kumar
//Pj6YytrF7G77BW9y