import {Router } from "express";
import { callback, getUser, login, logout } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.route("/login").get(login);
authRouter.route("/callback").get(callback);
authRouter.route("/logout").post(logout);
authRouter.route("/me").get(getUser);

export default authRouter;
