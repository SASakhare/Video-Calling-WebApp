import { Outlet } from "react-router-dom";
import { PageTransition } from "@/components/common/PageTransition";

export function MeetingRoomLayout() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-white overflow-hidden flex flex-col relative select-none">
      <main className="flex-1 flex flex-col min-h-0 min-w-0">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
export default MeetingRoomLayout;
