import { useState, useRef, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Camera, Edit2, Layout, Clock,
  Video, PlayCircle, Loader2, Save, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlassCard } from "@/components/common/GlassCard";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { Separator } from "@/components/ui/separator";
import { profileService } from "@/services/profile.service";
import { useAuthStore } from "@/store/auth.store";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  title: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(200).optional(),
});
type Values = z.infer<typeof schema>;

export default function Profile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [editMode, setEditMode] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [loading,setLoading]=useState<boolean>(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      name: user?.username || "",
      title: user?.title || "",
      bio: user?.bio || "",
    },
  });

  const stats = useQuery({
    queryKey: ["profile-stats"],
    queryFn: profileService.stats,
  });

  const activity = useQuery({
    queryKey: ["profile-activity"],
    queryFn: profileService.activity,
  });



  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await profileService.uploadAvatar(file);
      if (user) {
        setUser({ ...user, avatar: res.url });
        toast.success("Avatar updated");
      }
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const res = await profileService.uploadCover(file);
      if (user) {
        setUser({ ...user, cover: res.url });
        toast.success("Cover photo updated");
      }
    } catch {
      toast.error("Failed to upload cover photo");
    } finally {
      setUploadingCover(false);
    }
  };

  const onSubmit = (v: Values) => {

    setLoading(true);
    profileService.update(v);
    setLoading(false);
    
  };

  const initials = (user?.username || "U").split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div className="mx-auto max-w-4xl space-y-8 select-none">
      
      {/* Cover and header card */}
      <GlassCard className="p-0 overflow-hidden relative border border-border/60">
        {/* Cover image wrapper */}
        <div className="h-44 w-full bg-gradient-brand relative group overflow-hidden">
          {user?.cover && (
            <img src={user.cover} alt="Cover" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              variant="secondary"
              size="sm"
              className="rounded-full gap-1.5"
            >
              {uploadingCover ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
              Change Cover
            </Button>
          </div>
          <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* User basic details line details info */}
        <div className="p-6 pt-0 flex flex-col md:flex-row items-center md:items-end gap-5 -mt-10 relative z-10 text-center md:text-left">
          <div className="relative group shrink-0">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-gradient-brand text-2xl font-bold text-white uppercase select-none">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-auto">
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="text-white hover:scale-105 transition-transform"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </button>
            </div>
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex-1 pb-2">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground/95">{user?.username}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{user?.title || "Product user"}</p>
              </div>
              <Button
                onClick={() => {
                  if (editMode) reset();
                  setEditMode(!editMode);
                }}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <Edit2 className="mr-1.5 h-3.5 w-3.5" /> {editMode ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main grids panels layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column — Information updates & Stats */}
        <div className="md:col-span-1 space-y-6">
          {/* Bio edit form */}
          {editMode ? (
            <GlassCard>
              <h2 className="text-sm font-semibold mb-4">Edit Profile details</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" className="h-10 rounded-xl" {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" className="h-10 rounded-xl" placeholder="e.g. Lead Designer" {...register("title")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" className="min-h-[80px] rounded-xl resize-none" placeholder="Write a short bio..." {...register("bio")} />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 rounded-xl bg-gradient-brand text-primary-foreground btn-glow"
                >
                  {loading? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-1.5 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </form>
            </GlassCard>
          ) : (
            <GlassCard className="space-y-4">
              <h2 className="text-sm font-semibold">About</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {user?.bio || "No biography provided yet. Edit your profile to write one."}
              </p>
              <Separator className="bg-border/60" />
              <div className="text-xs text-muted-foreground space-y-2">
                <p>Job Title: <span className="capitalize font-semibold text-foreground/80">{user?.jobTitle}</span></p>
              </div>
            </GlassCard>
          )}

          {/* // *Stats counters widgets */}
          <GlassCard className="p-4 space-y-4">
            <h2 className="text-sm font-semibold">Meeting Analytics</h2>
            {stats.isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : stats.data ? (
              <div className="grid grid-cols-2 gap-3 text-center">
                {[
                  { label: "Hosted", value: stats.data.hosted, icon: Video },
                  { label: "Joined", value: stats.data.joined, icon: Users },
                  { label: "Mins Met", value: stats.data.minutes, icon: Clock },
                  { label: "Recordings", value: stats.data.recordings, icon: PlayCircle },
                ].map((s) => (
                  <div key={s.label} className="p-3 bg-muted/40 border border-border/40 rounded-xl flex flex-col justify-center items-center">
                    <s.icon className="h-4 w-4 text-primary mb-1 shrink-0" />
                    <span className="text-lg font-bold text-foreground/90">{s.value}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{s.label}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </GlassCard>
        </div>

        {/* Right column — Activity logs */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" />
            Recent Activity
          </h2>

          <GlassCard className="p-5">
            {activity.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : activity.data && activity.data.length > 0 ? (
              <div className="relative border-l border-border/60 ml-2 pl-6 space-y-6">
                {activity.data.map((act) => {
                  return (
                    <div key={act.id} className="relative">
                      {/* Left timeline dot indicator */}
                      <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                      <div>
                        <p className="text-xs font-semibold text-foreground/90">{act.label}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {new Date(act.at).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">No recent activity found.</p>
            )}
          </GlassCard>
        </div>
      </div>

    </div>
  );
}
