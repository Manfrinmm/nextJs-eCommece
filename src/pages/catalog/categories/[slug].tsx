import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

interface IProduct {
  id: number;
  title: string;
}

interface CategoryProps {
  products: IProduct[];
}

export default function Product({ products }: CategoryProps) {
  const router = useRouter();

  // Indica se essa página está em processo de renderização estática
  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2>{router.query.slug}</h2>

      <ul>
        {products.map(product => {
          return <li key={product.id}>{product.title}</li>;
        })}
      </ul>
    </div>
  );
}

// Isso deve ser usado quando a página é dinâmica e quer gerar
// ela de forma estática. Essa função é executada antes da
// `getStaticProps` para ver quais os dados serão utilizados
export const getStaticPaths: GetStaticPaths = async () => {
  // Com esse método, deverá retornar todas ou as principais categórias da aplicação

  // Quando tiver uma página dinâmica estática, não é recomendável fazer uma busca
  // paga pegar todos os dados, e sim pegar os principais dados
  const response = await fetch(`http://localhost:3333/categories`);
  const categories = await response.json();

  const paths = categories.map(category => {
    return {
      params: { slug: category.id },
    };
  });

  return {
    paths,
    // Como `true`, ele irá tentar gerar uma rota/página caso ela não exista
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async context => {
  const { slug } = context.params;

  const response = await fetch(
    `http://localhost:3333/products?category_id=${slug}`,
  );
  const products = await response.json();

  return {
    props: {
      products,
    },
    revalidate: 60, // em segundos
  };
};
