import type { CSSProperties } from 'react'
import type { Project } from '../../data'

export default function SocialShowcase({ project }: { project: Project }) {
  const socialImagePosts = project.socialPosts?.filter(p => p.type === 'post') || []
  const socialReels = project.socialPosts?.filter(p => p.type === 'reel') || []

  return (
    <div className="prj-panel-section reveal">
      <div className="prj-panel-section-label">Best on Social</div>
      <p className="prj-social-note">Hand-picked by our team, not a live feed.</p>
      {project.socialPosts && project.socialPosts.length > 0 ? (
        <>
          {socialImagePosts.length > 0 && (
            <>
              <div className="prj-social-subhead"><i className="fa-solid fa-images" /> Posts</div>
              <div className="prj-social-row reveal">
                {socialImagePosts.map((post, i) => (
                  <div key={i} className="prj-social-card prj-social-card-post">
                    <div className="prj-social-card-image">
                      <img className="prj-social-img-bg" src={post.image} alt="" aria-hidden="true" />
                      <img className="prj-social-img-fg" src={post.image} alt={post.caption} />
                      <span className="prj-social-badge prj-social-badge-post">
                        <i className="fa-solid fa-image" />
                        Post
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
            </>
          )}
          {socialReels.length > 0 && (
            <>
              <div className="prj-social-subhead"><i className="fa-solid fa-clapperboard" /> Reels</div>
              <div className="prj-reel-marquee reveal">
                <div
                  className="prj-reel-marquee-track"
                  style={{ '--reel-count': socialReels.length } as CSSProperties}
                >
                  {[...socialReels, ...socialReels].map((post, i) => (
                    <div
                      key={i}
                      className="prj-social-card prj-social-card-reel"
                      aria-hidden={i >= socialReels.length}
                    >
                      <div className="prj-social-card-image">
                        <img className="prj-reel-bg" src={post.image} alt="" aria-hidden="true" />
                        <video controls poster={post.image} preload="none" tabIndex={i >= socialReels.length ? -1 : 0}>
                          <source src={post.video} />
                        </video>
                        <span className="prj-social-badge prj-social-badge-reel">
                          <i className="fa-solid fa-film" />
                          Reel
                        </span>
                        {post.postUrl && (
                          <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="prj-social-outbound-link" aria-label="View original post" tabIndex={i >= socialReels.length ? -1 : 0}>
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
            </>
          )}
        </>
      ) : (
        <div className="prj-social-placeholder">
          <i className="fa-solid fa-photo-film" />
          <span>Social highlights coming soon</span>
        </div>
      )}
    </div>
  )
}
