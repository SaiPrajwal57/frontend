import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { stockSearchComponent } from '../stock-search/stock-search.component';

@Component({
  selector: 'app-stock-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    stockSearchComponent,
  ],
  templateUrl: './stock-form.component.html',
  styleUrl: './stock-form.component.css',
})
export class stockFormComponent implements OnInit {
  @Input() data: any;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  showSellPrompt = false;
  showSellFields = false;
  sellPromptData: any = null;

  form!: FormGroup;
  sellForm!: FormGroup;

  selectedInvestment: { transactionType: string } = { transactionType: '' };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      transactionType: [
        this.data?.transactionType || 'Buy',
        Validators.required,
      ],
      stockName: [this.data?.stockName || '', Validators.required],
      dematAccount: [this.data?.dematAccount || '', Validators.required],
      purchaseDate: [this.data?.purchaseDate || '', Validators.required],
      numberOfShares: [this.data?.numberOfShares || '', Validators.required],
      brokerage: [this.data?.brokerage || '', Validators.required],
      brokerageType: [this.data?.brokerageType || '%', Validators.required],
      purchasePrice: [this.data?.purchasePrice || '', Validators.required],
      sellDate: [this.data?.sellDate || ''],
      sellPrice: [this.data?.sellPrice || ''],
    });

    this.form.get('transactionType')?.valueChanges.subscribe((type) => {
      const sellDateControl = this.form.get('sellDate');
      const sellPriceControl = this.form.get('sellPrice');
      if (type === 'Sell') {
        sellDateControl?.setValidators([Validators.required]);
        sellPriceControl?.setValidators([Validators.required]);
      } else {
        sellDateControl?.clearValidators();
        sellPriceControl?.clearValidators();
      }
      sellDateControl?.updateValueAndValidity();
      sellPriceControl?.updateValueAndValidity();
    });

    if (this.form.get('transactionType')?.value === 'Sell') {
      this.form.get('sellDate')?.setValidators([Validators.required]);
      this.form.get('sellPrice')?.setValidators([Validators.required]);
    }

    if (this.isEditMode) {
      this.form.get('stockName')?.disable();
    }

    this.sellForm = this.fb.group({
      sellDate: ['', Validators.required],
      sellPrice: ['', Validators.required],
    });
  }

  onstockSelected(symbol: string) {
    if (!this.isEditMode) {
      this.form.get('stockName')?.setValue(symbol);
    }
  }

  submit() {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      const originalQty = this.data?.numberOfShares ?? 0;
      const newQty = value.numberOfShares;
      if (value.transactionType === 'Buy') {
        value.sellDate = null;
        value.sellPrice = null;
      }
      if (this.isEditMode && newQty < originalQty) {
        this.promptSellOrCorrection(originalQty, newQty, value);
      } else {
        this.save.emit(value);
      }
    }
  }

  promptSellOrCorrection(originalQty: number, newQty: number, value: any) {
    this.showSellPrompt = true;
    this.sellPromptData = { originalQty, newQty, value };
  }

  handleSellPrompt(choice: 'correction' | 'sell') {
    if (choice === 'correction') {
      this.save.emit(this.sellPromptData.value);
      this.showSellPrompt = false;
    } else if (choice === 'sell') {
      this.showSellFields = true;
      this.showSellPrompt = false;
      this.sellForm.reset(); 
    }
  }
  confirmSell() {
    if (this.sellForm.valid) {
      const { value, newQty, originalQty } = this.sellPromptData;
  
      
      const updatedHolding = {
        ...value,
        transactionType: 'Buy',
        numberOfShares: newQty,
      };
  
      // New Sell transaction (no ID)
      const sellTransaction = {
        stockName: value.stockName,
        dematAccount: value.dematAccount,
        transactionType: 'Sell',
        numberOfShares: originalQty - newQty,
        sellDate: this.sellForm.value.sellDate,
        sellPrice: this.sellForm.value.sellPrice,
      };
  
      this.save.emit({ type: 'updateHolding', data: updatedHolding });
      this.save.emit({ type: 'sellTransaction', data: sellTransaction });
  
      this.showSellFields = false;
      this.sellForm.reset();
    }
  }
  
  
}
