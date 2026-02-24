import type { LocativeElement } from "./locative-element";

export type PublicServiceDomain =
  | "health"
  | "education"
  | "social_assistance"
  | "security"
  | "citizen_service"
  | "shelter"
  | "other";

export interface PublicService extends LocativeElement {
  element_type: "public_service";

  public_service_domain: PublicServiceDomain;

  service_catalog?: string[];

  opening_hours?: any;

  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };

  queue_or_appointment?: {
    scheduling_url?: string;
    average_wait?: number;
  };
}