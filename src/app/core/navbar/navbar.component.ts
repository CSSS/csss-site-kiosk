import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  imports: [LucideDynamicIcon, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
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
      label: 'CLASS SEARCH',
      icon: LucidePencil.icon,
      url: '/class-search'
    }
  ]);
}
