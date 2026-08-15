export function getFallbackImage(jenis: any): string {
	const name = (jenis.model || '').toLowerCase();
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
	if (jenis.gambar) return jenis.gambar;
	return getFallbackImage(jenis);
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
