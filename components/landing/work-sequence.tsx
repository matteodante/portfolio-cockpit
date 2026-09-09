import Image from 'next/image'

/** Decorative film plates. Content and project links never depend on playback. */
export default function WorkSequence({ title }: { title: string }) {
  return (
    <div className="work-scene" data-work-sequence>
      <div className="cinema-stage work-stage">
        {[
          {
            film: 'launch',
            position: 'mission',
            sizes: '(max-width: 799px) 84vw, (min-width: 2500px) 1150px, 46vw',
          },
          {
            film: 'saturn',
            position: 'visor',
            sizes: '(max-width: 799px) 76vw, (min-width: 2432px) 900px, 37vw',
          },
        ].map(({ film, position, sizes }) => (
          <div
            className={`work-film work-film-${position}`}
            key={film}
            aria-hidden
          >
            <div className="work-film-image">
              <Image
                src={`/landing-v2/work-video/${film}-poster.jpg`}
                alt=""
                fill
                sizes={sizes}
                quality={85}
              />
              <video
                data-src={`/landing-v2/work-video/${film}.mp4`}
                muted
                playsInline
                preload="none"
                tabIndex={-1}
              />
            </div>
          </div>
        ))}
        <div className="work-shade" aria-hidden />
        <h2 id="work-heading">{title}</h2>
      </div>
    </div>
  )
}
