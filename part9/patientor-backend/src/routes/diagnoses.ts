import express from "express";
import * as diagnosesService from "../services/diagnoseService";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send(diagnosesService.getAllDiagnoses());
});

export default router;
