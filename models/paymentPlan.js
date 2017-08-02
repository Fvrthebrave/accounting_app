var mongoose = require("mongoose");

var paymentPlanSchema = new mongoose.Schema({
    dueDate: Date,
    totalPmts: Number,
    totalAmt: Number,
    amtDue: Number,
    latePmts: Number
});

module.exports = mongoose.model("paymentPlan", paymentPlanSchema);