import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NXTComponentComponent } from './nxt-component.component';

describe('NXTComponentComponent', () => {
  let component: NXTComponentComponent;
  let fixture: ComponentFixture<NXTComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NXTComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NXTComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
