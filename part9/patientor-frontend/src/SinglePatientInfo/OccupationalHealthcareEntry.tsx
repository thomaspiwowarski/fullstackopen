import {
    Card,
    CardContent,
    List,
    ListItem,
    Typography,
} from "@material-ui/core";
import { useStateValue } from "../state";
import { OccupationalHealthcareEntry } from "../types";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const OccupationalHealthcare = ({
    entry,
}: {
    entry: OccupationalHealthcareEntry;
}) => {
    const [{ diagnosis }] = useStateValue();

    const getDiagnosisDescription = (code: string): string | undefined => {
        return diagnosis?.find((diagnose) => diagnose.code === code)?.name;
    };
    console.log(entry);
    return (
        <Card style={{ margin: 10 }}>
            <CardContent>
                <Typography>
                    {entry.date} <LocalHospitalIcon />
                </Typography>
                <Typography> {entry.description}</Typography>
                <List>
                    {entry.diagnosisCodes?.map((code) => (
                        <ListItem key={code}>
                            {code} {getDiagnosisDescription(code)}
                        </ListItem>
                    ))}
                </List>
                <Typography>diagnosed by {entry.specialist}</Typography>
            </CardContent>
        </Card>
    );
};

export default OccupationalHealthcare;
