import { Event } from '@/types';
import { generateRecurringEvents } from '@/utils/generateRecurringEvents';

describe('generateRecurringEvents', () => {
  it('반복 설정이 유효하지 않으면 원본 이벤트만 반환해야 한다', () => {
    const event: Event = {
      id: 'event-single',
      title: '단일 일정',
      date: '2025-05-01',
      startTime: '13:00',
      endTime: '14:00',
      description: '회의',
      location: '회의실',
      category: '업무',
      repeat: { type: 'daily', interval: 0 },
      notificationTime: 10,
    };

    const result = generateRecurringEvents(event);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(event);
  });

  it('반복 설정에 종료 날짜가 없으면 오류가 발생해야 한다', () => {
    const event: Event = {
      id: 'event-123',
      title: '기존 일정',
      date: '2025-05-01',
      startTime: '13:00',
      endTime: '14:00',
      description: 'CoreTech Weekly Standup',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    };

    expect(() => generateRecurringEvents(event)).toThrow('반복 설정에는 종료 날짜가 필요합니다.');
  });

  it('종료 날짜가 시작 날짜보다 이전이면 오류가 발생해야 한다', () => {
    const event: Event = {
      id: 'event-123',
      title: '기존 일정',
      date: '2025-05-01',
      startTime: '13:00',
      endTime: '14:00',
      description: 'CoreTech Weekly Standup',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'daily', interval: 1, endDate: '2024-11-08' },
      notificationTime: 10,
    };

    expect(() => generateRecurringEvents(event)).toThrow(
      '종료 날짜는 시작 날짜보다 이후여야 합니다.'
    );
  });

  it('반복 날짜가 1일마다 반복되어야 하고, 시작 날짜와 종료 날짜를 모두 포함해야 한다', () => {
    const event: Event = {
      id: 'event-daily',
      title: '기존 일정',
      date: '2025-05-01',
      startTime: '13:00',
      endTime: '14:00',
      description: 'CoreTech Weekly Standup',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'daily', interval: 1, endDate: '2025-05-05' },
      notificationTime: 10,
    };

    const result = generateRecurringEvents(event);
    const resultDates = result.map((e) => e.date);

    expect(resultDates).toEqual([
      '2025-05-01',
      '2025-05-02',
      '2025-05-03',
      '2025-05-04',
      '2025-05-05',
    ]);
  });

  it('반복 날짜가 2일마다 반복되어야 하고, 종료 날짜를 초과하지 않는 범위 내에서 반복되어야 한다', () => {
    const event: Event = {
      id: 'event-daily-2',
      title: '기존 일정',
      date: '2025-05-01',
      startTime: '13:00',
      endTime: '14:00',
      description: 'CoreTech Weekly Standup',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'daily', interval: 2, endDate: '2025-05-10' },
      notificationTime: 10,
    };

    const result = generateRecurringEvents(event);
    const resultDates = result.map((e) => e.date);

    expect(resultDates).toEqual([
      '2025-05-01',
      '2025-05-03',
      '2025-05-05',
      '2025-05-07',
      '2025-05-09',
    ]);
  });

  it('반복 날짜가 1주마다 반복되어야 하고, 시작 날짜와 종료 날짜를 모두 포함해야 한다', () => {
    const event: Event = {
      id: 'event-weekly',
      title: '주간 회의',
      date: '2025-04-01',
      startTime: '13:00',
      endTime: '14:00',
      description: 'CoreTech Weekly Standup',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'weekly', interval: 1, endDate: '2025-04-29' },
      notificationTime: 10,
    };

    const result = generateRecurringEvents(event);
    const resultDates = result.map((e) => e.date);

    expect(resultDates).toEqual([
      '2025-04-01',
      '2025-04-08',
      '2025-04-15',
      '2025-04-22',
      '2025-04-29',
    ]);
  });

  it('반복 날짜가 2주마다 반복되어야 하고, 종료 날짜를 초과하지 않는 범위 내에서 반복되어야 한다', () => {
    const event: Event = {
      id: 'event-biweekly',
      title: '격주 회의',
      date: '2025-04-01',
      startTime: '13:00',
      endTime: '14:00',
      description: 'CoreTech Biweekly Standup',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'weekly', interval: 2, endDate: '2025-05-15' },
      notificationTime: 10,
    };

    const result = generateRecurringEvents(event);
    const resultDates = result.map((e) => e.date);

    expect(resultDates).toEqual(['2025-04-01', '2025-04-15', '2025-04-29', '2025-05-13']);
  });

  // 테스트 8: 월별 반복(1개월 간격)
  it('반복 날짜가 1개월마다 반복되어야 하고, 시작 날짜와 종료 날짜를 모두 포함해야 한다', () => {
    const event: Event = {
      id: 'event-monthly',
      title: '월간 보고',
      date: '2025-05-01',
      startTime: '13:00',
      endTime: '14:00',
      description: '월간 보고 회의',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-08-01' },
      notificationTime: 10,
    };

    const result = generateRecurringEvents(event);
    const resultDates = result.map((e) => e.date);

    expect(resultDates).toEqual(['2025-05-01', '2025-06-01', '2025-07-01', '2025-08-01']);
  });

  // 테스트 9: 월별 반복(3개월 간격)
  it('반복 날짜가 3개월마다 반복되어야 하고, 종료 날짜를 초과하지 않는 범위 내에서 반복되어야 한다', () => {
    const event: Event = {
      id: 'event-quarterly',
      title: '분기 보고',
      date: '2025-05-01',
      startTime: '13:00',
      endTime: '14:00',
      description: '분기 보고 회의',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'monthly', interval: 3, endDate: '2026-05-01' },
      notificationTime: 10,
    };

    const result = generateRecurringEvents(event);
    const resultDates = result.map((e) => e.date);

    expect(resultDates).toEqual([
      '2025-05-01',
      '2025-08-01',
      '2025-11-01',
      '2026-02-01',
      '2026-05-01',
    ]);
  });

  // 테스트 10: 연별 반복(1년 간격)
  it('반복 날짜가 1년마다 반복되어야 하고, 시작 날짜와 종료 날짜를 모두 포함해야 한다', () => {
    const event: Event = {
      id: 'event-yearly',
      title: '연간 회의',
      date: '2025-05-01',
      startTime: '13:00',
      endTime: '14:00',
      description: '연간 계획 회의',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'yearly', interval: 1, endDate: '2027-05-01' },
      notificationTime: 10,
    };

    const result = generateRecurringEvents(event);
    const resultDates = result.map((e) => e.date);

    expect(resultDates).toEqual(['2025-05-01', '2026-05-01', '2027-05-01']);
  });

  // 테스트 11: 최대 반복 횟수 지정
  it('사용자가 지정한 특정 횟수만큼 일정이 반복되어야 한다', () => {
    const event: Event = {
      id: 'event-max-occurrences',
      title: '주간 회의',
      date: '2025-04-01',
      startTime: '13:00',
      endTime: '14:00',
      description: 'CoreTech Weekly Standup',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' }, // 긴 종료일 설정
      notificationTime: 10,
    };

    const maxOccurrences = 4;
    const result = generateRecurringEvents(event, maxOccurrences);
    const resultDates = result.map((e) => e.date);

    expect(resultDates).toEqual(['2025-04-01', '2025-04-08', '2025-04-15', '2025-04-22']);
  });

  // 테스트 12: 종료 날짜가 딱 맞는 경우
  it('종료 날짜가 정확히 다음 반복일과 일치하는 경우 해당 날짜까지 포함되어야 한다', () => {
    const event: Event = {
      id: 'event-exact-end',
      title: '주간 회의',
      date: '2025-04-01',
      startTime: '13:00',
      endTime: '14:00',
      description: 'CoreTech Weekly Standup',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'weekly', interval: 1, endDate: '2025-04-22' }, // 마지막 반복일과 정확히 일치
      notificationTime: 10,
    };

    const result = generateRecurringEvents(event);
    const resultDates = result.map((e) => e.date);

    expect(resultDates).toEqual(['2025-04-01', '2025-04-08', '2025-04-15', '2025-04-22']);
  });

  it('윤년을 정확하게 처리해야 한다', () => {
    const event: Event = {
      id: 'event-leap-year',
      title: '특별 회의',
      date: '2024-02-28',
      startTime: '13:00',
      endTime: '14:00',
      description: '특별 회의',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'daily', interval: 1, endDate: '2024-03-01' },
      notificationTime: 10,
    };

    const result = generateRecurringEvents(event);
    const resultDates = result.map((e) => e.date);

    expect(resultDates).toEqual([
      '2024-02-28',
      '2024-02-29', // 윤년 날짜 포함
      '2024-03-01',
    ]);
  });

  it('월말 날짜를 정확하게 처리해야 한다', () => {
    const event: Event = {
      id: 'event-month-end',
      title: '월말 보고',
      date: '2025-01-31',
      startTime: '13:00',
      endTime: '14:00',
      description: '월말 보고',
      location: 'CoreTech 회의실',
      category: '업무',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-04-30' },
      notificationTime: 10,
    };

    const result = generateRecurringEvents(event);
    const resultDates = result.map((e) => e.date);

    expect(resultDates).toEqual(['2025-01-31', '2025-02-28', '2025-03-31', '2025-04-30']);
  });
});
