"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ExhibitionCard } from "./ExhibitionCard"

export function ExhibitionCarousel({ exhibitions }: { exhibitions: any[] }) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const pauseRef = useRef(false)
  const resumeTimerRef = useRef<number | null>(null)

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = getCardStep(scrollRef.current)
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
    }
  }

  const updateScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
    pauseAutoscrollTemporarily()
  }

  const getCardStep = (container: HTMLDivElement) => {
    const firstChild = container.children[0] as HTMLElement | undefined
    if (!firstChild) return 400

    const cardWidth = firstChild.getBoundingClientRect().width

    const gapStyle = window.getComputedStyle(container).gap
    let gapPx = 0
    if (gapStyle) {
      const parsed = parseFloat(gapStyle)
      gapPx = Number.isFinite(parsed) ? parsed : 0
    }
    if (!gapPx) gapPx = 24

    return Math.round(cardWidth + gapPx)
  }
  const pauseAutoscrollTemporarily = () => {
    pauseRef.current = true
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current)
    }
    // resume after 2500ms of inactivity
    resumeTimerRef.current = window.setTimeout(() => {
      pauseRef.current = false
      resumeTimerRef.current = null
    }, 2500)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let intervalId: number | null = null

    const step = () => {
      if (!el) return
      if (pauseRef.current) return

      const amount = getCardStep(el)
      const maxScrollLeft = el.scrollWidth - el.clientWidth

      if (el.scrollLeft + amount >= maxScrollLeft - 2) {
        el.scrollTo({ left: maxScrollLeft, behavior: "smooth" })
        setTimeout(() => {
          el.scrollTo({ left: 0, behavior: "auto" })
        }, 900)
      } else {
        el.scrollBy({ left: amount, behavior: "smooth" })
      }
    }

    intervalId = window.setInterval(step, 3200)

    const onMouseEnter = () => {
      pauseRef.current = true
    }
    const onMouseLeave = () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = window.setTimeout(() => {
        pauseRef.current = false
        resumeTimerRef.current = null
      }, 700)
    }
    const onTouchStart = () => {
      pauseRef.current = true
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current)
    }
    const onTouchEnd = () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = window.setTimeout(() => {
        pauseRef.current = false
        resumeTimerRef.current = null
      }, 1000)
    }

    el.addEventListener("mouseenter", onMouseEnter)
    el.addEventListener("mouseleave", onMouseLeave)
    el.addEventListener("touchstart", onTouchStart)
    el.addEventListener("touchend", onTouchEnd)

    return () => {
      if (intervalId) window.clearInterval(intervalId)
      el.removeEventListener("mouseenter", onMouseEnter)
      el.removeEventListener("mouseleave", onMouseLeave)
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchend", onTouchEnd)
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current)
    }
  }, [exhibitions])

  return (
    <div className="relative group">
      {/* Left button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {/* Right button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={updateScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
      >
        {exhibitions.map((ex) => (
          <ExhibitionCard key={ex._id} exhibition={ex} />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
