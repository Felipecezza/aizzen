import type { Tables } from "./tables";
import type { Functions } from "./functions";
import type { Json } from "./shared";

export interface Database {
  public: {
    Tables: Tables;
    Functions: Functions;
    Enums: {
      integration_type: "facebook_ads" | "tiktok_ads" | "chatwoot";
    };
  };
}

export type { Tables, Functions, Json };
export * from "./tables";
export * from "./functions";
export * from "./shared";