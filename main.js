const express = require('express');
const app = express();
const path=require("path")
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.get('/', (req, res) => {
    console.log("a request has been recieved");
    res.json({
        "message": "this is from backend"
    });


})
app.post('/login', (req, res) => {

    console.log('a login req has been recieved');
    if (req.body.email == "keshav@gmail.com") {
        if (req.body.pass == "12345") {
            res.sendFile(path.join(__dirname,"public","main.html"));
        }
        else {
            res.json({
                "message": "password wrong"
            });
        }
    }
    else {
        res.json({
            "message": "email wrong h mc"
        });
    }
})
app.get('/contact',(req,res)=>{
res.json(
    
    {
        "message":"you can contact us by here"
    });

})



app.listen(3000, () => {
    console.log("server is started at port 3000");


})
