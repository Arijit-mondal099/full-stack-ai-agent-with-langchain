import { Router } from "express";
import { runAgent } from "../controllers/agent.controller";

const agentRouter = Router();

agentRouter.route("/run").post(runAgent);

export default agentRouter;
