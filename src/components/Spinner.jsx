export default function Spinner({ label = "Chargement..." }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-950" />
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}
