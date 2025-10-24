/**
 * Charts Module
 * Creates and manages all charts for CONSUCOOP Dashboard
 */

const Charts = {
    instances: {},
    
    colors: {
        primary: '#FF6B35',
        primaryLight: '#FF8C61',
        female: '#E91E63',
        male: '#2196F3',
        juridica: '#9C27B0',
        success: '#4CAF50',
        warning: '#FFC107',
        info: '#2196F3',
        gray: {
            100: '#F5F5F5',
            200: '#E0E0E0',
            300: '#CCCCCC',
            600: '#4A4A4A'
        }
    },
    
    defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    font: {
                        family: 'Inter, sans-serif',
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    family: 'Inter, sans-serif',
                    size: 13,
                    weight: 600
                },
                bodyFont: {
                    family: 'Inter, sans-serif',
                    size: 12
                },
                cornerRadius: 6
            }
        }
    },
    
    /**
     * Destroy a chart instance
     */
    destroy(chartId) {
        if (this.instances[chartId]) {
            this.instances[chartId].destroy();
            delete this.instances[chartId];
        }
    },
    
    /**
     * Create Affiliates by Gender (Doughnut Chart)
     */
    createAffiliatesGenderChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        this.destroy(canvasId);
        
        const genderData = data.getAffiliatesByGender();
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Hombres', 'Mujeres', 'Personas Jurídicas'],
                datasets: [{
                    data: [genderData.hombres, genderData.mujeres, genderData.juridicas],
                    backgroundColor: [this.colors.male, this.colors.female, this.colors.juridica],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    legend: {
                        ...this.defaultOptions.plugins.legend,
                        position: 'right'
                    },
                    tooltip: {
                        ...this.defaultOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Create Gender Evolution (Line Chart)
     */
    createGenderEvolutionChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        this.destroy(canvasId);
        
        // Mock historical data
        const years = ['2020', '2021', '2022', '2023', '2024'];
        const femaleParticipation = [42.5, 44.2, 45.8, 46.9, 47.8];
        const femaleBoards = [28.5, 30.2, 32.8, 35.1, 37.4];
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Mujeres Afiliadas (%)',
                        data: femaleParticipation,
                        borderColor: this.colors.female,
                        backgroundColor: this.colors.female + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Mujeres en Directivas (%)',
                        data: femaleBoards,
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primary + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }
                ]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: this.colors.gray[200]
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Create Board Participation Chart (Horizontal Bar)
     */
    createBoardParticipationChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        this.destroy(canvasId);
        
        const boardData = data.getBoardParticipation();
        
        const labels = ['Junta Directiva', 'Junta Vigilancia', 'Empleados', 'Funcionarios'];
        const mujeres = [
            (boardData.juntaDirectiva.mujeres / boardData.juntaDirectiva.total * 100).toFixed(1),
            (boardData.juntaVigilancia.mujeres / boardData.juntaVigilancia.total * 100).toFixed(1),
            (boardData.empleados.mujeres / boardData.empleados.total * 100).toFixed(1),
            (boardData.funcionarios.mujeres / boardData.funcionarios.total * 100).toFixed(1)
        ];
        const hombres = [
            (boardData.juntaDirectiva.hombres / boardData.juntaDirectiva.total * 100).toFixed(1),
            (boardData.juntaVigilancia.hombres / boardData.juntaVigilancia.total * 100).toFixed(1),
            (boardData.empleados.hombres / boardData.empleados.total * 100).toFixed(1),
            (boardData.funcionarios.hombres / boardData.funcionarios.total * 100).toFixed(1)
        ];
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Mujeres',
                        data: mujeres,
                        backgroundColor: this.colors.female,
                        borderRadius: 6
                    },
                    {
                        label: 'Hombres',
                        data: hombres,
                        backgroundColor: this.colors.male,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                ...this.defaultOptions,
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    y: {
                        stacked: true
                    }
                },
                plugins: {
                    ...this.defaultOptions.plugins,
                    tooltip: {
                        ...this.defaultOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.x + '%';
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Create Credits by Type Chart (Stacked Bar)
     */
    createCreditsByTypeChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        this.destroy(canvasId);
        
        const creditsByType = data.getCreditsByTypeAndGender();
        const labels = Object.keys(creditsByType);
        
        const hombres = labels.map(tipo => creditsByType[tipo].hombres);
        const mujeres = labels.map(tipo => creditsByType[tipo].mujeres);
        const juridicas = labels.map(tipo => creditsByType[tipo].juridicas);
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Hombres',
                        data: hombres,
                        backgroundColor: this.colors.male,
                        borderRadius: 6
                    },
                    {
                        label: 'Mujeres',
                        data: mujeres,
                        backgroundColor: this.colors.female,
                        borderRadius: 6
                    },
                    {
                        label: 'Personas Jurídicas',
                        data: juridicas,
                        backgroundColor: this.colors.juridica,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true,
                        grid: {
                            color: this.colors.gray[200]
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Create Credit Balances Chart (Bar)
     */
    createCreditBalancesChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        this.destroy(canvasId);
        
        const balances = data.getCreditBalancesByGender();
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Hombres', 'Mujeres', 'Personas Jurídicas'],
                datasets: [{
                    label: 'Saldo Total (Millones L)',
                    data: [
                        balances.hombres / 1000000,
                        balances.mujeres / 1000000,
                        balances.juridicas / 1000000
                    ],
                    backgroundColor: [this.colors.male, this.colors.female, this.colors.juridica],
                    borderRadius: 8
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    legend: {
                        display: false
                    },
                    tooltip: {
                        ...this.defaultOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return 'L ' + context.parsed.y.toFixed(2) + 'M';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'L ' + value + 'M';
                            }
                        },
                        grid: {
                            color: this.colors.gray[200]
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Create Credits by Age Chart (Line)
     */
    createCreditsByAgeChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        this.destroy(canvasId);
        
        const ageData = data.getCreditsByAgeAndGender();
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ageData.map(d => d.label),
                datasets: [
                    {
                        label: 'Hombres (Millones L)',
                        data: ageData.map(d => d.hombres),
                        borderColor: this.colors.male,
                        backgroundColor: this.colors.male + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Mujeres (Millones L)',
                        data: ageData.map(d => d.mujeres),
                        borderColor: this.colors.female,
                        backgroundColor: this.colors.female + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'L ' + value + 'M';
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Create Top Departments Chart (Horizontal Bar)
     */
    createTopDepartmentsChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        this.destroy(canvasId);
        
        const topDepts = data.getTopDepartmentsByPortfolio(10);
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topDepts.map(d => d.nombre),
                datasets: [{
                    label: 'Cartera Total (Millones L)',
                    data: topDepts.map(d => d.total / 1000000),
                    backgroundColor: this.colors.primary,
                    borderRadius: 6
                }]
            },
            options: {
                ...this.defaultOptions,
                indexAxis: 'y',
                plugins: {
                    ...this.defaultOptions.plugins,
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            callback: function(value) {
                                return 'L ' + value + 'M';
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Create Affiliates by Department Chart (Bar)
     */
    createAffiliatesByDeptChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        this.destroy(canvasId);
        
        const deptData = data.getAffiliatesByDepartment().slice(0, 10);
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: deptData.map(d => d.nombre),
                datasets: [
                    {
                        label: 'Hombres',
                        data: deptData.map(d => d.hombres),
                        backgroundColor: this.colors.male,
                        borderRadius: 6
                    },
                    {
                        label: 'Mujeres',
                        data: deptData.map(d => d.mujeres),
                        backgroundColor: this.colors.female,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                ...this.defaultOptions,
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });
    },
    
    /**
     * Create Women Trend Chart (Line)
     */
    createWomenTrendChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        this.destroy(canvasId);
        
        // Mock trend data
        const years = ['2020', '2021', '2022', '2023', '2024'];
        const jd = [28.5, 30.2, 32.8, 35.1, 37.4];
        const jv = [32.1, 34.5, 36.8, 38.5, 40.0];
        const emp = [38.5, 40.2, 42.1, 43.8, 45.0];
        const func = [25.5, 27.2, 29.1, 30.5, 32.0];
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Junta Directiva',
                        data: jd,
                        borderColor: this.colors.primary,
                        tension: 0.4,
                        borderWidth: 3
                    },
                    {
                        label: 'Junta Vigilancia',
                        data: jv,
                        borderColor: this.colors.info,
                        tension: 0.4,
                        borderWidth: 3
                    },
                    {
                        label: 'Empleados',
                        data: emp,
                        borderColor: this.colors.success,
                        tension: 0.4,
                        borderWidth: 3
                    },
                    {
                        label: 'Funcionarios',
                        data: func,
                        borderColor: this.colors.warning,
                        tension: 0.4,
                        borderWidth: 3
                    }
                ]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Create Positions by Gender Chart (Doughnut)
     */
    createPositionsByGenderChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        this.destroy(canvasId);
        
        const boardData = data.getBoardParticipation();
        const totalMujeres = boardData.juntaDirectiva.mujeres + 
                            boardData.juntaVigilancia.mujeres + 
                            boardData.empleados.mujeres + 
                            boardData.funcionarios.mujeres;
        const totalHombres = boardData.juntaDirectiva.hombres + 
                            boardData.juntaVigilancia.hombres + 
                            boardData.empleados.hombres + 
                            boardData.funcionarios.hombres;
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Mujeres', 'Hombres'],
                datasets: [{
                    data: [totalMujeres, totalHombres],
                    backgroundColor: [this.colors.female, this.colors.male],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    legend: {
                        ...this.defaultOptions.plugins.legend,
                        position: 'bottom'
                    }
                }
            }
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Charts;
}
