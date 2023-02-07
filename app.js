const express = require('express');
const bodyParser = require('body-parser');

//Pristup drugom js fajlu
const date = require(__dirname + '/date.js');

const app = express();

app.use(express.static("public"))

//Deo za EJS
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}))

let newTodos= ["Buy food", "Cook food", "Eat food"];

let newWorks = ["School", "Homework", "Job"];

let checkedItem = []

app.get("/", (req, res)=>{

    let currentDate = date.getFullDate();

    res.render('index', {listTitle: currentDate, newListItems: newTodos})

    
})


app.get("/work", (req, res)=>{

    res.render('index', {listTitle: "Work list", newListItems: newWorks})

})



app.get("/about", (req, res)=>{

    res.render('about')

    
})

app.post("/", (req, res)=>{

    if(req.body.item != ""){

        let item = req.body.item;

        if(req.body.list === "Work"){

            newWorks.push(item)
            res.redirect("/work")

        }else{

            newTodos.push(item)
            res.redirect("/")
        }

    }else{
        if(req.body.list === "Work"){
            res.redirect("/work")

        }else{
            res.redirect("/")
        }
    }

    
})

app.post("/work", (req, res)=>{

    if(req.body.item != ""){
        newWork = req.body.item;

        newWorks.push(newWork)

        res.redirect("/work")
    
    }else{
        res.redirect("/work")
    }
    
    
})

app.listen("3000", ()=>{
    console.log("Listen on port 3000")
})