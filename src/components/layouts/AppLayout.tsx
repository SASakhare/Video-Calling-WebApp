import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { AppTopbar } from "@/components/navigation/AppTopbar";
import { MobileTabBar } from "@/components/navigation/MobileTabBar";
import { PageTransition } from "@/components/common/PageTransition";

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}
