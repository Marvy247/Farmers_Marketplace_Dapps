"use client";

import { useState } from "react";
import WalletConnection from "../molecules/WalletConnection";
import { Menu, X } from "lucide-react"; // Optional icon upgrade

interface HeaderProps {
  userType: "seller" | "buyer" | null;
  setUserType: (type: "seller" | "buyer" | null) => void;
}

export default function Header({ userType, setUserType }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { name: "Home", onClick: () => window.location.reload() },
    { name: "Farmer Dashboard", onClick: () => setUserType("seller") },
    { name: "Buyer Dashboard", onClick: () => setUserType("buyer") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md rounded-b-lgxl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
          <img
            alt="TrustFarm Logo"
            src="/Logo.png"
            className="w-10 h-10 object-contain"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold text-[#1A1A3D]">TrustFarm</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) => (
            <button
              key={item.name}
              onClick={item.onClick}
              className="relative text-sm font-medium text-[#1A1A3D] hover:text-[#5a7a22] transition-colors group"
            >
              {item.name}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#5a7a22] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <WalletConnection className="ml-4 bg-[#A6F52B] hover:bg-[#8bd100] text-[#1A1A3D] font-semibold text-sm rounded-full px-6 py-2.5 transition duration-300 shadow hover:shadow-lg" />
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md text-[#1A1A3D] focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-md rounded-b-2xl transition-all duration-300 ease-in-out">
          <nav className="space-y-2">
            {navLinks.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  item.onClick();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-[#1A1A3D] hover:bg-gray-100 rounded-md"
              >
                {item.name}
              </button>
            ))}
            <WalletConnection className="w-full mt-3 bg-[#A6F52B] hover:bg-[#8bd100] text-[#1A1A3D] font-semibold text-sm rounded-full px-4 py-2 transition" />
          </nav>
        </div>
      )}
    </header>
  );
}
