import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const url = "https://65642499ceac41c0761d7f40.mockapi.io/todo";

const App = () => {
    const [todos, setTodos] = useState([]);
    const [todoAdd, setTodoAdd] = useState("");
    const [editingTodo, setEditingTodo] = useState(null);
    const [editedTodoTitle, setEditedTodoTitle] = useState("");

    useEffect(() => {
        axios(url).then(({ data }) => setTodos(data));
    }, []);

    const handleAddTodo = () => {
        const newTodo = {
            title: todoAdd,
            completed: false,
            createdAt: null,
            completedAt: +new Date(),
        };
        setTodoAdd("");
        axios.post(url, newTodo).then(({ data }) => setTodos([...todos, data]));
    };

    const handleDeleteTodo = (todo) => {
        axios.delete(`${url}/${todo.id}`)
            .then(({ data }) => setTodos(todos.filter((t) => t.id !== data.id)))
            .catch((error) => console.error("Error deleting todo:", error));
    };

    const handleEditTodo = (todo) => {
        setEditingTodo(todo.id);
        setEditedTodoTitle(todo.title);
    };

    const handleSaveEdit = () => {
        axios.put(`${url}/${editingTodo}`, { title: editedTodoTitle })
            .then(() => {
                setEditingTodo(null);
                setTodos(todos.map((t) => (t.id === editingTodo ? { ...t, title: editedTodoTitle } : t)));
            })
            .catch((error) => console.error("Error editing todo:", error));
    };

    return (
        <div className={'container'}>
            <h1>Todo List</h1>
            <input className={'inputMain'} type="text" onChange={(e) => setTodoAdd(e.target.value)} />
            <button className={'mainButton'} onClick={handleAddTodo}>Add</button>
            <div>
                {todos.map((todo) => (
                    <div className={'todo-wrapper'} key={todo.id}>
                        {editingTodo === todo.id ? (
                            <>
                                <input type="text" value={editedTodoTitle} onChange={(e) => setEditedTodoTitle(e.target.value)} />
                                <button onClick={handleSaveEdit}>Save</button>
                            </>
                        ) : (
                            <>
                                <p>{todo.title}</p>
                                <input type="checkbox" checked={todo.completed} />
                                <span>{dayjs(todo.completedAt).format('HH:mm MM/DD/YYYY')}</span>
                                <button onClick={() => handleEditTodo(todo)}>Edit</button>
                                <button onClick={() => handleDeleteTodo(todo)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;