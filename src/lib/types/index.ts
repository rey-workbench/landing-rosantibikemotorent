// API Response types
export interface ApiResponse<T> {
	statusCode?: number;
	success?: boolean;
	message: string;
	data?: T;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

// Jenis Motor types
export interface JenisMotor {
	id: string;
	merk: string;
	model: string;
	cc: number;
	gambar?: string;
	slug: string;
	hargaSewa?: number; // Derived from units
	unitMotor?: { id: string; hargaSewa: number; status: string }[]; // Minimal unit info
	createdAt: string;
	updatedAt: string;
}

// Unit Motor types
export type StatusMotor = 'TERSEDIA' | 'DISEWA' | 'PERBAIKAN' | 'DIPESAN' | 'OVERDUE';

export interface UnitMotor {
	id: string;
	platNomor: string;
	jenisId: string;
	jenis?: JenisMotor;
	jenisMotor?: JenisMotor;
	status: StatusMotor;
	hargaSewa: number;
	tahunPembuatan?: number;
	slug: string;
	createdAt: string;
	updatedAt: string;
}

// Transaksi types
export type StatusTransaksi = 'PENDING' | 'AKTIF' | 'SELESAI' | 'OVERDUE' | 'DIBATALKAN';

export interface Transaksi {
	id: string;
	namaPenyewa: string;
	noWhatsapp: string;
	noKTP?: string;
	unitId: string;
	unitMotor?: UnitMotor;
	tanggalMulai: string;
	tanggalSelesai: string;
	jamMulai: string;
	jamSelesai: string;
	durasiHari: number;
	helm: number;
	jasHujan: number;
	totalBiaya: number;
	status: StatusTransaksi;
	createdAt: string;
	updatedAt: string;
}

// Blog types
export type StatusArtikel = 'DRAFT' | 'TERBIT';

export interface BlogPost {
	id: string;
	judul: string;
	slug: string;
	konten: string;
	thumbnail?: string;
	featuredImage?: string;
	status: StatusArtikel;
	kategoriId?: string;
	kategori?: BlogKategori;
	tags?: BlogTag[];
	metaTitle?: string;
	metaDescription?: string;
	createdAt: string;
	updatedAt: string;
}

export interface BlogKategori {
	id: string;
	nama: string;
	slug: string;
}

export interface BlogTag {
	id: string;
	nama: string;
	slug: string;
}

// Price Calculation types
export interface PriceCalculation {
	totalBiaya: number;
	rincian: {
		jumlahHari: number;
		jamTambahan: number;
		hargaPerHari: number;
		biayaJamTambahan: number;
		totalJam: number;
		dendaPerJam: number;
	};
	unit?: UnitMotor;
}
