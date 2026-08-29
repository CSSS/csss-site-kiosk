import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DebugService } from '@core/debug/debug.service';
import { MultiTapDirective } from '@core/debug/multi-tap.directive';
import {
  LucideCalendar,
  LucideDynamicIcon,
  LucideHouse,
  LucidePencil,
  type LucideIconData
} from '@lucide/angular';

interface NavItem {
  label: string;
  icon: LucideIconData;
  url: string;
}

@Component({
  selector: 'ksk-navbar',
  imports: [LucideDynamicIcon, RouterLink, RouterLinkActive, MultiTapDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  readonly activeIndex = signal(0);

  readonly navItems = signal<NavItem[]>([
    {
      label: 'HOME',
      icon: LucideHouse.icon,
      url: '/'
    },
    {
      label: 'EVENTS',
      icon: LucideCalendar.icon,
      url: '/events'
    },
    {
      label: 'CLASSES',
      icon: LucidePencil.icon,
      url: '/classes'
    }
  ]);

  protected readonly debug = inject(DebugService);

  protected setActiveIndex(isActive: boolean, index: number): void {
    if (isActive) {
      this.activeIndex.set(index);
    }
  }
}
