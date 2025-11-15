'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { apiCall } from '@/lib/api-client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'

interface Exhibition {
  _id: string
  name: string
  description: string
  venue: string
  startDate: string
  durationDay: number
  smallBoothQuota: number
  bigBoothQuota: number
  posterPicture?: string
}

export default function ExhibitionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, isLoading } = useAuth()
  const [exhibition, setExhibition] = useState<Exhibition | null>(null)
  const [isLoading2, setIsLoading2] = useState(true)
  const [error, setError] = useState('')

  const exhibitionId = params.id as string

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        const data = await apiCall(`/exhibitions/${exhibitionId}`)
        setExhibition(data.data)
      } catch (err: any) {
        setError(err.message || 'Failed to load exhibition')
      } finally {
        setIsLoading2(false)
      }
    }

    if (isAuthenticated && exhibitionId) {
      fetchExhibition()
    }
  }, [isAuthenticated, exhibitionId])

  if (isLoading || isLoading2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (error || !exhibition) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link href="/exhibitions">
            <Button variant="outline" size="sm" className="gap-2 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Exhibitions
            </Button>
          </Link>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Exhibition not found'}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const endDate = new Date(
    new Date(exhibition.startDate).getTime() + exhibition.durationDay * 24 * 60 * 60 * 1000
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/exhibitions">
            <Button variant="outline" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Exhibitions
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{exhibition.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {exhibition.posterPicture && (
              <img
                src={exhibition.posterPicture || "/placeholder.svg"}
                alt={exhibition.name}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}

            <Card className="p-8 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
              <p className="text-text-secondary leading-relaxed">{exhibition.description}</p>
            </Card>

            <Card className="p-8">
              <h2 className="text-xl font-bold text-foreground mb-6">Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Venue</p>
                  <p className="font-medium text-foreground">{exhibition.venue}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Duration</p>
                  <p className="font-medium text-foreground">{exhibition.durationDay} day(s)</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-text-secondary mb-1">Dates</p>
                  <p className="font-medium text-foreground">
                    {format(new Date(exhibition.startDate), 'MMMM dd, yyyy')} -{' '}
                    {format(endDate, 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Booth Availability</h3>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-surface rounded-lg">
                  <p className="text-sm text-text-secondary mb-1">Small Booth</p>
                  <p className="text-2xl font-bold text-accent mb-1">
                    {exhibition.smallBoothQuota}
                  </p>
                  <p className="text-xs text-text-secondary">Available</p>
                </div>

                <div className="p-4 bg-surface rounded-lg">
                  <p className="text-sm text-text-secondary mb-1">Big Booth</p>
                  <p className="text-2xl font-bold text-accent mb-1">{exhibition.bigBoothQuota}</p>
                  <p className="text-xs text-text-secondary">Available</p>
                </div>
              </div>

              <Link href={`/exhibitions/${exhibition._id}/book`}>
                <Button className="w-full bg-accent hover:bg-accent-hover">
                  Book a Booth
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
