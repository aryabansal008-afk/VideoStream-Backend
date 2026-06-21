import mongoose from "mongoose";
import { Comment } from "../models/commentmodel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req,res)=> {
    const {videoId} = req.params;
    const {page=1,limit =10} = req.query;

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }

    const comments = await Comment.find({
        video: videoId
    })
    .sort({createdAt:-1})
    .skip((page-1)*limit)
    .limit(Number(limit));

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched")
    );
})

const addComment = asyncHandler(async(req,res)=>{
    const { videoId } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment added successfully")
    );
})

const updateComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {new:true}
    );

    if(!comment){
        throw new ApiError(404,"Comment not found");
    }

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async(req,res)=>{
    const { commentId } = req.params;
    const { content } = req.body;

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }

    const comment = await Comment.findByIdAndDelete(commentId);

    res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
})

export{getVideoComments, addComment, updateComment, deleteComment};
