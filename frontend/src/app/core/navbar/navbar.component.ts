import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  imports: [LucideDynamicIcon, RouterLink, RouterLinkActive],
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

  protected setActiveIndex(isActive: boolean, index: number): void {
    if (isActive) {
      this.activeIndex.set(index);
    }
  }
}
