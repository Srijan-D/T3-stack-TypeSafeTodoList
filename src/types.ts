import { z } from "zod";
//in order to get the type of todo
// export type Todo = z.infer<typeof todoInput>;
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./server/api/root";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type allTodosOutput = RouterOutputs["todo"]["all"]

export type Todo = allTodosOutput[number]


export const todoInput = z
    .string({
        required_error: "Description is required",
    })
    .min(1)
    .max(100)
