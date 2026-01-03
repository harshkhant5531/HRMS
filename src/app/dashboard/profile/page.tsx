"use client";

import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    IdCard,
    Briefcase,
    Calendar,
    Camera,
    Loader2,
    Save,
    ShieldCheck
} from "lucide-react";
import { format } from "date-fns";

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/profile");
            const data = await res.json();
            setProfile(data);
            setFormData({
                name: data.name || "",
                phone: data.phone || "",
                address: data.address || "",
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                fetchProfile();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-gray-400 mt-2">Manage your personal and professional information.</p>
            </div>

            {/* Profile Header Card */}
            <div className="bg-[#1a1d23] border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[32px] bg-gradient-to-tr from-blue-500 to-purple-500 p-1">
                            <div className="w-full h-full rounded-[28px] bg-[#1a1d23] flex items-center justify-center text-4xl font-bold">
                                {profile.name?.charAt(0)}
                            </div>
                        </div>
                        <button className="absolute bottom-1 right-1 p-2 bg-blue-600 rounded-xl border-4 border-[#1a1d23] hover:scale-110 transition-transform">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                            <h2 className="text-3xl font-bold">{profile.name}</h2>
                            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1.5">
                                <ShieldCheck className="w-3 h-3" /> {profile.role}
                            </span>
                        </div>
                        <p className="text-gray-400 font-medium">{profile.jobTitle || "Software Engineer"} • {profile.department || "Engineering"}</p>
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-gray-500 pt-2">
                            <span className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4" /> {profile.email}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <IdCard className="w-4 h-4" /> {profile.employeeId}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Details Form */}
                <div className="bg-[#1a1d23] border border-white/5 p-8 rounded-3xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Personal Information</h3>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#0f1115] border border-white/5 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full bg-[#0f1115] border border-white/5 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Location / Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                <textarea
                                    rows={2}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Your office or home address"
                                    className="w-full bg-[#0f1115] border border-white/5 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Details Read-only */}
                <div className="bg-[#1a1d23] border border-white/5 p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold">Job Information</h3>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                                <Briefcase className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Job Title</p>
                                <p className="text-gray-200 font-medium">{profile.jobTitle || "Not Assigned"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Calendar className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Joining Date</p>
                                <p className="text-gray-200 font-medium">{format(new Date(profile.joiningDate), "MMMM dd, yyyy")}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                                <IdCard className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Employee ID</p>
                                <p className="text-gray-200 font-medium">{profile.employeeId}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-bold uppercase">Department</span>
                                <span className="font-bold text-gray-300">{profile.department || "General"}</span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
