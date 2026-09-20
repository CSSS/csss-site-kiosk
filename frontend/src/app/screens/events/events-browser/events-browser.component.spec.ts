import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KioskEvent } from '@screens/events/event.types';
import { EventsBrowserComponent } from '@screens/events/events-browser/events-browser.component';
import { EventsService } from '@screens/events/events.service';
import { register, SwiperContainer } from 'swiper/element';

describe('EventsBrowserComponent', () => {
  const events = signal<KioskEvent[]>([]);
  const partDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'part');
  let component: EventsBrowserComponent;
  let fixture: ComponentFixture<EventsBrowserComponent>;

  beforeAll(() => {
    if (!partDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'part', {
        configurable: true,
        get(this: HTMLElement): { add: (...tokens: string[]) => void } {
          return {
            add: (...tokens: string[]): void => {
              const currentTokens = this.getAttribute('part')?.split(' ').filter(Boolean) ?? [];
              this.setAttribute('part', [...new Set([...currentTokens, ...tokens])].join(' '));
            }
          };
        }
      });
    }

    register();
  });

  afterAll(() => {
    if (!partDescriptor) {
      delete (HTMLElement.prototype as Partial<HTMLElement>).part;
    }
  });

  beforeEach(async () => {
    events.set([]);

    await TestBed.configureTestingModule({
      imports: [EventsBrowserComponent],
      providers: [
        {
          provide: EventsService,
          useValue: { currentEvents: events }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates dynamic pagination after its injected styles load', async () => {
    events.set([createEvent(1), createEvent(2), createEvent(3)]);
    fixture.detectChanges();
    await fixture.whenStable();

    const swiperElement = fixture.nativeElement.querySelector(
      'swiper-container'
    ) as SwiperContainer;
    const paginationUpdate = vi.spyOn(swiperElement.swiper.pagination, 'update');
    const paginationStyles = swiperElement.shadowRoot?.querySelector<HTMLLinkElement>(
      'link[href="/swiper/pagination-element.min.css"]'
    );

    expect(swiperElement.swiper.pagination.bullets.length).toBeGreaterThan(0);
    expect(paginationStyles).not.toBeNull();

    paginationStyles?.dispatchEvent(new Event('load'));

    expect(paginationUpdate).toHaveBeenCalledOnce();
  });

  function createEvent(eid: number): KioskEvent {
    return {
      eid,
      name: `Event ${eid}`,
      description: '',
      image_url: '/images/placeholder.webp',
      startDatetime: new Date('2026-09-12T12:00:00-07:00')
    } as KioskEvent;
  }
});
