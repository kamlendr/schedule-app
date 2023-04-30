import dayjs from "dayjs"

export const groupByDate = (acc, val) => {
  const key = dayjs(val.meetingDate).format('YYYY-MM-DD');
  const group = acc[key] ?? [];
  return { ...acc, [key]: [...group, val] };
};