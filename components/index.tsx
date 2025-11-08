import { BandConnector } from "./Band";
import { GridCollectionConnector } from "./Collection/GridConnectorConnector";
import { Contacts } from "./Contacts";
import { HeroConnector } from "./Hero";
import { ImageContentConnector } from "./ImageContent";

// Map components which are dynamically resolved by content type in the CMS
export const componentMap = {
	hero: HeroConnector,
	imageContent: ImageContentConnector,
	contacts: Contacts,
	collection: GridCollectionConnector,
	band: BandConnector,
};
