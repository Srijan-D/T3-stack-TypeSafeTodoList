//in order to use the Todo type, we need to import it from the types folder
import type { Todo } from "../types"
import { api } from "~/utils/api"

type TodoProps = {
    todo: Todo
}
export default function Todo({ todo }: TodoProps) {
    const { id, text, done } = todo
    const trpc = api.useContext();

    const { mutate: doneMutation } = api.todo.toggle.useMutation({
        onSettled: async () => {
            await trpc.todo.all.invalidate();
            //we are invalidating the all query so that the todos component will re-render after Updating a todo
        }
    })
    const { mutate: deleteMutation } = api.todo.delete.useMutation({
        onSettled: async () => {
            await trpc.todo.all.invalidate();
            //we are invalidating the all query so that the todos component will re-render after Updating a todo
        }
    })

    return (
        <>
            <div className="flex gap-4 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <input type="checkbox" className="cursor-pointer w-4 h-4" name="done" id="done" checked={done}
                        onChange={(e) => {
                            doneMutation({ id, done: e.target.checked })
                        }}
                    />
                    <label htmlFor="done" className={`cursor-pointer`}>
                        {text}
                    </label>
                </div>
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 rounded p-1 text-sm my-2" onClick={() => {
                    deleteMutation(id)
                }}>
                    Delete
                </button>
            </div>
        </>
    )
}