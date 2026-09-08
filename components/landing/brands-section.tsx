import Image from 'next/image'
import { makeT } from '@/components/landing/i18n'
import type { Locale } from '@/lib/i18n/config'

const BRANDS = [
  {
    id: 'pilatus',
    name: 'Pilatus Aircraft',
    file: 'pilatus.svg',
    width: 159,
    height: 18,
    kind: 'team',
  },
  {
    id: 'piuudito',
    name: 'PiùUDITO',
    file: 'piuudito.webp',
    width: 640,
    height: 453,
    kind: 'client',
  },
  {
    id: 'hexa',
    name: 'Hexa Credit Care',
    file: 'hexa.webp',
    width: 567,
    height: 291,
    kind: 'team',
  },
  {
    id: 'dontouch',
    name: 'DonTouch',
    file: 'dontouch-v2.webp',
    width: 498,
    height: 144,
    kind: 'team',
  },
  {
    id: 'galileo',
    name: 'Galileo SpA',
    file: 'galileo.webp',
    width: 293,
    height: 75,
    kind: 'team',
  },
  {
    id: 'fastweb',
    name: 'Fastweb',
    file: 'fastweb.svg',
    width: 180,
    height: 30,
    kind: 'project',
  },
  {
    id: 'sorgenia',
    name: 'Sorgenia',
    file: 'sorgenia.svg',
    width: 147,
    height: 46,
    kind: 'project',
  },
  {
    id: 'gymtree',
    name: 'GymTree',
    file: 'gymtree.svg',
    width: 813,
    height: 348,
    kind: 'personal',
  },
  {
    id: 'maestro',
    name: 'Maestro',
    file: 'maestro.webp',
    width: 640,
    height: 192,
    kind: 'personal',
  },
] as const

export default function BrandsSection({ locale }: { locale: Locale }) {
  const t = makeT(locale)
  return (
    <section
      id="brands"
      className="brands-scene"
      aria-labelledby="brands-heading"
    >
      <div className="brands-stage">
        <div className="brands-heading">
          <h2 id="brands-heading">{t('home.brands.title')}</h2>
          <p>{t('home.brands.body')}</p>
        </div>
        <div className="brands-window">
          <ul className="brands-track">
            {BRANDS.map((brand) => (
              <li
                className={`brand-item brand-item-${brand.id}`}
                key={brand.id}
              >
                <div className="brand-image">
                  <Image
                    src={`/landing-v2/brands/${brand.file}`}
                    alt={brand.name}
                    width={brand.width}
                    height={brand.height}
                    sizes="(max-width: 799px) 210px, 320px"
                  />
                </div>
                <span>{t(`home.brands.${brand.kind}`)}</span>
              </li>
            ))}
            <li className="brand-item brand-item-docs">
              <div className="brand-image brand-wordmark">
                claude-local-docs
              </div>
              <span>{t('home.brands.personal')}</span>
            </li>
          </ul>
        </div>
        <div className="brands-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  )
}
