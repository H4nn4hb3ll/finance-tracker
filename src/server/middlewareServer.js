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
// Configure CORS from environment (comma-separated list) with a sensible default
const defaultAllowed = 'https://finance-tracker-7x6.pages.dev';
const allowedOrigins = (process.env.ALLOWED_ORIGINS || defaultAllowed).split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    return callback(null, allowedOrigins.includes(origin));
  }
}));
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

// Basic health endpoint so GET / returns something useful
app.get('/', (req, res) => {
  res.send('API running')
})

// Listen on all interfaces so the API is reachable from other machines on the LAN
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});