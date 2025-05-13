import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() pageTitle: string = 'Dashboard';
  @Input() totalValue: number = 0;
  @Input() totalCost: number = 0;
  @Input() gainLoss: number = 0;
  @Input() gainLossPercentage: number = 0;

  @Output() addInvestment = new EventEmitter<void>();

  onAddClick(): void {
    this.addInvestment.emit();
  }
}
