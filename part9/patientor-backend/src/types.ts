// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Patient {
    id: string;
    name: string;
    ssn: string;
    occupation: string;
    gender: Gender;
    dateOfBirth: string;
    entries: Entry[];
}

export type PublicPatient = Omit<Patient, "ssn" | "entries">;

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
}

export interface Diagnose {
    code: string;
    name: string;
    latin?: string;
}

export interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<Diagnose["code"]>;
}
export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3,
}

export interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
}

export interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: {
        date: string;
        criteria: string;
    };
}

export interface OccupationalHealthcare extends BaseEntry {
    type: "OccupationalHealthcare";
    employerName: string;
    sickLeave?: {
        startDate: string;
        endDate: string;
    };
}

export type Entry = HospitalEntry | OccupationalHealthcare | HealthCheckEntry;
export type NonSensitivePatient = Omit<Patient, "ssn">;
export type NewPatientEntry = Omit<Patient, "id">;
type UnionOmit<T, K extends string | number | symbol> = T extends unknown
    ? Omit<T, K>
    : never;
export type EntryWithoutId = UnionOmit<Entry, "id">;
