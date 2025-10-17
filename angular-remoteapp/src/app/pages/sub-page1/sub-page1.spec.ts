import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPage1 } from './sub-page1';

describe('SubPage1', () => {
  let component: SubPage1;
  let fixture: ComponentFixture<SubPage1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubPage1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubPage1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
