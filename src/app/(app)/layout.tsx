import { NavigationBar } from "@/components/layout/NavigationBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <NavigationBar />
      <main className="flex flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
