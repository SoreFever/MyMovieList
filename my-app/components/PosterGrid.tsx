export default function PosterGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
      {children}
    </div>
  );
}
