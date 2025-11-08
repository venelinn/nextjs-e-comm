import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useContext,
	useMemo,
	useState,
} from "react"

// Define the shape of your global state
export interface DataState {
	messages: string[]
	// Add other global fields here as needed
}

// Define the context value type: [state, setState]
type DataContextType = [DataState, Dispatch<SetStateAction<DataState>>]

// Initialize the context with a default empty tuple
const DataContext = createContext<DataContextType | undefined>(undefined)

export const initState: DataState = {
	messages: [],
}

// Hook to access global data
export function useData(): DataContextType {
	const context = useContext(DataContext)
	if (!context) {
		throw new Error("useData must be used within a DataProvider")
	}
	return context
}

// Provider component
export function DataProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<DataState>({ ...initState })
	const providerValue = useMemo(() => [state, setState] as DataContextType, [state]);

	return (
		<DataContext.Provider value={providerValue}>
			{children}
		</DataContext.Provider>
	)
}
