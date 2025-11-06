"use client";

type Props = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options?: string[];
  disabled?: boolean;
};

const DEFAULT_JUDETE = [
  "Alba","Arad","Arges","Bacau","Bihor","Bistrita-Nasaud","Botosani","Brasov","Braila",
  "Bucuresti","Buzau","Caras-Severin","Calarasi","Cluj","Constanta","Covasna","Dambovita",
  "Dolj","Galati","Giurgiu","Gorj","Harghita","Hunedoara","Ialomita","Iasi","Ilfov",
  "Maramures","Mehedinti","Mures","Neamt","Olt","Prahova","Satu Mare","Salaj","Sibiu",
  "Suceava","Teleorman","Timis","Tulcea","Vaslui","Valcea","Vrancea",
];

export default function JudetSelector({ label = "Județ", value, onChange, options, disabled }: Props) {
  const list = options && Array.isArray(options) ? options : DEFAULT_JUDETE;

  return (
    <label className="text-sm block">
      <span className="field-label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="select disabled:opacity-60"
      >
        <option value="" disabled>— selectează un județ —</option>
        {list.map((judet) => (
          <option key={judet} value={judet}>{judet}</option>
        ))}
      </select>
    </label>
  );
}