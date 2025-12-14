export default function ChartSection({ title, children }) {
  return (
    <section className="w-full space-y-3">
      <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider">
        {title}
      </h3>
      {children}
    </section>
  );
}