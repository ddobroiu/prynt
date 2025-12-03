import {
  LayoutGrid,
  Tag,
  Star,
  Layers,
  Image,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

export const siteConfig = {
  name: "Prynt.ro",
  url: "https://prynt.ro",
  ogImage: "https://prynt.ro/og.jpg",
  description:
    "Tipar digital & producție publicitară: bannere, flayere, canvas, autocolante și materiale rigide. Calitate, viteză și preț corect.",
  links: {
    twitter: "https://twitter.com/example",
    github: "https://github.com/example/example",
  },
  
  // --- MENIUL PRINCIPAL (HEADER) - STRUCTURA ORIGINALA ---
  headerNav: [
    {
      href: "/publicitar",
      label: "Publicitar",
      icon: Tag,
      children: [
        { href: "/pliante", label: "Pliante" },
        { href: "/flayere", label: "Flayere" }, // Nota: Verifica daca ai ruta /flayere sau daca e tot /pliante
        { href: "/afise", label: "Afișe" },
        { href: "/autocolante", label: "Autocolante" },
        { href: "/rollup", label: "Rollup" },
        { href: "/window-graphics", label: "Window Graphics" },
      ],
    },
    {
      href: "#",
      label: "Fonduri UE",
      icon: Star,
      children: [
        { href: "/fonduri-pnrr", label: "Fonduri PNRR" },
        { href: "/fonduri-regio", label: "Fonduri REGIO" },
        { href: "/fonduri-nationale", label: "Fonduri Naționale" },
      ],
    },
    {
      href: "/banner",
      label: "Banner",
      icon: Layers,
      children: [
        { href: "/banner", label: "O față" },
        { href: "/banner-verso", label: "Față-verso" },
      ],
    },
    {
      href: "/decor",
      label: "Decor",
      icon: Image,
      children: [
        { href: "/canvas", label: "Canvas" },
        { href: "/tapet", label: "Tapet" },
      ],
    },
    {
      href: "/materiale",
      label: "Materiale",
      icon: LayoutGrid,
      children: [
        { href: "/materiale/plexiglass", label: "Plexiglas" },
        { href: "/materiale/alucobond", label: "Alucobond" },
        { href: "/materiale/carton", label: "Carton" },
        { href: "/materiale/polipropilena", label: "Polipropilenă" },
        { href: "/materiale/pvc-forex", label: "PVC Forex" },
      ],
    },
    {
      href: "/shop",
      label: "Shop",
      icon: LayoutGrid,
      highlight: true,
    },
  ],

  // --- MENIUL FOOTER ---
  footerNav: [
    {
      title: "Companie",
      items: [
        { title: "Blog", href: "/blog" },
        { title: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      items: [
        { title: "Termeni & Condiții", href: "/termeni" },
        { title: "Confidențialitate", href: "/confidentialitate" },
        { title: "Politica Cookies", href: "/politica-cookies" },
      ],
    },
    {
      title: "Materiale",
      items: [
        { title: "Pliante & Flayere", href: "/pliante" },
        { title: "Bannere", href: "/banner" },
        { title: "Afișe", href: "/afise" },
        { title: "Autocolante", href: "/autocolante" },
        { title: "Rollup", href: "/rollup" },
        { title: "Window Graphics", href: "/window-graphics" },
        { title: "Canvas & Tapet", href: "/canvas" },
      ],
    },
  ],

  socialLinks: [
    { title: "Facebook", href: "https://facebook.com", icon: Facebook },
    { title: "Instagram", href: "https://instagram.com", icon: Instagram },
    { title: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
    { title: "Twitter", href: "https://twitter.com", icon: Twitter },
  ],
};

export type SiteConfig = typeof siteConfig;