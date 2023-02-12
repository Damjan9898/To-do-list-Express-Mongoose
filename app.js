const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const _ = require("lodash");

//Kreiram novu Bazu
mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true });

const app = express();

app.use(express.static("public"))

//Deo za EJS
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}))


const itemSchema = new mongoose.Schema({
    name: String
})

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
})

const Item = mongoose.model("Item", itemSchema);

const List = mongoose.model("List", listSchema);

// Kreiranje default itema
const item1 = new Item({
    name: "Welcome to your todo list"
});
const item2 = new Item({
    name: "Hit the + button to add new item"
});
const item3 = new Item({
    name: "<-- Click this to delete an item"
});



app.get("/", (req, res)=>{

    let allListNames = [];

    List.find((err, items)=>{
        if(!err){
            items.forEach((item)=>{
                if(item.name != "Favicon.ico"){
                    allListNames.push(item.name);
                }

            })
        }
    })



    Item.find((err, items)=>{
        if(err){
            console.log(err)
        }else{

            //U slucaju da je prazna baza dodajem default vrednosti
            if(items.length === 0){
                //Dodavanje default itema u bazu u kolekciju Items
                Item.insertMany([item1, item2, item3], (err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log("Success insert many")
                    }
                });

                res.redirect("/");

            }
            res.render('index', {listTitle: "Today", newListItems: items, allListNames: allListNames})
        }
    });

    

    
})

app.get("/about", (req, res)=>{

    let allListNames = [];

    List.find((err, items)=>{
        if(!err){
            items.forEach((item)=>{
                if(item.name != "Favicon.ico"){
                    allListNames.push(item.name);
                }

            })
            res.render('about', {allListNames: allListNames})
        }
    })

    

    
})

app.post("/", (req, res)=>{

    let listTitle = req.body.listButton;

    if(req.body.item != ""){

        let item = req.body.item;

        const newItem = new Item({
            name: item
        })

        if(listTitle === "Today"){
            newItem.save();
            res.redirect("/");
        }else{
            List.findOne({name: listTitle}, (err, foundList)=>{
                if(err){
                    console.log(err)
                }else{
                    foundList.items.push(newItem);
                    foundList.save();
                    res.redirect("/" + listTitle);
                }
            })
        }
    }else{
        res.redirect("/" + listTitle);
    }

    
})



app.get("/:customListName", (req,res)=>{


    let allListNames = [];

    List.find((err, items)=>{
        if(!err){
            items.forEach((item)=>{
                //Ovo je default dodato jer je los primer
                if(item.name != "Favicon.ico"){
                    allListNames.push(item.name);
                }
                
            })
        }
    })


    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, (err, customList)=>{
        if(err){
            console.log(err)
        }else{

            if(!customList){

                const list = new List({
                    name: customListName,
                    items: [item1, item2, item3]
                })

                list.save();

                res.render("index", {listTitle: list.name, newListItems: list.items, allListNames:allListNames})


            }else{
                res.render("index", {listTitle: customList.name, newListItems: customList.items, allListNames:allListNames})
            }

            
        }
    })


    
});


app.post("/delete", (req, res)=>{

    let selectedItemId = req.body.checkbox;

    let hiddenListName = req.body.hiddenListName;

    if(hiddenListName === "Today"){

    Item.findByIdAndRemove(selectedItemId, (err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Success delete items");
            res.redirect("/")
        }
    });

    }else{

        List.findOneAndUpdate({name: hiddenListName}, {$pull: {items: {_id:selectedItemId}}}, (err, item)=>{
            if(!err){
                res.redirect("/" + hiddenListName);
            }
        });

    }

});



app.post("/newList", (req, res)=>{

    let listTitle = _.capitalize(req.body.newListName);

    res.redirect("/" + listTitle);

})

app.post("/getList", (req, res)=>{

    let getListName = req.body.getListName;

    res.redirect("/" + getListName);

})


app.listen("3000", ()=>{
    console.log("Listen on port 3000")
})