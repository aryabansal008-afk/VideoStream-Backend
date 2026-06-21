import mongoose, {isValidObjectId} from "mongoose";
import { Like } from "../models/likemodel";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const toggleVideoLike = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponse(200,{},"Video unliked successfully")
        );
    }

    const like = await Like.create({
        video: videoId,
        likedBy: req.user._id
    });
    
    return res.status(200).json(
        new ApiResponse(200,like, "Video liked successfully")
    );

})

const toggleCommentLike = asyncHandler(async(req,res)=> {
    const {commentId} = req.params;

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id");
    }

    const existingCommentLike = await Like.findOne({
        likedBy: req.user._id,
        comment: commentId,
    });

    if(existingCommentLike){
        await Like.findByIdAndDelete(existingCommentLike._id);
        return res.status(200).json(
            new ApiResponse(200,{},"Comment unliked successfully")
        );
    }

    const like = await Like.create({
        likedBy: req.user._id,
        comment: commentId,
    })

    return res.status(200).json(
        new ApiResponse(200, like, "Comment liked successfully")
    );
})

const toggleTweetLike = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id");
    }

    const existingLikeTweet = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if(existingLikeTweet){
        await Like.findByIdAndDelete(existingLikeTweet._id);

        return res.status(200).json(
            new ApiResponse(200,{},"Tweet unliked successfully")
        );
    }

    const like =await Like.create({
        likedBy: req.user._id,
        tweet: tweetId
    })

    return res.status(200).json(
        new ApiResponse(200, like, "Tweet liked successfully")
    );
})

const getLikedVideos = asyncHandler(async (req,res)=>{
    const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: {$exists:true}
    }).populate("video");

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched")
    )
})

export{toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos}