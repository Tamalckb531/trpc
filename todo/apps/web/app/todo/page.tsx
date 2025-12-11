"use client";
import React from 'react'
import CreateTodo from '../../components/CreateTodo'
import { trpc } from '../../trpc/client';

const page = () => {
  const { data: todos } = trpc.todo.getAllTodos.useQuery();
  const utils = trpc.useUtils(); //? This basically works like useEffect which is use to invalidate prev data fetching and do new fetch after each effect

  const updateMutation = trpc.todo.updateTodo.useMutation({
    onSuccess: ()=> utils.todo.getAllTodos.invalidate()
  });

  const deleteMutation = trpc.todo.deleteTodo.useMutation({
    onSuccess: ()=> utils.todo.getAllTodos.invalidate()
  });

  const handleToggle = (todoId: string, completed: boolean) => {
    updateMutation.mutate({
      id: todoId,
      data: {
        completed: !completed
      }
    })
  }

  const handleDelete = (todoId: string) => {
    if (confirm('Are you sure you wanna delete this todo?')) {
      deleteMutation.mutate({id:todoId})
    }
  }
  return (
    <div className=' space-y-4 max-w-2xl mx-auto mt-6'>
       <CreateTodo/>
      {
        todos?.map(todo => (
          <div className=' border rounded p-4 bg-white shadow-sm flex justify-between items-start' key={todo.id}>
            <div className=' flex items-start space-x-3'>
              <input type="checkbox"
                className=' mt-1 h-4 w-4 text-blue-600'
                checked={todo.completed}
                onChange={() => handleToggle(todo.id, todo.completed)} />
              <div>
                <h3 className={`text-lg font-medium ${todo.completed ? " line-through text-gray-400" : " text-gray-900"}`}>
                  {todo.name}
                </h3>
                <p className=' text-gray-700'>{todo.description}</p>
                <div className=' text-sm text-gray-500 mt-1 space-x-2'>
                  {todo.dueDate && (
                    <span>
                      Due: {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {
                    todo.priority && (
                      <span>
                        Priority:
                        {
                          todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)
                        }
                      </span>
                    )
                  }
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(todo.id)}
              className=' text-red-500 hover:text-red-700 text-sm'
            >
              Delete
            </button>
          </div>
        ))
       }
    </div>
  )
}

export default page