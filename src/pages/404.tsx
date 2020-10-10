import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>Página não encontrada :/</h1>
      <p>
        Você está perdido? Não por isso, volte para página principal
        <Link href="/">
          <a>aqui</a>
        </Link>
      </p>
    </div>
  );
}
