import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { client } from "~/lib/prismic,";
import Prismic from "prismic-javascript";
import PrismicDOM from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";
import Link from "next/link";

interface CategoryProps {
  category: Document;
  products: Document[];
}

export default function Product({ category, products }: CategoryProps) {
  const router = useRouter();

  // Indica se essa página está em processo de renderização estática
  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2>{PrismicDOM.RichText.asText(category.data.title)}</h2>

      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`}>
                <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
              </Link>
            </li>
          );
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

  const categories = await client().query([
    Prismic.Predicates.at("document.type", "category"),
  ]);

  const paths = categories.results.map(category => {
    return {
      params: { slug: category.uid },
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

  const category = await client().getByUID("category", String(slug), {});
  const products = await client().query([
    Prismic.Predicates.at("document.type", "product"),
    Prismic.Predicates.at("my.product.category", category.id),
  ]);

  return {
    props: {
      category,
      products: products.results,
    },
    revalidate: 60, // em segundos
  };
};
