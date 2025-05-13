import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventEmitter, Input, Output } from '@angular/core';
import { stockFormComponent } from '../stock-form/stock-form.component';
import { BondFormComponent } from '../bond-form/bond-form.component';           
import { MutualFundFormComponent } from '../mutual-fund-form/mutual-fund-form.component';       
import { GoldBondFormComponent } from '../gold-bond-form/gold-bond-form.component';     
import { Investment } from '../../../core/models/investment';

@Component({
  selector: 'app-investment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, stockFormComponent,BondFormComponent,MutualFundFormComponent,GoldBondFormComponent,InvestmentModalComponent],
  templateUrl: './investment-modal.component.html',
  styleUrl: './investment-modal.component.css'
})
  export class InvestmentModalComponent {
    @Input() isEditMode = false;
    @Input() data: any = null;
    @Input() selectedType: string = 'stock';
    @Output() closeModal = new EventEmitter<void>();
    @Output() save = new EventEmitter<any>();
  
    onTypeChange() {
      if (!this.isEditMode) {
        this.data = null; 
      }
    }
  
    close() {
      this.closeModal.emit();
    }
  
    onSave(formData: any) {
      this.save.emit({ ...formData, type: this.selectedType });
      this.save.emit({ ...formData, type: this.selectedType, Id: this.data?.id });
      this.close();
  }
}
