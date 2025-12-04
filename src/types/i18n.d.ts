import type { LocalType } from "@/locales/index";

declare module "vue" {
  interface ComponentCustomProperties {
    $t: (message: ExtractObjectPath<LocalType>) => string;
  }
}
