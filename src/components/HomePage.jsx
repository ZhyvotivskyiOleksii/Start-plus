import HeroSection from "./HeroSection/HeroSection";
import WhyChooseUs from "./WhyChooseUs/WhyChooseUs";

export default function HomePage({ lang = "pl" }) {
  return (
    <>
      <HeroSection lang={lang} />
      <WhyChooseUs lang={lang} />
    </>
  );
}