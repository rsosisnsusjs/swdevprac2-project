'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { apiCall } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function CreateExhibitionPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    startDate: '',
    durationDay: 1,
    smallBoothQuota: 0,
    bigBoothQuota: 0,
    posterPicture: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'durationDay' || name === 'smallBoothQuota' || name === 'bigBoothQuota' ? parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await apiCall('/exhibitions', {
        method: 'POST',
        body: JSON.stringify(formData),
      })
      router.push('/admin/exhibitions')
    } catch (err: any) {
      setError(err.message || 'Failed to create exhibition')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <Link href="/admin/exhibitions">
            <Button variant="outline" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Exhibitions
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create Exhibition</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Card className="p-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Exhibition Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tech Expo 2024"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Exhibition details..."
                required
                disabled={isSubmitting}
                rows={4}
                className="w-full border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Venue</label>
              <Input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Convention Center"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Date
                </label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Duration (days)
                </label>
                <Input
                  type="number"
                  name="durationDay"
                  value={formData.durationDay}
                  onChange={handleChange}
                  min="1"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Small Booth Quota
                </label>
                <Input
                  type="number"
                  name="smallBoothQuota"
                  value={formData.smallBoothQuota}
                  onChange={handleChange}
                  min="0"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Big Booth Quota
                </label>
                <Input
                  type="number"
                  name="bigBoothQuota"
                  value={formData.bigBoothQuota}
                  onChange={handleChange}
                  min="0"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Poster Picture URL
              </label>
              <Input
                type="url"
                name="posterPicture"
                value={formData.posterPicture}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent-hover"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Creating...' : 'Create Exhibition'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
