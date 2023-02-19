const express= require("express")
const {noteModel}= require("../model/notes.model")
const noteRoute= express.Router()


/**
* @swagger
* components:
*   schemas:
*      User:
*         type: object
*         properties:
*           id:
*             type: string
*             description: The auto-generated id of the user
*           name:
*             type: string
*             description: The user name
*           email:
*             type: string
*             description: The user email
*           age:
*             type: integer
*             description: Age of the user
*/
/**
* @swagger
* tags:
*   name: Users
*   description: All the API routes related to User
*/
/**
* @swagger
* /users:
*   get:
*       summary: this will get all the user data from the database
*       tags: [Users]
*       responses:
*           200:
*               description: The list of all the users
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           item:
*                               $ref: "#/components/schemas/User"
*
*/

noteRoute.get("/",async(req,res)=>{
    try{
        const user= req.body.userID
        const data= await noteModel.find({userID:user})
        res.send(data)
    }
    catch(err){
        console.log(err);
    }
})

/**
* @swagger
* /users/create:
*   post:
*       summary:to post the details of a new user
*       tags: [Users]
*       requestBody:
*          required:true
*          content:
*             application/json:
*                schema:
*                  $ref: '$/components/schemas/User'
*        responses:  
*          200:
*             description: The users was successfully register
*             content:
*                application/json:
*                   schema:
*                     $ref: "#/components/schemas/User"
*          500:
*            description:Some server error       
*/

noteRoute.post("/create",async(req,res)=>{
    const payload= req.body
    const note= new noteModel(payload)
    await note.save()
    res.send({"msg":"Note Created"})
})

/**
* @swagger
* /users/update/{id}:
*   patch:
*       summary:it will update the user details
*       tags: [Users]
*       parameters:
*          - in:path
*            name:id
*            schema:
*               type:string
*            required:true
*            description:The book id
*        requestBody:
*          required:true
*          content:
*             application/json:
*                schema:
*                  $ref: '#/components/schemas/User'
*        responses:  
*          200:
*             description: The users was successfully register
*             content:
*                application/json:
*                   schema:
*                     $ref: "#/components/schemas/User"
*           400:
*             description: The user Details has been updated 
*          500:
*            description:Some server error       
*/


noteRoute.patch("/update/:id",async(req,res)=>{
    const id= req.params.id
    const data= req.body
    const note= await noteModel.findOne({"_id":id})
    const userID_in_note= note.userID
    const userID_making_req= req.body.userID

    try{
        if(userID_making_req!==userID_in_note){
            res.send({"msg":"You are not authorized"})
        }else{
            await noteModel.findByIdAndUpdate({"_id":id},data)
            res.send({"msg":`Note with id:${id} has been update`})
        }
    }catch(err){
        console.log(err)
        res.send({"msg":"Something went wrong"})
    }
    
})

/**
*@swagger
* /users/delete/{id}:
*   delete:
*       summary:Remove the user by id
*       tags: [Users]
*       parameters:
*            in:path
*            name:id
*            schema:
*               type:string
*            required:true
*            description: The user id
*        responses:  
*          200:
*             description:The users was deleted
*          400:
*             description:The user was not found
*          500:
*            description:Some server error       
*/

noteRoute.delete("/delete/:id",async(req,res)=>{
    const id= req.params.id
    const note= await noteModel.findOne({"_id":id})
    const userID_in_note= note.userID
    const userID_making_req= req.body.userID
    try{
        if(userID_making_req!==userID_in_note){
            res.send({"msg":"You are not authorized"})
        }else{
            await noteModel.findByIdAndDelete({"_id":id})
            res.send({"msg":`Note with id:${id} has been delete`})
        }
    }catch(err){
        console.log(err)
        res.send({"msg":"Something went wrong"})
    }
    
})


module.exports={
    noteRoute
}







