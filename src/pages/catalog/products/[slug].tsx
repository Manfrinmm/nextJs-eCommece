import { useRouter } from "next/router";
import { useState } from "react";

import dynamic from "next/dynamic";

// Import dinâmico, isso serve para que somente esse componente
//   seja importado quando for ser usado
// `loading` é um elemento que mostra algo em tela enquanto
//   o a importação não termina
// `ssr` serve para que o node não tente importar esse arquivo
//    somente o browser pode fazer isso. Isso pode acontecer pois
//    pode haver funções que somente o browser suporta
const AddToCartModal = dynamic(() => import("~/components/AddToCartModal"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Product({}) {
  const router = useRouter();

  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  function handleAddToCart() {
    setIsAddToCartModalVisible(true);
  }

  return (
    <div>
      <h2>{router.query.slug}</h2>

      <button onClick={handleAddToCart}>Add to cart</button>

      {isAddToCartModalVisible && <AddToCartModal />}
    </div>
  );
}
