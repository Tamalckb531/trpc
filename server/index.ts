import express, { Request, Response} from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { initTRPC, TRPCError} from '@trpc/server' 
import {z} from 'zod'
import dotenv from 'dotenv'

dotenv.config();

type Context = {
    userId?: string;
}

//? Initialize trpc with a context factory
//! Context is an object passed to all procedures. Mostly used in authentication
//! Express equivalent is authentication middleware used in jwt token verification 
const createContext = ({ req, res }: { req: Request, res: Response }): Context => {
    return {
        userId: req.headers.authorization || undefined,
    }
}

//? Initialize trpc
const t = initTRPC.context<Context>().create();

//? Create base router and procedure helpers 
const router = t.router;
const publicProcedure = t.procedure;

//? Define some mock data 
const users = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
    { id: '3', name: 'Charlie', email: 'charlie@example.com' },
];

//? Create a trpc router with procedures 
const appRouter = router({
    //? Query procedure - get all users
    getUsers: publicProcedure.query(() => { return users; }),
    
    //? Query procedure with input validation - get user by id
    getUserById: publicProcedure
        .input(z.string())
        .query(({ input }) => {
            const user = users.find(u => u.id === input);
            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `User with id ${input} not found`,
                });
            }
            return user;
        }),
    
    //? Mutation procedure - create a new user
    createUser: publicProcedure
        .input(z.object({
            name: z.string().min(2),
            email: z.string().email(),
        }))
        .mutation(({ input }) => {
            const existingUser = users.find(u => u.email === input.email);
            if (existingUser) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'User with this email already exists',
                });
            }

            const newUser = {
                id: String(users.length + 1),
                name: input.name,
                email: input.email,
            };

            users.push(newUser);
            return newUser;
        }),
});

//? Export type definition of API
export type AppRouter = typeof appRouter;

//? Create Express server 
const app = express();

//? Middleware
app.use(cors());
app.use(express.json());

//? Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).json({
        error:'Internal Server Error',
        message:process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
})

//? Add tRPC middleware
app.use(
    '/trpc',
    createExpressMiddleware({
        router: appRouter,
        createContext,
        onError: ({ error }) => {
            console.error('trpc error: ', error);
        }
    })
);

//? Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});