import '@/components/shared/learning-orbit.css'

/**
 * The courses' emblem: a small lunar planet with three tilted orbits and
 * their satellites, the orange one in front. CSS 3D only (no images, no
 * script), decorative. It holds still with reduced motion and when the
 * landing's motion is paused.
 */
export default function LearningOrbit({ className }: { className?: string }) {
  return (
    <div
      className={className ? `learning-orbit ${className}` : 'learning-orbit'}
      aria-hidden="true"
    >
      <div className="learning-orbit-stars" />
      <div className="learning-orbit-scene">
        <div className="learning-orbit-planet" />
        {(['inner', 'middle', 'outer'] as const).map((ring) => (
          <div key={ring} className={`learning-orbit-ring is-${ring}`}>
            <span className="learning-orbit-satellite" />
          </div>
        ))}
      </div>
    </div>
  )
}
