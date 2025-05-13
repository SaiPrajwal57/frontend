import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gold-bond-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gold-bond-form.component.html',
  styleUrls: ['./gold-bond-form.component.css']
})
export class GoldBondFormComponent implements OnInit {
  @Input() data: any;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      transactionType: [this.data?.transactionType || 'Buy', Validators.required],
      securityName: [this.data?.securityName || '', Validators.required],
      purchaseDate: [this.data?.purchaseDate || '', Validators.required],
      units: [this.data?.units || '', Validators.required],
      price: [this.data?.price || '', Validators.required],
      brokerage: [this.data?.brokerage || '', Validators.required],
      brokerageType: [this.data?.brokerageType || '%', Validators.required],
      couponRate: [this.data?.couponRate || '', Validators.required],
      maturityDate: [this.data?.maturityDate || '', Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue());
    }
  }
}
