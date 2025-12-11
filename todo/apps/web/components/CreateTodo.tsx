"use client";
import React, { useState } from 'react'
import { trpc } from '../trpc/client';

const CreateTodo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const utils = trpc.useUtils();

  const mutation = trpc.todo.createTodo.useMutation({
    onSuccess: () => {
      setName("");
      setDescription("");
      setDueDate("");
      setPriority("low");
      utils.todo.getAllTodos.invalidate();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    mutation.mutate({
      name,
      description,
      completed:false,
      dueDate,
      priority,
    })
  }
  return (
    <form onSubmit={handleSubmit} className=' space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className=' text-2xl font-semibold text-gray-800 mb-2 text-center'> Create a Todo</h2>

      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Todo name' className=' w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none' />
      
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Description' className=' w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none resize-none'></textarea>
      
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className=' w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none resize-none' />
      
      <select value={priority} onChange={(e) => {
        setPriority(e.target.value as "low"|"medium"|"high")
      }}
        className=' w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2 rounded outline-none resize-none'>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit" disabled={mutation.isPending}
        className=' bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 rounded w-full font-medium transition disabled:opacity-50'>
        { mutation.isPending ? 'Creating...':'Create Todo'}
      </button>
    </form>
  )
}

export default CreateTodo