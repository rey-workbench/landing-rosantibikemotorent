export function formatDate(
	date: string | Date | null | undefined,
	variant: 'short' | 'long' | 'full' = 'short'
): string {
	if (!date) return '-';

	let d: Date;
	try {
		d = typeof date === 'string' ? new Date(date) : (date as Date);
		if (isNaN(d.getTime())) {
			return '-';
		}
	} catch (e) {
		return '-';
	}

	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};

	if (variant === 'full') {
		options.weekday = 'long';
	}

	return d.toLocaleDateString('id-ID', options);
}

export function stripHtml(content: string, limit: number = 140): string {
	if (!content) return '';
	// Strip HTML tags and markdown formatting symbols
	const stripped = content
		.replace(/<[^>]*>/g, '')
		.replace(/[#*`_~>|\[\]\(\)]/g, '')
		.replace(/:\s*---\s*\|/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	if (stripped.length <= limit) return stripped;
	return stripped.substring(0, limit).trim() + '...';
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0
	}).format(amount);
}
