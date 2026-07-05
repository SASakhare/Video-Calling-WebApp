import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Play, Sparkles, Video, Users, Shield, Zap, MonitorPlay,
  MessageSquare, Calendar, Mic, VideoOff, PhoneOff, Hand, Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/common/GlassCard";

const features = [
  { icon: Video, title: "Studio-grade video", desc: "1080p adaptive streaming with noise-canceled audio, tuned for any network." },
  { icon: Users, title: "Rooms that scale", desc: "From 1:1s to all-hands with 500+ attendees — same buttery-smooth UI." },
  { icon: Shield, title: "Enterprise security", desc: "End-to-end encryption, SSO, SCIM, and granular admin controls." },
  { icon: Sparkles, title: "AI recaps", desc: "Auto-generated notes, action items, and searchable transcripts." },
  { icon: MonitorPlay, title: "Zero-friction sharing", desc: "Share a window, tab, or full screen with instant annotation tools." },
  { icon: Zap, title: "Blazing fast join", desc: "Under 2 seconds from click to camera. No downloads, no fuss." },
];

const logos = ["Northwind", "Acme Co.", "Vertex", "Stripe.io", "Linear", "Notion"];

const stats = [
  { value: "2.1M+", label: "Meetings hosted" },
  { value: "99.99%", label: "Uptime" },
  { value: "180+", label: "Countries" },
  { value: "4.9/5", label: "User rating" },
];

export default function Landing() {
  return (
    <>
      {/*//* HERO */}
      <section className="relative overflow-hidden hero-bg noise">
        <div className="pointer-events-none absolute inset-0 grid-dots opacity-30" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />

        <div className="container relative pt-24 pb-20 md:pt-32 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="outline" className="mb-6 rounded-full border-primary/30 bg-primary/5 px-3 py-1 text-primary">
              <Sparkles className="mr-1.5 h-3 w-3" /> Introducing AI meeting recaps
            </Badge>
            <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Video meetings that <span className="gradient-text">feel human</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
              Meetly is the premium video conferencing platform built for modern teams —
              crystal-clear video, effortless scheduling, and enterprise-grade security.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">

              {/* //* register page */}
              <Button asChild size="lg" className="h-12 rounded-full bg-gradient-brand px-6 text-primary-foreground btn-glow">
                <Link to="/register">Start for free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>

              {/* //* meeting join page */}
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-border/70 px-6 backdrop-blur">
                <Link to="/meetings/join"><Play className="mr-2 h-4 w-4" /> Join a meeting</Link>
              </Button>

            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              No credit card · Free for up to 100 participants
            </p>
          </motion.div>

          {/* //* Meeting preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto mt-16 max-w-6xl"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-brand opacity-20 blur-3xl" />
            <div className="relative glass-panel overflow-hidden rounded-3xl p-2 shadow-xl">
              {/* //* complete meeting preview */}
              <MeetingPreview />
            </div>
          </motion.div>
        </div>
      </section>

      {/* //* LOGOS */}
      <section className="border-y border-border/60 bg-muted/30 py-10">
        <div className="container">
          <p className="mb-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {logos.map((l) => (
              <span key={l} className="text-lg font-semibold text-muted-foreground/70">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* //* FEATURES */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4 rounded-full">Features</Badge>
            <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
              Everything you need. Nothing you don't.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A meeting platform designed with the same care as the software you love.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <GlassCard hover className="h-full">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* //* STATS */}
      <section className="border-y border-border/60 bg-gradient-brand-soft py-16">
        <div className="container grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold tracking-tight gradient-text md:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* // * SPLIT — chat & schedule */}
      <section className="py-24">
        <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="outline" className="mb-4 rounded-full">Collaboration</Badge>
            <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
              Rich chat, reactions, and side channels — all in flow.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Keep the conversation moving without breaking the meeting. Threaded chat, live reactions, raise hand,
              and instant polls come standard.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Persistent in-meeting chat with rich text",
                "Live reactions and hand-raising",
                "Breakout rooms with one click",
                "Polls, Q&A, and captions",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-foreground/90">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <GlassCard className="p-5">
            <ChatPreview />
          </GlassCard>
        </div>
      </section>

      {/* //* CTA */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-brand p-12 text-center text-primary-foreground shadow-brand md:p-16"
          >
            <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay grid-dots" />
            <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
              Your next meeting is one click away.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/85">
              Join thousands of teams already meeting better with Meetly.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {/* //* link to register page */}
              <Button asChild size="lg" variant="secondary" className="h-12 rounded-full px-6">
                <Link to="/register">Get started free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              {/* //* link to contact page */}
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/30 bg-white/10 px-6 text-primary-foreground backdrop-blur hover:bg-white/20 hover:text-primary-foreground">
                <Link to="/contact">Talk to sales</Link>
              </Button>

            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function MeetingPreview() {
  const tiles = [
    { name: "Alex Rivera", color: "from-rose-400 to-rose-600", speaking: true, host: true },
    { name: "Priya Shah", color: "from-amber-400 to-orange-500" },
    { name: "Jordan Lee", color: "from-emerald-400 to-teal-500", muted: true },
    { name: "Mika Chen", color: "from-sky-400 to-blue-500" },
    { name: "Sam Okafor", color: "from-violet-400 to-purple-500", hand: true, camOff: true },
    { name: "Rowan Patel", color: "from-pink-400 to-fuchsia-500", muted: true },
  ];

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-950">
      {/* Recording indicator */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        REC · 24:18
      </div>
      <div className="absolute right-4 top-4 z-10 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        6 participants
      </div>

      {/* //* Grid */}
      <div className="grid h-full grid-cols-3 gap-2 p-2">
        {tiles.map((t) => (
          <div key={t.name} className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${t.color} ${t.speaking ? "ring-2 ring-white/80" : ""}`}>
            {t.camOff ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-lg font-semibold text-white backdrop-blur">
                  {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/10" />
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/40 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
              {t.host && <span className="rounded-sm bg-white/25 px-1 py-px text-[9px]">HOST</span>}
              {t.name}
              {t.muted && <Mic className="h-3 w-3 opacity-70 line-through" />}
            </div>
            {t.hand && (
              <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg">
                <Hand className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* //* Control bar */}
      <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center">
        <div className="flex items-center gap-1.5 rounded-2xl bg-black/50 p-1.5 backdrop-blur-xl">
          {[
            { icon: Mic, label: "Mic" },
            { icon: VideoOff, label: "Cam" },
            { icon: MonitorPlay, label: "Share" },
            { icon: Hand, label: "Hand" },
            { icon: MessageSquare, label: "Chat" },
            { icon: Users, label: "People" },
            { icon: Circle, label: "Rec" },
          ].map((c) => (
            <button key={c.label} className="flex h-10 w-10 items-center justify-center rounded-xl text-white/85 hover:bg-white/10">
              <c.icon className="h-[18px] w-[18px]" />
            </button>
          ))}
          <div className="mx-1 h-6 w-px bg-white/20" />

          <button className="flex h-10 items-center gap-1.5 rounded-xl bg-red-500 px-3 text-sm font-medium text-white hover:bg-red-600">
            <PhoneOff className="h-4 w-4" /> Leave
          </button>

        </div>
      </div>
    </div>
  );
}

function ChatPreview() {
  const msgs = [
    { from: "Priya Shah", text: "Sharing the deck now 📎", side: "left" },
    { from: "Jordan Lee", text: "Looking great! One tweak on slide 4?", side: "left" },
    { from: "You", text: "Good catch — let me pull it up.", side: "right" },
    { from: "Sam Okafor", text: "👏 nice work team", side: "left" },
  ];


  return (
    <div className="space-y-3">

      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">Meeting chat</span>
        <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /> live</span>
      </div>

      <div className="space-y-3">
        {msgs.map((m, i) => (
          <motion.div
            key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className={`flex ${m.side === "right" ? "justify-end" : ""}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${m.side === "right" ? "bg-gradient-brand text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"}`}>
              {m.side === "left" && <p className="text-[11px] font-medium text-muted-foreground">{m.from}</p>}
              {m.text}
            </div>
            
          </motion.div>
        ))}
      </div>
    </div>
  );
}
