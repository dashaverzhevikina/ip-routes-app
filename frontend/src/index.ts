import { Route, SortField, SortOrder } from './interfaces.js';
import { fetchRoutes, sortRoutes } from './utils.js';

class RouteTable {
    private routes: Route[] = [];
    private currentSortField: SortField = 'address';
    private currentSortOrder: SortOrder = 'asc';
    private tableBody: HTMLTableSectionElement;
    private sortButtons: Record<SortField, HTMLButtonElement>;
    private loadingIndicator: HTMLDivElement;

    constructor() {
        this.tableBody = document.querySelector('#routes-table tbody') as HTMLTableSectionElement;
        this.sortButtons = {
            address: document.querySelector('#sort-address') as HTMLButtonElement,
            gateway: document.querySelector('#sort-gateway') as HTMLButtonElement,
            interface: document.querySelector('#sort-interface') as HTMLButtonElement
        };
        this.loadingIndicator = document.querySelector('#loading-indicator') as HTMLDivElement;

        this.initSortButtons();
        this.initLoadingIndicator();
        this.loadRoutes();
    }

    private initLoadingIndicator(): void {
        this.loadingIndicator.textContent = 'Загрузка данных...';
        this.loadingIndicator.style.display = 'block';
    }

    private hideLoadingIndicator(): void {
        this.loadingIndicator.style.display = 'none';
    }

    private initSortButtons(): void {
        Object.entries(this.sortButtons).forEach(([field, button]) => {
            button.addEventListener('click', () => {
                const sortField = field as SortField;
                if (this.currentSortField === sortField) {
                    this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    this.currentSortField = sortField;
                    this.currentSortOrder = 'asc';
                }
                this.updateSortIndicators();
                this.renderRoutes();
            });
        });
    }

    private updateSortIndicators(): void {
        Object.values(this.sortButtons).forEach(button => {
            button.querySelector('.sort-indicator')?.remove();
        });

        const currentButton = this.sortButtons[this.currentSortField];
        const indicator = document.createElement('span');
        indicator.className = 'sort-indicator';
        indicator.textContent = this.currentSortOrder === 'asc' ? ' ↑' : ' ↓';
        currentButton.appendChild(indicator);
    }

    private async loadRoutes(): Promise<void> {
        try {
            console.log("Starting data loading...");
            const startTime = Date.now();
            
            this.routes = await fetchRoutes();
            console.log(`Data loaded in ${Date.now() - startTime}ms`, this.routes);
            
            if (this.routes.length === 0) {
                throw new Error("Received empty routes array");
            }
            
            this.renderRoutes();
        } catch (error) {
            console.error('Error loading routes:', error);
            this.loadingIndicator.textContent = 'Ошибка загрузки данных';
            this.loadingIndicator.style.color = 'red';
        } finally {
            this.hideLoadingIndicator();
        }
    }

    private renderRoutes(): void {
        const sortedRoutes = sortRoutes(this.routes, this.currentSortField, this.currentSortOrder);

        this.tableBody.innerHTML = '';

        sortedRoutes.forEach(route => {
            const row = document.createElement('tr');
            
            const addressCell = document.createElement('td');
            addressCell.textContent = `${route.address}/${route.mask}`;
            row.appendChild(addressCell);
            
            const gatewayCell = document.createElement('td');
            gatewayCell.textContent = route.gateway;
            row.appendChild(gatewayCell);
            
            const interfaceCell = document.createElement('td');
            interfaceCell.textContent = route.interface;
            row.appendChild(interfaceCell);
            
            this.tableBody.appendChild(row);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RouteTable();
});