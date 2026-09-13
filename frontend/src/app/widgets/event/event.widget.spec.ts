import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KioskEvent } from '@screens/events/event.types';
import { EventsService } from '@screens/events/events.service';
import { EventWidget } from '@widgets/event/event.widget';
import { register } from 'swiper/element';

describe('EventWidget', () => {
  const events = signal<KioskEvent[]>([]);
  let component: EventWidget;
  let fixture: ComponentFixture<EventWidget>;

  beforeAll(async () => {
    register();
  });

  beforeEach(async () => {
    events.set([]);

    await TestBed.configureTestingModule({
      imports: [EventWidget],
      providers: [
        {
          provide: EventsService,
          useValue: { currentEvents: events }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('rebuilds loop indexes when events are inserted', async () => {
    events.set([createEvent(1), createEvent(2)]);
    fixture.detectChanges();
    await fixture.whenStable();

    const swiperElement = fixture.nativeElement.querySelector('swiper-container');
    const swiper = swiperElement.swiper;
    const loopDestroy = vi.spyOn(swiper, 'loopDestroy');
    const loopCreate = vi.spyOn(swiper, 'loopCreate');
    const autoplayStop = vi.spyOn(swiper.autoplay, 'stop');
    const autoplayStart = vi.spyOn(swiper.autoplay, 'start');

    events.set([createEvent(3), createEvent(1), createEvent(2)]);
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

    const insertedSlide = [...swiperElement.querySelectorAll('swiper-slide')].find(slide =>
      slide.textContent?.includes('Event 3')
    );

    expect(insertedSlide?.getAttribute('data-swiper-slide-index')).toBe('0');
    expect(loopDestroy).toHaveBeenCalledOnce();
    expect(loopCreate).toHaveBeenCalledOnce();
    expect(swiper.pagination.bullets).toHaveLength(3);
    expect(autoplayStop).toHaveBeenCalledOnce();
    expect(autoplayStart).toHaveBeenCalledOnce();
    expect(swiper.autoplay.running).toBe(true);
    expect(swiper.autoplay.paused).toBe(false);
  });

  function createEvent(eid: number): KioskEvent {
    return {
      eid,
      name: `Event ${eid}`,
      description: '',
      image_url: '',
      startDatetime: new Date('2026-09-12T12:00:00-07:00')
    } as KioskEvent;
  }
});
