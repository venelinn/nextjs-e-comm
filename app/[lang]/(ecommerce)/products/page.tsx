import { PrimaryCard } from "@/components/Cards";
import { Cell, Row } from "@/components/Grid";
import { Section } from "@/components/Section";
import { getContentItems } from "@/utils/content";
import { localization } from "@/utils/localization";

export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  const pageLocale = lang || localization.defaultLocale;

  const [products] = await Promise.all([getContentItems("product", pageLocale)]);

  return (
    <Section heading={{ heading: "Products", as: "h1", size: "h1" }}>
      <Row cols={3}>
        {products.map((item) => (
          <Cell key={item.id}>
            <PrimaryCard
              image={item.media[0]}
              content={item.description}
              heading={item.heading}
              price={item.price}
              id={item.id}
            />
          </Cell>
        ))}
      </Row>
    </Section>
  );
}
