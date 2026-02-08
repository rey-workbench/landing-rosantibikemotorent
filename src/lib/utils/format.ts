export function formatDate(date: string | Date, variant: 'short' | 'long' | 'full' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date;

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

export function stripHtml(html: string, limit: number = 120): string {
    if (!html) return '';
    const stripped = html.replace(/<[^>]*>/g, '');
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
