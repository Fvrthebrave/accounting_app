var express = require("express"),
    router  = express.Router(),
    Client  = require("../models/client"),
    middleware = require("../middleware");
    

// READ ROUTES
router.get("/clients", middleware.isLoggedIn, function(req, res){
    Client.find({}, function(err, clients){
       if(err){
           console.log(err);
       } else {
            res.render("client/list", {clients: clients});
       }
    });
});

router.get("/clients/searchByName", middleware.isLoggedIn, function(req, res){
   res.render("searchName"); 
});

router.get("/clients/searchById", middleware.isLoggedIn, function(req, res){
   res.render("searchId");
});

router.post("/clients/results", function(req, res){
    Client.find({lowerFirstName: req.body.firstName.toLowerCase(), lowerLastName: req.body.lastName.toLowerCase()}, function(err, clients){
        console.log(clients);
        if(err){
           console.log(err);
        } else if(clients[0] === undefined){
            req.flash("error", "No clients were found by that name!");
            res.redirect("/clients/searchByName");
        } else {
           res.render("client/results", {clients: clients});
        }
    });
});

router.post("/clients/resultsID", function(req, res){
   Client.findOne(req.body.client, function(err, client){
       if(err){
           console.log(err);
       }else if(client === null){
           req.flash("error", "Client was not found!");
           res.redirect("/clients/searchById");
       } else {
           res.render("client/resultsID", {client: client});
       }
   });
});

router.get("/clients/new", middleware.isLoggedIn, function (req, res){
   res.render("client/new");
});

router.get("/clients/:id/", middleware.isLoggedIn, function(req, res){
    Client.findById(req.params.id).populate("plans").exec(function(err, client){
        if(err){
            console.log(err);
        } else {
            res.render("client/show", {client: client}); 
        }
    });
});

router.get("/clients/:id/plan", middleware.isLoggedIn, function(req, res){
    Client.findById(req.params.id).populate("plans").exec(function(err, client){
        if(err){
            console.log(err);
        } else {
            res.render("client/agreement", {client: client}); 
        }
    });
});

router.get("/clients/:id/newPlan", middleware.isLoggedIn, function(req, res){
    Client.findById(req.params.id, function(err, client){
        if(err){
            console.log(err);
        } else {
            res.render("paymentPlan/new", {client: client}); 
        }
    });
});

router.get("/clients/:id/edit", middleware.isLoggedIn, function(req, res){
    Client.findById(req.params.id, function(err, client){
        if(err){
            console.log(err);
        } else {
            res.render("client/edit", {client: client});
        }
    });
});


// EDIT ROUTES *************************************************************
//UPDATE
router.put("/clients/:id", middleware.isLoggedIn, function(req, res){
   Client.findByIdAndUpdate(req.params.id, req.body.client, function(err, client){
       if(err){
           console.log(err);
       } else {
           req.flash("success", "Successfully updated client information!");
           res.redirect("/clients/" + req.params.id + "/");
       }
   }) ;
});


// CREATE ROUTES
router.post("/clients", middleware.isLoggedIn, function(req, res){
    Client.create(req.body.client, function(err, newClient){
       if(err){
           req.flash("error", "Something went wrong!");
           console.log(err);
       } else {
           newClient.lowerFirstName = newClient.firstName.toLowerCase();
           newClient.lowerLastName = newClient.lastName.toLowerCase();
           newClient.save();
           
           req.flash("success", "Successfully added client to database!");
           res.redirect("/clients");
       }
    });
});



module.exports = router;