import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CATRE Penedo — Centro Adventista de Treinamento, Retiros e Eventos",
  description: "O CATRE Penedo é um espaço destinado à realização de retiros espirituais, treinamentos, encontros, convenções e eventos religiosos da Associação Rio Sul.",
  keywords: ["CATRE", "Penedo", "retiro", "eventos", "adventista", "hospedagem"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
