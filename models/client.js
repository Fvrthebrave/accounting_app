var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var connection = mongoose.connect("mongodb://localhost/accounting_app");

autoIncrement.initialize(connection);


var clientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    clientId: Number,
    
    plans: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "paymentPlan"
        }
    ]
    
});

clientSchema.plugin(autoIncrement.plugin, "client");
module.exports = mongoose.model("client", clientSchema);