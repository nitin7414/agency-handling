export function dayRange(date = new Date()) { const start = new Date(date); start.setHours(0,0,0,0); const end = new Date(start); end.setDate(end.getDate()+1); return { start, end }; }
export function monthRange(date = new Date()) { const start = new Date(date.getFullYear(), date.getMonth(), 1); const end = new Date(date.getFullYear(), date.getMonth()+1, 1); return { start, end }; }
export function yearRange(date = new Date()) { const start = new Date(date.getFullYear(), 0, 1); const end = new Date(date.getFullYear()+1, 0, 1); return { start, end }; }
