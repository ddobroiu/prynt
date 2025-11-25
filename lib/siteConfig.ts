import { Facebook, Instagram, Linkedin } from "lucide-react";

export const siteConfig = {
  name: "Prynt.ro",
  description: "Tipografie Digitală & Producție Publicitară. Configurează online bannere, autocolante, afișe și multe altele.",
  
  // --- AICI ESTE MENIUL PRINCIPAL (HEADER) ---
  headerNav: [
    {
      label: "Acasă",
      href: "/",
    },
    {
      label: "Configuratoare",
      href: "/configuratoare",
      highlight: true, // Va apărea evidențiat ca buton (pe Desktop)
    },
    {
      label: "Produse Standard",
      href: "/shop",
    },
    {
      label: "Suport & Info",
      href: "#", // Link părinte pentru dropdown
      children: [
        { label: "Urmărește Comanda", href: "/urmareste-comanda" },
        { label: "Contact", href: "/contact" },
        { label: "Termeni și Condiții", href: "/termeni" },
        { label: "Politica de Confidențialitate", href: "/confidentialitate" },
      ],
    },
  ],

  // --- LINK-URI SOCIAL MEDIA (Folosite în Footer) ---
  socialLinks: [
    {
      title: "Facebook",
      href: "https://facebook.com", // Pune link-ul real
      icon: Facebook,
    },
    {
      title: "Instagram",
      href: "https://instagram.com", // Pune link-ul real
      icon: Instagram,
    },
    {
      title: "LinkedIn",
      href: "https://linkedin.com", // Pune link-ul real
      icon: Linkedin,
    },
  ],
};