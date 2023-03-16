import { api } from "~/utils/api";
import { useState } from "react";
import { todoInput } from "~/types";
import { toast } from "react-hot-toast";
import { totalmem } from "os";

export default function CreateTodo() {
    const [newTodo, setNewTodo] = useState("");
    const trpc = api.useContext();
    const { mutate } = api.todo.create.useMutation({
        onMutate: async (newTodo) => {
            //we are canceling the all query so that they dont overwrite optimistic updates
            await trpc.todo.all.cancel();

            //
            const previousTodos = trpc.todo.all.getData();

            //optimistic update
            trpc.todo.all.setData(undefined, (prev) => {
                const optimisticTodo = {
                    id: Math.random(),
                    text: "placeholder",
                    done: false,
                }
                if (!prev) return [optimisticTodo]
                return [...prev, optimisticTodo]
            })
            setNewTodo("");
            return ({ previousTodos })
        },
        onError: (err, newTodo, context) => {
            toast.error("Error occurred while creating todo 🤯");
            setNewTodo(newTodo);
            trpc.todo.all.setData(undefined, () => context?.previousTodos);
        },
        onSettled: async () => {
            await trpc.todo.all.invalidate();
            //we are invalidating the all query so that the todos component will re-render after creating a new one
        }
    });
    return (

        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                const result = todoInput.safeParse(newTodo);
                if (!result.success) {
                    toast.error(result.error.format()._errors.join("\n"));
                    return;
                }
                mutate(newTodo);
            }}>
                <input type="text" className="text-neutral-900" value={newTodo} onChange={(e) => {
                    setNewTodo(e.target.value);
                }} />
                <button>Create</button>
            </form>
        </div >
    )
}