import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvestmentModalComponent } from '../investment-modal/investment-modal.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'; 

@Component({
  selector: 'app-holdings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    InvestmentModalComponent,
    DeleteConfirmationModalComponent,
  ],
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.css'],
})
export class HoldingsComponent implements OnInit {
  investments: any[] = [];

  Id=0;
  totalInvestmentValue = 0;
  totalInvestmentCost = 0;
  totalGainLoss = 0;
  totalGainLossPercentage = 0;
  perDayGainLoss = 10;
  loading = true;
  error = '';
  showInvestmentModal = false;
  editMode = false;
  selectedType = 'stock';
  selectedInvestment = null;
  showDeleteConfirm = false;
  investmentToDelete: any = null;
  userId: number = 0; 
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('User ID1:', this.userId);
    this.userId = Number(localStorage.getItem('userId'));
    this.loadInvestments();
  }

  loadInvestments(): void {
    this.http
      .get<any[]>(`http://localhost:5154/api/Investment/user/${this.userId}`)
      .subscribe({
        next: (data) => {
          console.log('Fetched investments:', data); // Debugging line
          this.investments = data
            .filter((inv) => inv.transactionType === 'Buy') // Only include "Buy" transactions
            .map((inv) => ({
              ...inv,
              symbol: inv.stockName || inv.schemeName || inv.fixedIncomeName || null, // Map symbol
              currentPrice: null, // Placeholder for current price
              currentValue: null, // Placeholder for current value
              gainLoss: null, // Placeholder for gain/loss
              gainLossPercentage: null, // Placeholder for gain/loss percentage
            }));
          console.log('Mapped Investments:', this.investments); // Debugging line
          this.updateCurrentPrices(); // Fetch current prices after loading investments
        },
        error: (err) => {
          console.error('Error fetching investments:', err); // Log the error
          this.error = 'Failed to load investments';
          this.loading = false;
        },
      });
  }
   
  updateCurrentPrices(): void {
    const apiUrl = 'http://localhost:5154/api/finnhub/quote';
 
    const updatePromises = this.investments.map((investment) => {
      if (investment.symbol) {
        return this.http
          .get(`${apiUrl}?symbol=${investment.symbol}`)
          .toPromise()
          .then((response: any) => {
            console.log('API Response:', response); // Debugging line
            investment.currentPrice = response.currentPrice;
 
            // Calculate quantity based on type
            const quantity =
              investment.type === 'Stock'
                ? investment.numberOfShares
                : investment.type === 'MutualFund'
                ? investment.amount / investment.price
                : investment.type === 'GoldBond'
                ? investment.units
                : 1; // Default to 1 for bonds or other types
 
            // Correct calculations
            investment.currentValue = investment.currentPrice * quantity;
            investment.gainLoss =
              (investment.currentPrice - investment.purchasePrice) * quantity;
            investment.gainLossPercentage =
              ((investment.currentPrice - investment.purchasePrice) /
                investment.purchasePrice) *
              100;
              console.log('Current Price:', investment.currentPrice);
              console.log('Quantity:', quantity);
              console.log('Current Value:', investment.currentValue);
          })
          .catch((error) => {
            console.error(`Error fetching data for ${investment.symbol}`, error);
          });
      } else {
        console.warn('Missing symbol for investment:', investment); // Log missing symbol
      }
      return Promise.resolve();
    });
 
    Promise.all(updatePromises)
      .then(() => {
        console.log('Updated Investments:', this.investments); // Debugging line
        this.calculateTotals(); // Recalculate totals after updating prices
        this.loading = false;
      })
      .catch((error) => {
        this.error = 'Failed to update prices. Please try again later.';
        this.loading = false;
      });
  }
 
  calculateTotals(): void {
    this.totalInvestmentCost = 0;
    this.totalInvestmentValue = 0;
 
    for (const inv of this.investments) {
      if (inv.type === 'Stock') {
        const cost = inv.purchasePrice * inv.numberOfShares;
        this.totalInvestmentCost += cost;
        const currentPrice = inv.currentPrice || inv.purchasePrice; // Use currentPrice if available
        this.totalInvestmentValue += currentPrice * inv.numberOfShares;
      } else if (inv.type === 'MutualFund') {
        const units =
          inv.amountType === 'Rupees' ? inv.amount / inv.price : inv.amount;
        const currentPrice = inv.currentPrice || inv.price; // Use currentPrice if available
        this.totalInvestmentCost += units * inv.price;
        this.totalInvestmentValue += units * currentPrice;
      } else if (inv.type === 'GoldBond') {
        const cost = inv.units * inv.price;
        const currentPrice = inv.currentPrice || inv.price; // Use currentPrice if available
        this.totalInvestmentCost += cost;
        this.totalInvestmentValue += inv.units * currentPrice;
      } else if (inv.type === 'Bond') {
        this.totalInvestmentCost += inv.investmentAmount;
        const currentPrice = inv.currentPrice || inv.investmentAmount; // Use currentPrice if available
        this.totalInvestmentValue += currentPrice;
      }
    }
 
    this.totalGainLoss = this.totalInvestmentValue - this.totalInvestmentCost;
    this.totalGainLossPercentage =
      (this.totalGainLoss / this.totalInvestmentCost) * 100;
  }
  
  refreshPrices(): void {
    this.loadInvestments(); 
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToHoldings(): void {
    this.router.navigate(['/holdings']);
  }

  goToTransactions(): void {
    this.router.navigate(['/transactions']);
  }

  openAddInvestmentModal(type: string = 'stock') {
    this.editMode = false;
    this.selectedType = type;
    this.selectedInvestment = null;
    this.showInvestmentModal = true;
  }
  
  openEditInvestmentModal(inv: any) {
    this.editMode = true;
    this.selectedType = inv.type?.toLowerCase() || inv.Type?.toLowerCase() || 'stock';

    // Normalize data for the modal
    this.selectedInvestment = {
      ...inv,
      stockName: inv.stockName || inv.StockName || '',
      schemeName: inv.schemeName || inv.SchemeName || '',
      folioNo: inv.folioNo || inv.FolioNumber || '',
      investmentDate: inv.investmentDate || inv.InvestmentDate || '',
      amountType: inv.amountType || inv.AmountType || '',
      amount: inv.amount || inv.Amount || '',
      price: inv.price || inv.Price || '',
      purchaseDate: inv.purchaseDate || inv.PurchaseDate || '',
      numberOfShares: inv.numberOfShares || inv.NumberOfShares || '',
      dematAccount: inv.dematAccount || inv.DematAccount || '',
      brokerage: inv.brokerage || inv.Brokerage || '',
      brokerageType: inv.brokerageType || inv.BrokerageType || '',
      Id: inv.Id || inv.id,
      
    };
    this.showInvestmentModal = true;
    console.log('Selected Investment for Edit:', this.selectedInvestment); // Debugging line to check data
    
  }

  closeInvestmentModal() {
    this.showInvestmentModal = false;
  }
  generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, // Generate a random number from 0 to 15
          v = c === 'x' ? r : (r & 0x3 | 0x8); // Modify the y part to ensure valid GUID version
      return v.toString(16); // Convert the value to hexadecimal
    });
  }
  
  handleInvestmentSave(event: any) {
    const investmentType = event.type || this.selectedType;
    const payload = {
      ...event,
      transactionType: event.transactionType || 'Buy',
      userId: this.userId,
      type: investmentType,
      Id: this.editMode ? event.Id : this.generateGuid(),
    };
 
    // Map investment type to API endpoint
    let endpoint = '';
    switch (investmentType.toLowerCase()) {
      case 'stock':
        endpoint = 'stock';
        break;
      case 'bond':
        endpoint = 'bond';
        break;
      case 'mutualfund':
        endpoint = 'mutualfund';
        break;
      case 'goldbond':
        endpoint = 'goldbond';
        break;
      default:
        endpoint = 'stock';
    }
 
    if (this.editMode) {
      console.log('Editing investment, Id:', event.Id, 'Payload:', payload);
 
      this.http
      .put(`http://localhost:5154/api/Investment/${endpoint}/${payload.Id}`, payload)
  .subscribe({
 
          next: () => this.loadInvestments(),
          error: (err) => console.error('Error updating investment:', err),
        });
    } else {
      this.http
        .post(`http://localhost:5154/api/Investment/${endpoint}`, payload)
        .subscribe({
          next: () => this.loadInvestments(),
          error: (err) => console.error('Error adding investment:', err),
        });
      console.log('Payload being sent:', payload);
    }
    this.closeInvestmentModal();
  }

  confirmDelete(inv: any) {
    this.investmentToDelete = inv;
    this.showDeleteConfirm = true;
  }

  deleteInvestment() {
    if (!this.investmentToDelete) return;
    const id = this.investmentToDelete.Id || this.investmentToDelete.id;
    this.http.request('delete', `http://localhost:5154/api/Investment/${id}`, {
      body: { Id: id }
    }).subscribe({ 
    
      next: () => {
        this.loadInvestments();
        this.showDeleteConfirm = false;
        this.investmentToDelete = null;
      },
      error: (err) => {
        this.error = 'Failed to delete investment';
        this.showDeleteConfirm = false;
      },
    });
  }

  // export button
  exportToExcel(): void {
    // Prepare the data for export
    const exportData = this.investments.map((inv) => ({
      Symbol: inv.stockName || inv.schemeName || inv.fixedIncomeName || 'N/A',
      Type: inv.type,
      Quantity:
        inv.type === 'Stock'
          ? inv.numberOfShares
          : inv.type === 'MutualFund'
          ? inv.amountType === 'Rupees'
            ? (inv.amount / inv.price).toFixed(2)
            : inv.amount
          : inv.type === 'GoldBond'
          ? inv.units
          : '-',
      'Purchase Price': inv.purchasePrice || inv.price || inv.investmentAmount || '-',
      'Purchase Date': inv.purchaseDate || inv.date || inv.investmentDate || '-',
      'Current Price':
        inv.type === 'Stock'
          ? (inv.purchasePrice * 1.05).toFixed(2)
          : inv.type === 'MutualFund'
          ? (inv.price * 1.05).toFixed(2)
          : inv.type === 'GoldBond'
          ? (inv.price * 1.05).toFixed(2)
          : inv.type === 'Bond'
          ? (inv.investmentAmount * 1.02).toFixed(2)
          : '-',
      'Current Value':
        inv.type === 'Stock'
          ? (inv.numberOfShares * inv.purchasePrice * 1.05).toFixed(2)
          : inv.type === 'MutualFund'
          ? inv.amountType === 'Rupees'
            ? ((inv.amount / inv.price) * inv.price * 1.05).toFixed(2)
            : (inv.amount * inv.price * 1.05).toFixed(2)
          : inv.type === 'GoldBond'
          ? (inv.units * inv.price * 1.05).toFixed(2)
          : inv.type === 'Bond'
          ? (inv.investmentAmount * 1.02).toFixed(2)
          : '-',
      'Gain/Loss':
        inv.type === 'Stock'
          ? (inv.numberOfShares * inv.purchasePrice * 0.05).toFixed(2)
          : inv.type === 'MutualFund'
          ? inv.amountType === 'Rupees'
            ? ((inv.amount / inv.price) * inv.price * 0.05).toFixed(2)
            : (inv.amount * inv.price * 0.05).toFixed(2)
          : inv.type === 'GoldBond'
          ? (inv.units * inv.price * 0.05).toFixed(2)
          : inv.type === 'Bond'
          ? (inv.investmentAmount * 0.02).toFixed(2)
          : '-',
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Holdings');

    // Write the workbook and trigger the download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Holdings.xlsx');
  }
}
