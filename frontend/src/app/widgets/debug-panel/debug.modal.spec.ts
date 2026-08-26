import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BUILD_VERSION } from '../../app.version';
import { DebugService } from '../../core/debug/debug.service';
import { LoggingService } from '../../core/logging/logging.service';
import { TimeService } from '../../core/time.service';
import { DebugModal } from './debug.modal';

describe('DebugModal', () => {
  const getLatestReleaseVersion = vi.fn();
  const reload = vi.fn();
  const latestReleaseVersion = signal('v1.2.3');
  const entries = signal([
    {
      id: 'older',
      timestamp: new Date('2026-08-24T12:00:00Z'),
      url: '/older',
      status: 200
    },
    {
      id: 'newer',
      timestamp: new Date('2026-08-24T12:01:00Z'),
      url: '/newer',
      status: 503
    }
  ]);
  let component: DebugModal;
  let fixture: ComponentFixture<DebugModal>;

  beforeEach(async () => {
    getLatestReleaseVersion.mockReset();
    reload.mockReset();
    latestReleaseVersion.set('v1.2.3');
    entries.set([
      {
        id: 'older',
        timestamp: new Date('2026-08-24T12:00:00Z'),
        url: '/older',
        status: 200
      },
      {
        id: 'newer',
        timestamp: new Date('2026-08-24T12:01:00Z'),
        url: '/newer',
        status: 503
      }
    ]);
    vi.stubGlobal('location', {
      ...window.location,
      reload
    });

    await TestBed.configureTestingModule({
      imports: [DebugModal],
      providers: [
        {
          provide: DebugService,
          useValue: {
            getLatestReleaseVersion,
            latestReleaseVersion,
            serverVersion$: of('server-v4.5.6')
          }
        },
        {
          provide: LoggingService,
          useValue: { entries }
        },
        {
          provide: TimeService,
          useValue: {
            startTime: new Date('2026-08-24T12:00:00Z'),
            uptime: signal(3_661_000)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DebugModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders application versions and uptime', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain(BUILD_VERSION);
    expect(text).toContain('v1.2.3');
    expect(text).toContain('1h 1m 1s');
    expect(component.serverVersion()).toBe('server-v4.5.6');
  });

  it('renders request logs in reverse chronological order', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');

    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toContain('/newer');
    expect(rows[0].textContent).toContain('503');
    expect(rows[1].textContent).toContain('/older');
    expect(rows[1].textContent).toContain('200');
  });

  it('checks for the latest release from the controls', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('button')[0];

    button.click();

    expect(getLatestReleaseVersion).toHaveBeenCalledOnce();
  });

  it('refreshes the page from the controls', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('button')[1];

    button.click();

    expect(reload).toHaveBeenCalledOnce();
  });
});
