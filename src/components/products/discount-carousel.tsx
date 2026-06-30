'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { Badge } from '@/components/ui'
import { getFirstImage } from '@/lib/images'

type DiscountProduct = {
  id: string
  name: string
  slug: string
  price: number
  discount: number | null
  images: string
  category: { name: string } | null
}

export function DiscountCarousel({ products }: { products: DiscountProduct[] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [slideIn, setSlideIn] = useState(true)

  const changeSlide = (i: number) => {
    setSlideIn(false)
    setTimeout(() => {
      setCurrent(i)
      setSlideIn(true)
    }, 150)
  }

  const next = () => changeSlide((current + 1) % products.length)
  const prev = () => changeSlide((current - 1 + products.length) % products.length)

  const nextRef = useRef(next)
  nextRef.current = next

  useEffect(() => {
    if (paused || products.length <= 1) return
    const id = setInterval(() => nextRef.current(), 4000)
    return () => clearInterval(id)
  }, [paused, products.length])

  if (products.length === 0) return null

  const product = products[current]
  const discountPct = product.discount ?? 0
  const discountPrice = product.price * (1 - discountPct / 100)
  const image = getFirstImage(product.images)

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center gap-2">
        <Zap className="size-5 text-amber-500" />
        <h2 className="text-xl font-bold">Ofertas</h2>
        <span className="text-sm text-muted">Productos con descuento</span>
      </div>

      <div
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Link href={'/productos/' + product.slug} className="block">
          <div className={'flex items-center gap-6 p-6 sm:p-8 lg:p-12 transition-opacity duration-200 ' + (slideIn ? 'opacity-100' : 'opacity-0')}>
            <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-xl sm:w-52 lg:w-64">
              {image ? (
                <Image src={image} alt={product.name} fill sizes="(max-width: 640px) 160px, 256px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted text-xs text-muted">Sin img</div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              {product.category && (
                <p className="mb-1 text-xs text-muted">{product.category.name}</p>
              )}
              <h3 className="text-lg font-bold sm:text-xl lg:text-3xl line-clamp-2">{product.name}</h3>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-danger sm:text-4xl lg:text-5xl">
                  ${discountPrice.toLocaleString('es-AR')}
                </span>
                <span className="text-base text-muted line-through sm:text-lg">
                  ${product.price.toLocaleString('es-AR')}
                </span>
                <span className="inline-flex animate-pulse items-center rounded-full bg-danger px-3 py-1 text-sm font-black text-white shadow-lg sm:text-base">
                  -{discountPct}%
                </span>
              </div>

              <p className="mt-2 text-sm text-muted">Hacé tu pedido online y recibilo en Palermo</p>
            </div>
          </div>
        </Link>

        {products.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); prev() }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); next() }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); changeSlide(i) }}
                  className={'size-2.5 rounded-full transition-all ' + (i === current ? 'w-5 bg-primary' : 'bg-white/60 hover:bg-white/90')}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
