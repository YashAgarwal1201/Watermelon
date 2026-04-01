import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPage2 } from './sub-page2';

describe('SubPage2', () => {
  let component: SubPage2;
  let fixture: ComponentFixture<SubPage2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubPage2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubPage2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
