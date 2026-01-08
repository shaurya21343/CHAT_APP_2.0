import { Router } from "express";
import { sendMessage } from "../controller/sendMessage";
import FetchMessage from "../controller/fetchMessage";

const router = Router();

router.post('/send-message', sendMessage);
router.get('/fetch-messages',FetchMessage);

export default router;