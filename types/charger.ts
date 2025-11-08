// types/charger.ts

export const ChargerStatusValues = [
	"Available",
	"Preparing",
	"Pending",
	"Accepted",
	"Charging",
	"Finishing",
	"Completed",
	"Offline",
	"Faulted",
	"Rejected",
	"Stopped",
	"Unavailable",
	"Reserved",
	"Warning",
	"Approved",
] as const;

export type ChargerStatus = (typeof ChargerStatusValues)[number];

export interface UsageData {
	time: string;
	currentImport: number;
	SoC: number;
	transactionId: number;
}

export interface ChartPortData {
	port: number;
	usage: UsageData[];
}

export interface ChartData {
	meterData: ChartPortData[];
}

type DebugInfo = {
	error?: string;
	message?: string;
	data?: unknown;
};

// Legacy charger interface for backward compatibility
export interface LegacyChargerData {
	id: string;
	status: string;
	name: string;
	port: number;
	stateClass: string;
	currentImport?: number;
	SoC: number;
	serialNumber?: string;
	chartData?: ChartData;
	debug?: DebugInfo;
	state: string;
	chargerId: string;
	powerActiveImport?: string;
	transactionId?: number;
	tagId?: string;
	eta?: string;
}

// New charger structure based on updated API
export interface Connector {
	connector_id: number;
	evse_id?: number | null;
	status: string;
	status_timestamp?: string | null;
	error_code?: string | null;
	info?: string | null;
	vendor_error_code?: string | null;
	connector_type: string;
	max_amperage: number;
	max_voltage: number;
	max_power: number;
	phases: number;
	meter_serial_number?: string | null;
	last_meter_values: any[];
	current_transaction_id?: number | null;
	current_charging_state?: string | null;
	current_id_tag?: string | null;
	custom_data?: any | null;
}

export interface EVSE {
	evse_id: number;
	connectors: Connector[];
	admin_status?: string | null;
	custom_data?: any | null;
}

export interface Modem {
	iccid: string;
	imsi: string;
	custom_data?: any | null;
}

export interface ChargingStation {
	model: string;
	vendor_name: string;
	serial_number: string;
	firmware_version: string;
	modem: Modem;
	custom_data?: any | null;
}

export interface ConfigurationKey {
	key: string;
	readonly: boolean;
	value: string;
}

export interface Capabilities {
	supported_feature_profiles: string[];
	supported_auth_methods: string[];
	supported_message_types: string[];
	supports_reservation: boolean;
	supports_remote_start_stop: boolean;
	supports_local_auth_list: boolean;
	supports_charging_profiles: boolean;
	max_charging_profiles_installed?: number | null;
	charging_profile_purposes: string[];
	charging_profile_kinds: string[];
	charging_schedule_allowed_charging_rate_units: string[];
}

export interface ChargerData {
	charger_id: string;
	tenant_id: string;
	protocol: string;
	protocol_version: string;
	optional_name?: string;
	serial_number: string;
	site_id: string;
	maintenance_id?: string;
	state: string;
	availability: string;
	charging_station: ChargingStation;
	evses: EVSE[];
	configuration_keys: ConfigurationKey[];
	capabilities: Capabilities;
	custom_data?: any | null;
	active_transactions: any[];
	charging_profiles: any[];
	reservations: any[];
	device_id: string;
	edge_device_id: string;
	created_at: string;
	updated_at: string;
}

export interface ChargerBoxProps {
	id: string;
	status: ChargerStatus;
	SoC: UsageData["SoC"];
	name: string;
	port: number;
	eta?: string;
	currentImport?: number;
	powerActiveImport?: number;
	transactionId?: UsageData["transactionId"];
	tagId?: string;
}

// Charger State Log Interface
export interface ChargerStateLog {
	log_id: number;
	log_type: string;
	event_type: string;
	operator_id: string;
	state_before: string | null;
	details: Record<string, any>;
	state_after: string;
	charger_id: string;
	timestamp: string;
}
