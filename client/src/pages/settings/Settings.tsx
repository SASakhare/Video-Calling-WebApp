import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Monitor, Camera, Bell, ShieldAlert, Save, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/common/GlassCard";
import { Separator } from "@/components/ui/separator";
import { DeviceSelector } from "@/components/meetings/DeviceSelector";
import { useMediaPreview } from "@/hooks/useMediaPreview";
import { useUIStore } from "@/store/ui.store";
import { useMeetingStore } from "@/store/meeting.store";

const schema = z.object({
  currentPassword: z.string().min(6, "Must be at least 6 characters"),
  newPassword: z.string().min(8, "Must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type Values = z.infer<typeof schema>;

export default function Settings() {
  const { theme, setTheme } = useUIStore();
  const {
    selectedCamera,
    selectedMic,
    selectedSpeaker,
    setSelectedCamera,
    setSelectedMic,
    setSelectedSpeaker,
  } = useMeetingStore();

  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const { devices } = useMediaPreview();

  const handlePasswordSubmit = async (v: Values) => {
    setPwLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // Mock latency
    setPwLoading(false);
    toast.success("Password changed successfully");
    reset();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 select-none">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Configure default themes, hardware devices, and security settings.
        </p>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid grid-cols-4 bg-muted/40 border border-border/40 rounded-xl max-w-md p-1 h-11 shrink-0">
          <TabsTrigger value="appearance" className="rounded-lg text-xs font-semibold">Appearance</TabsTrigger>
          <TabsTrigger value="devices" className="rounded-lg text-xs font-semibold">Devices</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg text-xs font-semibold">Alerts</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg text-xs font-semibold">Security</TabsTrigger>
        </TabsList>

        {/* Appearance settings */}
        <TabsContent value="appearance" className="mt-4">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="space-y-6">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Monitor className="h-4.5 w-4.5 text-primary" /> Appearance Theme
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Change default application styling theme.</p>
              </div>

              <div className="flex gap-3">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 rounded-2xl border p-4 text-center transition-all capitalize font-semibold text-xs ${
                      theme === t
                        ? "border-primary/40 bg-primary/5 shadow-md ring-1 ring-primary/20"
                        : "border-border/60 bg-muted/30 hover:border-border"
                    }`}
                  >
                    {t} Mode
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </TabsContent>

        {/* Device managers tab */}
        <TabsContent value="devices" className="mt-4">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="space-y-6">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Camera className="h-4.5 w-4.5 text-primary" /> Hardware Defaults
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Select pre-join media options for calls.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Microphone Source</Label>
                  <DeviceSelector
                    kind="audioinput"
                    devices={devices}
                    selected={selectedMic}
                    onSelect={setSelectedMic}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Camera Source</Label>
                  <DeviceSelector
                    kind="videoinput"
                    devices={devices}
                    selected={selectedCamera}
                    onSelect={setSelectedCamera}
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications" className="mt-4">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="space-y-6">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Bell className="h-4.5 w-4.5 text-primary" /> In-app & Email Alerts
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Manage notification subscriptions.</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Meeting Invites", desc: "Alert me when invited to scheduled rooms" },
                  { title: "Reminders", desc: "Notify me 15 minutes before meeting slots start" },
                  { title: "Product Updates", desc: "Receive email updates for new app features" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
