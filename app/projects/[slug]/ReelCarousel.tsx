'use client'

import { useEffect, useRef, useState } from 'react'
import type { SocialPost } from '../data'

export default function ReelCarousel({ reels }: { reels: SocialPost[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    if (reels.length < 2 || paused) return
    const t = setInterval(() => setActive(i => (i + 1) % reels.length), 5500)
    return () => clearInterval(t)
  }, [reels.length, paused])

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (v && i !== active) v.pause()
    })
  }, [active])

  if (reels.length === 0) return null

  const go = (i: number) => setActive((i + reels.length) % reels.length)

  return (
    <div
      className="prj-reel-carousel reveal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="prj-reel-viewport">
        <div className="prj-reel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {reels.map((post, i) => (
            <div className="prj-reel-slide" key={i} aria-hidden={i !== active}>
              <div className="prj-social-card-image">
                <video
                  ref={el => { videoRefs.current[i] = el }}
                  controls
                  poster={post.image}
                  preload="none"
                  onPlay={() => setPaused(true)}
                >
                  <source src={post.video} />
                </video>
                <span className="prj-social-badge prj-social-badge-reel">
                  <i className="fa-solid fa-film" />
                  Reel
                </span>
                {post.postUrl && (
                  <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="prj-social-outbound-link" aria-label="View original post">
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                  </a>
                )}
              </div>
              <p className="prj-social-caption">{post.caption}</p>
              {(post.likes || post.views) && (
                <div className="prj-social-stats">
                  {post.likes && <span><i className="fa-solid fa-heart" /> {post.likes}</span>}
                  {post.views && <span><i className="fa-solid fa-eye" /> {post.views}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {reels.length > 1 && (
        <>
          <button type="button" className="prj-reel-arrow prj-reel-arrow-prev" onClick={() => go(active - 1)} aria-label="Previous reel">
            <i className="fa-solid fa-chevron-left" />
          </button>
          <button type="button" className="prj-reel-arrow prj-reel-arrow-next" onClick={() => go(active + 1)} aria-label="Next reel">
            <i className="fa-solid fa-chevron-right" />
          </button>
          <div className="prj-reel-dots">
            {reels.map((_, i) => (
              <button
                type="button"
                key={i}
                className={`prj-reel-dot${i === active ? ' active' : ''}`}
                onClick={() => go(i)}
                aria-label={`Reel ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
