import { Input, Mutation, Query, Router } from "nestjs-trpc";
import { TodosService } from "./todos.service";
import { z } from 'zod';
import { createTodoSchema, todoSchema } from "./todos.schema";
import type { CreateTodoInput } from "./todos.schema";

@Router({ alias: 'todo' })
    
//! This router has full crud functionality and the logics are getting called from service
export class TodoRouter {
    constructor(private readonly todosService: TodosService) { }

    @Query({
        input: z.object({ id: z.string() }),
        output: todoSchema,
    })
    getTodoById(@Input('id') id:string) {
        return this.todosService.getTodoById(id);
    }

    @Query({
        output: z.array(todoSchema),
    })
    getAllTodos() {
        return this.todosService.getAllTodos();
    }

    @Mutation({
        input: createTodoSchema,
        output: todoSchema
    })
    createTodo(@Input() todoData: CreateTodoInput) {
        return this.todosService.createTodo(todoData);
    }

    @Mutation({
        input: z.object({
            id: z.string(),
            data: createTodoSchema.partial()
        }),
        output: todoSchema
    })
    updateTodo(
        @Input('id') id: string,
        @Input('data') data: Partial<CreateTodoInput>
    ) {
        return this.todosService.updateTodo(id, data);
    }

    @Mutation({
        input: z.object({
            id: z.string(),
        }),
        output: z.boolean()
    })
    deleteTodo(
        @Input('id') id: string
    ) {
        return this.todosService.deleteTodo(id);
    }
 }