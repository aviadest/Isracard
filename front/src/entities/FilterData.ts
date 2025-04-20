export interface FilterData {
    dates?: DateRange;
    Destination?: string;
}

export interface DateRange {
    start: Date | null;
    end: Date | null;
}

