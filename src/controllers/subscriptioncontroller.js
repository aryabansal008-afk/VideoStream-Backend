import mongoose,{isValidObjectId} from "mongoose";
import { User } from "../models/usermodel";
import { Subscription } from "../models/subscriptionmodel";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const toggleSubscription = asyncHandler(async(req,res)=>{
    const{channelId} = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    });

    if(existingSubscription){
        await Subscription.findByIdAndDelete(existingSubscription._id);

        return res.status(200).json(
            new ApiResponse(200,{},"Unsubscribed Successfully")
        );
    }

    const subscription = await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    });

    return res.status(201).json(
        new ApiResponse(201, subscription, "Subscribed Successfully")
    )
})

const getUserChannelSubscriber = asyncHandler(async(req,res)=>{
    const {channelId} = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    const subscribers = await Subscription.find({
        channel: channelId,
    }).populate("subscriber", "username fullname avatar"); //mongoose would see subscriber with reference of User and fetches user data

    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched")
    );
})

const getSubscribedChannel = asyncHandler(async(req,res)=>{
    const {subscriberId} = req.params;

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"Invalid subscriber id");
    }

    const subscribedChannels = await Subscription.find({
        subscriber: subscriberId
    }).populate("channel", "username fullname avatar");

    return res.status(200).json(
        new ApiResponse(200, subscribedChannels, "Subscribed channels fetched")
    )
});


export{toggleSubscription, getUserChannelSubscriber, getSubscribedChannel}