import { Route, SortField } from './interfaces.js';

export function compareIPs(ip1: string, ip2: string): number {
    const parts1 = ip1.split('.').map(Number);
    const parts2 = ip2.split('.').map(Number);
    
    for (let i = 0; i < 4; i++) {
        if (parts1[i] !== parts2[i]) {
            return parts1[i] - parts2[i];
        }
    }
    return 0;
}

export function sortRoutes(routes: Route[], field: SortField, order: 'asc' | 'desc'): Route[] {
    const sorted = [...routes];
    
    sorted.sort((a, b) => {
        let comparison = 0;
        
        if (field === 'address' || field === 'gateway') {
            comparison = compareIPs(a[field], b[field]);
        } else {
            comparison = a[field].localeCompare(b[field]);
        }
        
        return order === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
}

export async function fetchRoutes(): Promise<Route[]> {
    try {
        const response = await fetch('http://localhost:5008/api/routes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data); // Для отладки
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format received');
        }
        
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}