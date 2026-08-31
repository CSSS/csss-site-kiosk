import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugService } from '@core/debug/debug.service';
import { LoggingService } from '@core/logging/logging.service';
import { TimeService } from '@core/time.service';
import { DebugModal } from '@widgets/debug-panel/debug.modal';
import { BUILD_VERSION } from '../../app.version';

describe('DebugModal', () => {
  const reloadLatestRelease = vi.fn();
  const reload = vi.fn();
  const latestReleaseValue = signal('v1.2.3');
  const serverInfo = signal({
    version: 'server-v4.5.6',
    startedAt: new Date('2026-08-24T12:00:00Z').getTime()
  });
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
    reloadLatestRelease.mockReset();
    reload.mockReset();
    latestReleaseValue.set('v1.2.3');
    serverInfo.set({
      version: 'server-v4.5.6',
      startedAt: new Date('2026-08-24T12:00:00Z').getTime()
    });
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
            latestReleaseVersion: {
              reload: reloadLatestRelease,
              value: latestReleaseValue
            },
            serverInfo
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
            currentDatetime: signal(new Date('2026-08-24T13:01:01Z')),
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
    expect(text).toContain('server-v4.5.6');
    expect(text).toContain('v1.2.3');
    expect(text).toContain('1h 1m 1s');
    expect(component.serverInfo()).toEqual({
      version: 'server-v4.5.6',
      startedAt: new Date('2026-08-24T12:00:00Z').getTime()
    });
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

    expect(reloadLatestRelease).toHaveBeenCalledOnce();
  });

  it('refreshes the page from the controls', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('button')[1];

    button.click();

    expect(reload).toHaveBeenCalledOnce();
  });
});
