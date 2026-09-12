import { BusStatus } from '@csss-api';
import { DepartureInfo } from '../../api/translink/translink.service';

// TODO: Fix the enum values on the backend and regenerate the services to get better enum names
export const STATUS_COLOUR_MAP: Record<number, string> = {
  [BusStatus.NUMBER_1]: '--arrived',
  [BusStatus.NUMBER_2]: '--delayed',
  [BusStatus.NUMBER_3]: '--on-time',
  [BusStatus.NUMBER_4]: '--cancelled'
};

export function getStatusClass(departure?: DepartureInfo): string {
  if (!departure) {
    return STATUS_COLOUR_MAP[BusStatus.NUMBER_3];
  }
  if (departure.arrived) {
    return STATUS_COLOUR_MAP[BusStatus.NUMBER_1];
  }
  return STATUS_COLOUR_MAP[departure.status];
}
