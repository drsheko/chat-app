const User = require("../models/userModel");
const Call = require('../models/callModal')
const mongoose = require("mongoose");


exports.create_call = async (req, res) => {
    console.log(req.body)
    let caller = req.body.caller;
    let recipient = req.body.recipient;
    let status  = req.body.status;
    var newCall = new Call({
        users:[caller,recipient],
        caller,
        recipient,
        status
    })

    newCall.save((error, call)=>{
        if(error){
            return res.status(401).json({success:false, error})
        }
        return res.status(200).json({success:true, call})
    })
}
