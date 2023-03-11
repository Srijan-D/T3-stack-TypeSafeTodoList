//in order to use the Todo type, we need to import it from the types folder
import type { Todo } from "../types"

type TodoProps = {
    todo: Todo
}
export default function Todo({ todo }: TodoProps) {
    const { id, text, done } = todo

    return (
        <div>
            <p>{text}</p>
        </div>
    )
}