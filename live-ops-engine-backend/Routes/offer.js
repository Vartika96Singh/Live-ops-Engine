const express = require('express');
const offerRouter = express.Router();
const jwt = require('jsonwebtoken');
const secret = "random-string"
const bodyparser = require('body-parser');
// middleware bodyparser
offerRouter.use(bodyparser.urlencoded({ extended: false }))
offerRouter.use(bodyparser.json());
const OffersData = require("../Schemas/offersdata");

const userDetailsByToken = (token) => {

    return new Promise((resolve, reject) => {
        if (token) {
            let userdata;
            try {
                userdata = jwt.verify(token, secret);
                resolve(userdata)
            } catch (error) {
                reject('invalid token');
            }
        } else {
            reject("token not found");
        }
    })
}
// ============ creating offer here =========================
offerRouter.post('/create-offer', async (req, res) => {

    userDetailsByToken(req.headers.authorization).then(async (user) => {

        try {
            const offer = await OffersData.create({ ...req.body, username: user.username });
            res.status(201).json({
                offer
            })
        } catch (e) {
            res.status(500).json({
                status: "failed",
                message: e.message
            })
        }
    })
})
// ================================== showing offer list here =======================
offerRouter.get('/offers-list', async (req, res) => {

    //=================================
    try {
        const allOffers = await OffersData.find();
        res.status(200).json({
            status: "success",
            data: allOffers
        })

    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        })
    }


    //    let  validOffers = [];
    //     OffersData.find().then((offers) => {
    //         console.log(offers);
    //         offers.filter((offer) => {
    //             const rules = offer.target().split('and');
    //             rules.forEach((rule) => {
    //                 let ruleKey = {};
    //                 if (rule.includes(">")) {
    //                     ruleKey = { key: rule.trim.split(">")[0].trim(), value: parseInt(rule.trim.split(">")[1]) };
    //                     if (req.body[ruleKey.key] > ruleKey.value) {
    //                         validOffers.push(offer)
    //                         console.log("inside line 59");
    //                     } else {
    //                         ruleKey = { key: rule.trim().split("<")[0], value: rule.trim().split("<")[1] }
    //                         if (req.body[ruleKey.key] < ruleKey.value) {
    //                             validOffers.push(offer)
    //                         }
    //                     }
    //                 }
    //             })
    //         })
    //         res.status(200).json({
    //             status : "Success",
    //             data : validOffers
    //         })
    //     }).catch((e)=>{
    //        res.status(500).json({
    //         status : "failed",
    //         message : e.message 

    //        })
    //     })

    // ===========================================
    //==================================   Deleting offer =======================

    offerRouter.delete('/offers/:id', async (req, res) => {
        try {
            const data = await OffersData.findByIdAndDelete({ _id: req.params.id });
            if (data) {
                res.status(200).json({
                    status: "success",
                    data
                })
            } else {
                res.status(400).json({
                    status: "failed",
                    message: "offer id is not valid"
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "failed",
                message: error.message
            })
        }
    })
})

//================== updating offer //=========================

offerRouter.put('/offers/:id', async (req, res) => {
    try {
        const updatedData = await OffersData.findByIdAndUpdate({ _id : req.params.id }, req.body);
        if (updatedData) {
            res.status(200).json({
                status: "success",
                updatedData
            })
        } else {
            res.status(400).json({
                status: "failed",
                message: "offer id is not valid"
            })
        }

    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
})

module.exports = offerRouter
