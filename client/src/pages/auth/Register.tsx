/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Lock, ArrowRight, Building, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const schema = z.object({
  first_name: z.string().trim().min(2, "Enter your first name").max(80),
  last_name: z.string().trim().min(2, "Enter your last name").max(80),
  company: z.string().trim().min(2, "Enter your working company name").max(80),
  job_title: z.string().trim().min(2, "Enter your job title").max(80),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters").max(128),
});
type Values = z.infer<typeof schema>;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { first_name: "", last_name: "", company: "", job_title: "", email: "", password: "" } });

  const onSubmit = async (v: Values) => {
    setLoading(true);
    try {
      const data = {
        first_name: v.first_name,
        last_name: v.last_name,
        company: v.company,
        job_title: v.job_title,
        email: v.email,
        password: v.password,
      };

      await authService.register(data);
      // * we can implement it later
      // navigate("/verify-email");
      console.log(data);

    } catch (e: any) { toast.error(e.message || "Sign-up failed"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Free forever · No credit card required.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="first_name">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="first_name" placeholder="Jane" className="pl-9" {...form.register("first_name")} />
          </div>
          {form.formState.errors.first_name && <p className="text-xs text-destructive">{form.formState.errors.first_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last_name">Last name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="last_name" placeholder="Doe" className="pl-9" {...form.register("last_name")} />
          </div>
          {form.formState.errors.last_name && <p className="text-xs text-destructive">{form.formState.errors.last_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@company.com" className="pl-9" {...form.register("email")} />
          </div>
          {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Company Name</Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="company" type="text" placeholder="company name" className="pl-9" {...form.register("company")} />
          </div>
          {form.formState.errors.company && <p className="text-xs text-destructive">{form.formState.errors.company.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="job_title">Job Title</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="job_title" type="text" placeholder="you@company.com" className="pl-9" {...form.register("job_title")} />
          </div>
          {form.formState.errors.job_title && <p className="text-xs text-destructive">{form.formState.errors.job_title.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type="password" placeholder="Min. 8 characters" className="pl-9" {...form.register("password")} />
          </div>
          {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl bg-gradient-brand text-primary-foreground btn-glow">
          {loading ? "Creating account…" : <>Create account <ArrowRight className="ml-1.5 h-4 w-4" /></>}
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
