import {
    Card,
    CardContent,
    List,
    ListItem,
    Typography,
} from "@material-ui/core";
import { HealthCheckEntry } from "../types";
import { useStateValue } from "../state";
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import FavoriteIcon from "@mui/icons-material/Favorite";

const HealthCheck = ({ entry }: { entry: HealthCheckEntry }) => {
    const [{ diagnosis }] = useStateValue();

    const getDiagnosisDescription = (code: string): string | undefined => {
        return diagnosis?.find((diagnose) => diagnose.code === code)?.name;
    };

    let color: "green" | "yellow" | "orange" | "red";

    switch (entry.healthCheckRating) {
        case 0:
            color = "green";
            break;
        case 1:
            color = "yellow";
            break;
        case 2:
            color = "orange";
            break;
        case 3:
            color = "red";
            break;
        default:
            color = "green";
            break;
    }

    return (
        <Card style={{ margin: 10 }}>
            <CardContent>
                <Typography>
                    {entry.date}
                    <MedicationLiquidIcon />
                </Typography>
                <Typography>
                    {entry.description}
                    <FavoriteIcon style={{ color: color }} />
                </Typography>
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

export default HealthCheck;
