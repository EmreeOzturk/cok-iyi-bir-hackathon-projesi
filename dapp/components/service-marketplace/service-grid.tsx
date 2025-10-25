import { ServiceCard } from "@/components/service-marketplace/service-card";

const MOCK_SERVICES = [
  {
    name: "flight-orchestrator",
    description: "PTB ile uçuş arama, rezervasyon ve AccessNFT teslimatı.",
    price: "0.42 USDC",
    tier: "premium",
    reputation: 4.9,
  },
  {
    name: "hotel-curator",
    description: "Dinamik otel önerileri ve on-chain rezervasyon.",
    price: "0.18 USDC",
    tier: "standard",
    reputation: 4.7,
  },
  {
    name: "event-streamer",
    description: "Şehir etkinliklerini canlı olarak Mastra ajanın için derler.",
    price: "0.08 USDC",
    tier: "trial",
    reputation: 4.4,
  },
  {
    name: "compliance-guardian",
    description: "PTB öncesi güvenlik taraması ve limit kontrolü.",
    price: "0.15 USDC",
    tier: "premium",
    reputation: 4.8,
  },
];

export const ServiceGrid = () => (
  <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    {MOCK_SERVICES.map((service) => (
      <ServiceCard key={service.name} service={service} />
    ))}
  </section>
);

