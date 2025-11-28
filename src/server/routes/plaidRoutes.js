import * as plaidController from "../controllers/plaidController.js"
import express from 'express';

const router = express.Router()

router.post("/createLinkToken", plaidController.createLinkToken)
router.post("/getAccessToken", plaidController.getAccessToken)
router.post("/getTransactions", plaidController.getTransactions)

export default router;