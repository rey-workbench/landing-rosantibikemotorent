
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

