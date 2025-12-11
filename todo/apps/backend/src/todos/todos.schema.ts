import { z } from "zod";

export const todoSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    completed: z.boolean(),
    createdAt: z.string(),
    dueDate: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
});

export const createTodoSchema = todoSchema.omit({
    id: true,
    createdAt: true
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;

export type Todo = z.infer<typeof todoSchema>;