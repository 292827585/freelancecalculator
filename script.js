// Tax rates by country/region (2026 estimates)
const taxRates = {
    'united-states': { rate: 25, name: 'United States' },
    'canada': { rate: 26, name: 'Canada' },
    'united-kingdom': { rate: 20, name: 'United Kingdom' },
    'germany': { rate: 22, name: 'Germany' },
    'france': { rate: 24, name: 'France' },
    'australia': { rate: 23, name: 'Australia' },
    'japan': { rate: 20, name: 'Japan' },
    'singapore': { rate: 18, name: 'Singapore' },
    'india': { rate: 18, name: 'India' },
    'brazil': { rate: 27, name: 'Brazil' },
    'eastern-europe': { rate: 18, name: 'Eastern Europe' },
    'western-europe': { rate: 22, name: 'Western Europe' },
    'southeast-asia': { rate: 15, name: 'Southeast Asia' },
    'south-asia': { rate: 15, name: 'South Asia' }
};

// Platform fees
const platformFees = {
    'direct': { name: 'Direct Client', fee: 0.025 },
    'upwork': { name: 'Upwork', fee: 0.10 },
    'fiverr': { name: 'Fiverr', fee: 0.20 },
    'freelancer': { name: 'Freelancer.com', fee: 0.10 },
    'toptal': { name: 'Toptal', fee: 0.00 },
    'peopleperhour': { name: 'PeoplePerHour', fee: 0.175 },
    'guru': { name: 'Guru', fee: 0.07 },
    'contra': { name: 'Contra', fee: 0.00 },
    '99designs': { name: '99designs', fee: 0.15 },
    'behance': { name: 'Behance', fee: 0.00 }
};

// Platform colors for charts
const platformColors = {
    'direct': '#667eea',
    'upwork': '#00b42a',
    'fiverr': '#1dbf73',
    'freelancer': '#28c76f',
    'toptal': '#ff6b6b',
    'peopleperhour': '#f39c12',
    'guru': '#9b59b6',
    'contra': '#3498db',
    '99designs': '#e74c3c',
    'behance': '#053eff'
};

// Rate benchmarks based on Category, Experience Level, and Complexity
const rateBenchmarks = {
    'web-development': {
        'junior': { min: 35, max: 55 },
        'mid-level': { min: 65, max: 95 },
        'senior': { min: 110, max: 160 },
        'complexity': { simple: 0.85, medium: 1.0, complex: 1.35 }
    },
    'ui-ux-design': {
        'junior': { min: 40, max: 60 },
        'mid-level': { min: 70, max: 100 },
        'senior': { min: 120, max: 170 },
        'complexity': { simple: 0.85, medium: 1.0, complex: 1.30 }
    },
    'graphic-design': {
        'junior': { min: 25, max: 40 },
        'mid-level': { min: 45, max: 70 },
        'senior': { min: 75, max: 110 },
        'complexity': { simple: 0.85, medium: 1.0, complex: 1.25 }
    },
    'writing-content': {
        'junior': { min: 25, max: 40 },
        'mid-level': { min: 45, max: 70 },
        'senior': { min: 75, max: 110 },
        'complexity': { simple: 0.85, medium: 1.0, complex: 1.25 }
    },
    'other': {
        'junior': { min: 30, max: 50 },
        'mid-level': { min: 55, max: 85 },
        'senior': { min: 90, max: 130 },
        'complexity': { simple: 0.85, medium: 1.0, complex: 1.30 }
    }
};

// DOM Elements
const targetIncomeInput = document.getElementById('targetIncome');
const billableHoursInput = document.getElementById('billableHours');
const hoursValue = document.getElementById('hoursValue');
const expensesInput = document.getElementById('expenses');
const locationSelect = document.getElementById('location');
const taxRateInput = document.getElementById('taxRate');
const categorySelect = document.getElementById('category');
const experienceRadios = document.querySelectorAll('input[name="experience"]');
const complexitySelect = document.getElementById('complexity');
const platformCheckboxes = document.querySelectorAll('input[name="platform"]');
const recommendedRate = document.getElementById('recommendedRate');
const defaultRateInput = document.getElementById('defaultRate');
const resetBtn = document.querySelector('.reset-btn');

// Initialize charts
let incomeBreakdownChart;
let platformChart;

// Update hours value display
billableHoursInput.addEventListener('input', function() {
    hoursValue.textContent = this.value;
    calculateResults();
});

// Update tax rate when location changes
locationSelect.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const taxRate = selectedOption.getAttribute('data-tax') || 25;
    taxRateInput.value = taxRate;
    calculateResults();
});

// Calculate and update default rate based on category, experience, and complexity
function updateDefaultRate() {
    const category = categorySelect.value;
    const experience = document.querySelector('input[name="experience"]:checked').value;
    const complexity = complexitySelect.value;
    
    const benchmarks = rateBenchmarks[category];
    if (!benchmarks) return;
    
    const levelData = benchmarks[experience];
    const complexityMultiplier = benchmarks.complexity[complexity];
    
    // Calculate midpoint of the range and apply complexity multiplier
    const midpoint = (levelData.min + levelData.max) / 2;
    const adjustedRate = Math.round(midpoint * complexityMultiplier);
    
    defaultRateInput.value = adjustedRate;
}

// Recalculate on input change
targetIncomeInput.addEventListener('input', calculateResults);
expensesInput.addEventListener('input', calculateResults);
taxRateInput.addEventListener('input', calculateResults);
categorySelect.addEventListener('change', function() {
    updateDefaultRate();
    calculateResults();
});
complexitySelect.addEventListener('change', function() {
    updateDefaultRate();
    calculateResults();
});

experienceRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        document.querySelectorAll('.level-radio').forEach(el => el.classList.remove('active'));
        this.parentElement.classList.add('active');
        updateDefaultRate();
        calculateResults();
    });
});

platformCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        calculateResults();
    });
});

// Reset all inputs
resetBtn.addEventListener('click', function() {
    targetIncomeInput.value = 4000;
    billableHoursInput.value = 80;
    hoursValue.textContent = 80;
    expensesInput.value = 200;
    locationSelect.value = 'united-states';
    taxRateInput.value = 25;
    categorySelect.value = 'web-development';
    complexitySelect.value = 'medium';
    
    // Reset experience level
    document.querySelectorAll('input[name="experience"]').forEach((radio, index) => {
        radio.checked = index === 1; // mid-level
        radio.parentElement.classList.toggle('active', index === 1);
    });
    
    // Reset platforms
    platformCheckboxes.forEach((checkbox, index) => {
        checkbox.checked = index === 0; // direct client only
    });
    
    // Reset default rate based on current selections
    updateDefaultRate();
    calculateResults();
});

// Calculate all results
function calculateResults() {
    const targetIncome = parseFloat(targetIncomeInput.value) || 0;
    const billableHours = parseFloat(billableHoursInput.value) || 0;
    const expenses = parseFloat(expensesInput.value) || 0;
    const taxRate = parseFloat(taxRateInput.value) / 100 || 0;
    
    // Check for division by zero
    if (billableHours <= 0) {
        recommendedRate.textContent = '0.00';
        return;
    }
    
    // Calculate gross hourly rate needed
    // Net = Gross * (1 - platform fee) * (1 - tax) - expenses
    // We'll use average platform fee of 10% for calculation
    const avgPlatformFee = 0.10;
    const effectiveRate = (1 - avgPlatformFee) * (1 - taxRate);
    
    const grossHourlyRate = (targetIncome + expenses) / (billableHours * effectiveRate);
    const roundedRate = Math.round(grossHourlyRate * 100) / 100;
    
    recommendedRate.textContent = roundedRate.toFixed(2);
    
    // Update income comparison table
    updateIncomeTable(roundedRate, billableHours, expenses, taxRate);
    
    // Update charts
    updateCharts(roundedRate, billableHours, expenses, taxRate);
}

// Update income comparison table
function updateIncomeTable(hourlyRate, billableHours, expenses, taxRate) {
    const grossIncome = hourlyRate * billableHours;
    const tbody = document.getElementById('incomeTableBody');
    
    let html = '';
    const selectedPlatforms = Array.from(platformCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    if (selectedPlatforms.length === 0) {
        selectedPlatforms.push('direct');
    }
    
    selectedPlatforms.forEach(platform => {
        const fee = platformFees[platform].fee;
        const platformFeeAmount = grossIncome * fee;
        const taxableIncome = grossIncome - platformFeeAmount;
        const taxAmount = taxableIncome * taxRate;
        const netIncome = taxableIncome - taxAmount - expenses;
        
        html += `
            <tr>
                <td>${platformFees[platform].name}</td>
                <td>$${grossIncome.toFixed(0)}</td>
                <td>$${platformFeeAmount.toFixed(0)}</td>
                <td>$${taxAmount.toFixed(0)}</td>
                <td>$${expenses.toFixed(0)}</td>
                <td>$${netIncome.toFixed(0)}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Update charts
function updateCharts(hourlyRate, billableHours, expenses, taxRate) {
    const grossIncome = hourlyRate * billableHours;
    const platformFee = grossIncome * 0.025; // Direct client average
    const taxableIncome = grossIncome - platformFee;
    const taxAmount = taxableIncome * taxRate;
    const netIncome = taxableIncome - taxAmount - expenses;
    
    // Destroy existing charts
    if (incomeBreakdownChart) incomeBreakdownChart.destroy();
    if (platformChart) platformChart.destroy();
    
    // Income Breakdown Chart (Doughnut)
    const ctx1 = document.getElementById('incomeBreakdownChart').getContext('2d');
    incomeBreakdownChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Your Net', 'Taxes', 'Platform Fees', 'Expenses'],
            datasets: [{
                data: [netIncome, taxAmount, platformFee, expenses],
                backgroundColor: ['#667eea', '#f093fb', '#4ade80', '#fbbf24'],
                borderWidth: 0,
                cutout: '65%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: { size: 11 }
                    }
                }
            }
        }
    });
    
    // Net Income by Platform Chart (Bar)
    const ctx2 = document.getElementById('platformChart').getContext('2d');
    const platforms = ['direct', 'upwork', 'fiverr', 'freelancer'];
    const netIncomes = platforms.map(platform => {
        const fee = platformFees[platform].fee;
        const pf = grossIncome * fee;
        const ti = grossIncome - pf;
        const tax = ti * taxRate;
        return ti - tax - expenses;
    });
    
    platformChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: platforms.map(p => platformFees[p].name),
            datasets: [{
                label: 'Net Income',
                data: netIncomes,
                backgroundColor: platforms.map(p => platformColors[p]),
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        },
                        font: { size: 11 }
                    }
                },
                y: {
                    ticks: { font: { size: 10 } }
                }
            }
        }
    });
}

// Initialize
updateDefaultRate();
calculateResults();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
