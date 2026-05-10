import { Download } from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return <><MobileHeader title="Reports" subtitle="Export records and prepare database backup" /><main className="space-y-4 px-4"><section className="touch-card"><h2 className="text-lg font-bold">Customer records</h2><p className="mb-4 text-sm text-muted-foreground">Download all customer balances, cylinders and contact details as CSV.</p><Button asChild className="w-full"><a href="/api/export/customers"><Download className="h-4 w-4" />Export customers</a></Button></section><section className="touch-card"><h2 className="text-lg font-bold">Transaction report</h2><p className="mb-4 text-sm text-muted-foreground">Export payments, pending dues and delivery counts for accounting.</p><Button asChild className="w-full" variant="secondary"><a href="/api/export/transactions"><Download className="h-4 w-4" />Export transactions</a></Button></section><section className="touch-card"><h2 className="text-lg font-bold">Backup support</h2><p className="text-sm text-muted-foreground">For Neon PostgreSQL, enable point-in-time restore and scheduled branch backups in Neon. Keep DATABASE_URL encrypted in your deployment provider.</p></section></main></>;
}
