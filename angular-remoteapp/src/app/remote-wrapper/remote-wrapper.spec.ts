import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteWrapper } from './remote-wrapper';

describe('RemoteWrapper', () => {
  let component: RemoteWrapper;
  let fixture: ComponentFixture<RemoteWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoteWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoteWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
