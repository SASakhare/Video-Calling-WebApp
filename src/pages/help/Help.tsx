import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { HelpCircle, Search, Mail, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/common/GlassCard";
import {
  Accordion as ShadcnAccordion,
  AccordionContent as ShadcnContent,
  AccordionItem as ShadcnItem,
  AccordionTrigger as ShadcnTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I invite external users to a meeting?",
    a: "You can copy the meeting code (formatted as xxxx-xxxx-xxxx) or the full join URL from either the Dashboard's personal room details or the post-creation created page view and email it directly. If they don't have an account, they can join instantly without requiring login steps.",
    cat: "lobby",
  },
  {
    q: "Why is my camera stream not displaying in the lobby?",
    a: "Verify that Meetly has browser permissions enabled for media devices. Check if another application (like Zoom or Teams) is using the hardware feed. Refreshing the browser or reconnecting the device usually re-requests media permission access.",
    cat: "media",
  },
  {
    q: "Can I record a meeting on the free starter plan?",
    a: "Starter tier permits recording meetings locally, while Pro and Business packages save recording streams directly to cloud spaces (offering AI recap summaries and transcript search tags).",
    cat: "recording",
  },
  {
    q: "How does the waiting room function?",
    a: "If waiting rooms are toggled on, invited attendees are placed on a pulsing waiting screen rather than joining directly. The meeting host receives joins notices and can approve permissions manually.",
    cat: "lobby",
  },
];

const ticketSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});
type TicketValues = z.infer<typeof ticketSchema>;

export default function Help() {
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TicketValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { email: "", subject: "", message: "" },
  });

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase())
  );

  const handleTicketSubmit = async (v: TicketValues) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900)); // Mock latency
    setSubmitting(false);
    toast.success("Support ticket submitted! We will contact you soon.");
    reset();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 select-none">
      
      {/* Help Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 text-primary-foreground shadow-brand md:p-10">
        <div className="pointer-events-none absolute inset-0 grid-dots opacity-20" />
        <div className="relative text-center max-w-md mx-auto space-y-4">
          <div className="mx-auto h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Help Center & Support</h1>
            <p className="text-xs text-primary-foreground/80 mt-1">Search frequently asked questions or open a ticket.</p>
          </div>
          {/* FAQ search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help topics..."
              className="pl-9 h-10 border-0 bg-white text-slate-900 placeholder:text-muted-foreground rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Main layouts section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left/Center faq details */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" /> FAQ Topics
          </h2>

          <GlassCard className="p-5">
            {filteredFaqs.length > 0 ? (
              <ShadcnAccordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, i) => (
                  <ShadcnItem key={i} value={`faq-${i}`} className="border-b border-border/40 last:border-0">
                    <ShadcnTrigger className="text-left text-sm font-semibold hover:text-primary transition-colors py-4">
                      {faq.q}
                    </ShadcnTrigger>
                    <ShadcnContent className="text-xs leading-relaxed text-muted-foreground pb-4">
                      {faq.a}
                    </ShadcnContent>
                  </ShadcnItem>
                ))}
              </ShadcnAccordion>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">No matching topics found.</p>
            )}
          </GlassCard>
        </div>

        {/* Right sidebar contact ticketing */}
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" /> Contact Support
          </h2>

          <GlassCard className="p-4">
            <form onSubmit={handleSubmit(handleTicketSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Your Email</Label>
                <Input id="email" className="h-10 rounded-xl" placeholder="you@company.com" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" className="h-10 rounded-xl" placeholder="How can we help?" {...register("subject")} />
                {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" className="min-h-[100px] rounded-xl resize-none" placeholder="Provide details about your query..." {...register("message")} />
                {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-10 rounded-xl bg-gradient-brand text-primary-foreground btn-glow"
              >
                {submitting ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-1.5 h-4 w-4" />
                )}
                Submit Ticket
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>

    </div>
  );
}
