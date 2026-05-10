import { z } from "zod";

export const customerSchema = z.object({ fullName: z.string().min(2), phoneNumber: z.string().min(7), fullAddress: z.string().min(5), area: z.string().min(2), notes: z.string().optional() });
export const transactionSchema = z.object({ customerId: z.string().min(1), filledCylindersDelivered: z.coerce.number().int().min(0), emptyCylindersReceived: z.coerce.number().int().min(0), paymentAmount: z.coerce.number().min(0), paymentStatus: z.enum(["Pending", "Done"]), deliveryDate: z.coerce.date(), notes: z.string().optional() });
export const taskSchema = z.object({ customerId: z.string().min(1), taskType: z.enum(["DeliverCylinder", "CollectEmptyCylinder"]), dueDate: z.coerce.date(), priority: z.enum(["Low", "Medium", "High", "Urgent"]), reminderNotes: z.string().optional() });
export const paymentSchema = z.object({ transactionId: z.string().min(1) });
