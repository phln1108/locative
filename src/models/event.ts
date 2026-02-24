import type { LocativeElement } from "./locative-element";

export type EventKind =
  | "fair"
  | "festival"
  | "show"
  | "vaccination_campaign"
  | "workshop"
  | "public_meeting"
  | "parade"
  | "other";

export interface SituatedEvent extends LocativeElement {
  element_type: "situated_event";

  event_kind: EventKind;

  start_datetime: string;
  end_datetime: string;

  organizer?: string;

  recurrence_rule?: string;

  ticketing?: {
    free?: boolean;
    price_range?: string;
    ticket_url?: string;
  };

  capacity?: number;
}