import { Component } from '@angular/core';
import {
  BreakpointState,
  BreakpointObserver,
  Breakpoints,
} from '@angular/cdk/layout';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pokédex';

  isHandset$ = this.breakpoint.observe([
    Breakpoints.Handset, Breakpoints.TabletPortrait
  ]);
  constructor(private breakpoint: BreakpointObserver) {

  }
}
