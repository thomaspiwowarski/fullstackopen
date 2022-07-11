import {
    Card,
    CardContent,
    List,
    ListItem,
    Typography,
} from "@material-ui/core";
import { useStateValue } from "../state";
import { HospitalEntry } from "../types";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const Hospital = ({ entry }: { entry: HospitalEntry }) => {
    const [{ diagnosis }] = useStateValue();

    const getDiagnosisDescription = (code: string): string | undefined => {
        return diagnosis?.find((diagnose) => diagnose.code === code)?.name;
    };

    return (
        <Card style={{ margin: 10 }}>
            <CardContent>
                <Typography>
                    {entry.date} <MedicalServicesIcon />
                </Typography>
                <Typography>{entry.description}</Typography>
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

export default Hospital;
