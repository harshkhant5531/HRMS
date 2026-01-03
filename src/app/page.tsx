import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0f1115]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic">
            Dayflow
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-blue-400 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="px-6 py-2.5 text-sm font-black uppercase tracking-widest bg-white text-black rounded-xl hover:bg-gray-200 transition-all active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl mx-auto space-y-24">
          <div className="text-center space-y-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase">
              <Zap className="w-3 h-3" /> Modern HR Management
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
              Workday <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent px-2">
                Redefined.
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Experience a sleek, high-performance HRMS that manages your team's lifecycle with precision. From automated check-ins to seamless payroll.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link href="/signup" className="group w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-600/40 active:scale-95">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all active:scale-95">
                View Demo
              </Link>
            </div>
          </div>

          {/* System Mockup */}
          <div className="relative group max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent blur-3xl -z-10 group-hover:opacity-75 transition-opacity opacity-50" />
            <div className="bg-[#1a1d23] border border-white/10 p-2 rounded-[48px] shadow-2xl transform transition-all duration-1000 group-hover:translate-y-[-10px]">
              <img
                src="/hrms_dashboard_mockup_1767436195127.png"
                alt="Dashboard Preview"
                className="rounded-[44px] w-full"
              />
            </div>

            {/* Floating Elements for visual depth */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full animate-pulse [animation-delay:1s]" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24 max-w-2xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Core Features</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Everything you need to manage your team</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Attendance tracking",
              desc: "Easy check-ins with simple reports and real-time status updates.",
              icon: CheckCircle2,
              gradient: "from-blue-500/20 to-transparent"
            },
            {
              title: "Leave Management",
              desc: "Request and approve leave with just a few clicks.",
              icon: Shield,
              gradient: "from-purple-500/20 to-transparent"
            },
            {
              title: "Payroll Access",
              desc: "View salary slips and payment history whenever you need.",
              icon: Zap,
              gradient: "from-pink-500/20 to-transparent"
            },
          ].map((feat, i) => (
            <div key={i} className="relative p-12 rounded-[48px] bg-[#1a1d23] border border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden">
              <div className={cn("absolute top-0 right-0 w-48 h-48 bg-gradient-to-br blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700", feat.gradient)} />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-10 border border-white/10 group-hover:border-blue-500/50 transition-all">
                  <feat.icon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-black mb-5 tracking-tight">{feat.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6">
        <div className="max-w-5xl mx-auto rounded-[60px] p-20 text-center space-y-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />

          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white relative z-10 leading-[0.9]">
            Scale your <br /> workforce today.
          </h2>
          <p className="text-blue-100/70 text-lg font-medium max-w-xl mx-auto relative z-10">
            Join the digital-first workspace revolution. Built for teams of 5 to 50,000.
          </p>
          <div className="pt-6 relative z-10">
            <Link href="/signup" className="px-12 py-6 bg-white text-black rounded-[28px] font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all active:scale-95 inline-block shadow-2xl shadow-black/20">
              Start Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-16 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic">
              Dayflow
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <a href="#" className="hover:text-white transition-colors">Status</a>
            </div>
            <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em]">© 2026 Dayflow HRMS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
