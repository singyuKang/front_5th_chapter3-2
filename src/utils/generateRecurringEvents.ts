/* eslint-disable no-case-declarations */
import { Event, RepeatType } from '@/types';

export function generateRecurringEvents(event: Event, maxOccurrences?: number): Event[] {
  if (!event.repeat || !event.repeat.type || !event.repeat.interval) {
    return [event];
  }

  const { type, interval, endDate } = event.repeat;
  const startDate = new Date(event.date);

  if (!endDate) {
    throw new Error('반복 설정에는 종료 날짜가 필요합니다.');
  }

  const endDateObj = new Date(endDate);

  if (endDateObj < startDate) {
    throw new Error('종료 날짜는 시작 날짜보다 이후여야 합니다.');
  }

  const events: Event[] = [];
  let currentDate = new Date(startDate);
  let count = 0;

  while (currentDate <= endDateObj && (!maxOccurrences || count < maxOccurrences)) {
    const newEvent: Event = {
      ...JSON.parse(JSON.stringify(event)),
      date: formatDate(currentDate),
      id: `${event.id}_${count}`,
    };

    events.push(newEvent);
    count++;

    currentDate = getNextDate(currentDate, type, interval);
  }

  return events;
}

function getNextDate(date: Date, type: RepeatType, interval: number): Date {
  const nextDate = new Date(date);

  switch (type) {
    case 'daily':
      nextDate.setDate(date.getDate() + interval);
      break;
    case 'weekly':
      nextDate.setDate(date.getDate() + 7 * interval);
      break;
    case 'monthly':
      // 월말 날짜 처리
      const originalDay = date.getDate();

      // 원래 날짜가 해당 월의 마지막 날이었는지 확인
      const originalMonthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const wasLastDay = originalDay === originalMonthLastDay;

      // 다음 월 계산
      const newYear = date.getFullYear() + Math.floor((date.getMonth() + interval) / 12);
      const newMonth = (date.getMonth() + interval) % 12;

      if (wasLastDay) {
        nextDate.setFullYear(newYear, newMonth + 1, 0);
      } else {
        const lastDayOfNewMonth = new Date(newYear, newMonth + 1, 0).getDate();
        const targetDay = Math.min(originalDay, lastDayOfNewMonth);
        nextDate.setFullYear(newYear, newMonth, targetDay);
      }
      break;
    case 'yearly':
      nextDate.setFullYear(date.getFullYear() + interval);
      break;
  }

  return nextDate;
}
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
