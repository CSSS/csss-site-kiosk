import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivityService, INACTIVITY_TIMEOUT } from './activity.service';

describe('ActivityService', () => {
  let navigateByUrl: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    navigateByUrl = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        ActivityService,
        {
          provide: Router,
          useValue: { navigateByUrl }
        }
      ]
    });
    TestBed.inject(ActivityService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });

  it('navigates home after five minutes of inactivity', () => {
    vi.advanceTimersByTime(INACTIVITY_TIMEOUT - 1);

    expect(navigateByUrl).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(navigateByUrl).toHaveBeenCalledOnce();
    expect(navigateByUrl).toHaveBeenCalledWith('/');
  });

  it.each(['click', 'touchstart', 'mousemove', 'keydown'])(
    'timeout reset after each %s event',
    eventType => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT - 1);
      document.dispatchEvent(new Event(eventType));

      vi.advanceTimersByTime(INACTIVITY_TIMEOUT - 1);
      expect(navigateByUrl).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(navigateByUrl).toHaveBeenCalledOnce();
      expect(navigateByUrl).toHaveBeenCalledWith('/');
    }
  );
});
