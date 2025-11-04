import type { Config } from 'tailwindcss';

const config: Config = {
  // 1. Content: Căile către toate fișierele care conțin clase Tailwind CSS.
  // Fără această secțiune, Tailwind nu generează CSS-ul necesar.
  content: [
    // Next.js App Router: Include fișierele din 'app', 'pages' și 'components'
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}', // Adăugat pentru proiectele cu un folder 'src'
  ],
  
  // 2. Theme: Permite personalizarea culorilor, fonturilor, spațierii, etc.
  theme: {
    // Am inclus 'extend' pentru a nu suprascrie toate setările implicite ale Tailwind.
    extend: {
      // Puteți adăuga aici orice culori, fonturi sau alte utilitare personalizate.
      // De exemplu: 'backgroundColor: { 'custom-dark': '#1e293b' }'
    },
  },
  
  // 3. Plugin-uri: Adaugă funcționalități suplimentare (opțional).
  plugins: [],
  
  // 4. Modul întunecat (Dark Mode): Next.js implicit
  darkMode: 'media',
};

export default config;