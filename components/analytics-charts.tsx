"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";

export function RevenueChart({ data }: { data: { label: string; revenue: number; cylinders: number }[] }) {
  return <div className="h-64 rounded-3xl border bg-card p-3"><h2 className="mb-2 font-semibold">Revenue trend</h2><ResponsiveContainer width="100%" height="86%"><AreaChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="label" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="revenue" stroke="#0f766e" fill="#0f766e" fillOpacity={0.2} /></AreaChart></ResponsiveContainer></div>;
}
export function CylinderChart({ data }: { data: { label: string; revenue: number; cylinders: number }[] }) {
  return <div className="h-64 rounded-3xl border bg-card p-3"><h2 className="mb-2 font-semibold">Cylinder sales</h2><ResponsiveContainer width="100%" height="86%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="label" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="cylinders" fill="#f59e0b" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>;
}
