import { api } from "~/utils/api"
import Todo from "~/components/Todo"
export default function Todos() {
    const { data: todos, isLoading, isError } = api.todo.all.useQuery()

    if (isLoading) return <div>Loading...⏳</div>
    if (isError) return <div>Oops!Error whilst fetching 😢 </div>

    return (
        <>
            {todos.length ? todos.map((todo) => {
                return <Todo key={todo.id} todo={todo} />
            }) : <div>No todos yet! 🤷‍♂️</div>}

        </>
    )
}