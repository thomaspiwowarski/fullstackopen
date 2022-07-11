import { useParams } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Typography, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import HealthCheckEntryForm from "./HealthCheckEntryForm";
import HospitalEntryForm from "./HospitalEntryForm";
import OccupationalHealthcareEntryForm from "./OccupationalHealthcareEntryForm";

const EntryFormsBase = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) return <div>Loading...</div>;
    return (
        <Box>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                >
                    <Typography>Health check entry</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <HealthCheckEntryForm id={id} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel2a-content'
                    id='panel2a-header'
                >
                    <Typography>Hospital entry</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <HospitalEntryForm id={id} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel3a-content'
                    id='panel3a-header'
                >
                    <Typography>Occupational healthcare entry</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <OccupationalHealthcareEntryForm id={id} />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default EntryFormsBase;
