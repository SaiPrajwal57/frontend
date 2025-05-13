import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mutual-fund-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mutual-fund-form.component.html',
  styleUrls: ['./mutual-fund-form.component.css']
})
export class MutualFundFormComponent implements OnInit {
  @Input() data: any;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      transactionType: [this.data?.transactionType || 'Buy', Validators.required],
      SchemeName: [this.data?.SchemeName || '', Validators.required],
      FolioNumber: [this.data?.FolioNumber || '', Validators.required],
      InvestmentDate: [this.data?.InvestmentDate || '', Validators.required],
      AmountType: [this.data?.AmountType || 'Rupees', Validators.required],
      Amount: [this.data?.Amount || '', Validators.required],
      Price: [this.data?.Price || '', Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue());
    }
  }
}