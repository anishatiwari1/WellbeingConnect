import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import Silk from "@/components/Silk";

export default function Landing() {
  const [showLearnMore, setShowLearnMore] = useState(false);
  return (
    <>
      <div className="fixed inset-0 -z-10">
        <Silk speed={5} scale={1} color="#3564e3" noiseIntensity={1.5} rotation={0} />
      </div>
      <main className="container py-16 animate-enter relative text-white">
        <SEO title="WellBeingConnect — Your mental wellness companion" description="Track your mood, grow your thoughts, read helpful content, and improve your mental wellness with WellBeingConnect." />

        <section className="relative overflow-hidden rounded-2xl border-0 shadow-[var(--shadow-elegant)] iridescence-parent z-10">
          <div className="relative px-8 py-14 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Welcome to WellBeingConnect</h1>
            <p className="mt-3 text-lg text-white/80 max-w-2xl mx-auto">
              A Tech-Based Initiative for Mental Health Support and Digital Wellness
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link to="/login">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-12 bg-white text-slate-900 hover:bg-white/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]"
                >
                  Login
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 bg-white/5 hover:bg-white/10 border-white/20 text-white"
                aria-expanded={showLearnMore}
                aria-controls="learn-more-panel"
                onClick={() => setShowLearnMore((prev) => !prev)}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Learn More dropdown card */}
        <section className="relative z-10 mt-6">
          <div className="flex justify-center">
            <div
              className={`w-full md:w-3/4 lg:w-2/3 overflow-hidden transition-all duration-500 ease-out ${
                showLearnMore ? "max-h-[600px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <div id="learn-more-panel" className="mt-4 rounded-2xl border-0 bg-white/5 backdrop-blur-sm shadow-[0_20px_60px_-12px_rgba(0,0,0,0.55),0_8px_24px_-8px_rgba(0,0,0,0.35)] px-8 py-10">
                <h2 className="text-2xl font-bold text-white text-center">This project was made by</h2>
                <ul className="mt-6 list-disc list-inside space-y-2">
                  <li className="text-white/90">
                    <span className="font-semibold text-white">Sameet Vipat</span> <span className="text-white/70">( Moodle ID : 23104014 )</span>
                  </li>
                  <li className="text-white/90">
                    <span className="font-semibold text-white">Arsh Siddique</span> <span className="text-white/70">( Moodle ID : 23104075 )</span>
                  </li>
                  <li className="text-white/90">
                    <span className="font-semibold text-white">Anisha Tiwari</span> <span className="text-white/70">( Moodle ID : 23104036 )</span>
                  </li>
                  <li className="text-white/90">
                    <span className="font-semibold text-white">Vidhi Sharma</span> <span className="text-white/70">( Moodle ID : 23104002 )</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        

        <section id="features" className="relative z-10 mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Voice-Based Thought Garden",
              description:
                "Capture thoughts hands-free with secure, transcribed audio entries you can revisit anytime.",
            },
            {
              title: "Mental Health Tracking",
              description:
                "Log moods, sleep, and habits to spot patterns and measure progress over time.",
            },
            {
              title: "Personalized insights",
              description:
                "Receive gentle, data-driven tips tailored to your trends and goals.",
            },
          ].map((feature) => (
            <Card
              key={feature.title}
              className="bg-gradient-card/20 backdrop-blur border-0 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.55),0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-shadow transition-transform hover:shadow-[0_28px_80px_-16px_rgba(0,0,0,0.6),0_12px_32px_-10px_rgba(0,0,0,0.4)] hover:-translate-y-0.5"
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-white/80 mt-2">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </>
  );
}
