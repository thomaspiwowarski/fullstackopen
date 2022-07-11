import diagnoses from "../../data/diagnoses";

import { Diagnose } from "../types";

export const getAllDiagnoses = (): Diagnose[] => {
    return diagnoses;
};
