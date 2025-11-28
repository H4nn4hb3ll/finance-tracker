import express from 'express';
import * as userController from "../controllers/userController.js"

const router = express.Router()

router.get("/", userController.getUsers)
router.post("/createUser", userController.createUser)
router.post("/loginUser", userController.loginUser)
router.post("/logout", userController.logoutUser)

router.post("/getBudget", userController.getBudget)
router.post("/setBudget", userController.setBudget)
router.post("/getExistingToken", userController.getExistingToken)
router.post("/addToken", userController.addToken)

export default router;