const con = require('./config/db'); 
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const userRouter = require('./routers/userRouter'); 
const nodeRouter=require('./routers/nodeRoutes');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
app.use("/api/v1/users",userRouter);
app.use("/api/v1/nodes",nodeRouter)

const startServer = async () => {
    try {
        await con.connect()
        .then(() => console.log("Connected to database"))
        .catch(err => console.error("Database connection error:", err)); 
        app.listen(port, () => {
            console.log('Server is running on port:', port);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
};

startServer();
