import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bond-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bond-form.component.html',
  styleUrls: ['./bond-form.component.css']
})
export class BondFormComponent implements OnInit {
  @Input() data: any;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      transactionType: [this.data?.transactionType || 'Buy', Validators.required],
      fixedIncomeName: [this.data?.fixedIncomeName || '', Validators.required],
      investmentDate: [this.data?.investmentDate || '', Validators.required],
      investmentAmount: [this.data?.investmentAmount || '', Validators.required],
      couponRate: [this.data?.couponRate || '', Validators.required],
      compoundingFrequency: [this.data?.compoundingFrequency || 'Yearly', Validators.required],
      interestType: [this.data?.interestType || 'Accrued', Validators.required],
      maturityDate: [this.data?.maturityDate || '', Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue());
    }
  }
}
