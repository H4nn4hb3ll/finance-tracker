import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import plaidRoutes from "./routes/plaidRoutes.js";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

dotenv.config()
const prisma = new PrismaClient();

// Initialize an Express application
const app = express();
const port = 3333;
app.use(cors());
app.use(express.json());

app.use("/api/users", (req, res, next) => {
    req.prisma = prisma
    console.log("got a user request")
    next()
}, userRoutes)

app.use("/api/plaid", (req, res, next) => {
    req.prisma = prisma
    next()
}, plaidRoutes)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});