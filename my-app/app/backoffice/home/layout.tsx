import Sidebar from "../../components/Sidebar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow h-[calc(100vh-64px)] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}