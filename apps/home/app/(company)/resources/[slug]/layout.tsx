export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return <div className="relative isolate px-6 pt-14 lg:px-8">{children}</div>;
}
