import { Link } from "react-router-dom";

const columns = [
  {
    title: "Service client",
    links: ["Contact", "Livraison", "Retours", "Paiement securise"],
  },
  {
    title: "Informations",
    links: ["Conditions generales", "Confidentialite", "Mentions legales", "Aide"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#E8E8E8] bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.3fr_1fr_1fr] lg:px-10">
        <div>
          <h2 className="font-serif text-2xl uppercase tracking-[0.18em] text-[#1A1A1A]">La Votre</h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#6B6B6B]">
            Maroquinerie d'exception, alliant tradition et modernite. Chaque piece est une invitation au voyage.
          </p>
          <div className="mt-8 flex gap-5 text-lg">
            {["f", "x", "p", "ig"].map((social) => (
              <button key={social} type="button" className="text-[#1A1A1A] transition-colors duration-300 hover:text-[#C9A84C]">
                {social}
              </button>
            ))}
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1A1A1A]">{column.title}</p>
            <div className="space-y-2">
              {column.links.map((item) => (
                <Link key={item} to="/" className="block text-[13px] leading-8 text-[#6B6B6B] transition-colors duration-300 hover:text-[#1A1A1A]">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="border-t border-[#E8E8E8] py-6 text-center text-[12px] text-[#6B6B6B]">
        Copyright 2026 La Votre. Tous droits reserves.
      </p>
    </footer>
  );
}
