/**
 * ViewContainer component provides a consistent layout for views in the application.
 */
export default function ViewContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="view-container">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      {children}
    </div>
  );
}
