// components/Timeline/types.ts

export interface TimeBreakdownItem {
	startTime: string;
}

export interface Limit {
	startTime: string;
	endTime: string;
	limit: number;
}

export interface ChargingSession {
	startTime: string;
	endTime: string;
	sessionDuration: string;
	soc?: number;
	startSoc?: number;
	faulted?: boolean;
	transactionStatus?: string;
	transactionId?: string;
	totalKwh?: number;
}

export interface ChargerData {
	name: string;
	port: string;
	status: string;
	limits: Limit[];
	chargingSessions: ChargingSession[];
}

export interface StationItem {
	name: string;
	chargers: ChargerData[];
	address: string; // Add address prop
	timezone: string;
}

export interface TimelineData {
	timeBreakdown?: TimeBreakdownItem[];
	stations?: StationItem[];
	currentTime?: any; // Define a more specific type if known
}
