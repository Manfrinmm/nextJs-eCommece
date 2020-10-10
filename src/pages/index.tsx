import { GetServerSideProps } from "next";
import { useEffect } from "react";
import SEO from "~/components/SEO";
import { Title } from "../styles/pages/Home";

interface IProduct {
  id: number;
  title: string;
}

interface IHomeProps {
  recommendedProducts: IProduct[];
}

export default function Home({ recommendedProducts }: IHomeProps) {
  useEffect(() => {}, []);

  // Import dinâmico
  async function handleSum() {
    // Isso serve para que essa lib seja importada somente quando
    // essa função for chamada
    const math = (await import("../lib/math")).default;

    alert(math.sum(2, 3));
  }

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
              <li key={recommendedProduct.id}>{recommendedProduct.title}</li>
            );
          })}
        </ul>
      </section>

      <button onClick={handleSum}>Sum!</button>
    </div>
  );
}

// Usar somente esse método quando é necessário que os motores de buscam,
// façam a indexação desse s dados quem vem da API.
export const getServerSideProps: GetServerSideProps<IHomeProps> = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/recommended`,
  );
  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts,
    },
  };
};
