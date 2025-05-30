import Sidebar from "@/components/sidebar/Page";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex">
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;