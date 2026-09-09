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
  {
    id: 'docs',
    name: 'claude-local-docs',
    file: null,
    width: 0,
    height: 0,
    kind: 'personal',
  },
] as const

const BRAND_ROWS = [BRANDS.slice(0, 4), BRANDS.slice(4, 7), BRANDS.slice(7)]

function BrandMark({
  brand,
  relationship,
}: {
  brand: (typeof BRANDS)[number]
  relationship: string
}) {
  return (
    <>
      <div className="brand-image">
        {brand.file ? (
          <Image
            src={`/landing-v2/brands/${brand.file}`}
            alt={brand.name}
            width={brand.width}
            height={brand.height}
            sizes="(max-width: 799px) 140px, 176px"
          />
        ) : (
          <span className="brand-wordmark">{brand.name}</span>
        )}
      </div>
      <span>{relationship}</span>
    </>
  )
}

export default function BrandsSection({ locale }: { locale: Locale }) {
  const t = makeT(locale)
  return (
    <section
      id="brands"
      className="brands-scene"
      aria-labelledby="brands-heading"
    >
      <div className="brands-heading">
        <h2 id="brands-heading">{t('home.brands.title')}</h2>
        <p>{t('home.brands.body')}</p>
      </div>
      <div className="brands-wall" aria-hidden="true">
        {BRAND_ROWS.map((row) => (
          <div className="brands-row" key={row[0]?.id}>
            <div className="brands-track">
              {[0, 1].map((copy) => (
                <div className="brands-run" key={copy}>
                  {[0, 1].map((repeat) =>
                    row.map((brand) => (
                      <div
                        className={`brand-item brand-item-${brand.id}`}
                        key={`${repeat}-${brand.id}`}
                      >
                        <BrandMark
                          brand={brand}
                          relationship={t(`home.brands.${brand.kind}`)}
                        />
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ul className="brands-static">
        {BRANDS.map((brand) => (
          <li className={`brand-item brand-item-${brand.id}`} key={brand.id}>
            <BrandMark
              brand={brand}
              relationship={t(`home.brands.${brand.kind}`)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
