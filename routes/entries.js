import { Router } from "express";
import { getEntries, postEntry, putEntry, removeEntry,} from "../controllers/entriesController.js";

const router= Router();
const asyncHandler= (fn) => (req,res,next) => {
  fn(req,res,next).catch(next);
};

router.get("/", asyncHandler(getEntries));
router.post("/", asyncHandler(postEntry));
router.put("/:id", asyncHandler(putEntry));
router.delete("/:id", asyncHandler(removeEntry));

export default router;
