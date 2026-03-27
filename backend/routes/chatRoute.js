import express from "express";
import { chatWithBot } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/", chatWithBot);

export default chatRouter;