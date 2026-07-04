import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/common/GlassCard";

const values = [
  { title: "Craft first", desc: "We sweat every pixel and every millisecond. Software should feel like a well-made object." },
  { title: "Human-scale", desc: "Meetings are between people, not endpoints. Our product should always remember that." },
  { title: "Radical clarity", desc: "No dark patterns. No lock-in. Fair pricing that scales with real value." },
];

const team = [
  { name: "Alex Rivera", role: "CEO & Co-founder", seed: "alex" },
  { name: "Priya Shah", role: "CTO & Co-founder", seed: "priya" },
  { name: "Jordan Lee", role: "Head of Design", seed: "jordan" },
  { name: "Mika Chen", role: "Head of Engineering", seed: "mika" },
];

export default function About() {
  return (
    <div className="hero-bg">
      <section className="container py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 rounded-full">Our story</Badge>
          <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl">
            We're building the meeting <span className="gradient-text">we always wanted</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Meetly started with a simple frustration: modern teams deserve a video product with the taste and polish
            of the software they love. So we built it.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {values.map((v) => (
            <GlassCard key={v.title}>
              <h3 className="text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </GlassCard>
          ))}
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold tracking-tight">The team</h2>
          <p className="mt-2 text-muted-foreground">A small group with a big taste for details.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <GlassCard key={m.name} hover className="text-center">
                <img
                  src={`https://api.dicebear.com/9.x/glass/svg?seed=${m.seed}&backgroundType=gradientLinear`}
                  alt={m.name}
                  className="mx-auto h-20 w-20 rounded-2xl"
                />
                <h3 className="mt-4 font-semibold">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
