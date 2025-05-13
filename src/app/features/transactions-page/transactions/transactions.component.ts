import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx'; 
 
@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  recentTransactions: any[] = [];
  filteredTransactions: any[] = [];
  investments: any[] = [];
  userId: number|null = null; // Default value
  totalInvestmentValue = 0;
  totalInvestmentCost = 0;
  totalGainLoss = 0;
  totalGainLossPercentage = 0;
  perDayGainLoss = 10;
  loading = true;
  error = '';
 
  // Filter variables
  fromDate: string = '';
  toDate: string = '';
  selectedType: string = 'all';
  searchQuery: string = '';
 
  isSearchFocused: boolean = false;
 
  constructor(private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
 
  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    this.loadInvestments();
  }
 
 
 
  loadInvestments(): void {
    this.http.get<any[]>(`http://localhost:5154/api/Investment/user/${this.userId}`).subscribe({
      next: (data) => {
        // Optionally filter by userId if endpoint returns all users' investments
        this.investments = data.filter(inv => inv.userId === this.userId);
 
        // Map investments to transactions format for display
        this.transactions = this.investments.map((item: any) => ({
          id: item.id,
          name:
            item.stockName ||
            item.fixedIncomeName ||
            item.schemeName ||
            item.securityName ||
            'N/A',
          type: item.type,
          transactionType: item.transactionType,
          date: item.purchaseDate || item.investmentDate || 'N/A',
          amount:
            item.purchasePrice ||
            item.investmentAmount ||
            item.amount ||
            item.price ||
            'N/A',
          units: item.numberOfShares || item.units || 'N/A',
        }));
        this.recentTransactions = [...this.transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
 
          // Initialize filtered transactions
          this.filteredTransactions = [...this.transactions];
 
 
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading investments:', err);
        this.error = 'Failed to load investments';
        this.loading = false;
      },
    });
  }
   //  filters to the "All Transactions" table
   applyFilters(): void {
 
    this.filteredTransactions = this.transactions.filter((txn) => {
      const matchesDate =
        (!this.fromDate || new Date(txn.date) >= new Date(this.fromDate)) &&
        (!this.toDate || new Date(txn.date) <= new Date(this.toDate));
      const matchesType =
        this.selectedType === 'all' ||  txn.transactionType.toLowerCase() === this.selectedType.toLowerCase();
        console.log('Selected Type:', this.selectedType);
      const matchesSearch =
        !this.searchQuery ||
        txn.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesDate && matchesType && matchesSearch;
    });
    console.log(this.filteredTransactions)
  }
 
  clearFilters(): void {
    this.fromDate = '';
    this.toDate = '';
    this.selectedType = 'all';
    this.searchQuery = '';
    this.filteredTransactions = [...this.transactions];
  }
 
 
  
exportToExcel(): void {
  // Prepare the data for export
  const exportData = this.filteredTransactions.map((txn) => ({
    Name: txn.name,
    Type: txn.type,
    'Transaction Type': txn.transactionType,
    Date: new Date(txn.date).toLocaleDateString(), // Format the date
    Price: txn.amount,
    'Units/Shares': txn.units,
  }));

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  // Export the workbook to an Excel file
  XLSX.writeFile(workbook, 'Transactions.xlsx');
}

 
  // Navigation methods
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
 
  goToHoldings(): void {
    this.router.navigate(['/holdings']);
  }
 
  goToTransactions(): void {
    this.router.navigate(['/transactions']);
  }
}
 