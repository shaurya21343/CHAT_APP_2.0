import { Router } from "express";
import { registerUser } from "../controller/user.register";
import { loginUser } from "../controller/user.login";
import logoutUser from "../controller/user.logout";
import { preventLogedInUsers,requireAuth } from "../middleware/auth.middleware";
import { checkAuth } from "../controller/checkAuth";

const router = Router();

router.post("/register",preventLogedInUsers, registerUser);

router.post("/login",preventLogedInUsers, loginUser);

router.post("/logout",requireAuth, logoutUser)

router.post("/check-auth",requireAuth, checkAuth);



export default router;