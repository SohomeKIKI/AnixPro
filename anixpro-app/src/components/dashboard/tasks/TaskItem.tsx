import { format } from 'date-fns'
import { Calendar as CalendarIcon, Check, Trash2, Clock, MapPin, User } from 'lucide-react'

export interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  deadline: string | null
  time: string | null
  place: string | null
  person: string | null
  projectId: string | null
}

interface TaskItemProps {
  task: Task
  onToggle: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'done'

  return (
    <div className={`group flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all ${isCompleted ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onToggle(task)}
          className={`flex items-center justify-center w-6 h-6 rounded-full border transition-all flex-shrink-0 ${isCompleted ? 'bg-amber-500 border-amber-500' : 'border-white/20 hover:border-amber-500'}`}
        >
          {isCompleted && <Check className="w-4 h-4 text-white" />}
        </button>
        <div>
          <h3 className={`text-white font-medium ${isCompleted ? 'line-through text-white/50' : ''}`}>
            {task.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            {task.deadline && (
              <span className="text-xs text-white/40 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                {format(new Date(task.deadline), 'MMM d, yyyy')}
              </span>
            )}
            {task.time && (
              <span className="text-xs text-amber-400/70 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {task.time}
              </span>
            )}
            {task.place && (
              <span className="text-xs text-blue-400/70 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {task.place}
              </span>
            )}
            {task.person && (
              <span className="text-xs text-emerald-400/70 flex items-center gap-1">
                <User className="w-3 h-3" />
                {task.person}
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-white/40 hover:text-red-400 transition-all rounded-lg hover:bg-white/5"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
