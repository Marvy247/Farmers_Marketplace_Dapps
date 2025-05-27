"use client";
import React, { useState, useCallback } from "react";
import Header from "../components/atoms/header";
import Footer from "../components/atoms/footer";
import LandingPage from "../components/organisms/landing-page";
import UserTypeSelector from "../components/molecules/UserTypeSelector";
import FarmerDashboard from "../components/organisms/FarmerDashboard";
import BuyerDashboard from "../components/organisms/BuyerDashboard";
import { ContractProvider, useContract } from "../context/ContractContext";

const HomeContent = ({
  userType,
  setUserType,
  refreshMarketplace,
  triggerRefreshMarketplace,
}: {
  userType: "seller" | "buyer" | null;
  setUserType: (type: "seller" | "buyer" | null) => void;
  refreshMarketplace: boolean;
  triggerRefreshMarketplace: () => void;
}) => {
  const { isConnected, isLoading } = useContract();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600">
        Connecting to wallet...
      </div>
    );
  }

  if (!isConnected) {
    return <LandingPage />;
  }

  if (!userType) {
    return <UserTypeSelector onSelect={(type) => setUserType(type)} />;
  }

  if (userType === "seller") {
    return <FarmerDashboard onProductCreated={triggerRefreshMarketplace} />;
  }

  if (userType === "buyer") {
    return <BuyerDashboard refreshMarketplace={refreshMarketplace} />;
  }

  return null;
};

export default function Home() {
  const [userType, setUserType] = useState<"seller" | "buyer" | null>(null);
  const [refreshMarketplace, setRefreshMarketplace] = useState(false);

  const triggerRefreshMarketplace = useCallback(() => {
    setRefreshMarketplace((prev) => !prev);
  }, []);

  return (
    <ContractProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header userType={userType} setUserType={setUserType} />
        <main className="flex-grow px-4 sm:px-6 lg:px-8">
          <HomeContent
            userType={userType}
            setUserType={setUserType}
            refreshMarketplace={refreshMarketplace}
            triggerRefreshMarketplace={triggerRefreshMarketplace}
          />
        </main>
        <Footer />
      </div>
    </ContractProvider>
  );
}
