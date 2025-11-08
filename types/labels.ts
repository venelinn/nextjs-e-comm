export interface Label {
	key: string;
	value: string;
}

export interface SiteLabels {
	siteId: string;
	labels: Label[];
}

export interface ChargerLabels {
	chargerId: string;
	labels: Label[];
}

export interface TagLabels {
	tagId: string;
	labels: Label[];
}

export interface VehicleIdLabels {
	vehicleIdId: string;
	labels: Label[];
}

export interface LabelsApiResponse {
	success: boolean;
	data: SiteLabels | ChargerLabels | TagLabels | VehicleIdLabels;
	message?: string;
}

export interface LabelsFormData {
	labels: Label[];
}

// Form validation types
export interface LabelValidationError {
	key?: string;
	value?: string;
}

export interface LabelsValidationErrors {
	[index: number]: LabelValidationError;
	_root?: string;
}
