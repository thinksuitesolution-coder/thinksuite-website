'use client'
import { useState } from 'react'

export default function SafeImg({
  src,
  fallback,
  alt,
  loading,
}: {
  src: string
  fallback: string
  alt: string
  loading?: 'eager' | 'lazy'
}) {
  const [errored, setErrored] = useState(false)
  return (
    <img
      src={errored ? fallback : src}
      alt={alt}
      loading={loading}
      onError={() => setErrored(true)}
    />
  )
}
