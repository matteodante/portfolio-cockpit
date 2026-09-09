import Image from 'next/image'

/** Decorative film plates. Content and project links never depend on playback. */
export default function WorkSequence({ title }: { title: string }) {
  return (
    <div className="work-scene" data-work-sequence>
      <div className="cinema-stage work-stage">
        {['mission', 'visor'].map((film) => (
          <div className={`work-film work-film-${film}`} key={film} aria-hidden>
            <div className="work-film-image">
              <Image
                src={`/landing-v2/work-video/${film}-poster.jpg`}
                alt=""
                fill
                sizes="(max-width: 799px) 58vw, 42vw"
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
