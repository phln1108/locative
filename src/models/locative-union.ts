import type { PublicPlace } from "./public-place";
import type { Infrastructure } from "./infrastructure";
import type { PublicService } from "./public-service";
import type { SituatedEvent } from "./event";
import type { SymbolicHeritage } from "./heritage";
import type { CommercialPOI } from "./poi";
import type { PublicTransport } from "./transport";
import type { NaturalElement } from "./natural";
import type { MobileElement } from "./mobile";
import type { ReligiousSpiritual } from "./religious";

export type LocativeUnion =
  | PublicPlace
  | Infrastructure
  | PublicService
  | SituatedEvent
  | SymbolicHeritage
  | CommercialPOI
  | PublicTransport
  | NaturalElement
  | MobileElement
  | ReligiousSpiritual;