import NavbarHotel from '@/components/hotel/NavbarHotel'
import HeroHotel from '@/components/hotel/HeroHotel'
import SobreHotel from '@/components/hotel/SobreHotel'
import AmenidadesHotel from '@/components/hotel/AmenidadesHotel'
import AcomodacoesHotel from '@/components/hotel/AcomodacoesHotel'
import GaleriaHotel from '@/components/hotel/GaleriaHotel'
import ReservaHotel from '@/components/hotel/ReservaHotel'
import LocalizacaoHotel from '@/components/hotel/LocalizacaoHotel'
import FAQHotel from '@/components/hotel/FAQHotel'
import DepoimentosHotel from '@/components/hotel/DepoimentosHotel'
import FooterHotel from '@/components/hotel/FooterHotel'

export default function Home() {
  return (
    <main className="bg-white">
      <NavbarHotel />
      <HeroHotel />
      <SobreHotel />
      <AmenidadesHotel />
      <AcomodacoesHotel />
      <GaleriaHotel />
      <ReservaHotel />
      <LocalizacaoHotel />
      <DepoimentosHotel />
      <FAQHotel />
      <FooterHotel />
    </main>
  )
}
