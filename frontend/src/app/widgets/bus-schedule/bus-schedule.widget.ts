import { Component, inject } from '@angular/core';
import { ScheduleDisplayComponent } from '@widgets/bus-schedule/schedule-display/schedule-display.component';
import { DepartureInfo, TranslinkService } from '../../api/translink/translink.service';

@Component({
  selector: 'ksk-bus-schedule-widget',
  imports: [ScheduleDisplayComponent],
  templateUrl: './bus-schedule.widget.html',
  styleUrl: './bus-schedule.widget.scss'
})
export class BusScheduleWidget {
  private translinkService = inject(TranslinkService);

  protected routesToTrack = this.translinkService.routesToTrack;

  protected nextDepartures = this.translinkService.nextDepartures;

  protected getDeparture(route: string): DepartureInfo[] {
    return this.nextDepartures().get(route) ?? [];
  }
}
