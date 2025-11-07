import React from "react";
import BannerVersoConfigurator from "@/components/BannerVersoConfigurator";

export const metadata = {
  title: "Banner Verso — Configurator",
  description: "Configurează un banner verso personalizat",
};

export default function BannerVersoPage() {
  // server component wrapping client configurator
  return (
    <div>
      <BannerVersoConfigurator productSlug="banner-verso" />
    </div>
  );
}