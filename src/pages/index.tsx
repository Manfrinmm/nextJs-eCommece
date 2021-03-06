import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect } from "react";
import SEO from "~/components/SEO";
import { client } from "~/lib/prismic,";
import { Title } from "../styles/pages/Home";
import Prismic from "prismic-javascript";
import PrismicDom from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";

interface IHomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: IHomeProps) {
  useEffect(() => {}, []);

  return (
    <div>
      <SEO
        title="DevCommerce, your best e-commecer!"
        image="google.png"
        shouldExcludeTitleSuffix
      />

      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                <Link href={`/catalog/products/${recommendedProduct.uid}`}>
                  <a>
                    {PrismicDom.RichText.asText(recommendedProduct.data.title)}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

// Usar somente esse método quando é necessário que os motores de buscam,
// façam a indexação desse s dados quem vem da API.
export const getServerSideProps: GetServerSideProps<IHomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at("document.type", "product"),
  ]);

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    },
  };
};
