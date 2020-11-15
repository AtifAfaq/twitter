import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuDynamicComponent } from './side-menu-dynamic.component';

describe('SideMenuDynamicComponent', () => {
  let component: SideMenuDynamicComponent;
  let fixture: ComponentFixture<SideMenuDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideMenuDynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
