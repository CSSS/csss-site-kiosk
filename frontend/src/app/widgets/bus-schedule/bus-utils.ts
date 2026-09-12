import { BusStatus } from '@csss-api';

// TODO: Fix the enum values on the backend and regenerate the services to get better enum names
export const STATUS_COLOUR_MAP: Record<number, string> = {
  [BusStatus.NUMBER_1]: '--arrived',
  [BusStatus.NUMBER_2]: '--delayed',
  [BusStatus.NUMBER_3]: '--on-time',
  [BusStatus.NUMBER_4]: '--cancelled'
};
