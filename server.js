const app=require("./app");
const dotenv=require("dotenv")
const connectDatabase=require("./config/database")
//handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.messege}`);
    console.log("shutting down the server uncaught exception")
    process.exit(1);
})

dotenv.config({path:"./config/config.env"})

connectDatabase();





const server=app.listen(process.env.PORT,()=>{
    console.log('server is working')
})


//unhandled promise rejection
process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`)
    console.log("shutting down the server due to unhandled promise rejection")
    server.close(()=>{
        process.exit(1);
    });

});