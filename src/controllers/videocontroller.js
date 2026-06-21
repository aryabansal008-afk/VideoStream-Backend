import mongoose, {isValidObjectId} from "mongoose"
import { Video } from "../models/videomodel"
import { User } from "../models/usermodel"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { uploadOnCloudinary } from "../utils/cloudinary"

const getAllVideos = asyncHandler(async(req, res)=>{
    const { page = 1, limit = 10, query, sortBy="createdAt", sortType="desc", userId } = req.query;

    const filter = {};

    if(query){
        filter.$or = [
            {title: {$regex: query,$options:"i"}},
            {description: {$regex: query, $options:"i"}}
        ];
    }

    if(userId && isValidObjectId(userId)){
        filter.owner = userId;
    }

    const sortOptions = {
        [sortBy]: sortType === "asc"?1:-1
    }

    const videos = await Video.find(filter).sort(sortOptions).skip((page-1)*limit).limit(Number(limit));

    const totalVideos = await Video.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, {videos, totalVideos, currentPage: Number(page), totalPages: Math.ceil(totalVideos/limit)},
        "Videos fetched successfully")
    );
});

const publishVideo = asyncHandler(async (req,res)=> {
    const{title, description} = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if(!videoFileLocalPath){
        throw new ApiError(400, "Video file is required");
    }

    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!videoFile){
        throw new ApiError(500, "Error uploading video");
    }

    if(!thumbnail){
        throw new ApiError(500, "Error uploading thumbnail");
    }

    const video = await Video.create({
        title,
        description, 
        videoFile: videoFile.url, thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: req.user?._id
    });

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    );
})

const getVideoById = asyncHandler (async (req,res)=>{
    const {videoId} = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video Id");
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    );
})

const updateVideo = asyncHandler(async (req,res)=>{
    const {videoId} = req.params;
    const {title, description} = req.body;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID");
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    let thumbnail;

    if(thumbnailLocalPath){
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                ...(title && {title}),
                ...(description && {description}),
                ...(thumbnail && {thumbnail: thumbnail.url})
            }
        },
        {new: true}
    );

    if(!video){
        throw new ApiError(400, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video updates successfully")
    );
})

const deleteVideo = asyncHandler(async (req,res)=>{
    const {videoId} = req.params;

    const video = await Video.findByIdAndDelete(videoId);

    if(!video){
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
})

const togglePublishStatus = asyncHandler(async (req,res)=>{
    const {videoId} = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;

    await video.save({validateBeforeSave: false});

    return res.status(200).json(new ApiResponse(200,video, "Video published status updated."))
})

export {getAllVideos, publishVideo,getVideoById, updateVideo, deleteVideo, togglePublishStatus}