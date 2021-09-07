'use strict'

const axios = require('axios')

const express = require ('express')
const server =  express ()
const cors = require ('cors')
require('dotenv').config();
const mongoose = require('mongoose')
const PORT =process.env.PORT

server.use(cors());
server.use(express.json());
mongoose.connect(`'mongodb://localhost:27017/chocolate'`,{ useNewUrlParser: true, useUnifiedTopology: true });

class Choco {
    constructor(choco){
        this.title = choco.title
        this.imageUrl = choco.imageUrl
    }
}
//////////////////////////////////////


//schema
let chocoSchema = new mongoose.Schema({
    userEmail:String,
    title:String,
    imageUrl:String,
})



const chocoModel = mongoose.model('choco',chocoSchema)
//////////////////////////////////////
server.get('/getAPIData',getAPIData)
function getAPIData(req,res){
    axios.get('https://ltuc-asac-api.herokuapp.com/allChocolateData').then(
        result=>{
           const choco =  result.data.map(data=>{
               return new Choco(data)
           })
           res.send(choco)
        }

    )
}

/////////////////////////////////////////////////////////
server.post('/addData',addData)
function addData(req,res){
    const {userEmail,title,imageUrl} = req.body
    chocoModel.create({userEmail,title,imageUrl},function(err,data){
        console.log('ggggggggg',data)
        chocoModel.find({userEmail:userEmail},function(err,result){
            res.send (result)

        })
    })

}
/////////////////////////////////////////////////////////////
server.get('/getFavData',getFavData)
function getFavData(req,res){
    const userEmail= req.query

    chocoModel.find({userEmail:userEmail},function(err,data){
        res.send(data)
    })
}

//////////////////////////////////////////////////////////////////
server.get('/delete/:wantedId',deleteFavData)
function deleteFavData(req,res){
    const wantedId = req.params.wantedId
    const userEmail = req.query.userEmail
    chocoModel.delete({_id:wantedId},function(err,deleted){
        
        chocoModel.find({userEmail:userEmail},function(err,result){

            res.send(result)
        })
    })
}
///////////////////////////////////////////////////////////////

server.put('/update/:wantedId',updateFavData)
function updateFavData(req,res){
    const{userEmail,title,imageUrl}=req.body
    const wantedId = req.params.wantedId

    chocoModel.findOne({_id:wantedId},function(err,updated){

        console.log(updated)

        updated.title=title
        updated.imageUrl=imageUrl

        updated.save().then(result=>{
            chocoModel.find({userEmail:userEmail},function(err,data){

                res.send(data)
            })
        })


    })
}




////////////////////////////////////////////////////////


server.get('/',getHome)
function getHome(req,res){
    res.send('home')
}

server.listen(PORT,()=>{
    console.log(`listen to PORT ${PORT}`)
})