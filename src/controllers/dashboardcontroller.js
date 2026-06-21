import mongoose from "mongoose";
import { Video } from "../models/videomodel.js";
import { Like } from "../models/likemodel.js";
import { Subscription } from "../models/subscriptionmodel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async(req,res)=>{
    const totalVideos = await Video.countDocuments({
        owner:req.user._id
    });

    const videos = await Video.find({
        owner: req.user._id
    });

    const totalViews = videos.reduce(
        (acc,video) => acc+ video.views, 0
    );

    const totalSubscribers = await Subscription.countDocuments({
        channel: req.user._id
    });

    const videoIds = videos.map((video)=> video._id);

    const totalLikes = await Like.countDocuments({
        video: {$in: videoIds}
    });

    return res.status(200).json(
        new ApiResponse(200,{totalLikes, videos, totalVideos, totalViews, totalSubscribers, videoIds}, "Channel stats fetched")
    );
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({
        owner: req.user._id
    }).sort({createdAt: -1});

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched")
    );
})

export {getChannelStats, getChannelVideos};
