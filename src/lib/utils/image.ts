export function getFallbackImage(jenis: any): string {
	if (!jenis) return '';
	const name = `${jenis.merk || ''} ${jenis.model || ''} ${jenis.nama || ''}`.toLowerCase();
	if (name.includes('beat')) return '/images/honda-beat.webp';
	if (name.includes('soul')) return '/images/yamaha-soul-gt.webp';
	if (name.includes('pcx')) return '/images/honda-pcx.webp';
	if (name.includes('scoopy')) return '/images/honda-scoopy.webp';
	if (name.includes('vario')) return '/images/honda-vario-125.webp';
	if (name.includes('lexi')) return '/images/yamaha-lexi.webp';
	if (name.includes('nmax')) return '/images/yamaha-nmax.webp';
	if (name.includes('aerox')) return '/images/yamaha-aerox.webp';
	return '';
}

export function getMotorImage(jenis: any): string {
	if (!jenis) return '';
	// If it has a remote/Cloudinary image or a valid local image from /images/
	if (typeof jenis.gambar === 'string' && jenis.gambar.trim()) {
		const img = jenis.gambar.trim();
		if (img.startsWith('http://') || img.startsWith('https://')) {
			// Legacy local-upload URLs (/uploads/...) are no longer served —
			// fall back to the local per-model image instead of requesting a 404.
			if (!img.includes('/uploads/')) {
				return optimizeImageUrl(img);
			}
		} else if (img.startsWith('/images/')) {
			return img;
		}
	}
	return getFallbackImage(jenis);
}

export function optimizeImageUrl(url: string | null | undefined, width?: number): string {
	if (!url) return '';
	if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
		const parts = url.split('/upload/');
		if (parts.length === 2) {
			const transforms = ['f_auto', 'q_auto'];
			if (width) {
				transforms.push(`w_${width}`, 'c_limit');
			}
			let rest = parts[1];
			// Normalize by stripping any existing transformation block before /v\d+/
			rest = rest.replace(/^([^/]+\/)*v(\d+)/, 'v$2');
			return `${parts[0]}/upload/${transforms.join(',')}/${rest}`;
		}
	}
	return url;
}

export function handleImageError(e: Event) {
	const target = e.target as HTMLImageElement;
	if (target) {
		const fallback = target.dataset.fallback;
		if (fallback && !target.src.includes(fallback)) {
			target.src = fallback;
			return;
		}
		target.style.display = 'none';
		if (target.nextElementSibling) {
			(target.nextElementSibling as HTMLElement).style.display = 'flex';
		}
	}
}
