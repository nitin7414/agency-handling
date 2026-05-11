"use client";
import { useMemo, useState } from "react";
import { completeTask, createTask } from "@/actions/customer-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Calendar, Clock, MapPin, Zap, Flame, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

type Task = { id: string; taskType: "DeliverCylinder" | "CollectEmptyCylinder"; dueDate: Date; status: "Pending" | "Completed"; priority: string; reminderNotes: string | null; customer: { id: string; fullName: string; area: string; phoneNumber: string } };
type Customer = { id: string; fullName: string; area: string };

export function TaskClient({ tasks, customers }: { tasks: Task[]; customers: Customer[] }) {
  const [filter, setFilter] = useState("Pending"); 
  const [query, setQuery] = useState(""); 
  const [message, setMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const filtered = useMemo(() => tasks.filter((t) => 
    (filter === "All" || t.status === filter) && 
    `${t.customer.fullName} ${t.customer.area} ${t.reminderNotes ?? ""}`.toLowerCase().includes(query.toLowerCase())
  ), [tasks, filter, query]);

  async function onCreate(form: FormData) { 
    const res = await createTask(null, form); 
    setMessage(res.message); 
    if (res.ok) {
       setIsAdding(false);
       setTimeout(() => setMessage(""), 3000);
    }
  }

  return (
    <main className="space-y-6 px-4 pb-24 pt-4">
      {/* Create Task Toggle */}
      <div className={cn(
        "glass-card rounded-[2.5rem] overflow-hidden transition-all duration-500",
        isAdding ? "p-6" : "p-2"
      )}>
        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-between px-6 py-4 text-white hover:text-primary transition-colors"
          >
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-primary" />
               </div>
               <span className="font-black text-sm uppercase tracking-widest">New Reminder</span>
            </div>
            <Zap className="h-4 w-4 opacity-30" />
          </button>
        ) : (
          <form action={onCreate} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-black text-white">Create Reminder</h2>
               <button type="button" onClick={() => setIsAdding(false)} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white">Cancel</button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Customer</label>
                <select name="customerId" className="h-14 w-full rounded-2xl glass border-white/5 px-4 text-white font-bold outline-none">
                  {customers.map((c) => <option key={c.id} value={c.id} className="bg-background">{c.fullName} • {c.area}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Type</label>
                   <select name="taskType" className="h-14 w-full rounded-2xl glass border-white/5 px-4 text-white font-bold outline-none">
                     <option value="DeliverCylinder" className="bg-background">Delivery</option>
                     <option value="CollectEmptyCylinder" className="bg-background">Collection</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Priority</label>
                   <select name="priority" className="h-14 w-full rounded-2xl glass border-white/5 px-4 text-white font-bold outline-none">
                     <option className="bg-background">Medium</option>
                     <option className="bg-background">High</option>
                     <option className="bg-background">Urgent</option>
                     <option className="bg-background">Low</option>
                   </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Due Date & Time</label>
                <Input name="dueDate" type="datetime-local" required className="h-14 rounded-2xl glass-card border-white/5" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Notes</label>
                <Textarea name="reminderNotes" placeholder="Any special instructions..." className="rounded-2xl glass-card border-white/5 min-h-[100px]" />
              </div>

              <Button className="w-full h-14 rounded-2xl bg-primary text-black font-black text-lg shadow-xl shadow-primary/20 touch-card">
                Save Task
              </Button>
            </div>
          </form>
        )}
      </div>

      {message && (
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4">
          <p className="text-sm font-bold text-primary flex items-center gap-2">
            <Zap className="h-4 w-4" /> {message}
          </p>
        </div>
      )}

      {/* Filter & Search */}
      <div className="space-y-3 sticky top-[80px] z-30">
        <div className="glass-card rounded-3xl p-2 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-2">
            <Search className="h-5 w-5 text-primary" />
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Filter by area or customer..." 
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-muted-foreground text-sm font-medium" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 px-1">
          {["Pending", "Completed", "All"].map((f) => (
            <button 
              key={f} 
              type="button" 
              onClick={() => setFilter(f)}
              className={cn(
                "py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border",
                filter === f 
                  ? "bg-primary text-black border-primary shadow-lg shadow-primary/10" 
                  : "bg-white/5 text-muted-foreground border-white/5"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <section className="space-y-4">
        {filtered.map((task) => { 
          const overdue = task.status === "Pending" && new Date(task.dueDate) < new Date(); 
          return (
            <article key={task.id} className={cn(
               "glass-card rounded-[2rem] p-6 relative overflow-hidden transition-all duration-300",
               overdue && "border-destructive/20 bg-destructive/5"
            )}>
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white leading-tight">{task.customer.fullName}</h3>
                  <div className="flex items-center gap-1.5 text-primary">
                     <MapPin className="h-3 w-3" />
                     <span className="text-[10px] font-bold uppercase tracking-wider">{task.customer.area}</span>
                  </div>
                </div>
                <Badge className={cn(
                   "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] border-none",
                   overdue ? "bg-destructive text-white" : task.status === "Completed" ? "bg-emerald-500 text-white" : "bg-primary/20 text-primary"
                )}>
                  {overdue ? "Overdue" : task.status}
                </Badge>
              </div>

              <div className="space-y-3 mb-6">
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <ClipboardList className="h-4 w-4 text-primary/60" />
                    <p className="text-xs font-medium text-white/80">{task.taskType === "DeliverCylinder" ? "Deliver Cylinder" : "Collect Empty Cylinder"}</p>
                 </div>
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary/60" />
                    <p className="text-xs font-bold text-white/80">{new Date(task.dueDate).toLocaleString("en-IN", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                 </div>
                 {task.reminderNotes && (
                   <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[11px] leading-relaxed text-muted-foreground italic">"{task.reminderNotes}"</p>
                   </div>
                 )}
              </div>

              {task.status === "Pending" && (
                <Button 
                   className="w-full h-12 rounded-xl bg-primary text-black font-black text-sm shadow-lg shadow-primary/10 touch-card" 
                   onClick={() => completeTask(task.id)}
                >
                  Mark as Completed
                </Button>
              )}
            </article>
          ); 
        })}
      </section>

      {filtered.length === 0 && (
        <div className="glass-card rounded-[2rem] p-12 text-center border-dashed border-white/5">
          <p className="text-muted-foreground font-medium italic">No tasks found in this category.</p>
        </div>
      )}
    </main>
  );
}
