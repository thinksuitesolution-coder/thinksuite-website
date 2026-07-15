export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        background: 'linear-gradient(90deg, var(--accent), var(--primary))',
        animation: 'ts-loading-bar 1.1s ease-in-out infinite',
        transformOrigin: '0% 50%',
      }}
    />
  )
}
