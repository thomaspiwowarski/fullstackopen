import patientsData from "../../data/patients";
import { v4 as uuid } from "uuid";
import {
    NonSensitivePatient,
    NewPatientEntry,
    Patient,
    EntryWithoutId,
    Entry,
} from "../types";

export const getAllPatients = (): NonSensitivePatient[] => {
    return patientsData.map(
        ({ id, name, dateOfBirth, gender, occupation, entries }) => ({
            id,
            name,
            dateOfBirth,
            gender,
            occupation,
            entries,
        })
    );
};

export const getPatient = (id: string): Patient | undefined => {
    const patient = patientsData.find((patient) => patient.id === id);
    if (!patient) throw new Error("There is no patient with such id");
    return patient;
};

export const addPatient = (entry: NewPatientEntry): Patient => {
    const newPatientEntry = {
        id: uuid(),
        ...entry,
    };

    patientsData.push(newPatientEntry);
    return newPatientEntry;
};

export const findPatient = (id: string): Patient | undefined => {
    return patientsData.find((p) => p.id === id);
};

export const addEntry = (entry: EntryWithoutId, patientId: string): Entry => {
    const newEntry = {
        id: uuid(),
        ...entry,
    };

    const patient = findPatient(patientId);
    patient?.entries.push(newEntry);
    return newEntry;
};
