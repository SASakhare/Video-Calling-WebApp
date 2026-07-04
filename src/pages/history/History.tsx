import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Calendar, Users, Clock, PlayCircle, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/common/GlassCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { meetingService } from "@/services/meeting.service";

const ITEMS_PER_PAGE = 5;

const statusBadges = {
  scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  live: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse",
  ended: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  cancelled: "bg-muted text-muted-foreground border-border/60",
} as const;

export default function History() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "scheduled" | "ended" | "cancelled">("all");
  const [page, setPage] = useState(1);

  const meetingsQuery = useQuery({
    queryKey: ["meetings", "list"],
    queryFn: meetingService.list,
  });

  const filteredMeetings = useMemo(() => {
    if (!meetingsQuery.data) return [];
    return meetingsQuery.data.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.hostName.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || m.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [meetingsQuery.data, search, filter]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredMeetings.length / ITEMS_PER_PAGE));
  const paginatedMeetings = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredMeetings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMeetings, page]);

  const handleRowClick = (id: string, status: string) => {
    if (status === "ended") {
      navigate(`/meetings/summary/${id}`);
    } else {
      navigate(`/meetings/lobby/${id}`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meeting History</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          View your past, active, and upcoming scheduled meetings.
        </p>
      </div>

      {/* Filters & Search Control deck */}
      <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title or host..."
            className="pl-9 rounded-xl border-border/60 bg-muted/40 h-10"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(["all", "scheduled", "ended", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                filter === f
                  ? "bg-gradient-brand text-primary-foreground shadow-brand"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Meetings List */}
      <div className="space-y-3.5">
        {meetingsQuery.isLoading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : paginatedMeetings.length > 0 ? (
          paginatedMeetings.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard
                hover
                onClick={() => handleRowClick(m.id, m.status)}
                className="cursor-pointer transition-all flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`rounded-full text-[10px] uppercase shrink-0 ${statusBadges[m.status]}`}>
                      {m.status}
                    </Badge>
                    {m.recording && (
                      <Badge variant="outline" className="rounded-full text-[10px] bg-red-500/10 text-red-500 border-red-500/20 shrink-0">
                        <PlayCircle className="mr-1 h-3 w-3 inline" /> REC
                      </Badge>
                    )}
                    <h3 className="truncate font-semibold text-base text-foreground/90">{m.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {m.scheduledAt || m.startedAt
                        ? new Date(m.scheduledAt || m.startedAt!).toLocaleDateString([], { dateStyle: "medium" })
                        : "No Date"}
                    </span>
                    {m.durationMin && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {m.durationMin} mins
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {m.participantsCount} participants
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  {m.status === "ended" ? (
                    <Button variant="outline" size="sm" className="rounded-full shrink-0">
                      View Summary
                    </Button>
                  ) : (
                    <Button size="sm" className="rounded-full bg-gradient-brand text-primary-foreground shrink-0 btn-glow">
                      Join Lobby
                    </Button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))
        ) : (
          <EmptyState
            icon={<Video className="h-8 w-8" />}
            title="No meetings found"
            description="Try adjusting your filters or search keywords."
          />
        )}
      </div>

      {/* Pagination Controller */}
      {filteredMeetings.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1} - {Math.min(page * ITEMS_PER_PAGE, filteredMeetings.length)} of {filteredMeetings.length} meetings
          </p>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 w-8 rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 w-8 rounded-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
