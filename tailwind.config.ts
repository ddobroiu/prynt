import type { Config } from 'tailwindcss';

const config: Config = {
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