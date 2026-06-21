import { Router } from "express";
import { healthcheck } from "../controllers/healthcheckcontroller";

const router = Router();

router.route("/").get(healthcheck);

export default router;