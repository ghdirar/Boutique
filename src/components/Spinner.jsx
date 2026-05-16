export default function Spinner({ label = "Chargement..." }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/15 border-t-or" />
      <p className="text-sm text-white/70">{label}</p>
    </div>
  );
}
