import type { Metadata } from 'next'

interface MetadataOptions {
  title: string
  description: string
  path?: string
  image?: string
}

export function createMetadata({ title, description, path = '', image }: MetadataOptions): Metadata {
  const url = `https://kivvi.tech${path}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },
    twitter: {
      title,
      description,
      ...(image && { images: [image] }),
    },
    alternates: {
      canonical: url,
    },
  }
}
