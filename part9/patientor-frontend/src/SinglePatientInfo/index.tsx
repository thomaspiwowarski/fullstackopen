import { setDiagnosis, useStateValue } from "../state";
import { PatientWithEntries, Diagnosis, Entry } from "../types";
import { useParams } from "react-router-dom";
import { Typography, Container, Box } from "@material-ui/core";
import { useEffect } from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { addPatientInfo } from "../state";
import Hospital from "./HospitalEntry";
import OccupationalHealthcare from "./OccupationalHealthcareEntry";
import HealthCheck from "./HealthCheckEntry";
import EntryFormsBase from "./EntryFormsBase";

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
        case "Hospital":
            return <Hospital entry={entry} />;
        case "OccupationalHealthcare":
            return <OccupationalHealthcare entry={entry} />;
        case "HealthCheck":
            return <HealthCheck entry={entry} />;
        default:
            return assertNever(entry);
    }
};

const SinglePatientInfo = () => {
    const { id } = useParams<{ id: string }>();
    const [{ patientsInfo }, dispatch] = useStateValue();

    // const getDiagnosisDescription = (code: string): string | undefined => {
    //     return diagnosis?.find((diagnose) => diagnose.code === code)?.name;
    // };

    if (!id) return <div>Loading</div>;

    useEffect(() => {
        if (id in patientsInfo) {
            return;
        }

        const fetchSinglePatient = async (): Promise<void> => {
            try {
                const { data: patient } = await axios.get<PatientWithEntries>(
                    `${apiBaseUrl}/patients/${id}`
                );
                console.log(patient);
                dispatch(addPatientInfo(patient));
                const response = await axios.get<Array<Diagnosis>>(
                    `${apiBaseUrl}/diagnoses`
                );
                dispatch(setDiagnosis(response.data));
            } catch (e) {
                console.error(encodeURI);
            }
        };
        void fetchSinglePatient();
    }, []);

    if (!(id in patientsInfo)) {
        return <div>No patient</div>;
    }

    const { name, occupation, gender, ssn, entries } = patientsInfo[id];

    const genderIcon = {
        male: <MaleIcon />,
        female: <FemaleIcon />,
        other: <TransgenderIcon />,
    };

    return (
        <Container>
            <Typography
                variant='h3'
                style={{ marginBottom: "0.5em", marginTop: "0.5em" }}
            >
                {name} {genderIcon[gender]}
            </Typography>
            <Typography>ssn: {ssn}</Typography>
            <Typography>occupation: {occupation}</Typography>
            <Box style={{ marginTop: "0.5em" }}>
                <Typography variant='h5'>entries</Typography>
                <Box>
                    {entries?.map((entry: Entry) => (
                        <Box key={entry.id}>
                            <EntryDetails entry={entry} />
                        </Box>
                    ))}
                </Box>
            </Box>
            <EntryFormsBase />
        </Container>
    );
};

export default SinglePatientInfo;
