import Navbar from '@/components/Navbar'
import HeroBanner from '@/components/HeroBanner'
import SobreCatre from '@/components/SobreCatre'
import Estrutura from '@/components/Estrutura'
import Galeria from '@/components/Galeria'
import FAQ from '@/components/FAQ'
import Depoimentos from '@/components/Depoimentos'
import Localizacao from '@/components/Localizacao'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroBanner />
      <SobreCatre />
      <Estrutura />
      <Galeria />
      <Depoimentos />
      <FAQ />
      <Localizacao />
      <Footer />
    </main>
  )
}
