'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toastStore: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []

export function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 3000) {
  const id = Math.random().toString(36).substr(2, 9)
  const toast: Toast = { id, message, type, duration }
  
  toastStore.push(toast)
  notifyListeners()

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  return id
}

export function removeToast(id: string) {
  const index = toastStore.findIndex(t => t.id === id)
  if (index > -1) {
    toastStore.splice(index, 1)
    notifyListeners()
  }
}

function notifyListeners() {
  listeners.forEach(listener => listener([...toastStore]))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setToasts(newToasts)
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => {
        const Icon = {
          success: CheckCircle,
          error: XCircle,
          warning: AlertCircle,
          info: Info,
        }[toast.type]

        const bgColor = {
          success: 'bg-success/10 border-success/30',
          error: 'bg-danger/10 border-danger/30',
          warning: 'bg-warning/10 border-warning/30',
          info: 'bg-info/10 border-info/30',
        }[toast.type]

        const textColor = {
          success: 'text-success',
          error: 'text-danger',
          warning: 'text-warning',
          info: 'text-info',
        }[toast.type]

        return (
          <div
            key={toast.id}
            className={`${bgColor} border rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-right-full duration-300`}
          >
            <Icon className={`w-5 h-5 ${textColor} flex-shrink-0 mt-0.5`} />
            <p className={`text-sm ${textColor} flex-1`}>{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`p-1 hover:bg-black/10 rounded transition-smooth flex-shrink-0 ${textColor}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
