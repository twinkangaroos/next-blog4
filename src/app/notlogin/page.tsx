'use client'
import { Amplify } from 'aws-amplify';
// import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
// import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createTodo, updateTodo, deleteTodo } from '@/graphql/mutations';
import { listTodos } from '@/graphql/queries';

import config from '@/amplifyconfiguration.json';
Amplify.configure(config);

export function App() {
    
    const [todoName, setTodoName] = useState("")
    const [todos, setTodos] = useState<any[]>([]);

    useEffect(()=> {
        const fetchData = async () => {
            const client = generateClient();
            const ret = await client.graphql({ query: listTodos });
            setTodos(ret.data.listTodos.items)
            //console.log("todos", ret.data.listTodos.items)
        }
        fetchData()
    }, [])

    // Todo入力時のChangeイベント
    const todoNameChange = (e: any) => {
        setTodoName(e.target.value)
    }

    // Todo追加ボタンクリック時
    async function addTodo() {
        const client = generateClient();
        /* create a todo */
        const newData = await client.graphql({
            query: createTodo,
            variables: {
                input: {
                    "name": todoName,
                    "description": ''
                }
            }
        });
        console.log('Created Todo: ', newData);
    }

    return (
        <>
            <div
                style={{
                    maxWidth: '500px',
                    margin: '0 auto',
                    textAlign: 'center',
                    marginTop: '100px'
                }}
            >
                {/* <div style={{ marginBottom: "30px" }}>
                    <h1>Hello {user?.username}</h1>
                    <button onClick={signOut}>Sign out</button>
                </div> */}
                <div>
                    <input name="todoName" placeholder="Add a todo" onChange={(e) => todoNameChange(e)} />
                    <button onClick={addTodo}>Add</button>
                </div>
                {(!todos || todos.length === 0) && (
                    <div>
                        <p>No todos, please add one.</p>
                    </div>
                )}
               <ul>
                    {todos?.map((todo) => {
                        return <li key={todo.id} style={{ listStyle: 'none' }}>{todo.name}</li>;
                    })}
                </ul>
            </div>
        </>
    );
}
export default App;