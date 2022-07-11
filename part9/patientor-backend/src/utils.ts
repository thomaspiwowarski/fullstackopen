import {
    NewPatientEntry,
    Gender,
    HealthCheckRating,
    EntryWithoutId,
} from "./types";

const assertNever = (value: string): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const isString = (text: unknown): text is string => {
    return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): date is string => {
    return Boolean(Date.parse(date));
};

const isGender = (gender: any): gender is Gender => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.values(Gender).includes(gender);
};

const isArrayOfStrings = (array: unknown[]): array is string[] => {
    return array.every(isString);
};

const isHealthCheckRating = (
    healthCheckRating: any
): healthCheckRating is HealthCheckRating => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.keys(HealthCheckRating).includes(String(healthCheckRating));
};

const isDischarge = (discharge: unknown): discharge is DischargeType => {
    const keys = Object.keys(Object.assign({}, discharge));
    if (keys.length !== 2) return false;
    return keys.includes("date") && keys.includes("criteria");
};

const isSickLeave = (sickLeave: unknown): sickLeave is SickLeaveType => {
    const keys = Object.keys(Object.assign({}, sickLeave));
    if (keys.length !== 2) return false;
    return keys.includes("startDate") && keys.includes("endDate");
};

const parseName = (name: unknown): string => {
    if (!name || !isString(name)) throw new Error("Incorrect or missing name");
    return name;
};

const parseDate = (date: unknown): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error("Incorrect or missing date");
    }
    return date;
};

const parseSsn = (ssn: unknown): string => {
    if (!ssn || !isString(ssn)) throw new Error("Incorrect or missing name");
    return ssn;
};

const parseOccupation = (occupation: unknown): string => {
    if (!occupation || !isString(occupation))
        throw new Error("Incorrect or missing occupation");
    return occupation;
};

const parseGender = (gender: unknown): Gender => {
    if (!gender || !isGender(gender))
        throw new Error("Incorrect or missing gender");
    return gender;
};

const parseType = (type: unknown): string => {
    if (!type || !isString(type)) throw new Error("Incorrect or missing type");
    return type;
};

const parseDescription = (description: unknown): string => {
    if (!description || !isString(description))
        throw new Error("Incorrect or missing description");
    return description;
};

const parseSpecialist = (specialist: unknown): string => {
    if (!specialist || !isString(specialist))
        throw new Error("Incorrect or missing specialist");
    return specialist;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown[]): string[] => {
    if (
        !diagnosisCodes.length ||
        !Array.isArray(diagnosisCodes) ||
        !isArrayOfStrings(diagnosisCodes)
    ) {
        throw new Error("Incorrect or missing diagnosis codes");
    }
    diagnosisCodes.forEach((code) => {
        if (code.length < 3 || code.length > 6) {
            throw new Error("Incorrect diagnosisCodes!");
        }
    });

    return diagnosisCodes;
};

const parseHealthCheckRating = (
    healthCheckRating: unknown
): HealthCheckRating => {
    if (!isHealthCheckRating(healthCheckRating)) {
        throw new Error("Incorrect or missing health check rating");
    }
    return healthCheckRating;
};

type DischargeType = {
    date: string;
    criteria: string;
};

const parseDischarge = (discharge: unknown): DischargeType => {
    if (
        !isDischarge(discharge) ||
        !isDate(discharge.date) ||
        !isString(discharge.criteria)
    )
        throw new Error("Incorrect or missing health check rating");
    return discharge;
};

const parseEmployerName = (employerName: unknown): string => {
    if (!employerName || !isString(employerName))
        throw new Error("Incorrect or missing employer name");
    return employerName;
};

type SickLeaveType = {
    startDate: string;
    endDate: string;
};

const parseSickLeave = (sickLeave: unknown): SickLeaveType => {
    if (
        !isSickLeave(sickLeave) ||
        !isDate(sickLeave.startDate) ||
        !isDate(sickLeave.endDate)
    )
        throw new Error("Incorrect or missing dates");

    return sickLeave;
};

type Fields = {
    name: unknown;
    dateOfBirth: unknown;
    ssn: unknown;
    occupation: unknown;
    gender: unknown;
};

export const toNewPatientEntry = ({
    name,
    dateOfBirth,
    ssn,
    occupation,
    gender,
}: Fields): NewPatientEntry => {
    const newEntry: NewPatientEntry = {
        name: parseName(name),
        dateOfBirth: parseDate(dateOfBirth),
        ssn: parseSsn(ssn),
        occupation: parseOccupation(occupation),
        gender: parseGender(gender),
        entries: [],
    };

    return newEntry;
};

type toNewEntryField = {
    type: unknown;
    description: unknown;
    date: unknown;
    specialist: unknown;
    diagnosisCodes?: unknown[];
    healthCheckRating?: unknown;
    discharge?: unknown;
    employerName?: unknown;
    sickLeave?: unknown;
};

export const toNewEntry = ({
    type,
    description,
    date,
    specialist,
    diagnosisCodes,
    healthCheckRating,
    discharge,
    employerName,
    sickLeave,
}: toNewEntryField): EntryWithoutId => {
    const entryType = parseType(type);
    let baseEntry = {
        description: parseDescription(description),
        date: parseDate(date),
        specialist: parseSpecialist(specialist),
    };

    if (diagnosisCodes) {
        baseEntry = Object.assign(baseEntry, {
            diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
        });
    }

    switch (entryType) {
        case "HealthCheck":
            return {
                ...baseEntry,
                healthCheckRating: parseHealthCheckRating(healthCheckRating),
                type: "HealthCheck",
            };
        case "Hospital":
            return {
                ...baseEntry,
                discharge: parseDischarge(discharge),
                type: "Hospital",
            };
        case "OccupationalHealthcare":
            if (!sickLeave) {
                return {
                    ...baseEntry,
                    employerName: parseEmployerName(employerName),
                    type: "OccupationalHealthcare",
                };
            } else {
                return {
                    ...baseEntry,
                    employerName: parseEmployerName(employerName),
                    sickLeave: parseSickLeave(sickLeave),
                    type: "OccupationalHealthcare",
                };
            }
        default:
            return assertNever(entryType);
    }
};
