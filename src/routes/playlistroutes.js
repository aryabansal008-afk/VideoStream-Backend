import { Router } from "express";
import {createPlaylist, getUserPlaylists, getPlayListById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist} from "../controllers/playlistcontroller.js"
import {verifyJWT} from "../middlewares/auth.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist)

router.route("/:playlistId")
.get(getPlayListById)
.patch(updatePlaylist)
.delete(deletePlaylist);

router.route("/user/:userId").get(getUserPlaylists);

router.route("/:playlistId/add/:videoId").patch(addVideoToPlaylist);
router.route("/:playlistId/remove/:videoId").patch(removeVideoFromPlaylist);

export default router;