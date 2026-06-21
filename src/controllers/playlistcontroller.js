import mongoose, {isValidObjectId} from "mongoose";
import { Playlist } from "../models/playlistmodel";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const createPlaylist = asyncHandler(async(req,res)=>{
    const {name, description} = req.body;

    if(!name?.trim()){
        throw new ApiError(400, "Playlist name is required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201,playlist,"Playlist created successfully")
    );
})

const getUserPlaylists = asyncHandler(async(req,res)=>{
    const{userId} = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const playlists = await Playlist.find({
        owner: userId
    }).sort({createdAt: -1});

    return res.status(200).json(
        new ApiResponse(200, playlists, "User playlists fetched")
    );
})

const getPlayListById = asyncHandler(async (req,res)=>{
    const {playlistId} = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched")
    );
})

const addVideoToPlaylist = asyncHandler(async(req,res)=>{
    const{playlistId, videoId} = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid id");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId
            }
        },
        {new:true}
    );

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
})

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    const{playlistId, videoId} = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid id");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{
                videos: videoId,
            }
        },
        {new:true}
    );

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from the playlist")
    );
})

const deletePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId}= req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if(!playlist){
        throw new ApiError(404,"Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Playlist deleted successfully")
    );
})

const updatePlaylist = asyncHandler(async(req,res)=>{
    const{playlistId}= req.params;
    const{name,description} = req.body;

    if(isValidObjectId(playlistId)){
        throw ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                ...(name && {name}),
                ...(description && {description})
            }
        },
        {new:true}
    );

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist updated successfully")
    );
})

export{createPlaylist, getUserPlaylists, getPlayListById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist}