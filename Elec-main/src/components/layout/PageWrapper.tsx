export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      <div className="flex-1 flex flex-col pt-16">
        {children}
      </div>
    </div>
  );
}
