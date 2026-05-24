'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Plus, Calendar as CalendarIcon, Clock, MapPin, User, ChevronDown, ChevronUp } from 'lucide-react'

import { TaskItem, type Task } from '@/components/dashboard/tasks/TaskItem'

// Define the fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function TasksClient() {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDeadline, setNewTaskDeadline] = useState('')
  const [newTaskTime, setNewTaskTime] = useState('')
  const [newTaskPlace, setNewTaskPlace] = useState('')
  const [newTaskPerson, setNewTaskPerson] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  // Fetch all tasks - single API call
  const { data: allTasks, mutate: mutateAllTasks } = useSWR<Task[]>('/api/tasks/all', fetcher)

  // Derived state to avoid redundant API calls
  const todayTasks = allTasks?.filter(task => {
    if (!task.deadline) return false
    const today = new Date().setHours(0,0,0,0)
    const taskDate = new Date(task.deadline).setHours(0,0,0,0)
    return today === taskDate
  })

  // Exclude today's tasks from the "All Tasks" view to avoid visual duplication
  const otherTasks = allTasks?.filter(task => {
    if (!task.deadline) return true
    const today = new Date().setHours(0,0,0,0)
    const taskDate = new Date(task.deadline).setHours(0,0,0,0)
    return today !== taskDate
  })

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const optimisticTask: Task = {
      id: Math.random().toString(),
      title: newTaskTitle,
      status: 'todo',
      deadline: newTaskDeadline ? new Date(newTaskDeadline).toISOString() : null,
      time: newTaskTime || null,
      place: newTaskPlace || null,
      person: newTaskPerson || null,
      projectId: null,
    }

    // Optimistic UI update
    if (allTasks) mutateAllTasks([optimisticTask, ...allTasks], false)

    // Reset form
    setNewTaskTitle('')
    setNewTaskDeadline('')
    setNewTaskTime('')
    setNewTaskPlace('')
    setNewTaskPerson('')
    setShowDetails(false)

    await fetch('/api/tasks/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: optimisticTask.title,
        deadline: optimisticTask.deadline,
        time: optimisticTask.time,
        place: optimisticTask.place,
        person: optimisticTask.person,
      }),
    })

    // Revalidate
    mutateAllTasks()
  }

  const handleToggleStatus = async (task: Task) => {
    const newStatus = (task.status === 'done' ? 'todo' : 'done') as Task['status']
    
    // Optimistic update function
    const updateTasksArray = (tasks?: Task[]) => 
      tasks?.map(t => t.id === task.id ? { ...t, status: newStatus } : t)

    mutateAllTasks(updateTasksArray(allTasks), false)

    await fetch('/api/tasks/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: task.id, status: newStatus }),
    })

    mutateAllTasks()
  }

  const handleDelete = async (taskId: string) => {
    const filterTasks = (tasks?: Task[]) => tasks?.filter(t => t.id !== taskId)
    
    mutateAllTasks(filterTasks(allTasks), false)

    await fetch(`/api/tasks/delete?taskId=${taskId}`, { method: 'DELETE' })

    mutateAllTasks()
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
        <p className="text-white/60">Manage your daily priorities</p>
      </header>

      {/* Task Creation Form */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <form onSubmit={handleCreateTask} className="space-y-4">
          {/* Row 1: Title */}
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
            required
          />

          {/* Row 2: Date + Time + Toggle Details */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type="date"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white/60 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all cursor-pointer"
              />
            </div>
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white/60 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all cursor-pointer"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white/80 transition-all text-sm"
            >
              More Details
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Row 3: Place + Person (collapsible) */}
          {showDetails && (
            <div className="flex flex-col md:flex-row gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Place (e.g. Office, Cafe)"
                  value={newTaskPlace}
                  onChange={(e) => setNewTaskPlace(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div className="relative flex-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/50 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Person involved (e.g. John, Team)"
                  value={newTaskPerson}
                  onChange={(e) => setNewTaskPerson(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </form>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Today&apos;s Focus
          </h2>
          <div className="space-y-3">
            {!todayTasks ? (
              <div className="animate-pulse bg-white/5 h-16 rounded-xl" />
            ) : todayTasks.length === 0 ? (
              <p className="text-white/40 text-sm italic">No tasks due today. Enjoy your day!</p>
            ) : (
              todayTasks.map(task => (
                <TaskItem key={task.id} task={task} onToggle={handleToggleStatus} onDelete={handleDelete} />
              ))
            )}
          </div>
        </section>

        {/* Other Tasks */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            Other Tasks
          </h2>
          <div className="space-y-3">
            {!otherTasks ? (
              <div className="animate-pulse bg-white/5 h-16 rounded-xl" />
            ) : otherTasks.length === 0 ? (
              <p className="text-white/40 text-sm italic">No other upcoming tasks.</p>
            ) : (
              otherTasks.map(task => (
                <TaskItem key={task.id} task={task} onToggle={handleToggleStatus} onDelete={handleDelete} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
