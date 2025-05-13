import { ComponentFixture, TestBed } from '@angular/core/testing';

import { stockFormComponent } from './stock-form.component';

describe('stockFormComponent', () => {
  let component: stockFormComponent;
  let fixture: ComponentFixture<stockFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [stockFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(stockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
