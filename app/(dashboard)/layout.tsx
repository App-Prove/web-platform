import { DashboardWrapper } from "./dashboard/components/dashboard-wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="text-foreground mx-auto min-h-screen flex flex-col overflow-hidden sm:overflow-visible relative w-full">
      <DashboardWrapper>
        {children}
      </DashboardWrapper>
    </div>
  );
}
