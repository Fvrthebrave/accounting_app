var express  = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    Client  =   require("./models/client.js"),
    Plan    =   require("./models/paymentPlan.js"),
    methodOverride = require("method-override");
    
var app = express();
mongoose.connect("mongodb://localhost/accounting_app");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//SeedDB();


// READ
// GET ROUTES *******************************
app.get("/", function(req, res){
    res.render("home");
});

app.get("/clients/", function(req, res){
    Client.find({}).sort("_id").exec(function(err, clients){
        if(err){
            console.log(err);
        } else {
            res.render("client/list", {clients: clients});
        }
    });

});

app.get("/clients/searchByName", function(req, res){
   res.render('searchName'); 
});

app.get("/clients/searchById", function(req, res){
   res.render('searchId');
});

app.post("/clients/results", function(req, res){
    Client.find(req.body.client, function(err, clients){
       if(err){
           console.log(err);
       } else {
           res.render("client/results", {clients: clients});
       }
    });
});

app.post("/clients/resultsID", function(req, res){
   Client.findOne(req.body.client, function(err, client){
       if(err){
           console.log(err);
       } else {
           res.render("client/resultsID", {client: client});
       }
   });
});

app.get("/clients/new", function (req, res){
   res.render("client/new");
});

app.get("/clients/:id/", function(req, res){
    Client.findById(req.params.id).populate("plans").exec(function(err, client){
        if(err){
            console.log(err);
        } else {
            res.render("client/show", {client: client}); 
        }
    });
});

app.get("/clients/:id/plan", function(req, res){
    Client.findById(req.params.id).populate("plans").exec(function(err, client){
        if(err){
            console.log(err);
        } else {
            res.render("client/agreement", {client: client}); 
        }
    });
});

app.get("/clients/:id/newPlan", function(req, res){
    Client.findById(req.params.id, function(err, client){
        if(err){
            console.log(err);
        } else {
            res.render("paymentPlan/new", {client: client}); 
        }
    });
});

// EDIT ROUTES *************************************************************

app.get("/clients/:id/edit", function(req, res){
    Client.findById(req.params.id, function(err, client){
        if(err){
            console.log(err);
        } else {
            res.render("client/edit", {client: client});
        }
    });
});

app.get("/clients/:id/:planId/edit", function(req, res){
    Client.findById(req.params.id).populate("plans").exec(function(err, client){
       if(err){
           console.log(err);
       } else {
            Plan.findById(req.params.planId, function(err, plan){
                if(err) {
                    console.log(err);
                } else {
                    res.render("paymentPlan/edit", {client: client, plan: plan});
                }
            });    
       }
    });

});

//UPDATE
app.put("/clients/:id", function(req, res){
   Client.findByIdAndUpdate(req.params.id, req.body.client, function(err, client){
       if(err){
           console.log(err);
       } else {
           res.redirect("/clients/" + req.params.id + "/");
       }
   }) ;
});


app.put("/clients/:id/plans/:planId", function(req, res){
    Plan.findByIdAndUpdate(req.params.planId, req.body.plan, function(err, plan){
        console.log(plan);
       if(err){
           console.log(err);
           res.redirect("/clients/" + req.params.id + "/plan");
       } else {
           res.redirect("/clients/" + req.params.id + "/plan");
       }
   }) ;
});

// CREATE
app.post("/clients", function(req, res){
    Client.create(req.body.client, function(err, newClient){
       if(err){
           console.log(err);
       } else {
           res.redirect("/clients");
       }
    });
});

app.post("/clients/:id/plans", function(req, res){
    Client.findById(req.params.id, function(err, client){
       if(err){
           console.log(err);
       } else {
           Plan.create(req.body.plan, function(err, newPlan){
               if(err){
                   console.log(err);
               } else {
                   newPlan.save();
                   console.log(newPlan.dueDate);
                   
                   //Push to client
                   client.plans.push(newPlan);
                   client.save();
                   res.redirect("/clients/" + client._id + "/plan");
               }
           });
       }
    });
});

//REMOVE
// DESTROY ROUTES **************************************************************
app.delete("/clients/:id/plan/:planId", function(req, res){
    Plan.findByIdAndRemove(req.params.planId, function(err, removedPlan){
       if(err){
           console.log(err);
       } else {
           res.redirect('/clients/' + req.params.id + '/plan');
       }
    });
});



//DEFAULT ROUTE

app.get("(*)", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server is listening...');
});

function SeedDB(){
    Client.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log('Clients removed!');
        }
    })
}