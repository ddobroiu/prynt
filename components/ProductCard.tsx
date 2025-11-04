import Image from "next/image";

type Props = {
  href: string;
  title: string;
  desc: string;
  img: string; // /public path
  cta?: string;
};

export default function ProductCard({ href, title, desc, img, cta = "Configurați" }: Props) {
  return (
    <a
      href={href}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
    >
      <div className="relative h-52 w-full">
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 33vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-1 text-white/70 text-sm">{desc}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold">
          {cta} →
        </div>
      </div>
    </a>
  );
}
