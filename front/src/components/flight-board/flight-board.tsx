import * as signalR from "@microsoft/signalr";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { Flight } from "../../entities/Flight";
import { apiUrl, DeleteFlightApi } from "../../Services/api.service";
import { getStatusByDepartureTime } from "../../Services/utils.service";
import "./flight-board.scss";
import FilterForm from "../search/filter-form";

function FlightBoard() {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    const startConnection = () => {

        closeConnection();

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${apiUrl}/connect`)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        newConnection.start()
            .then(() => setIsConnected(true))
            .catch(() => setIsConnected(false));

        newConnection.onclose(() => setIsConnected(false));

        // newConnection.on("ReceiveFlights", (flightsRes: Flight[]) => {
        //     const flights = flightsRes.map((flight) =>
        //     ({
        //         ...flight,
        //         status: {
        //             name: getStatusByDepartureTime(new Date(flight.departureTime))
        //         }
        //     }));

        //     setFlights(flights);
        //     if (connection) connection.off("ReceiveFlights");
        // });

        newConnection.on("FlightAdded", (newFlight: Flight) => {
            newFlight.isNew = true;
            newFlight.status = {
                name: getStatusByDepartureTime(new Date(newFlight.departureTime))
            }
            setFlights(prev => [...prev, newFlight]);

            setTimeout(() => {
                setFlights(prev => {
                    const flight = prev.find(f => f.id === newFlight.id);
                    if (flight) {
                        flight.isNew = false;
                    }
                    return [...prev];
                });
            }, 3000);
        });

        newConnection.on("FlightDeleted", (flightId: number) => {
            setFlights(prev => {
                const flight = prev.find(f => f.id === flightId);
                if (flight) {
                    flight.isDeleted = true;
                }
                return [...prev];
            });

            setTimeout(() => {
                setFlights(prev => {
                    const index = prev.findIndex(f => f.id === flightId);
                    if (index !== -1) {
                        prev.splice(index, 1);
                    }
                    return [...prev];
                });
            }, 3000);
        });

        setConnection(newConnection);
    }

    const closeConnection = () => {
        if (connection) {
            // connection.off("ReceiveFlights");
            connection.off("FlightAdded");
            connection.off("FlightDeleted");
            connection.stop();

            setConnection(null);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            updateStatuses();
        // }, 120000); // 2 minutes
        }, 4000); // 444444444444444444444
        return () => clearInterval(interval);
    }, [flights]);

    const updateStatuses = () => {
        const changed: number[] = [];

        setFlights(flights => {
            flights.forEach(flight => {
                const newStatus = getStatusByDepartureTime(new Date(flight.departureTime));
                if (newStatus !== flight.status?.name) {
                    flight.status = {
                        name: newStatus,
                        isChanged: true
                    }
                    changed.push(flight.id);
                }
            });

            return [...flights];
        });

        setTimeout(() => {
            setFlights(flights => {
                return flights.map(flight =>
                    changed.includes(flight.id) ?
                        {
                            ...flight,
                            status: { ...flight.status, isChanged: false }
                        }
                        :
                        flight
                );
            });
        }, 8000);

    };

    const handleDelete = async (id: number) => {
        try {
            setFlights((prev) =>
                prev.map((flight) =>
                    flight.id === id
                        ? { ...flight, isDisabled: true }
                        : flight
                )
            );
            await DeleteFlightApi(id);
        } catch (error) {
            console.error("Error deleting flight:", error);
            alert(error);
            setFlights((prev) =>
                prev.map((flight) =>
                    flight.id === id
                        ? { ...flight, isDisabled: false }
                        : flight
                )
            );
        }
    };

    return (
        <>
            <div className="connection-indicator">
                <div className={`glow ${isConnected ? "connected" : "disconnected"}`} />
                <span className="status-text">{isConnected ? "Connected" : "Disconnected"}</span>
                {!isConnected && (
                    <IconButton color="primary" size="small" sx={{ padding: 0, fontSize: "inherit" }} >
                        <RefreshIcon sx={{ fontSize: "18px" }} onClick={startConnection} />
                    </IconButton>
                )}
            </div>
            <FilterForm setFlights={setFlights} startConnection={startConnection} closeConnection={closeConnection} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Flight Number</TableCell>
                            <TableCell>Destination</TableCell>
                            <TableCell>Departure Time</TableCell>
                            <TableCell>Gate</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flights.map((flight) => (
                            <TableRow key={flight.id} className={flight.isDeleted ? "deleted" : flight.isNew ? "new" : ""}>
                                <TableCell>{flight.flightNumber}</TableCell>
                                <TableCell>{flight.destination}</TableCell>
                                <TableCell>{new Date(flight.departureTime).toLocaleString('he-il')}</TableCell>
                                <TableCell>{flight.gate}</TableCell>
                                <TableCell className={flight.status?.isChanged ? 'changed' : ''}>
                                    {flight.status?.name}
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" onClick={() => handleDelete(flight.id)} disabled={flight.isDisabled}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default FlightBoard;
