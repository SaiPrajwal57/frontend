import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Chart, registerables } from 'chart.js/auto';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  investments: any[] = [];
  userId: number = 0; 
  totalInvestmentValue = 0;
  totalInvestmentCost = 0;
  totalGainLoss = 0;
  totalGainLossPercentage = 0;
  loading = true;
  error = '';

  assetAllocationLabels: string[] = [];
  assetAllocationData: number[] = [];
  investmentTypeLabels: string[] = [];
  investmentTypeData: number[] = [];
 

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    
    console.log('User ID:', localStorage.getItem('userId')); 
    this.loadInvestments();
    const chartData = this.generatePerformanceChartData();
    

  }

  loadInvestments(): void {
    const userIdFromStorage = localStorage.getItem('userId');
    this.http.get<any[]>(`http://localhost:5154/api/investment/user/${userIdFromStorage}`).subscribe({
      next: (data) => {
        // Log data for debugging
        console.log('Fetched investments:', data);
        // this.investments = data.filter(
        //   (inv) => inv.userId === this.userId && inv.transactionType === 'buy'
        // );
        this.investments = data;

        // Log filtered investments to verify
        console.log('Filtered investments:', this.investments);

        this.calculateTotals();
        this.loading = false;
        this.prepareChartData();
        const chartData = this.generatePerformanceChartData();
        new Chart('performanceChart', {
          type: 'line',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => '$' + tooltipItem.raw
                }
              }
            },
            scales: {
              x: {
                title: { display: true, text: 'Investment' }
              },
              y: {
                title: { display: true, text: 'Gain/Loss ($)' },
                beginAtZero: false
              }
            }
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load investments';
        this.loading = false;
      },
    });
  }

  calculateTotals(): void {
    this.totalInvestmentCost = 0;
    this.totalInvestmentValue = 0;
    
    for (const inv of this.investments) {
      if (inv.type === 'Stock') {
        const cost = inv.purchasePrice * inv.numberOfShares;
        this.totalInvestmentCost += cost;
        const currentPrice = inv.purchasePrice * 1.05; // Dummy current price +5%
        this.totalInvestmentValue += currentPrice * inv.numberOfShares;
      } else if (inv.type === 'MutualFund') {
        const units =
          inv.amountType === 'Rupees' ? inv.amount / inv.price : inv.amount;
        const currentPrice = inv.price * 1.05;
        this.totalInvestmentCost += units * inv.price;
        this.totalInvestmentValue += units * currentPrice;
      } else if (inv.type === 'GoldBond') {
        const cost = inv.units * inv.price;
        const currentPrice = inv.price * 1.05;
        this.totalInvestmentCost += cost;
        this.totalInvestmentValue += inv.units * currentPrice;
      } else if (inv.type === 'Bond') {
        this.totalInvestmentCost += inv.investmentAmount;
        this.totalInvestmentValue += inv.investmentAmount * 1.02; // Assume 2% appreciation
      }
    }
    this.totalGainLoss = this.totalInvestmentValue - this.totalInvestmentCost;
    this.totalGainLossPercentage =
      (this.totalGainLoss / this.totalInvestmentCost) * 100;
  }


  prepareChartData(): void
  {
    const assetAllocation: { [key: string]: number } = {};
    const typeAllocation: { [key: string]: number } = {};
 
    for (const inv of this.investments) {
      const assetLabel = inv.Symbol || inv.StockName || 'Unknown';
      const type = inv.Type || 'Unknown';
      const value = this.getCurrentValue(inv);
 // Asset allocation
 assetAllocation[assetLabel] = (assetAllocation[assetLabel] || 0) + value;
 
 // Investment type allocation
 typeAllocation[type] = (typeAllocation[type] || 0) + value;
}

this.assetAllocationLabels = Object.keys(assetAllocation);
this.assetAllocationData = Object.values(assetAllocation);

this.investmentTypeLabels = Object.keys(typeAllocation);
this.investmentTypeData = Object.values(typeAllocation);

this.updateCharts(); // Call chart creation after preparing data
this.createPerformanceChart();
}
createPerformanceChart(): void {
    const chartData = this.generatePerformanceChartData();
 
    // Destroy previous chart if it exists (to prevent duplicates)
    const canvas = document.getElementById('performanceChart') as any;
    if (canvas && canvas.chartInstance) {
      canvas.chartInstance.destroy();
    }
 
    const chart = new Chart('performanceChart', {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => '$' + tooltipItem.raw
            }
          }
        },
        scales: {
          x: { title: { display: true, text: 'Investment' }},
          y: { title: { display: true, text: 'Gain/Loss ($)' }, beginAtZero: false }
        }
      }
    });
 
    // Attach chart instance for cleanup
    if (canvas) canvas.chartInstance = chart;
  }
 
 
  calculateGainLoss(inv: any): number {
    switch (inv.Type) {
      case 'Stock':
        return (inv.NumberOfShares || 1) * (inv.PurchasePrice ? inv.PurchasePrice * 0.05 : inv.price ? inv.price * 0.05 : 0);
      case 'MutualFund':
        if (inv.amountType === "Rupees") {
          return inv.amount && inv.price
            ? (inv.amount / inv.price) * inv.price * 0.05
            : inv.price
            ? 1 * inv.price * 0.05
            : 0;
        } else {
          return inv.amount && inv.price
            ? inv.amount * inv.price * 0.05
            : inv.price
            ? 1 * inv.price * 0.05
            : 0;
        }
      case 'GoldBond':
        return (inv.units || 1) * (inv.price ? inv.price * 0.05 : 0);
      case 'Bond':
        return inv.price
          ? (inv.units || 1) * inv.price * 0.02
          : inv.investmentAmount
          ? inv.investmentAmount * 0.02
          : 0;
      default:
        return (inv.quantity || 1) * (inv.price ? inv.price * 0.05 : 0);
    }
  }
 
 
  generatePerformanceChartData() {
    const labels: string[] = [];
    const data: number[] = [];
 
    this.investments.forEach((inv, index) => {
      const label = inv.name ||inv.StockName ;
      // || inv.Type + ' ' + (index + 1);
      const gainLoss = this.calculateGainLoss(inv);
 
      labels.push(label);
      data.push(+gainLoss.toFixed(2));
    });
 
    return {
      labels,
      datasets: [
        {
          label: 'Gain/Loss ($)',
          data,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  }
 
 
 
  updateCharts(): void {
    // Chart for Asset Allocation
    new Chart('assetAllocationChart', {
      type: 'doughnut',
      data: {
        labels: this.assetAllocationLabels,
        datasets: [
          {
            data: this.assetAllocationData,
            backgroundColor: ['#5a8fcf', '#6da86e', '#d4b662', '#b45f66', '#7e6bbd'],
          },
        ],
      },
      options: {
        responsive: true, 
        maintainAspectRatio: false, // Allows height to adjust based on container size
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
 
    // Chart for Investment Type
    new Chart('investmentTypeChart', {
      type: 'doughnut',
      data: {
        labels: this.investmentTypeLabels,
        datasets: [
          {
            data: this.investmentTypeData,
            backgroundColor: ['#4a6fa1', '#5c8265', '#b59b48', '#a35a5f'],
          },
        ],
      },
      options: {
        responsive: true, // Ensures chart resizes with its container
        maintainAspectRatio: false, 
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }
 
  getCurrentValue(inv: any): number {
    const price = inv.PurchasePrice || inv.price || 0;
    const units =
      inv.Type === 'Stock'
        ? inv.NumberOfShares || 1
        : inv.Type === 'MutualFund' && inv.amountType === 'Rupees'
        ? inv.amount / price
        : inv.units || inv.amount || 1;
 
    const growthFactor = inv.Type === 'Bond' ? 1.02 : 1.05;
    return units * price * growthFactor;
  }
 
  refreshPrices(): void {
    this.loadInvestments(); 
  }

  logout(): void {
    this.authService.clearUser(); 
    this.router.navigate(['/login']);
  }
}