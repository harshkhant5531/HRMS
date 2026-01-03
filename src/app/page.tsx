import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap, Users, CreditCard, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0c10]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white italic">Dayflow</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/signup" className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-white text-black rounded-xl hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Subtle Background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] bg-indigo-600/10 blur-[150px] rounded-full -z-10 opacity-60" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black tracking-[0.2em] uppercase">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Unified HR Management
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-white">
              The platform <br />
              <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent px-2">
                for modern teams.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
              Manage workforce lifecycle, automate attendance tracking, and streamline payroll with a beautifully engineered interface.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/signup" className="group w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/30 active:scale-95 text-white">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 text-gray-400 hover:text-white">
                View Demo
              </Link>
            </div>
          </div>

          {/* System Mockup - Professional Clean Style */}
          <div className="relative group max-w-6xl mx-auto px-4">
            <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="bg-[#11141a] border border-white/[0.08] p-3 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              <img
                src="/hrms_dashboard_mockup_1767436195127.png"
                alt="Organization Dashboard"
                className="rounded-[32px] w-full border border-white/5 shadow-inner"
              />
            </div>

            {/* Floating UI Badges */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 animate-bounce-slow">
              <div className="p-4 rounded-2xl bg-[#11141a] border border-white/10 shadow-xl backdrop-blur-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Attendance</p>
                  <p className="text-xs font-bold text-white">98% Logged</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#11141a] border border-white/10 shadow-xl backdrop-blur-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Workforce</p>
                  <p className="text-xs font-bold text-white">124 Members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-48 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24 max-w-3xl mx-auto space-y-4">
          <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">Operations Ledger</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Built for scale, <br /> designed for people.</h2>
          <p className="text-gray-500 font-medium text-lg leading-relaxed">Everything you need to manage a high-performance team in one unified environment.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Time Intelligence",
              desc: "Effortless check-ins with automated presence reports and real-time history.",
              icon: Zap,
              color: "text-amber-500",
              bg: "bg-amber-500/5",
              border: "hover:border-amber-500/20"
            },
            {
              title: "Approval workflows",
              desc: "Request and approve leave with a streamlined digital feedback cycle.",
              icon: Shield,
              color: "text-indigo-500",
              bg: "bg-indigo-500/5",
              border: "hover:border-indigo-500/20"
            },
            {
              title: "Payroll engine",
              desc: "Access digital salary slips and payout history through a secure encrypted portal.",
              icon: CreditCard,
              color: "text-emerald-500",
              bg: "bg-emerald-500/5",
              border: "hover:border-emerald-500/20"
            },
          ].map((feat, i) => (
            <div key={i} className={cn("relative p-12 rounded-[48px] bg-[#11141a] border border-white/5 transition-all group overflow-hidden", feat.border)}>
              <div className="relative z-10">
                <div className={cn("w-16 h-16 rounded-[30%] flex items-center justify-center mb-10 border border-white/5 group-hover:scale-110 transition-transform shadow-inner", feat.bg)}>
                  <feat.icon className={cn("w-7 h-7", feat.color)} />
                </div>
                <h3 className="text-2xl font-black mb-5 tracking-tight text-white">{feat.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-indigo-500/5 transition-all" />
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="pb-48 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Organizations", value: "250+" },
            { label: "Total Members", value: "85K" },
            { label: "Check-ins Today", value: "42K" },
            { label: "System Uptime", value: "99.9%" },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2 p-8 rounded-[32px] bg-white/[0.01] border border-white/5">
              <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto bg-indigo-600 rounded-[60px] p-24 text-center space-y-12 relative overflow-hidden group shadow-2xl shadow-indigo-600/20">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.85]">
              Ready to optimize <br /> your operations?
            </h2>
            <p className="text-indigo-100 font-medium text-lg max-w-xl mx-auto opacity-80">
              Join high-growth teams using Dayflow to build a better workspace experience.
            </p>
          </div>
          <div className="relative z-10 pt-6">
            <Link href="/signup" className="px-14 py-7 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all active:scale-95 inline-block shadow-2xl shadow-black/20">
              Start Building Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-16 border-t border-white/5 px-6 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-500 border border-indigo-500/10">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white italic">Dayflow</span>
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <a href="#" className="hover:text-white transition-colors">Compliance</a>
            </div>
            <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em]">© 2026 Dayflow Technologies</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
