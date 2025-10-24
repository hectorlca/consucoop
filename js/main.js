/**
 * Main Application Logic
 * CONSUCOOP Dashboard MVP
 */

const App = {
    currentView: 'dashboard',
    
    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing CONSUCOOP Dashboard...');
        
        try {
            // Show loading overlay
            this.showLoading();
            
            // Load all data
            await DataLoader.loadAll();
            
            // Populate filter dropdowns
            this.populateFilters();
            
            // Initialize all views
            this.initDashboardView();
            this.initCreditosView();
            this.initDiversidadView();
            this.initGeograficoView();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Hide loading overlay
            this.hideLoading();
            
            console.log('Dashboard initialized successfully!');
        } catch (error) {
            console.error('Error initializing dashboard:', error);
            alert('Error al cargar los datos. Por favor, recargue la página.');
        }
    },
    
    /**
     * Show loading overlay
     */
    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    },
    
    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    },
    
    /**
     * Populate filter dropdowns
     */
    populateFilters() {
        // Populate department filter
        const deptFilter = document.getElementById('filter-dept');
        if (deptFilter && DataLoader.data.departamentos) {
            DataLoader.data.departamentos.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.id;
                option.textContent = dept.nombre;
                deptFilter.appendChild(option);
            });
        }
    },
    
    /**
     * Initialize Dashboard View (Portada Ejecutiva)
     */
    initDashboardView() {
        console.log('Initializing Dashboard View...');
        
        // Update KPIs
        this.updateDashboardKPIs();
        
        // Create charts
        Charts.createAffiliatesGenderChart('chart-afiliados-genero', DataLoader);
        Charts.createGenderEvolutionChart('chart-evolucion-genero');
        Charts.createBoardParticipationChart('chart-participacion-organos', DataLoader);
    },
    
    /**
     * Update Dashboard KPIs
     */
    updateDashboardKPIs() {
        // KPI 1: Active Cooperatives
        const activeCoops = DataLoader.getActiveCooperatives();
        document.getElementById('kpi-cooperativas').textContent = activeCoops;
        document.getElementById('kpi-cooperativas-trend').textContent = '+5.2%';
        
        // KPI 2: Women Affiliates
        const womenPct = DataLoader.getFemaleAffiliatesPercentage();
        document.getElementById('kpi-mujeres-afiliadas').textContent = womenPct + '%';
        document.getElementById('kpi-mujeres-afiliadas-trend').textContent = '+2.1%';
        
        // KPI 3: Women in Boards
        const womenBoardsPct = DataLoader.getWomenInBoardsPercentage();
        document.getElementById('kpi-mujeres-directivas').textContent = womenBoardsPct + '%';
        document.getElementById('kpi-mujeres-directivas-trend').textContent = '+2.3%';
        
        // Check if below parity
        if (parseFloat(womenBoardsPct) < 40) {
            const trendElement = document.getElementById('kpi-mujeres-directivas-trend-container');
            if (trendElement) {
                trendElement.classList.remove('positive');
                trendElement.classList.add('warning');
            }
        }
        
        // KPI 4: Total Loan Portfolio
        const totalLoans = DataLoader.getTotalLoanPortfolio();
        document.getElementById('kpi-cartera').textContent = DataLoader.formatLempiras(totalLoans);
        document.getElementById('kpi-cartera-trend').textContent = '+8.5%';
        
        // KPI 5: Total Savings
        const totalSavings = DataLoader.getTotalSavings();
        document.getElementById('kpi-ahorros').textContent = DataLoader.formatLempiras(totalSavings);
        document.getElementById('kpi-ahorros-trend').textContent = '+6.3%';
        
        // KPI 6: Total Remittances
        const totalRemittances = DataLoader.getTotalRemittances();
        document.getElementById('kpi-remesas').textContent = DataLoader.formatUSD(totalRemittances);
        document.getElementById('kpi-remesas-trend').textContent = '+4.7%';
    },
    
    /**
     * Initialize Creditos View
     */
    initCreditosView() {
        console.log('Initializing Creditos View...');
        
        // Update summary cards
        const stats = DataLoader.getCreditsStats();
        
        document.getElementById('creditos-total').textContent = 
            DataLoader.formatNumber(stats.total);
        
        document.getElementById('creditos-hombres').textContent = 
            DataLoader.formatNumber(stats.hombres.count);
        document.getElementById('creditos-hombres-pct').textContent = 
            ((stats.hombres.count / stats.total) * 100).toFixed(1) + '%';
        
        document.getElementById('creditos-mujeres').textContent = 
            DataLoader.formatNumber(stats.mujeres.count);
        document.getElementById('creditos-mujeres-pct').textContent = 
            ((stats.mujeres.count / stats.total) * 100).toFixed(1) + '%';
        
        document.getElementById('creditos-promedio').textContent = 
            'L ' + ((stats.hombres.sum + stats.mujeres.sum + stats.juridicas.sum) / stats.total / 1000).toFixed(0) + 'K';
        
        // Create charts
        Charts.createCreditsByTypeChart('chart-creditos-tipo', DataLoader);
        Charts.createCreditBalancesChart('chart-creditos-saldo', DataLoader);
        Charts.createCreditsByAgeChart('chart-creditos-edad', DataLoader);
    },
    
    /**
     * Initialize Diversidad View
     */
    initDiversidadView() {
        console.log('Initializing Diversidad View...');
        
        // Update gender balance bars
        const boardData = DataLoader.getBoardParticipation();
        
        // Junta Directiva
        const jdMalePct = (boardData.juntaDirectiva.hombres / boardData.juntaDirectiva.total * 100).toFixed(0);
        const jdFemalePct = (boardData.juntaDirectiva.mujeres / boardData.juntaDirectiva.total * 100).toFixed(0);
        
        const jdMaleBar = document.getElementById('jd-male-bar');
        const jdFemaleBar = document.getElementById('jd-female-bar');
        const jdMalePctEl = document.getElementById('jd-male-pct');
        const jdFemalePctEl = document.getElementById('jd-female-pct');
        
        if (jdMaleBar && jdFemaleBar && jdMalePctEl && jdFemalePctEl) {
            jdMaleBar.style.width = jdMalePct + '%';
            jdMaleBar.querySelector('span').textContent = jdMalePct + '%';
            jdFemaleBar.style.width = jdFemalePct + '%';
            jdFemaleBar.querySelector('span').textContent = jdFemalePct + '%';
            jdMalePctEl.textContent = jdMalePct + '%';
            jdFemalePctEl.textContent = jdFemalePct + '%';
        }
        
        // Create charts
        Charts.createWomenTrendChart('chart-tendencia-mujeres');
        Charts.createPositionsByGenderChart('chart-cargos-genero', DataLoader);
    },
    
    /**
     * Initialize Geografico View
     */
    initGeograficoView() {
        console.log('Initializing Geografico View...');
        
        // Create map placeholder
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            // Create simple SVG map placeholder
            this.createMapPlaceholder(mapContainer);
        }
        
        // Create charts
        Charts.createTopDepartmentsChart('chart-dept-cartera', DataLoader);
        Charts.createAffiliatesByDeptChart('chart-dept-afiliados', DataLoader);
    },
    
    /**
     * Create map placeholder
     */
    createMapPlaceholder(container) {
        // Create a simple SVG representation
        const topDepts = DataLoader.getTopDepartmentsByPortfolio(18);
        
        let html = '<div style="width: 100%; height: 100%; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; padding: 20px; gap: 10px;">';
        
        topDepts.forEach((dept, index) => {
            const size = 60 + (18 - index) * 3; // Size based on ranking
            const color = index < 3 ? '#F44336' : (index < 8 ? '#FFC107' : '#4CAF50');
            
            html += `
                <div style="
                    width: ${size}px; 
                    height: ${size}px; 
                    background: ${color}; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                    font-weight: bold; 
                    font-size: 10px;
                    text-align: center;
                    padding: 5px;
                    cursor: pointer;
                    transition: transform 0.2s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                "
                onmouseover="this.style.transform='scale(1.1)'"
                onmouseout="this.style.transform='scale(1)'"
                title="${dept.nombre}: L ${(dept.total / 1000000).toFixed(2)}M">
                    ${dept.nombre.substring(0, 8)}
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                this.switchView(view);
            });
        });
        
        // Apply filters button
        const applyFiltersBtn = document.querySelector('.btn-apply-filters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        // Export buttons (placeholder)
        const exportButtons = document.querySelectorAll('.btn-icon');
        exportButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                alert('Funcionalidad de exportación disponible en versión completa');
            });
        });
    },
    
    /**
     * Switch between views
     */
    switchView(viewName) {
        console.log('Switching to view:', viewName);
        
        // Hide all views
        const views = document.querySelectorAll('.view');
        views.forEach(view => view.classList.remove('active'));
        
        // Show selected view
        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.add('active');
        }
        
        // Update navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-view') === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        this.currentView = viewName;
    },
    
    /**
     * Apply filters
     */
    applyFilters() {
        const year = document.getElementById('filter-year').value;
        const dept = document.getElementById('filter-dept').value;
        
        console.log('Applying filters:', { year, dept });
        
        // Show loading
        this.showLoading();
        
        // Simulate filter application (in real version, would re-query data)
        setTimeout(() => {
            alert(`Filtros aplicados:\nAño: ${year}\nDepartamento: ${dept === 'todos' ? 'Todos' : dept}\n\nEn la versión completa, los gráficos se actualizarán con los datos filtrados.`);
            this.hideLoading();
        }, 500);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for debugging
if (typeof window !== 'undefined') {
    window.App = App;
    window.DataLoader = DataLoader;
    window.Charts = Charts;
}
