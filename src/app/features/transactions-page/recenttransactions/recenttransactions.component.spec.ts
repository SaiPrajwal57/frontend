import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecenttransactionsComponent } from './recenttransactions.component';

describe('RecenttransactionsComponent', () => {
  let component: RecenttransactionsComponent;
  let fixture: ComponentFixture<RecenttransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecenttransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecenttransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
