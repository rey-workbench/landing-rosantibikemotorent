import { writable, get } from 'svelte/store';

// Global image cache to prevent duplicate loading
export const imageCache = writable<Map<string, HTMLImageElement>>(new Map());

// Track loading state per source
export const loadingState = writable<Record<string, { loaded: number; total: number }>>({});

/**
 * Get or load an image from the cache
 */
export function getCachedImage(src: string): HTMLImageElement | null {
    const cache = get(imageCache);
    return cache.get(src) || null;
}

/**
 * Add an image to the cache
 */
export function setCachedImage(src: string, img: HTMLImageElement): void {
    imageCache.update((cache) => {
        cache.set(src, img);
        return cache;
    });
}

/**
 * Preload a batch of images with caching
 * Returns a promise that resolves when all images are loaded
 */
export async function preloadImages(
    sources: { src: string }[],
    onProgress?: (loaded: number, total: number) => void
): Promise<HTMLImageElement[]> {
    const cache = get(imageCache);
    const results: HTMLImageElement[] = [];
    let loaded = 0;

    const loadPromises = sources.map(({ src }) => {
        return new Promise<HTMLImageElement>((resolve) => {
            // Check cache first
            const cached = cache.get(src);
            if (cached && cached.complete) {
                loaded++;
                onProgress?.(loaded, sources.length);
                resolve(cached);
                return;
            }

            // Load new image
            const img = new Image();
            img.src = src;

            img.onload = () => {
                setCachedImage(src, img);
                loaded++;
                onProgress?.(loaded, sources.length);
                resolve(img);
            };

            img.onerror = () => {
                console.warn(`Failed to load: ${src}`);
                loaded++;
                onProgress?.(loaded, sources.length);
                resolve(img); // Resolve anyway to not block
            };
        });
    });

    const loadedImages = await Promise.all(loadPromises);
    return loadedImages;
}

/**
 * Check if images for a source are already cached
 */
export function areImagesCached(sources: string[]): boolean {
    const cache = get(imageCache);
    return sources.every((src) => cache.has(src) && cache.get(src)?.complete);
}
