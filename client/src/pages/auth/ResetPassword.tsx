import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";

const schema = z.object({
  password: z.string().min(8, "At least 8 characters"),
  confirm: z.string(),
}).refine((v) => v.password === v.confirm, { message: "Passwords must match", path: ["confirm"] });
type Values = z.infer<typeof schema>;

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { password: "", confirm: "" } });

  const onSubmit = async (v: Values) => {
    setLoading(true);
    try { await authService.resetPassword("mock", v.password); toast.success("Password updated — sign in with your new password"); navigate("/login"); }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Set a new password</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Choose a strong password you don't use elsewhere.</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type="password" className="pl-9" {...form.register("password")} />
          </div>
          {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="confirm" type="password" className="pl-9" {...form.register("confirm")} />
          </div>
          {form.formState.errors.confirm && <p className="text-xs text-destructive">{form.formState.errors.confirm.message}</p>}
        </div>
        <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl bg-gradient-brand text-primary-foreground btn-glow">
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
