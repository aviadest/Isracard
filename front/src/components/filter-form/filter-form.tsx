import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect } from 'react';
import { Flight } from '../../entities/Flight';
import { GetFlightsApi } from '../../Services/api.service';
import { getStatusByDepartureTime } from '../../Services/utils.service';
import './filter-form.scss';

interface FilterFormProps {
    setFlights: React.Dispatch<React.SetStateAction<Flight[]>>;
    startConnection: () => void;
    closeConnection: () => void;
}
const FilterForm: React.FC<FilterFormProps> = (
    {
        setFlights,
        startConnection,
        closeConnection
    }) => {

    const initialValues = {
        status: "",
        destination: "",
    };

    const getFlights = async (values: typeof initialValues) => {
        try {
            const queryParams = new URLSearchParams(values).toString();
            const flightsRes = await GetFlightsApi(queryParams);
            const flights = flightsRes.map((flight) =>
            ({
                ...flight,
                status: {
                    name: getStatusByDepartureTime(new Date(flight.departureTime))
                }
            }));

            setFlights(flights);
            startConnection();
        } catch (error) {
            console.error("Error fetching flights:", error);
            alert("Error fetching flights. Please try again.");
        }
    }

    useEffect(() => {

    }, []);

    useEffect(() => {

        getFlights(initialValues);
        return () => {
            closeConnection();
        };

    }, []);
    return (
        <div className='filter-container'>
            <Formik
                initialValues={initialValues}
                onSubmit={async (values) => {
                    getFlights(values);
                }}
                onReset={async () => {
                    getFlights(initialValues);
                }}
            >
                {({ handleSubmit, handleChange, values, errors, touched }) => (
                    <Form onSubmit={handleSubmit}>
                        <FormControl style={{ flex: 1 }}>
                            <TextField
                                name="destination"
                                label="Destination"
                                variant="outlined"
                                value={values.destination}
                                onChange={handleChange}
                                helperText={touched.destination ? errors.destination : ""}
                                fullWidth
                            />
                        </FormControl>
                        <FormControl style={{ flex: 1 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={values.status}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="Scheduled">Scheduled</MenuItem>
                                <MenuItem value="Boarding">Boarding</MenuItem>
                                <MenuItem value="Departed">Departed</MenuItem>
                                <MenuItem value="Landed">Landed</MenuItem>
                                <MenuItem value="Delayed">Delayed</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" type="submit">
                            Filter
                        </Button>
                        <Button variant="contained" color="secondary" type="reset">
                            Reset
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>

    )
}

export default FilterForm;
