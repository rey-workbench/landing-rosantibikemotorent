export function getMotorImage(jenis: any): string {
	if (!jenis || typeof jenis.gambar !== 'string' || !jenis.gambar.trim()) return '';
	return optimizeImageUrl(jenis.gambar.trim());
}

export function optimizeImageUrl(url: string | null | undefined, width?: number): string {
	if (!url) return '';
	if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
		const parts = url.split('/upload/');
		if (parts.length === 2) {
			const transforms = ['f_auto', 'q_auto:good'];
			if (width) {
				transforms.push(`w_${width}`, 'c_limit');
			}
			let rest = parts[1];
			// Normalize by stripping any existing transformation block before /v\d+/
			rest = rest.replace(/^([^/]+\/)*v(\d+)/, 'v$2');
			return `/cdn/${transforms.join(',')}/${rest}`;
		}
	}
	return url;
}

export function handleImageError(e: Event) {
	const target = e.target as HTMLImageElement;
	if (target) {
		target.style.display = 'none';
		if (target.nextElementSibling) {
			(target.nextElementSibling as HTMLElement).style.display = 'flex';
		}
	}
}
