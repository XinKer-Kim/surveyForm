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
