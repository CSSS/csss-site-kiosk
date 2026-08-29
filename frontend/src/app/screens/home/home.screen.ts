import { Component } from '@angular/core';
import { BusScheduleWidget } from '@widgets/bus-schedule/bus-schedule.widget';
import { EventWidget } from '@widgets/event/event.widget';

@Component({
  selector: 'ksk-home-screen',
  imports: [EventWidget, BusScheduleWidget],
  templateUrl: './home.screen.html',
  styleUrl: './home.screen.scss'
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class HomeScreen {}
