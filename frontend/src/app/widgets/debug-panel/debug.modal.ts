import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { DebugService } from '@core/debug/debug.service';
import { DurationPipe } from '@core/duration.pipe';
import { LoggingService } from '@core/logging/logging.service';
import { TimeService } from '@core/time.service';
import { BUILD_VERSION } from '../../app.version';

@Component({
  imports: [DurationPipe, DatePipe],
  selector: 'ksk-debug-modal',
  styleUrl: './debug.modal.scss',
  templateUrl: './debug.modal.html'
})
export class DebugModal implements OnInit {
  protected readonly timeService = inject(TimeService);
  protected readonly loggingService = inject(LoggingService);
  protected readonly debugService = inject(DebugService);

  appVersion = BUILD_VERSION;
  requestLogs = computed(() => this.loggingService.entries().reverse());
  serverVersion = this.debugService.serverVersion;
  latestReleaseVersion = this.debugService.latestReleaseVersion;

  ngOnInit(): void {}

  protected refreshPage(): void {
    window.location.reload();
  }
}
