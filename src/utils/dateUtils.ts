import { parse } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * Date 객체를 'YYYY. MM. DD.' 형식의 string 타입으로 변환.
 * @param date - 포맷 대상 Date 객체
 * @returns 'YYYY. MM. DD.' 형식의 날짜 문자열 (ex. 2025. 07. 24.)
 */
export const formatDate = (date: Date | string | undefined): string => {
  if (!date || date === "") return "";

  let dateObj;
  if (typeof date === "string") dateObj = new Date(date);
  else dateObj = date;

  return dateObj.toLocaleDateString("kr-KO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * Date 객체를 'HH:MM:SS' (24시간) 형식의 string 타입으로 변환.
 * @param date - 포맷 대상 Date 객체
 * @returns 'HH:MM' 형식의 시간 문자열 (ex. 04:30)
 */
export const formatTime = (date: Date | string | undefined): string => {
  if (!date || date === "") return "";

  let dateObj;
  if (typeof date === "string") dateObj = new Date(date);
  else dateObj = date;

  return dateObj.toLocaleTimeString("kr-KO", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });
};
export const isOngoing = (endTime: Date | undefined): boolean => {
  if (!endTime) return true;
  const end = new Date(endTime); // 문자열인 경우도 포함
  return end.getTime() > Date.now();
};
/**
 * 'yyyy. MM. dd.' 형식의 날짜 문자열과 'aaaa hh:mm' 형식의 시간 문자열을 하나의 표준 Date 객체로 변환.
 * @param dateStr - 날짜 문자열 (예: '2025. 07. 25.')
 * @param timeStr - 시간 문자열 (예: '오후 02:30')
 * @returns {Date} 변환된 Date 객체
 */
export const parseDateTime = (dateStr: string, timeStr: string): Date => {
  const combinedStr = `${dateStr} ${timeStr}`;
  const formatPattern = "yyyy. MM. dd. aaaa hh:mm"; // aaaa: 오전/오후

  const dateObject = parse(
    combinedStr,
    formatPattern,
    new Date(), // 파싱 기준 날짜.
    { locale: ko } // '오후' 같은 한국어 표기 인식을 위한 로케일 설정.
  );

  return dateObject;
};
