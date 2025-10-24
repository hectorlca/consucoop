/**
 * Data Loader Module
 * Loads and processes CSV data for CONSUCOOP Dashboard
 */

const DataLoader = {
    data: {
        departamentos: [],
        municipios: [],
        cooperativas: [],
        creditos: [],
        depositos: [],
        remesas: [],
        afiliados: [],
        directivos: [],
        empleados: [],
        funcionarios: [],
        tiposCredito: [],
        tiposDeposito: []
    },
    
    loaded: false,
    
    /**
     * Load all required CSV files
     */
    async loadAll() {
        try {
            console.log('Starting to load data...');
            
            // Load catalogs
            this.data.departamentos = await this.loadCSV('../datos/catalogos/departamentos.csv');
            this.data.municipios = await this.loadCSV('../datos/catalogos/municipios.csv');
            this.data.cooperativas = await this.loadCSV('../datos/catalogos/cooperativas.csv');
            this.data.tiposCredito = await this.loadCSV('../datos/catalogos/tipos_credito.csv');
            this.data.tiposDeposito = await this.loadCSV('../datos/catalogos/tipos_deposito.csv');
            
            // Load transactional data
            this.data.creditos = await this.loadCSV('../datos/datos/creditos.csv');
            this.data.depositos = await this.loadCSV('../datos/datos/depositos.csv');
            this.data.remesas = await this.loadCSV('../datos/datos/remesas.csv');
            
            // Load organizational data
            this.data.afiliados = await this.loadCSV('../datos/datos/afiliados.csv');
            this.data.directivos = await this.loadCSV('../datos/datos/directivos.csv');
            this.data.empleados = await this.loadCSV('../datos/datos/empleados.csv');
            this.data.funcionarios = await this.loadCSV('../datos/datos/funcionarios.csv');
            
            this.loaded = true;
            console.log('All data loaded successfully!', this.data);
            
            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    },
    
    /**
     * Load a single CSV file
     */
    loadCSV(filepath) {
        return new Promise((resolve, reject) => {
            Papa.parse(filepath, {
                download: true,
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.warn(`Warnings in ${filepath}:`, results.errors);
                    }
                    resolve(results.data);
                },
                error: (error) => {
                    console.error(`Error loading ${filepath}:`, error);
                    reject(error);
                }
            });
        });
    },
    
    /**
     * Get active cooperatives count
     */
    getActiveCooperatives() {
        return this.data.cooperativas.filter(c => c.estado === 'ACTIVA').length;
    },
    
    /**
     * Get total active affiliates
     */
    getActiveAffiliates() {
        return this.data.afiliados.filter(a => a.estado === 'ACTIVO').length;
    },
    
    /**
     * Get percentage of female affiliates
     */
    getFemaleAffiliatesPercentage() {
        const activeAffiliates = this.data.afiliados.filter(a => a.estado === 'ACTIVO');
        const females = activeAffiliates.filter(a => a.genero === 'M').length;
        return ((females / activeAffiliates.length) * 100).toFixed(1);
    },
    
    /**
     * Get percentage of women in boards
     */
    getWomenInBoardsPercentage() {
        const activeDirectivos = this.data.directivos;
        const females = activeDirectivos.filter(d => d.genero === 'M').length;
        return ((females / activeDirectivos.length) * 100).toFixed(1);
    },
    
    /**
     * Get total loan portfolio
     */
    getTotalLoanPortfolio() {
        return this.data.creditos.reduce((sum, c) => sum + (c.saldo_actual || 0), 0);
    },
    
    /**
     * Get total savings volume
     */
    getTotalSavings() {
        return this.data.depositos.reduce((sum, d) => sum + (d.saldo || 0), 0);
    },
    
    /**
     * Get total remittances
     */
    getTotalRemittances() {
        return this.data.remesas.reduce((sum, r) => sum + (r.monto_usd || 0), 0);
    },
    
    /**
     * Get affiliates by gender
     */
    getAffiliatesByGender() {
        const activeAffiliates = this.data.afiliados.filter(a => a.estado === 'ACTIVO');
        
        return {
            hombres: activeAffiliates.filter(a => a.genero === 'H').length,
            mujeres: activeAffiliates.filter(a => a.genero === 'M').length,
            juridicas: activeAffiliates.filter(a => a.genero === 'J').length
        };
    },
    
    /**
     * Get credits by type and gender
     */
    getCreditsByTypeAndGender() {
        const result = {};
        
        this.data.tiposCredito.forEach(tipo => {
            const creditosDelTipo = this.data.creditos.filter(c => c.tipo_credito_id === tipo.id);
            
            result[tipo.nombre] = {
                hombres: creditosDelTipo.filter(c => c.genero === 'H').length,
                mujeres: creditosDelTipo.filter(c => c.genero === 'M').length,
                juridicas: creditosDelTipo.filter(c => c.genero === 'J').length
            };
        });
        
        return result;
    },
    
    /**
     * Get credit balances by gender
     */
    getCreditBalancesByGender() {
        return {
            hombres: this.data.creditos
                .filter(c => c.genero === 'H')
                .reduce((sum, c) => sum + (c.saldo_actual || 0), 0),
            mujeres: this.data.creditos
                .filter(c => c.genero === 'M')
                .reduce((sum, c) => sum + (c.saldo_actual || 0), 0),
            juridicas: this.data.creditos
                .filter(c => c.genero === 'J')
                .reduce((sum, c) => sum + (c.saldo_actual || 0), 0)
        };
    },
    
    /**
     * Get board participation by gender
     */
    getBoardParticipation() {
        const juntaDirectiva = this.data.directivos.filter(d => 
            d.tipo_organo === 'Junta Directiva'
        );
        const juntaVigilancia = this.data.directivos.filter(d => 
            d.tipo_organo === 'Junta de Vigilancia'
        );
        
        return {
            juntaDirectiva: {
                hombres: juntaDirectiva.filter(d => d.genero === 'H').length,
                mujeres: juntaDirectiva.filter(d => d.genero === 'M').length,
                total: juntaDirectiva.length
            },
            juntaVigilancia: {
                hombres: juntaVigilancia.filter(d => d.genero === 'H').length,
                mujeres: juntaVigilancia.filter(d => d.genero === 'M').length,
                total: juntaVigilancia.length
            },
            empleados: {
                hombres: this.data.empleados.filter(e => e.genero === 'H' && e.estado === 'ACTIVO').length,
                mujeres: this.data.empleados.filter(e => e.genero === 'M' && e.estado === 'ACTIVO').length,
                total: this.data.empleados.filter(e => e.estado === 'ACTIVO').length
            },
            funcionarios: {
                hombres: this.data.funcionarios.filter(f => f.genero === 'H').length,
                mujeres: this.data.funcionarios.filter(f => f.genero === 'M').length,
                total: this.data.funcionarios.length
            }
        };
    },
    
    /**
     * Get top departments by loan portfolio
     */
    getTopDepartmentsByPortfolio(limit = 10) {
        const deptPortfolio = {};
        
        this.data.creditos.forEach(credito => {
            const deptId = credito.departamento_id;
            if (!deptPortfolio[deptId]) {
                deptPortfolio[deptId] = 0;
            }
            deptPortfolio[deptId] += (credito.saldo_actual || 0);
        });
        
        // Convert to array and sort
        const sorted = Object.entries(deptPortfolio)
            .map(([id, total]) => {
                const dept = this.data.departamentos.find(d => d.id === parseInt(id));
                return {
                    id: parseInt(id),
                    nombre: dept ? dept.nombre : `Dept ${id}`,
                    total: total
                };
            })
            .sort((a, b) => b.total - a.total)
            .slice(0, limit);
        
        return sorted;
    },
    
    /**
     * Get affiliates by department
     */
    getAffiliatesByDepartment() {
        const deptAffiliates = {};
        
        this.data.afiliados.filter(a => a.estado === 'ACTIVO').forEach(afiliado => {
            const deptId = afiliado.departamento_id;
            if (!deptAffiliates[deptId]) {
                deptAffiliates[deptId] = {
                    hombres: 0,
                    mujeres: 0,
                    juridicas: 0,
                    total: 0
                };
            }
            
            deptAffiliates[deptId].total++;
            if (afiliado.genero === 'H') deptAffiliates[deptId].hombres++;
            else if (afiliado.genero === 'M') deptAffiliates[deptId].mujeres++;
            else if (afiliado.genero === 'J') deptAffiliates[deptId].juridicas++;
        });
        
        // Convert to array with department names
        return Object.entries(deptAffiliates).map(([id, counts]) => {
            const dept = this.data.departamentos.find(d => d.id === parseInt(id));
            return {
                id: parseInt(id),
                nombre: dept ? dept.nombre : `Dept ${id}`,
                ...counts
            };
        }).sort((a, b) => b.total - a.total);
    },
    
    /**
     * Get credits statistics by gender
     */
    getCreditsStats() {
        const stats = {
            total: this.data.creditos.length,
            hombres: {
                count: this.data.creditos.filter(c => c.genero === 'H').length,
                sum: this.data.creditos.filter(c => c.genero === 'H')
                    .reduce((sum, c) => sum + (c.saldo_actual || 0), 0)
            },
            mujeres: {
                count: this.data.creditos.filter(c => c.genero === 'M').length,
                sum: this.data.creditos.filter(c => c.genero === 'M')
                    .reduce((sum, c) => sum + (c.saldo_actual || 0), 0)
            },
            juridicas: {
                count: this.data.creditos.filter(c => c.genero === 'J').length,
                sum: this.data.creditos.filter(c => c.genero === 'J')
                    .reduce((sum, c) => sum + (c.saldo_actual || 0), 0)
            }
        };
        
        // Calculate averages
        stats.hombres.avg = stats.hombres.count > 0 ? stats.hombres.sum / stats.hombres.count : 0;
        stats.mujeres.avg = stats.mujeres.count > 0 ? stats.mujeres.sum / stats.mujeres.count : 0;
        stats.juridicas.avg = stats.juridicas.count > 0 ? stats.juridicas.sum / stats.juridicas.count : 0;
        
        return stats;
    },
    
    /**
     * Get credits by age group and gender
     */
    getCreditsByAgeAndGender() {
        const ageGroups = [
            { label: '18-25', min: 18, max: 25 },
            { label: '26-35', min: 26, max: 35 },
            { label: '36-45', min: 36, max: 45 },
            { label: '46-55', min: 46, max: 55 },
            { label: '56-65', min: 56, max: 65 },
            { label: '65+', min: 66, max: 150 }
        ];
        
        return ageGroups.map(group => {
            const creditsInGroup = this.data.creditos.filter(c => 
                c.edad >= group.min && c.edad <= group.max
            );
            
            return {
                label: group.label,
                hombres: creditsInGroup.filter(c => c.genero === 'H')
                    .reduce((sum, c) => sum + (c.monto || 0), 0) / 1000000, // In millions
                mujeres: creditsInGroup.filter(c => c.genero === 'M')
                    .reduce((sum, c) => sum + (c.monto || 0), 0) / 1000000
            };
        });
    },
    
    /**
     * Format number as currency (Lempiras)
     */
    formatLempiras(value) {
        return 'L ' + (value / 1000000).toFixed(2) + 'M';
    },
    
    /**
     * Format number as USD
     */
    formatUSD(value) {
        return '$ ' + (value / 1000000).toFixed(2) + 'M';
    },
    
    /**
     * Format number with thousand separators
     */
    formatNumber(value) {
        return value.toLocaleString('es-HN');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}
