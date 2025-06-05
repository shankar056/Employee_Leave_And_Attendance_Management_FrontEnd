import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeatendanceComponent } from './employeeatendance.component';

describe('EmployeeatendanceComponent', () => {
  let component: EmployeeatendanceComponent;
  let fixture: ComponentFixture<EmployeeatendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeatendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeatendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});