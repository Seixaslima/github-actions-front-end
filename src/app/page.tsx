import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Pagina inicial</h1>
      <Link href="./about">Sobre[preview]</Link>
    </main>
  );
}
