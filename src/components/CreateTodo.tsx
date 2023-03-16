import { api } from "~/utils/api";
import { useState } from "react";
export default function CreateTodo() {
    const [newTodo, setNewTodo] = useState("");
    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
            }}>
                <input type="text" className="text-neutral-900" value={newTodo} onChange={(e) => {
                    setNewTodo(e.target.value);
                }} />
                <button>Create</button>
            </form>
        </div>
    )
}