import { Field, Formik, Form } from "formik";
import {
    TextField,
    SelectField,
    DiagnosisSelection,
} from "../AddPatientModal/FormField";
import { Entry, EntryWithoutId, HealthCheckRating } from "../types";
import { FormikHelpers } from "formik";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Grid, Button } from "@material-ui/core";
import { addEntry } from "../state";
import * as Yup from "yup";

const HealthChechRatingOptions = [
    {
        value: HealthCheckRating.Healthy,
        label: "Healthy",
    },
    { value: HealthCheckRating.LowRisk, label: "Low risk" },
    { value: HealthCheckRating.HighRisk, label: "High risk" },
    { value: HealthCheckRating.CriticalRisk, label: "Critical risk" },
];

const HealthCheckEntryForm = ({ id }: { id: string }) => {
    const [{ diagnosis }, dispatch] = useStateValue();

    if (!diagnosis || diagnosis.length === 0) return <div>Loading...</div>;

    const handleSubmit = async (
        values: EntryWithoutId,
        { resetForm }: FormikHelpers<EntryWithoutId>
    ): Promise<void> => {
        try {
            const { data: response } = await axios.post<Entry>(
                `${apiBaseUrl}/patients/${id}/entries`,
                values
            );
            dispatch(addEntry(id, response));
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    const HealthCheckFormSchema = Yup.object().shape({
        description: Yup.string().required("Required"),
        date: Yup.date().required("Required"),
        specialist: Yup.string().required("Required"),
    });

    return (
        <Formik
            initialValues={{
                description: "",
                date: "",
                specialist: "",
                diagnosisCodes: [],
                healthCheckRating: HealthCheckRating.Healthy,
                type: "HealthCheck",
            }}
            validationSchema={HealthCheckFormSchema}
            onSubmit={handleSubmit}
        >
            {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
                return (
                    <Form className='form ui'>
                        <Field
                            label='Description'
                            placeholder='Description'
                            name='description'
                            component={TextField}
                        />
                        <Field
                            label='Date'
                            placeholder='YYYY-MM-DD'
                            name='date'
                            component={TextField}
                        />
                        <Field
                            label='Specialist'
                            placeholder='Specialist'
                            name='specialist'
                            component={TextField}
                        />
                        <SelectField
                            label='Health Check Rating'
                            options={HealthChechRatingOptions}
                            name='healthCheckRating'
                        />
                        <DiagnosisSelection
                            diagnoses={Object.values(diagnosis)}
                            setFieldTouched={setFieldTouched}
                            setFieldValue={setFieldValue}
                        />
                        <Grid>
                            <Grid item>
                                <Button
                                    color='secondary'
                                    variant='contained'
                                    style={{ float: "left" }}
                                    type='button'
                                    onClick={() => null}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    style={{ float: "right" }}
                                    type='submit'
                                    variant='contained'
                                    disabled={!dirty || !isValid}
                                >
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default HealthCheckEntryForm;
