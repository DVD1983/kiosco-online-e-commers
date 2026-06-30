export function getImages(images: string): string[] {
  if (!images) return []
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed : [images]
  } catch {
    return [images]
  }
}

export function getFirstImage(images: string): string {
  const arr = getImages(images)
  return arr[0] || ""
}

export function encodeImages(images: string[]): string {
  return JSON.stringify(images)
}
