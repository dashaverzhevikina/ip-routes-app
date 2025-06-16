export interface Route {
    uuid: string;
    address: string;
    mask: string;
    gateway: string;
    interface: string;
}

export type SortField = 'address' | 'gateway' | 'interface';
export type SortOrder = 'asc' | 'desc';