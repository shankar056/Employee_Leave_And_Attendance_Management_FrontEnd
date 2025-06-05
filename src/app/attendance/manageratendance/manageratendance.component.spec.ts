import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageratendanceComponent } from './manageratendance.component';

describe('ManageratendanceComponent', () => {
  let component: ManageratendanceComponent;
  let fixture: ComponentFixture<ManageratendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageratendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageratendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
