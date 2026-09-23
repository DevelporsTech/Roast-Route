/**
 * Image optimization utility that enforces modern WebP format,
 * responsive thumbnail dimensions, and performance compression.
 */

export function toWebp(url: string, targetWidth = 600, quality = 75): string {
  if (!url) return '';

  // Unsplash Image CDN optimization -> Enforce WebP format, fit, quality and width
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('fm', 'webp');
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      if (targetWidth) parsed.searchParams.set('w', targetWidth.toString());
      if (quality) parsed.searchParams.set('q', quality.toString());
      return parsed.toString();
    } catch {
      if (!url.includes('fm=webp')) {
        return `${url}&fm=webp`;
      }
      return url;
    }
  }

  // Local assets: convert jpg/jpeg/png paths to webp
  if (/\.(jpg|jpeg|png)($|\?)/i.test(url)) {
    return url.replace(/\.(jpg|jpeg|png)($|\?)/i, '.webp$2');
  }

  return url;
}
