import api from './axios';
import type { JenisMotor, PaginationMeta, UnitMotor } from '$lib/types';

export interface ProcessedJenisMotor extends JenisMotor {
    computed: {
        minPrice: number;
        hasAvailable: boolean;
        availableCount: number;
    };
}

function processJenis(jenis: any): ProcessedJenisMotor {
    const units = (jenis.unitMotor || []) as UnitMotor[];
    const availableUnits = units.filter((u) => u.status === 'TERSEDIA');
    const hasAvailable = availableUnits.length > 0;
    const availableCount = availableUnits.length;

    let minPrice = 0;
    if (units.length > 0) {
        if (hasAvailable) {
            minPrice = Math.min(...availableUnits.map((u) => u.hargaSewa));
        } else {
            minPrice = Math.min(...units.map((u) => u.hargaSewa));
        }
    }

    return {
        ...jenis,
        computed: {
            minPrice,
            hasAvailable,
            availableCount
        }
    };
}

export const jenisMotorApi = {
    getAll: async (filter?: {
        page?: number;
        limit?: number;
        search?: string;
        merk?: string;
    }): Promise<{ data: ProcessedJenisMotor[]; meta: PaginationMeta }> => {
        const { data: body } = await api.get('/jenis-motor', { params: filter });
        return {
            data: (body.data || []).map(processJenis),
            meta: body.meta
        };
    },
    getById: async (id: string): Promise<ProcessedJenisMotor> => {
        const { data: body } = await api.get(`/jenis-motor/${id}`);
        return processJenis(body.data);
    },
    getBySlug: async (slug: string): Promise<ProcessedJenisMotor> => {
        const { data: body } = await api.get(`/jenis-motor/slug/${slug}`);
        return processJenis(body.data);
    },
    getBrands: async (): Promise<{ id: string; merk: string }[]> => {
        const { data: body } = await api.get('/jenis-motor', { params: { limit: 1000 } });
        const brands = new Map<string, string>();
        for (const jenis of (body.data || [])) {
            if (jenis.merk && !brands.has(jenis.merk)) {
                brands.set(jenis.merk, jenis.id);
            }
        }
        return Array.from(brands.entries()).map(([merk, id]) => ({ id, merk }));
    }
};
