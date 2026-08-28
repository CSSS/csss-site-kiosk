import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChildren, effect, model } from '@angular/core';
import { SlidingTabDirective } from '@core/sliding-tabs/sliding-tab.directive';

@Component({
  imports: [NgTemplateOutlet, Tab, TabContent, TabList, TabPanel, Tabs],
  selector: 'ksk-sliding-tabs',
  styleUrl: './sliding-tabs.component.scss',
  templateUrl: './sliding-tabs.component.html'
})
export class SlidingTabsComponent {
  readonly selectedTab = model<string | undefined>(undefined);

  protected readonly tabs = contentChildren(SlidingTabDirective);

  protected readonly selectedIndex = computed(() => {
    const index = this.tabs().findIndex(tab => tab.value() === this.selectedTab());
    return Math.max(index, 0);
  });

  protected readonly trackTransform = computed(() => `translateX(${-this.selectedIndex() * 100}%)`);

  protected readonly indicatorWidth = computed(() => {
    const count = this.tabs().length;
    return count > 0 ? 100 / count : 0;
  });

  protected readonly indicatorTransform = computed(
    () => `translateX(${this.selectedIndex() * 100}%)`
  );

  constructor() {
    effect(() => {
      const tabs = this.tabs();
      const selectedTab = this.selectedTab();

      if (tabs.length > 0 && !tabs.some(tab => tab.value() === selectedTab)) {
        this.selectedTab.set(tabs[0].value());
      }
    });
  }
}
