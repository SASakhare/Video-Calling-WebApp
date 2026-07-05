import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";

const schema = z.object({ email: z.string().trim().email("Enter a valid email") });
type Values = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async (v: Values) => {
    setLoading(true);
    try { await authService.forgotPassword(v.email); setSent(true); toast.success("Reset link sent"); }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand-soft text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Check your inbox</h1>
        <p className="mt-2 text-sm text-muted-foreground">We sent a reset link to <span className="font-medium text-foreground">{form.getValues("email")}</span>.</p>
        <Button asChild variant="outline" className="mt-6 rounded-full">
          <Link to="/login"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Forgot your password?</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Enter your email and we'll send a reset link.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@company.com" className="pl-9" {...form.register("email")} />
          </div>
          {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl bg-gradient-brand text-primary-foreground btn-glow">
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </div>
  );
}
