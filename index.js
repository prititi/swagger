const express= require("express")
const {connection}=require("./db")
const {userRouter}= require("./route/user.routes")
const {noteRoute}= require("./route/note.routes")
const { authentication } = require("./middleware/authenticate.middleware")
const cors= require("cors")
const swaggerJSdoc=require("swagger-jsdoc")
const swaggerUi=require("swagger-ui-express")

require("dotenv").config()
const app= express()
app.use(express.json())
app.use(cors())

const options= {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Learning Swagger",
            version:"1.0.0"
        },
        servers:[
            {
                url:"http://localhost:2100"
            }
        ]
    },
    apis:["./route/*.js"]
}
const swaggerSpec=swaggerJSdoc(options)
app.use("/api.doc",swaggerUi.serve,swaggerUi.setup(swaggerSpec))

// app.get("/",(req,res)=>{
//     res.send("HOME PAGE")
// })

app.use("/users",userRouter)
app.use(authentication)
app.use("/notes",noteRoute)


app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("Connected to DB")
    }catch(err){
        console.log(err.message)
    }
    console.log(`Server is running at port ${process.env.port}`)
})