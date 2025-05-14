import express from "express";

const router = express.Router();

router.get("/status", (req, res) => {
  res.status(200).json({ message: "APIs v1 ready" });
});

export const APIs_V1 = router;
