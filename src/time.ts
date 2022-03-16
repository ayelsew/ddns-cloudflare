const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

export default function time(strTime: string) {
  const multiplier = Number(strTime.replace(/[a-z]/i, ''));

  if (Number.isNaN(multiplier))
    throw new Error(`time: the time passed is not valid. Try to use 's' (second) 'm' (minute) until w (week).`);

  if (/s$/.test(strTime))
    return SECOND * multiplier;

  if (/m$/.test(strTime))
    return MINUTE * multiplier;

  if (/h$/.test(strTime))
    return HOUR * multiplier;

  if (/d$/.test(strTime))
    return DAY * multiplier;

  if (/w$/.test(strTime))
    return WEEK * multiplier;

  if (Number.isNaN(multiplier))
    throw new Error(`time: Try to use 's' (second), 'm' (minute), 'h' (hour), 'd' (day) and w (week).`);
}