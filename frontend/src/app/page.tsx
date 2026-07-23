import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import TrustedCompanies from "@/components/landing/TrustedCompanies";
import Features from "@/components/landing/Features";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <TrustedCompanies />
      <Features />
    </main>
  );
}