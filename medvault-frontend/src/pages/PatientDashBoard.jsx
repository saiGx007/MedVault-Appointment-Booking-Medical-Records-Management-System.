import React, { useState, useEffect } from 'react'; // FIX 1: Added Hooks
import { Heart, Activity, Clock, Star, ArrowRight, User, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig'; // FIX 2: Ensure api is imported

export default function PatientDashboard() {
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = [
    { label: "Heart Rate", value: "72 bpm", sub: "Normal", color: "bg-rose-500", icon: Heart },
    { label: "Blood Sugar", value: "110 mg/dL", sub: "Healthy", color: "bg-blue-500", icon: Activity },
    { label: "Last Checkup", value: "Jan 12", sub: "5 days ago", color: "bg-amber-500", icon: Clock },
    { label: "Health Score", value: "A+", sub: "Top 5%", color: "bg-emerald-500", icon: Star },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/appointments/patient/my-bookings');
        // Sort by date descending and take top 3
        const latest = response.data
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
          .slice(0, 3);
        setRecentAppointments(latest);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10 animate-page">
      {/* Welcome Banner */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-blue-600">M Sai Ganesh!</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Managing your healthcare at MedVault.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Sync: Active</span>
        </div>
      </header>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
            <div className={`${s.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${s.color}/20 group-hover:scale-110 transition-transform`}>
              <s.icon className="text-white" size={26} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List - DYNAMIC DATA */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Recent Appointments</h3>
            <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-2">
              See All <ArrowRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-blue-600" />
              </div>
            ) : recentAppointments.length > 0 ? (
              recentAppointments.map((apt) => (
                <AppointmentRow
                  key={apt.id}
                  name={`Dr. ${apt.doctor.user.fullName}`}
                  type={apt.doctor.specialization}
                  date={`${apt.appointmentDate}, ${apt.appointmentTime}`}
                  status={apt.status}
                />
              ))
            ) : (
              <p className="text-slate-400 italic text-center py-10">No recent appointments found.</p>
            )}
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold leading-tight">Need a <br/>Checkup?</h3>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed">Book a consultation with our verified specialists now.</p>
            <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white w-full py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/30 active:scale-95">
              Book Appointment
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </div>
    </div>
  );
}

function AppointmentRow({ name, type, date, status }) {
  // Logic to determine status color
  const statusColor = status === 'COMPLETED' || status === 'PAID' ? 'text-blue-600' : 'text-amber-600';

  return (
    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-200 hover:bg-white transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors border border-slate-200">
          <User size={20} />
        </div>
        <div>
          <p className="font-bold text-slate-800">{name}</p>
          <p className="text-xs text-slate-500 font-medium">{type}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-800">{date}</p>
        <p className={`text-[10px] font-black uppercase tracking-tighter mt-1 ${statusColor}`}>
          {status}
        </p>
      </div>
    </div>
  );
}