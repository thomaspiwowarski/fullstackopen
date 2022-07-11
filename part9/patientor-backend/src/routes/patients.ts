import express from "express";
import * as patientService from "../services/patientService";
import { toNewPatientEntry, toNewEntry } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send(patientService.getAllPatients());
});

router.get("/:id", (req, res) => {
    try {
        const { id } = req.params;
        res.json(patientService.getPatient(id));
    } catch (error: unknown) {
        let errorMessage = "Something went wrong";
        if (error instanceof Error) errorMessage += ` Error ${error.message}`;
        res.status(400).send(errorMessage);
    }
});

router.post("/", (req, res) => {
    try {
        const newPatientEntry = toNewPatientEntry(req.body);
        const addedPatient = patientService.addPatient(newPatientEntry);
        res.json(addedPatient);
    } catch (error: unknown) {
        let errorMessage = "Something went wrong";
        if (error instanceof Error) errorMessage += ` Error ${error.message}`;
        res.status(400).send(errorMessage);
    }
});

router.post("/:id/entries", (req, res) => {
    try {
        const { id } = req.params;
        const newEntry = toNewEntry(req.body);
        console.log(newEntry);
        const addedEntry = patientService.addEntry(newEntry, id);
        res.json(addedEntry);
    } catch (error: unknown) {
        let errorMessage = "Something went wrong";
        if (error instanceof Error) errorMessage += ` Error ${error.message}`;
        res.status(400).send(errorMessage);
    }
});

export default router;
