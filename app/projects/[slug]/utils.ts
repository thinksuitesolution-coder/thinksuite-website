import type { Project } from '../data'

export function parseMetric(val: string): { target: number; suffix: string; decimals: number } | null {
  const m = val.match(/^(\d+(?:\.\d+)?)(.*)$/)
  if (!m) return null
  const suffix = m[2]
  const decimals = m[1].includes('.') ? m[1].split('.')[1].length : 0
  const target = parseFloat(m[1])
  if (!suffix && target >= 1000) return null // bare years ("2015") don't read as a stat count-up
  return { target, suffix, decimals }
}

export function hasWebsite(project: Project): boolean {
  return project.cat.includes('Website')
}

export function getDomain(url?: string): string | null {
  if (!url || url === '#') return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export function buildKeywords(project: Project): string[] {
  const raw = [project.industry, ...project.services, ...(project.tech || [])]
  const seen = new Set<string>()
  const out: string[] = []
  for (const k of raw) {
    const key = k.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(k)
  }
  return out
}
