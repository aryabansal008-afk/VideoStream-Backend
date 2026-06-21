import {Router} from "express";
import{toggleSubscription, getUserChannelSubscriber, getSubscribedChannel} from "../controllers/subscriptioncontroller.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();
router.use(verifyJWT);

router.route("/c/:channelId").get(getUserChannelSubscriber).post(toggleSubscription);
router.route("/u/:subscriberId").get(getSubscribedChannel);