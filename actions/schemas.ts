import { z } from "zod";

export const customerSchema = z.object({ 
  fullName: z.string().min(2), 
  phoneNumber: z.string().min(7), 
  fullAddress: z.string().min(5), 
  area: z.string().min(2), 
  notes: z.string().optional(),
  aadharUrl: z.string().optional().nullable(),
  panUrl: z.string().optional().nullable(),
  foodLicenseUrl: z.string().optional().nullable(),
  gstProofUrl: z.string().optional().nullable()
});
export const transactionSchema = z.object({ 
  customerId: z.string().min(1), 
  filledCylindersDelivered: z.coerce.number().int().min(0), 
  emptyCylindersReceived: z.coerce.number().int().min(0), 
  dueAmount: z.coerce.number().min(0).optional(),
  paidAmount: z.coerce.number().min(0).optional(),
  paymentAmount: z.coerce.number().min(0).optional(), 
  paymentStatus: z.enum(["Pending", "Done"]), 
  deliveryDate: z.coerce.date(), 
  notes: z.string().optional() 
});
export const taskSchema = z.object({ customerId: z.string().min(1), taskType: z.enum(["DeliverCylinder", "CollectEmptyCylinder"]), dueDate: z.coerce.date(), priority: z.enum(["Low", "Medium", "High", "Urgent"]), reminderNotes: z.string().optional() });
export const paymentSchema = z.object({ transactionId: z.string().min(1) });
export const adminSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).optional().or(z.literal('')),
  currentPassword: z.string().min(1).optional().or(z.literal('')),
});
