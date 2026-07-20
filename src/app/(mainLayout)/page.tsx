import Banner from "@/components/Banner";
import CallToAction from "@/components/CallToAction";
import ContactPage from "@/components/contact";
import FAQSection from "@/components/FAQSection";
import HelpPage from "@/components/help";
import OurServices from "@/components/OurServices";
import PlatformStats from "@/components/PlatformStats";
import TopScholarships from "@/components/TopScholarships";
import ScholarAIFeatures from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <Banner></Banner>
      <TopScholarships></TopScholarships>
      <ScholarAIFeatures></ScholarAIFeatures>
      <PlatformStats></PlatformStats>
      <OurServices></OurServices>
      <FAQSection></FAQSection>
      <CallToAction></CallToAction>
      <HelpPage></HelpPage>
      <ContactPage></ContactPage>
    </div>
  );
}
