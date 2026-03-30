export type StatusTransaksi = 'PENDING' | 'AKTIF' | 'SELESAI' | 'OVERDUE' | 'DIBATALKAN';

export interface Transaksi {
    id: string;
    namaPenyewa: string;
    noWhatsapp: string;
    noKTP?: string;
    unitId: string;
    unitMotor?: import('./motor').UnitMotor;
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
    unit?: import('./motor').UnitMotor;
}
