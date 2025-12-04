import { createI18n } from "vue-i18n";
import zhCN from "@/locales/zh-CN.json";
import enUS from "@/locales/en-US.json";

const messages: any = {
  "zh-CN": zhCN,
  "en-US": enUS,
};

// 精确获取浏览器语言
const browserLanguage = navigator.language;

// 设置默认语言
const defaultLanguage = messages[browserLanguage] ? browserLanguage : "en-US";

const i18n = createI18n({
  legacy: false,
  locale: defaultLanguage,
  fallbackLocale: "zh-CN",
  messages,
});

export const $t: (key: string, ...args: any[]) => string = i18n.global.t;

export default i18n;
