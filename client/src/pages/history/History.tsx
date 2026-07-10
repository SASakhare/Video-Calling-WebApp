import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Calendar, Users, Clock, PlayCircle, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/common/GlassCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { meetingService } from "@/services/meeting.service";
import { useMeetingStore } from "@/store/meeting.store";
import { Meeting } from "@/types";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";

const ITEMS_PER_PAGE = 5;

const statusBadges = {
  CREATED:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",

  WAITING:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",

  LIVE:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse",

  ENDED:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",

  CANCELLED:
    "bg-muted text-muted-foreground border-border/60",
} as const;

const typeBadges = {
  INSTANT:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",

  SCHEDULED:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
} as const;


export default function History() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "CREATED" | "WAITING" | "LIVE" | "ENDED" | "CANCELLED"
  >("all");
  const [page, setPage] = useState(1);

  // Zustand
  const meetings = useMeetingStore((state) => state.meetings);

  // Fetch once to populate the store
  const meetingsQuery = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.list,
  });

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      const matchesSearch =
        meeting.title.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || meeting.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [meetings, search, filter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMeetings.length / ITEMS_PER_PAGE)
  );

  const paginatedMeetings = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredMeetings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMeetings, page]);

  const handleRowClick = (meeting: Meeting) => {
    if (meeting.status === "ENDED") {
      navigate(`/meetings/summary/${meeting.meetingId}`);
    } else {
      navigate(`/meetings/lobby/${meeting.meetingId}`);
    }
  };
  const cancelMeetingMutation = useMutation({
    mutationFn: meetingService.cancel,
    onSuccess: () => {
      toast.success("Meeting cancelled");
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Failed to cancel meeting");
    },
  });

  const handleCancelMeeting = (meetingId: string) => {
    cancelMeetingMutation.mutate(meetingId);
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
          {(["all", "CREATED", "WAITING", "LIVE", "ENDED", "CANCELLED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${filter === f
                ? "bg-gradient-brand text-primary-foreground shadow-brand"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* //* Meetings List */}
      <div className="space-y-3.5">
        {meetingsQuery.isLoading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : paginatedMeetings.length > 0 ? (
          paginatedMeetings.map((m) => (
            <motion.div
              key={m.meetingId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard
                hover
                onClick={() => handleRowClick(m)}
                className="cursor-pointer transition-all flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status */}
                    <Badge
                      variant="outline"
                      className={`rounded-full text-[10px] uppercase shrink-0 ${statusBadges[m.status]}`}
                    >
                      {m.status}
                    </Badge>

                    {/* Meeting Type */}
                    <Badge
                      variant="outline"
                      className={`rounded-full text-[10px] uppercase shrink-0 ${typeBadges[m.type_]}`}
                    >
                      {m.type_}
                    </Badge>

                    {/* Recording */}
                    {m.recordingEnabled && (
                      <Badge
                        variant="outline"
                        className="rounded-full text-[10px] bg-red-500/10 text-red-500 border-red-500/20 shrink-0"
                      >
                        <PlayCircle className="mr-1 h-3 w-3" />
                        REC
                      </Badge>
                    )}

                    <h3 className="truncate font-semibold text-base text-foreground/90">
                      {m.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {m.scheduledStartTime || m.scheduledStartTime
                        ? new Date(m.actualStartTime || m.actualStartTime!).toLocaleDateString([], { dateStyle: "medium" })
                        : "No Date"}
                    </span>
                    {m.actualStartTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {meetingService.getMeetingDuration(m.actualStartTime, m.actualEndTime)} mins
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {m.participantsCount} participants
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  {m.status === "ENDED" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/meetings/summary/${m.meetingId}`);
                      }}
                    >
                      View Summary
                    </Button>
                  ) : m.status === "LIVE" ? (
                    <Button
                      size="sm"
                      className="rounded-full bg-gradient-brand text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/meetings/lobby/${m.meetingId}`);
                      }}
                    >
                      Join
                    </Button>
                  ) : m.status === "CREATED" || m.status === "WAITING" ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/meetings/edit/${m.meetingId}`, {
                            state: {
                              meetingId: m.meetingId,
                            }
                          });
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelMeeting(m.meetingId);
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        size="sm"
                        className="rounded-full bg-gradient-brand text-primary-foreground md:w-20"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/meetings/lobby/${m.meetingId}`);
                        }}
                      >
                        Join
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary" size="sm" disabled>
                      Cancelled
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
