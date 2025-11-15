'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { apiCall } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, ArrowLeft, Check } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

interface Exhibition {
  _id: string
  name: string
  venue: string
  startDate: string
  smallBoothQuota: number
  bigBoothQuota: number
}

export default function BookBoothPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, isLoading } = useAuth()
  const [exhibition, setExhibition] = useState<Exhibition | null>(null)
  const [boothType, setBoothType] = useState<'small' | 'big'>('small')
  const [amount, setAmount] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading2, setIsLoading2] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await apiCall('/booking', {
        method: 'POST',
        body: JSON.stringify({
          exhibition: exhibitionId,
          boothType,
          amount,
        }),
      })

      setSuccess(true)
      setTimeout(() => {
        router.push('/bookings')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || isLoading2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (error && !exhibition) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Link href="/exhibitions">
            <Button variant="outline" size="sm" className="gap-2 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Exhibitions
            </Button>
          </Link>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!exhibition) return null

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
          <p className="text-text-secondary mb-6">
            Your booth booking has been successfully created. Redirecting...
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <Link href={`/exhibitions/${exhibitionId}`}>
            <Button variant="outline" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Book a Booth</h1>
          <p className="text-text-secondary mt-1">{exhibition.name}</p>
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Booth Type Selection */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-4 block">
                Select Booth Type
              </Label>
              <RadioGroup value={boothType} onValueChange={(value: any) => setBoothType(value)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-surface cursor-pointer">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small" className="flex-1 cursor-pointer">
                      <p className="font-medium text-foreground">Small Booth</p>
                      <p className="text-sm text-text-secondary">
                        Available: {exhibition.smallBoothQuota}
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-surface cursor-pointer">
                    <RadioGroupItem value="big" id="big" />
                    <Label htmlFor="big" className="flex-1 cursor-pointer">
                      <p className="font-medium text-foreground">Big Booth</p>
                      <p className="text-sm text-text-secondary">
                        Available: {exhibition.bigBoothQuota}
                      </p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Quantity Selection */}
            <div>
              <Label htmlFor="amount" className="text-base font-semibold text-foreground mb-4 block">
                Number of Booths
              </Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                  disabled={amount <= 1 || isSubmitting}
                >
                  −
                </Button>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="6"
                  className="w-20 text-center border border-border rounded-lg px-3 py-2 text-foreground"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAmount(Math.min(6, amount + 1))}
                  disabled={amount >= 6 || isSubmitting}
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Maximum 6 booths per exhibition
              </p>
            </div>

            {/* Summary */}
            <Card className="p-4 bg-surface">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Booth Type:</span>
                  <span className="font-medium text-foreground capitalize">{boothType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Quantity:</span>
                  <span className="font-medium text-foreground">{amount}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between">
                  <span className="text-foreground font-semibold">Total:</span>
                  <span className="font-bold text-accent">{amount} booth(s)</span>
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent-hover"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
