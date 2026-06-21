import mongoose, {isValidObjectId} from "mongoose";
import { Tweet } from "../models/tweetmodel.js";
import { User } from "../models/usermodel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res)=>{
    const {content}= req.body;

    if(!content?.trim()){
        throw new ApiError(400, "Tweet content empty");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id,
    });

    return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet created successfully")
    );
});

const getUserTweets = asyncHandler (async (req,res)=>{
    const {userId} = req.params;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }

    const tweets = (await Tweet.find({owner: userId})).toSorted({createdAt:-1});  //sorting from newest to oldest

    return res.status(200).json(
        new ApiResponse(200,tweets,"User tweets fetched successfully")
    );
})

const updateTweet = asyncHandler(async (req,res)=>{
    const {tweetId} = req.params;
    const {content} = req.body;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id");
    }

    if(!content?.trim()){
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content,
            }
        },
        {
            new:true
        }
    );

    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }

    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet updated successfully")
    );
})

const deleteTweet = asyncHandle(async(req,res)=>{
    const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id");
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if(!twet){
        throw new ApiError(404, "Tweet not found");
    }

    return res.status(200).json(
        new ApiResponse(200,{},"Tweet deleted successfully")
    )
})

export{createTweet, getUserTweets, updateTweet, deleteTweet}