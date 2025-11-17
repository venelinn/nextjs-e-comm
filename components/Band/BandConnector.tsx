import { PrimaryCard } from "../Cards";
import { GridCollection } from "../Collection";

const BandConnector = (props) => {
  const members = props?.members ?? [];
  if (!members.length) return null;
  console.log(props);
  return (
    <GridCollection
      id={props?.id}
      heading={props?.heading}
      description={props?.description}
      itemsPerRow={props.itemsPerRow || 1}
      items={members.map((item) => ({
        id: item.id,
        content: <PrimaryCard id={item.id} image={item.image[0]} content={item.content} heading={item.heading} />,
      }))}
    />
  );
};

export default BandConnector;
export { BandConnector };
