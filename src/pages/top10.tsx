import { GetStaticProps } from "next";

interface IProduct {
  id: number;
  title: string;
}

interface ITop10Props {
  products: IProduct[];
}

export default function Top10({ products }: ITop10Props) {
  return (
    <div>
      <h1>Top 10</h1>

      <ul>
        {products.map(product => {
          return <li key={product.id}>{product.title}</li>;
        })}
      </ul>
    </div>
  );
}

// Guarda dados estáticos, logo as páginas também serão.
// A opção `revalidate`, serve para o Next gerar a página novamente
export const getStaticProps: GetStaticProps<ITop10Props> = async context => {
  const response = await fetch("http://localhost:3333/products");
  const products = await response.json();

  return {
    props: {
      products,
    },
    revalidate: 5, // em segundos
  };
};
