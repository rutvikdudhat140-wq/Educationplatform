import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Google's favicon proxy redirects to gstatic, which answers 404 for any domain
 * it has no icon cached for. Colleges store that URL as a last-ditch image, so
 * it must never win over a real photo and it must never be the final answer.
 */
const FAVICON_PROXY = /google\.com\/s2\/favicons|gstatic\.com\/faviconV2/i;

const normalize = (sources) =>
  [
    ...new Set(
      sources
        .map((src) => {
          if (typeof src !== 'string') return '';
          let s = src.trim();
          // Remove rogue port numbers appended to base64 strings by mistake
          if (s.startsWith('data:image/') && s.match(/:\d+$/)) {
            s = s.replace(/:\d+$/, '');
          }
          if (s.startsWith(':5001/')) {
            s = 'http://localhost' + s;
          }
          return s;
        })
        .filter((src) => src.length > 0 && !FAVICON_PROXY.test(src) && !(src.startsWith('data:image/') && src.indexOf(',') === -1))
    ),
  ];

const entitySources = (entity) => {
  if (!entity) return [];

  return normalize([
    entity.coverImageUrl,
    entity.coverImage,
    ...(Array.isArray(entity.images) ? entity.images : []),
    entity.logoUrl,
    entity.logo,
  ]);
};

/**
 * Renders the first candidate image that actually loads, skipping to the next one
 * on every error and settling on `fallback` once they are exhausted. Without
 * this a dead URL leaves a broken-image icon plus a console 404.
 *
 * Failures are tracked per-URL rather than per-index, so the walk never needs to
 * be reset when the caller swaps in a different record.
 */
function SafeImage({
  entity,
  sources,
  src: rawSrc,
  alt = '',
  className,
  fallback = null,
  fallbackClassName,
  ...props
}) {
  const candidates = useMemo(
    () => (sources ? normalize(sources) : rawSrc ? normalize(Array.isArray(rawSrc) ? rawSrc : [rawSrc]) : entitySources(entity)),
    [entity, sources, rawSrc]
  );

  const [failed, setFailed] = useState(() => new Set());

  const src = candidates.find((candidate) => !failed.has(candidate));

  const handleError = () => {
    if (src) {
      setFailed((previous) => new Set(previous).add(src));
    }
  };

  if (!src) {
    if (!fallback) return null;

    return (
      <div
        data-slot="safe-image-fallback"
        className={cn('flex items-center justify-center', fallbackClassName)}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      data-slot="safe-image"
      src={src}
      alt={alt}
      className={cn('block object-cover w-full h-full', className)}
      onError={handleError}
      {...props}
    />
  );
}

export { SafeImage };
export default SafeImage;
