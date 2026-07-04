import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MessageCircle, MapPin, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/common/GlassCard";
import { delay } from "@/services/_mock";
import { useState } from "react";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Invalid email"),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});
type FormValues = z.infer<typeof schema>;

const channels = [
  { icon: Mail, title: "Email", value: "hello@meetly.app" },
  { icon: MessageCircle, title: "Live chat", value: "Mon–Fri · 9am–6pm" },
  { icon: MapPin, title: "Office", value: "San Francisco, CA" },
];

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", company: "", message: "" } });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    await delay(900);
    setLoading(false);
    toast.success("Message sent — we'll be in touch shortly.");
    form.reset();
    console.log("[contact]", values);
  };

  return (
    <div className="hero-bg">
      <section className="container py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 rounded-full">Contact</Badge>
          <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl">
            We'd love to <span className="gradient-text">hear from you</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Questions, feedback, or a partnership idea — drop us a line.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            {channels.map((c) => (
              <GlassCard key={c.title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.value}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="lg:col-span-2">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Jane Doe" {...form.register("name")} />
                  {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="jane@company.com" {...form.register("email")} />
                  {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">Company (optional)</Label>
                <Input id="company" placeholder="Acme Co." {...form.register("company")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={6} placeholder="How can we help?" {...form.register("message")} />
                {form.formState.errors.message && <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>}
              </div>
              <Button type="submit" disabled={loading} className="rounded-full bg-gradient-brand text-primary-foreground btn-glow">
                {loading ? "Sending…" : <>Send message <Send className="ml-1.5 h-4 w-4" /></>}
              </Button>
            </form>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
