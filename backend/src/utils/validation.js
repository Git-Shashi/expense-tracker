import { z } from 'zod';

// Schema for creating a new expense
export const createExpenseSchema = z.object({
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number'
    })
    .positive('Amount must be positive')
    .finite('Amount must be a finite number')
    .refine(
      (val) => {
        // Check if amount has at most 2 decimal places
        const decimalPart = val.toString().split('.')[1];
        return !decimalPart || decimalPart.length <= 2;
      },
      { message: 'Amount must have at most 2 decimal places' }
    ),
  category: z
    .string({
      required_error: 'Category is required',
      invalid_type_error: 'Category must be a string'
    })
    .trim()
    .min(1, 'Category cannot be empty')
    .max(50, 'Category cannot exceed 50 characters'),
  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string'
    })
    .trim()
    .min(1, 'Description cannot be empty')
    .max(500, 'Description cannot exceed 500 characters'),
  date: z
    .string({
      required_error: 'Date is required'
    })
    .datetime({ message: 'Date must be a valid ISO 8601 datetime string' })
    .or(z.date())
    .refine(
      (val) => {
        const dateValue = typeof val === 'string' ? new Date(val) : val;
        return dateValue <= new Date();
      },
      { message: 'Date cannot be in the future' }
    )
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
});

// Schema for query parameters when getting expenses
export const getExpensesQuerySchema = z.object({
  category: z
    .string()
    .trim()
    .min(1, 'Category filter cannot be empty')
    .optional(),
  sortBy: z
    .enum(['date', 'amount', 'createdAt'], {
      errorMap: () => ({ message: 'sortBy must be one of: date, amount, createdAt' })
    })
    .optional()
    .default('date'),
  order: z
    .enum(['asc', 'desc'], {
      errorMap: () => ({ message: 'order must be either asc or desc' })
    })
    .optional()
    .default('desc'),
  limit: z
    .string()
    .regex(/^\d+$/, 'limit must be a positive integer')
    .transform(Number)
    .refine((val) => val > 0 && val <= 1000, {
      message: 'limit must be between 1 and 1000'
    })
    .optional(),
  skip: z
    .string()
    .regex(/^\d+$/, 'skip must be a non-negative integer')
    .transform(Number)
    .refine((val) => val >= 0, {
      message: 'skip must be non-negative'
    })
    .optional()
});

// Schema for updating an expense (all fields optional)
export const updateExpenseSchema = createExpenseSchema.partial();

// Schema for expense ID parameter validation
export const expenseIdSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid expense ID format')
});

// Type exports for TypeScript users (if you migrate to TypeScript)
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type GetExpensesQuery = z.infer<typeof getExpensesQuerySchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseIdParam = z.infer<typeof expenseIdSchema>;
