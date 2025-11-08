// types/logs.ts

// Define the structure of a log message payload
export type MessagePayload = {
	// Common fields
	key?: string;
	value?: string;
	responseStatus?: string;
	timestamp?: string;
	status?: string;
	errorCode?: string;
	vendorErrorCode?: string;

	// Transaction fields
	idTag?: string | null;
	transactionId?: string;
	connectorId?: string | null;
	chargerId?: string;
	uniqueId?: string;

	// Meter values
	PowerActiveImport?: string | number;
	PowerActiveImportUnit?: string;
	EnergyActiveImportRegister?: string | number;
	EnergyActiveImportRegisterUnit?: string;
	CurrentImport?: string | number;
	CurrentImportUnit?: string;
	Voltage?: string | number;
	VoltageUnit?: string;
	SoC?: string | number;

	// Stop transaction specific
	meterStop?: string | null;
};

// Define the structure of a single log entry
export type LogEntry = {
	timeReceived: string;
	messageType: string;
	messagePayload?: MessagePayload;
};
