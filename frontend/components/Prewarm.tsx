"use client"

import { useEffect } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Prewarm() {
  useEffect(() => {
    const alreadyWarmed = sessionStorage.getItem("prewarm_done")

    if (!alreadyWarmed) {
      fetch(`${API_URL}/health`, {
        cache: "no-store"
      }).catch(() => {})

      sessionStorage.setItem("prewarm_done", "true")
    }
  }, [])

  return null
}