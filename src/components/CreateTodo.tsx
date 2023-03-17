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

            // we are saving the previous todos so that we can rollback to the previous state if the mutation fails
            const previousTodos = trpc.todo.all.getData();

            //optimistic update
            trpc.todo.all.setData(undefined, (prev) => {
                const optimisticTodo = {
                    id: "optimistic-id",
                    //id is set on the server side, so we are setting it to a random string
                    text: newTodo,
                    //we are setting the text to the newTodo value
                    done: false,
                }
                if (!prev) return [optimisticTodo]
                return [...prev, optimisticTodo]
            })
            setNewTodo("");
            return ({ previousTodos })
        },
        //if the mutation fails, we will rollback to the previous state
        onError: (err, newTodo, context) => {
            toast.error("Error occurred while creating todo 🤯");
            setNewTodo(newTodo);
            //rollback to the previous state
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
                <input type="text" className="text-neutral-900 w-auto hover:opacity-80 bg-gray-400 focus:bg-gray-300 focus:outline-none" value={newTodo} onChange={(e) => {
                    setNewTodo(e.target.value);
                }} />
                <button className="ml-6 mt-5 text-xl">Create</button>
            </form>
        </div >
    )
}