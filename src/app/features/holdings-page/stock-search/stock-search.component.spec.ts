import { ComponentFixture, TestBed } from '@angular/core/testing';

import { stockSearchComponent } from './stock-search.component';

describe('stockSearchComponent', () => {
  let component: stockSearchComponent;
  let fixture: ComponentFixture<stockSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [stockSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(stockSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
