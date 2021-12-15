const express = require("express");
const app = express();
const connection = require("./database/database");

//Model offers
require("./database/offers");
//Schedule run
require("./services/schedule");

app.use(express.json());

const RouteCrowler = require("./routes/crawlers");
app.use('/crawlers',RouteCrowler)

connection
    .authenticate()
    .then( () => {
        console.log("Conexao feita")
    }).catch( (msgErr) => {
        console.log(msgErr)  
    })


//Liga server
app.listen(3000, () => { 
    console.log("Server running")
})
