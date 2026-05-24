'use client'

import { useEffect, useRef } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Task {
  id: string
  title: string
  deadline: string | null
  time: string | null
  place: string | null
  person: string | null
  status: string
}

export default function TaskNotifier() {
  const { data: tasks } = useSWR<Task[]>('/api/tasks/all', fetcher, {
    refreshInterval: 30000, // Re-fetch every 30 seconds
  })

  // Track which tasks we've already notified about (by ID) so we don't spam
  const notifiedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!tasks || tasks.length === 0) return

    const checkTasks = () => {
      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]
      const currentHours = now.getHours().toString().padStart(2, '0')
      const currentMinutes = now.getMinutes().toString().padStart(2, '0')
      const currentTimeStr = `${currentHours}:${currentMinutes}`

      tasks.forEach((task) => {
        if (task.status === 'done') return
        if (notifiedRef.current.has(task.id)) return
        if (!task.deadline || !task.time) return

        const taskDateStr = new Date(task.deadline).toISOString().split('T')[0]

        // Check if the task is due RIGHT NOW (same date, same hour:minute)
        if (taskDateStr === todayStr && task.time === currentTimeStr) {
          notifiedRef.current.add(task.id)

          // Fire browser notification
          if (Notification.permission === 'granted') {
            const body = [
              task.place && `📍 ${task.place}`,
              task.person && `👤 ${task.person}`,
            ]
              .filter(Boolean)
              .join('  •  ')

            new Notification(`⏰ Task Due: ${task.title}`, {
              body: body || 'Your task is due now!',
              icon: '/favicon.ico',
              tag: task.id, // Prevents duplicate OS-level notifications
            })
          }

          // Also show an in-page toast as fallback
          showInPageToast(task)
        }
      })
    }

    // Check every 15 seconds for precision
    const interval = setInterval(checkTasks, 15000)
    checkTasks() // Run immediately on mount

    return () => clearInterval(interval)
  }, [tasks])

  return null // This component is invisible — it only runs logic
}

function showInPageToast(task: Task) {
  // Create a floating toast notification
  const toast = document.createElement('div')
  toast.className = 'task-notification-toast'
  toast.innerHTML = `
    <div style="
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, rgba(245,158,11,0.95), rgba(217,119,6,0.95));
      color: #0f172a;
      padding: 16px 20px;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(245,158,11,0.2);
      z-index: 9999;
      max-width: 360px;
      font-family: 'Inter', sans-serif;
      animation: slideInUp 0.4s ease-out;
      backdrop-filter: blur(10px);
    ">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">⏰ Task Due Now</div>
      <div style="font-weight: 600; font-size: 16px; margin-bottom: 6px;">${task.title}</div>
      <div style="font-size: 12px; opacity: 0.8; display: flex; gap: 12px;">
        ${task.time ? `<span>🕐 ${task.time}</span>` : ''}
        ${task.place ? `<span>📍 ${task.place}</span>` : ''}
        ${task.person ? `<span>👤 ${task.person}</span>` : ''}
      </div>
    </div>
  `
  document.body.appendChild(toast)

  // Auto-remove after 8 seconds
  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transition = 'opacity 0.5s'
    setTimeout(() => toast.remove(), 500)
  }, 8000)
}
