"use client";

import { useEffect } from "react";
import { ServiceCard } from "@/components/service-marketplace/service-card";
import { useContractStore } from "@/stores/use-contract-store";
import { useWalletStore } from "@/stores/use-wallet-store";

// Helper function to map contract data to UI format
const mapServiceToUI = (service: any) => {
  const tierLabels = ["per_credit", "subscription", "free"];
  const tierDisplay = ["trial", "standard", "premium"];

  return {
    name: service.description.split(" ")[0] || "Unknown Service",
    description: service.description,
    price: `${service.pricing.amount / 100} USDC`, // Convert from smallest unit
    tier: tierDisplay[service.pricing.model_type] || "trial",
    reputation: 4.5, // Would calculate from reputation NFT data
  };
};

export const ServiceGrid = () => {
  const { services, loadServices } = useContractStore();
  const { connectedAccount } = useWalletStore();

  useEffect(() => {
    if (connectedAccount) {
      loadServices();
    }
  }, [connectedAccount, loadServices]);

  // Show loading state or empty state
  if (!connectedAccount) {
    return (
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-full text-center py-8 text-muted-foreground">
          Please connect your wallet to view available services
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-full text-center py-8 text-muted-foreground">
          Loading services...
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service, index) => (
        <ServiceCard key={index} service={mapServiceToUI(service)} />
      ))}
    </section>
  );
};

