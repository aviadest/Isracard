import { Button, FormControl, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/he";
import { Form, Formik } from "formik";
import React from "react";
import { FlightFormData } from "../../entities/FlightFormData";
import { AddFlightApi } from "../../Services/api.service";
import "./add-flight.scss";
import { onChangeFlightNumber } from "../../Services/utils.service";


const initialValues: FlightFormData = {
    flightNumber: "",
    destination: "",
    departureTime: "",
    gate: "",
};

const validate = (values: FlightFormData) => {
    const errors: Partial<FlightFormData> = {};

    if (!values.flightNumber) {
        errors.flightNumber = "Flight number is required.";
    } else if (!/^\d+$/.test(values.flightNumber)) {
        errors.flightNumber = "Flight number must be numeric.";
    }

    if (!values.destination) errors.destination = "Destination is required.";
    if (!values.gate) errors.gate = "Gate is required.";

    if (!values.departureTime) {
        errors.departureTime = "Departure time is required.";
    }
    
     else if (dayjs(values.departureTime).isBefore(dayjs())) {
        errors.departureTime = "Departure time must be in the future.";
    }

    return errors;
};

function AddFlight() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
            <h1>Add Flight</h1>
            <Formik
                initialValues={initialValues}
                validate={validate}
                onSubmit={async (values, { resetForm }) => {
                    try {
                        const res = await AddFlightApi(values);
                        const result = await res.json();
                        console.log({ res, result })
                        if (res.ok) {
                            alert(result.message);
                            resetForm();
                        }
                        else if (result.errors) {
                            let errorMessage = 'Error!';
                            Object.keys(result.errors).forEach((key) => {
                                errorMessage += `\n${key} : ${result.errors[key]?.[0]}`;
                            });
                            alert(errorMessage);
                        }
                        else {
                            throw new Error();
                        }
                    } catch (error) {
                        console.error("Error adding flight:", error);
                        alert("Error adding flight. Please try again.");
                    }
                }}
            >
                {({ handleSubmit, handleChange, setFieldValue, values, errors, touched }) => (
                    <Form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                name="flightNumber"
                                label="Flight Number"
                                variant="outlined"
                                value={values.flightNumber}
                                onChange={(e) => {
                                    onChangeFlightNumber(e);
                                    handleChange(e);
                                }}
                                error={touched.flightNumber && !!errors.flightNumber}
                                helperText={touched.flightNumber ? errors.flightNumber : ""}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <TextField
                                name="destination"
                                label="Destination"
                                variant="outlined"
                                value={values.destination}
                                onChange={handleChange}
                                error={touched.destination && !!errors.destination}
                                helperText={touched.destination ? errors.destination : ""}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <DateTimePicker
                                closeOnSelect={true}
                                label="Departure Time"
                                value={values.departureTime ? dayjs(values.departureTime) : null} // Convert to Day.js object if value exists
                                onChange={(newValue) => {
                                    // Update form value and format departure time using Day.js
                                    const formattedValue = newValue ? dayjs(newValue).format("YYYY-MM-DDTHH:mm:ss") : null;
                                    setFieldValue("departureTime", formattedValue);
                                }}
                                slotProps={{
                                    textField: {
                                        error: touched.departureTime && !!errors.departureTime,
                                        helperText: touched.departureTime ? errors.departureTime : "",
                                    },
                                }}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <TextField
                                name="gate"
                                label="Gate"
                                variant="outlined"
                                value={values.gate}
                                onChange={handleChange}
                                error={touched.gate && !!errors.gate}
                                helperText={touched.gate ? errors.gate : ""}
                            />
                        </FormControl>

                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Add Flight
                        </Button>
                    </Form>
                )}
            </Formik>
        </LocalizationProvider>
    );
};

export default AddFlight;
