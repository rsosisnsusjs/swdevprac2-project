'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, BookOpen, MapPin, Users, ChevronLeft, ChevronRight, ArrowRight, Loader2 } from 'lucide-react'
import { apiCall } from '@/lib/api-client'
import { ExhibitionCarousel } from '@/components/ExhibitionCarousel'
import { HeroSection } from '@/components/HeroSection'

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

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [isLoadingExhibitions, setIsLoadingExhibitions] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Remove automatic redirect - let Navbar handle auth
  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push('/auth/login')
  //   }
  // }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const data = await apiCall('/exhibitions')
        setExhibitions(data.data || [])
      } catch (err: any) {
        console.error('Failed to load exhibitions:', err)
      } finally {
        setIsLoadingExhibitions(false)
      }
    }

    fetchExhibitions()
  }, [])

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || exhibitions.length === 0) return

    let scrollInterval: NodeJS.Timeout

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          container.scrollBy({ left: 320, behavior: 'smooth' })
        }
      }, 3500)
    }

    const timer = setTimeout(startAutoScroll, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(scrollInterval)
    }
  }, [exhibitions])

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    return `${date.getDate()} ${months[date.getMonth()]}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-accent" />
          <p className="text-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const upcomingExhibitions = exhibitions
    .filter(ex => new Date(ex.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 8)

  return (
    <div className="min-h-screen bg-background">
      <HeroSection user={user} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {upcomingExhibitions.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Recommended Exhibitions
                </h2>
                <p className="text-text-secondary mt-1">
                  Upcoming exhibitions you might be interested in
                </p>
              </div>

              <Link href="/exhibitions">
                <Button variant="outline" className="gap-2">
                  See All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <ExhibitionCarousel exhibitions={upcomingExhibitions} />
          </>
        )}
      </div>


      {/* Action Cards */}
      {/* {(user?.role === 'member' || user?.role === 'admin') && (
          <div className="grid md:grid-cols-1 max-w-2xl mx-auto gap-6"> */}
      {/* My Bookings Card - Only for members */}
      {/* {user?.role === 'member' && (
              <Card className="p-8 hover:shadow-lg hover:border-accent/50 group">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground group-hover:text-accent">
                      My Bookings
                    </h2>
                    <p className="text-text-secondary mt-2">
                      Manage your booth reservations and bookings
                    </p>
                  </div>
                  <div className="p-3 bg-accent-light rounded-lg group-hover:bg-accent group-hover:scale-110 transition-all">
                    <BookOpen className="h-6 w-6 text-accent group-hover:text-white transition-colors" />
                  </div>
                </div>
                <Link href="/bookings">
                  <Button className="w-full bg-accent hover:bg-accent-hover group-hover:shadow-lg">
                    View Bookings
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            )} */}

      {/* Admin Panel Card - Only for admins */}
      {/* {user?.role === 'admin' && (
              <Card className="p-8 hover:shadow-lg hover:border-accent/50 group">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground group-hover:text-accent">
                      Admin Panel
                    </h2>
                    <p className="text-text-secondary mt-2">
                      Manage booth reservations and Exhibitions
                    </p>
                  </div>
                  <div className="p-3 bg-accent-light rounded-lg group-hover:bg-accent">
                    <BookOpen className="h-6 w-6 text-accent group-hover:text-white" />
                  </div>
                </div>
                <Link href="/admin">
                  <Button className="w-full bg-accent hover:bg-accent-hover group-hover:shadow-lg">
                    View Admin Panel
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            )} */}
      {/* </div>
        )} */}
    </div>
  )
}