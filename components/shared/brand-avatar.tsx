import Image from 'next/image'

export default function BrandAvatar() {
  return (
    <Image
      className="brand-avatar"
      src="/landing-v2/matteo-avatar-v4.webp"
      alt=""
      width={40}
      height={40}
      sizes="40px"
    />
  )
}
