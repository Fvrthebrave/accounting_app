var express = require("express"),
    router  = express.Router(),
    Client  = require("../models/client"),
    Plan    = require("../models/paymentPlan"),
    middleware  = require("../middleware");
    

router.get("/clients/:id/:planId/edit", middleware.isLoggedIn, function(req, res){
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


router.put("/clients/:id/plans/:planId", middleware.isLoggedIn, function(req, res){
    Plan.findByIdAndUpdate(req.params.planId, req.body.plan, function(err, plan){
        console.log(plan);
       if(err){
           console.log(err);
           res.redirect("/clients/" + req.params.id + "/plan");
       } else {
           req.flash("success", "Successfully updated plan!");
           res.redirect("/clients/" + req.params.id + "/plan");
       }
   }) ;
});

router.post("/clients/:id/plans", middleware.isLoggedIn, function(req, res){
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
                   req.flash("success", "Successfully added plan to database!");
                   res.redirect("/clients/" + client._id + "/plan");
               }
           });
       }
    });
});

//REMOVE
// DESTROY ROUTES **************************************************************
router.delete("/clients/:id/plan/:planId", middleware.isLoggedIn, function(req, res){
    Plan.findByIdAndRemove(req.params.planId, function(err, removedPlan){
       if(err){
           console.log(err);
       } else {
           req.flash("success", "Successfully removed plan from database!");
           res.redirect('/clients/' + req.params.id + '/plan');
       }
    });
});

module.exports = router;