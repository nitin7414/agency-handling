"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";

const TooltipContent = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl p-3 border-white/10 shadow-2xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{payload[0].payload.label}</p>
        <p className="text-sm font-black text-white">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data }: { data: { label: string; revenue: number; cylinders: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
            dy={10}
          />
          <YAxis 
            hide
          />
          <Tooltip content={<TooltipContent />} />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="var(--color-primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRev)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CylinderChart({ data }: { data: { label: string; revenue: number; cylinders: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
            dy={10}
          />
          <YAxis hide />
          <Tooltip content={<TooltipContent />} />
          <Bar 
            dataKey="cylinders" 
            fill="var(--color-primary)" 
            radius={[6, 6, 0, 0]} 
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
