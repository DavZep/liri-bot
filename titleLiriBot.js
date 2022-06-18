const figlet = require("figlet")

figlet("L I R I B O T", {
    font: "banner3-D",
    horizontalLayout: "default",
    veriticalLayout: "default"
}, (err, result) =>{
    console.log(err || result)
});

figlet()