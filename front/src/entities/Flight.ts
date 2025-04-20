export interface Flight {
    id: number;
    flightNumber: number;
    destination: string;
    departureTime: Date;
    gate: string;
    
    status: Status;
    isDeleted?: boolean;
    isNew?: boolean
    isDisabled?: boolean;
}

export interface Status {
    name: FlightStatus;
    isChanged?: boolean;
}

export type FlightStatus = "Scheduled" | "Boarding" | "Departed" | "Landed" | "Delayed";
