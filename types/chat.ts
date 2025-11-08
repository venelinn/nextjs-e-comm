type AgentType = "primary" | "secondary"; // BUTTON types
type MessageType = "user" | "agent" | "system";

export type TableAttachmentProps = {
	data: string[][];
	headers: string[];
	title: string;
};

export type FileAttachmentProps = {
	fileName: string;
	fileType: string;
	fileSize: string;
	url: string;
};

export interface Agent {
	id: string;
	name: string;
	icon: string;
	type: AgentType;
}

export interface Message {
	id: string;
	type: MessageType;
	content: string;
	timestamp: string;
	agentId?: string;
}

export interface ChatWindowProps {
	placeholder: string;
	sendButtonText: string;
	onSendMessage?: (content: string) => void;
}

export type ChatMessage = {
	role: string;
	content: string;
	// add more fields if needed
};

export type ChatData = {
	messages: Message[];
	agents: Agent[];
	chatWindow: ChatWindowProps;
};
