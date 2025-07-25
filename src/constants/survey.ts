export const SurveyPeriod = {
  /**
   * 설문 일정을 '바로 시작'으로 설정했음을 의미
   */
  START: "START",

  /**
   * 설문 마감일을 '제한 없음'으로 설정했음을 의미
   */
  UNLIMITED: "UNLIMITED",

  /**
   * 설문 시작일과 마감일을 직접 지정했음을 의미
   */
  CUSTOM: "CUSTOM",
} as const;

export type SurveyPeriodType = (typeof SurveyPeriod)[keyof typeof SurveyPeriod];
