import dayjs from "dayjs";
import { FlightFormData } from "../entities/FlightFormData";
import { FlightReq } from "../entities/FlightReq";
import { Flight } from "../entities/Flight";

export const apiUrl = 'https://localhost:7233/api'

export async function AddFlightApi(values: FlightFormData) {
    const request: FlightReq =
    {
        flightNumber: parseInt(values.flightNumber),
        destination: values.destination,
        // departureTime: new Date(values.departureTime).toISOString(),
        departureTime: dayjs(values.departureTime).format("YYYY-MM-DDTHH:mm:ss"),
        gate: values.gate
    }

    const response = await fetch(`${apiUrl}/flights`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    return response;
}

export async function DeleteFlightApi(id: number) {
    const response = await fetch(`${apiUrl}/flights/${id}`, { method: "DELETE" });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response;
}

export async function GetFlightsApi(queryParams: string) {
    const response = await fetch(`${apiUrl}/flights?${queryParams}`, {
        method: "GET",
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json() as Flight[]
    return result;
}


