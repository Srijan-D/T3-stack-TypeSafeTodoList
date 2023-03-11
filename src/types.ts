import { z } from "zod";


export const todoInput = z
    .string({
        required_error: "Description is required",
    })
    .min(1)
    .max(100)
    