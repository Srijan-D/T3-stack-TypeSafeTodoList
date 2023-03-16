//in order to use the Todo type, we need to import it from the types folder
import type { Todo } from "../types"

type TodoProps = {
    todo: Todo
}
export default function Todo({ todo }: TodoProps) {
    const { id, text, done } = todo

    return (
        <>
            <div className="flex gap-4 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <input type="checkbox" className="cursor-pointer w-4 h-4" name="done" id="done" checked={done}/>
                    <label htmlFor="done" className={`cursor-pointer`}>
                        {text}
                    </label>
                </div>
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 rounded p-1 text-sm my-2">
                    Delete
                </button>
            </div>
        </>
    )
}