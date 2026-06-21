import {Router} from "express";
import {getVideoComments, addComment, updateComment, deleteComment} from "../controllers/commentcontroller.js";
import {verifyJWT} from "../middlewares/auth.js";

const router = Router();
router.use(verifyJWT);

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;