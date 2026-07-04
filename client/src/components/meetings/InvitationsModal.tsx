import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Plus, X, Send, RotateCw, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { invitationService } from "@/services/invitation.service";
import { cn } from "@/lib/utils";

const emailSchema = z.string().trim().email();

const statusColors = {
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  accepted: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  declined: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
  expired: "bg-muted text-muted-foreground border-border/60",
} as const;

interface InvitationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId: string;
}

export function InvitationsModal({
  open,
  onOpenChange,
  meetingId,
}: InvitationsModalProps) {
  const [emailInput, setEmailInput] = useState("");
  const [pendingEmails, setPendingEmails] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const existing = useQuery({
    queryKey: ["invitations", meetingId],
    queryFn: () => invitationService.list(meetingId),
    enabled: open,
  });

  const sendMutation = useMutation({
    mutationFn: (emails: string[]) => invitationService.send(meetingId, emails),
    onSuccess: (data) => {
      toast.success(`${data.length} invitation${data.length > 1 ? "s" : ""} sent`);
      setPendingEmails([]);
      queryClient.invalidateQueries({ queryKey: ["invitations", meetingId] });
    },
    onError: () => toast.error("Failed to send invitations"),
  });

  const resendMutation = useMutation({
    mutationFn: (id: string) => invitationService.resend(id),
    onSuccess: () => {
      toast.success("Invitation resent");
      queryClient.invalidateQueries({ queryKey: ["invitations", meetingId] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => invitationService.cancel(id),
    onSuccess: () => {
      toast.success("Invitation cancelled");
      queryClient.invalidateQueries({ queryKey: ["invitations", meetingId] });
    },
  });

  const addEmail = () => {
    setEmailError(null);
    const trimmed = emailInput.trim();
    if (!trimmed) return;

    const result = emailSchema.safeParse(trimmed);
    if (!result.success) {
      setEmailError("Enter a valid email address");
      return;
    }
    if (pendingEmails.includes(trimmed)) {
      setEmailError("Already added");
      return;
    }
    setPendingEmails((prev) => [...prev, trimmed]);
    setEmailInput("");
  };

  const removeEmail = (email: string) => {
    setPendingEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel max-w-lg border-border/60 p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Mail className="h-5 w-5 text-primary" />
            Invite people
          </DialogTitle>
          <DialogDescription>
            Add email addresses to invite participants to this meeting.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-2">
          {/* Add email input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setEmailError(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="colleague@company.com"
                type="email"
                className={cn(
                  "h-10 rounded-xl",
                  emailError && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {emailError && (
                <p className="mt-1 text-xs text-destructive">{emailError}</p>
              )}
            </div>
            <Button
              onClick={addEmail}
              size="icon"
              variant="outline"
              className="h-10 w-10 shrink-0 rounded-xl"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Pending email chips */}
          {pendingEmails.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {pendingEmails.map((email) => (
                <Badge
                  key={email}
                  variant="secondary"
                  className="gap-1 rounded-full py-1 pl-3 pr-1.5 text-xs"
                >
                  {email}
                  <button
                    onClick={() => removeEmail(email)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Send button */}
          {pendingEmails.length > 0 && (
            <Button
              onClick={() => sendMutation.mutate(pendingEmails)}
              disabled={sendMutation.isPending}
              className="mt-3 w-full rounded-xl bg-gradient-brand text-primary-foreground btn-glow"
            >
              {sendMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-1.5 h-4 w-4" />
              )}
              Send {pendingEmails.length} invitation
              {pendingEmails.length > 1 ? "s" : ""}
            </Button>
          )}
        </div>

        <Separator className="bg-border/60" />

        {/* Existing invitations */}
        <div className="max-h-64 overflow-y-auto px-6 pb-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Sent invitations
          </p>

          {existing.isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : existing.data && existing.data.length > 0 ? (
            <div className="space-y-2">
              {existing.data.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{inv.email}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(inv.sentAt).toLocaleString([], {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 rounded-full text-[10px] uppercase",
                      statusColors[inv.status]
                    )}
                  >
                    {inv.status}
                  </Badge>
                  <div className="flex shrink-0 gap-1">
                    {inv.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => resendMutation.mutate(inv.id)}
                          disabled={resendMutation.isPending}
                          title="Resend"
                        >
                          <RotateCw className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => cancelMutation.mutate(inv.id)}
                          disabled={cancelMutation.isPending}
                          title="Cancel"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No invitations sent yet.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
