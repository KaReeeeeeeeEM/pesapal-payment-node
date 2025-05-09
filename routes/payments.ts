import express from "express";
import { getIPNList, makePayment, requestIPN, requestToken } from "../controllers/paymentController";

// Create an instance of the express router
const router = express.Router();

// Payment routes
router.post("/pay", makePayment)
router.post("/token", requestToken)
router.post("/ipn", requestIPN)
router.post("/ipn/list", getIPNList)

export default router;