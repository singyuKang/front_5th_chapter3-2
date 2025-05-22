import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

import { test, expect } from '@playwright/test';

let serverProcess;
let clientProcess;

async function waitForServer(url, timeout = 30000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.log('서버 준비 에러');
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`서버 타임아웃`);
}

async function clearRealEventsData() {
  const filePath = path.join(process.cwd(), 'src/__mocks__/response/realEvents.json');
  try {
    const data = { events: [] };
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log('realEvents.json 초기화 완료');
  } catch (error) {
    console.error('파일 초기화 실패:', error);
  }
}

test.describe.serial('통합 테스트', () => {
  test.beforeAll(async () => {
    await clearRealEventsData();

    // 먼저 서버를 실행하도록 함
    serverProcess = exec('npx nodemon server.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Server error: ${error.message}`);
      }
      if (stderr) {
        console.error(`Server stderr: ${stderr}`);
      }
      console.log(`Server stdout: ${stdout}`);
    });

    // 그 다음 클라이언트를 실행하도록 함
    clientProcess = exec('pnpm dev', (error, stdout, stderr) => {
      if (error) {
        console.error(`Client error: ${error.message}`);
      }
      if (stderr) {
        console.error(`Client stderr: ${stderr}`);
      }
      console.log(`Client stdout: ${stdout}`);
    });

    // 클라이언트가 준비될 때까지 대기
    await waitForServer('http://localhost:5173');
  });

  test.describe('반복 일정 등록', () => {
    test('1. 반복 유형을 매일로 선택하면, 매일 반복되는 일정이 생성되어야한다.', async ({
      page,
    }) => {
      await clearRealEventsData();
      await page.goto('http://localhost:5173/');
      await page.reload();

      //반복일정 등록 useEventForm
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('반복일정 테스트');
      await page.getByLabel('날짜').fill('2025-05-01');
      await page.getByRole('textbox', { name: '시작 시간' }).click();
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).click();
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('반복일정 테스트 하기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('서울');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.getByText('반복 일정').click();
      await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-05-10');

      await page.getByTestId('event-submit-button').click();

      await expect(page.getByTestId('event-list').getByText('🔁반복일정 테스트')).toHaveCount(10);

      const dates = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

      //정확한 날짜 테스트
      for (const day of dates) {
        await expect(
          page
            .getByTestId('event-list')
            .locator('div')
            .filter({ hasText: `🔁반복일정 테스트2025-05-${day}` })
            .first()
        ).toBeVisible();
      }
    });

    test('2. 반복 유형을 매주로 선택하면, 매주 반복되는 일정이 생성되어야한다.', async ({
      page,
    }) => {
      await clearRealEventsData();
      await page.goto('http://localhost:5173/');
      await page.reload();

      //반복일정 등록 useEventForm
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('반복일정 테스트');
      await page.getByLabel('날짜').fill('2025-05-01');
      await page.getByRole('textbox', { name: '시작 시간' }).click();
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).click();
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('반복일정 테스트 하기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('서울');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.getByText('반복 일정').click();
      await page.getByLabel('반복 유형').selectOption('weekly');
      await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-06-01');

      await page.getByTestId('event-submit-button').click();

      //정확한 날짜 테스트
      const expectedDates = ['01', '08', '15', '22', '29'];

      for (const day of expectedDates) {
        await expect(
          page
            .getByTestId('event-list')
            .locator('div')
            .filter({ hasText: `🔁반복일정 테스트2025-05-${day}` })
            .first()
        ).toBeVisible();
      }
    });

    test('3. 반복 유형을 매월로 선택하면, 매월 반복되는 일정이 생성되어야한다.', async ({
      page,
    }) => {
      await clearRealEventsData();

      await page.goto('http://localhost:5173/');
      await page.reload();

      //반복일정 등록 useEventForm
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('반복일정 테스트');
      await page.getByLabel('날짜').fill('2025-05-01');
      await page.getByRole('textbox', { name: '시작 시간' }).click();
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).click();
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('반복일정 테스트 하기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('서울');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.getByText('반복 일정').click();
      await page.getByLabel('반복 유형').selectOption('monthly');
      await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-07-01');

      await page.getByTestId('event-submit-button').click();

      //정확한 날짜 테스트
      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: `🔁반복일정 테스트2025-05-01` })
          .first()
      ).toBeVisible();

      await page.getByRole('button', { name: 'Next' }).click();
      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: `🔁반복일정 테스트2025-06-01` })
          .first()
      ).toBeVisible();

      await page.getByRole('button', { name: 'Next' }).click();
      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: `🔁반복일정 테스트2025-07-01` })
          .first()
      ).toBeVisible();
    });

    test('4. 반복 유형을 매년로 선택하면, 매년 반복되는 일정이 생성되어야한다.', async ({
      page,
    }) => {
      await clearRealEventsData();
      await page.goto('http://localhost:5173/');
      await page.reload();

      //반복일정 등록 useEventForm
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('반복일정 테스트');
      await page.getByLabel('날짜').fill('2025-05-01');
      await page.getByRole('textbox', { name: '시작 시간' }).click();
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).click();
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('반복일정 테스트 하기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('서울');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.getByText('반복 일정').click();
      await page.getByLabel('반복 유형').selectOption('yearly');
      await page.getByRole('textbox', { name: '반복 종료일' }).fill('2027-05-01');

      await page.getByTestId('event-submit-button').click();

      //정확한 날짜 테스트
      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: `🔁반복일정 테스트2025-05-01` })
          .first()
      ).toBeVisible();

      //1년 이동
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: `🔁반복일정 테스트2026-05-01` })
          .first()
      ).toBeVisible();

      //1년 이동
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: `🔁반복일정 테스트2027-05-01` })
          .first()
      ).toBeVisible();
    });

    test('5. 종료 횟수를 2로 설정하면 2개의 일정만 생성되어야 한다.', async ({ page }) => {
      await clearRealEventsData();
      await page.goto('http://localhost:5173/');
      await page.reload();

      // 반복일정 등록
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('종료 횟수 테스트');
      await page.getByLabel('날짜').fill('2025-05-01');
      await page.getByRole('textbox', { name: '시작 시간' }).click();
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).click();
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('종료 횟수 2회로 제한');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('서울');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.getByText('반복 일정').click();
      await page.getByLabel('반복 유형').selectOption('daily');

      await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-05-15');

      await page.getByRole('spinbutton', { name: '종료 횟수' }).fill('2');

      await page.getByTestId('event-submit-button').click();

      await expect(page.getByTestId('event-list').getByText('🔁종료 횟수 테스트')).toHaveCount(2);

      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: '🔁종료 횟수 테스트2025-05-01' })
          .first()
      ).toBeVisible();

      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: '🔁종료 횟수 테스트2025-05-02' })
          .first()
      ).toBeVisible();

      // 2025-05-03은 존재하지 않아야 함
      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: '🔁종료 횟수 테스트2025-05-03' })
      ).toHaveCount(0);

      console.log('✅ 종료 횟수 2개로 정확히 제한됨');
    });

    test('6. 종료 횟수를 5로 설정하면 5개의 일정만 생성되어야 한다.', async ({ page }) => {
      await clearRealEventsData();

      await page.goto('http://localhost:5173/');
      await page.reload();

      // 반복일정 등록
      await page.getByLabel('제목').fill('종료 횟수 5회 테스트');
      await page.getByLabel('날짜').fill('2025-05-01');
      await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
      await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
      await page.getByLabel('설명').fill('5회만 반복되는 일정');
      await page.getByLabel('위치').fill('회의실');
      await page.getByLabel('카테고리').selectOption('업무');
      await page.getByText('반복 일정').click();
      await page.getByLabel('반복 유형').selectOption('daily');

      // 종료일을 넉넉히 설정 (한 달 후)
      await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-06-01');

      // 종료 횟수를 5로 설정
      await page.getByRole('spinbutton', { name: '종료 횟수' }).fill('5');

      await page.getByTestId('event-submit-button').click();

      // 총 5개의 일정만 생성되었는지 확인
      await expect(page.getByTestId('event-list').getByText('🔁종료 횟수 5회 테스트')).toHaveCount(
        5
      );

      // 정확한 날짜들 확인 (2025-05-01 ~ 2025-05-05)
      const expectedDates = ['01', '02', '03', '04', '05'];
      for (const day of expectedDates) {
        await expect(
          page
            .getByTestId('event-list')
            .locator('div')
            .filter({ hasText: `🔁종료 횟수 5회 테스트2025-05-${day}` })
            .first()
        ).toBeVisible();
      }

      // 6번째 일정(2025-05-06)은 존재하지 않아야 함
      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: '🔁종료 횟수 5회 테스트2025-05-06' })
      ).toHaveCount(0);

      console.log('✅ 종료 횟수 5개로 정확히 제한됨');
    });

    test('7. 주간 반복에서 종료 횟수를 3으로 설정하면 3주간만 생성되어야 한다.', async ({
      page,
    }) => {
      await clearRealEventsData();
      await page.goto('http://localhost:5173/');
      await page.reload();

      // 주간 반복일정 등록
      await page.getByLabel('제목').fill('주간 종료 횟수 테스트');
      await page.getByLabel('날짜').fill('2025-05-01'); // 목요일
      await page.getByRole('textbox', { name: '시작 시간' }).fill('14:00');
      await page.getByRole('textbox', { name: '종료 시간' }).fill('15:00');
      await page.getByLabel('설명').fill('3주간만 반복되는 일정');
      await page.getByLabel('위치').fill('카페');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.getByText('반복 일정').click();
      await page.getByLabel('반복 유형').selectOption('weekly');

      // 종료일을 넉넉히 설정
      await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-06-30');

      // 종료 횟수를 3으로 설정
      await page.getByRole('spinbutton', { name: '종료 횟수' }).fill('3');

      await page.getByTestId('event-submit-button').click();

      // 총 3개의 일정만 생성되었는지 확인
      await expect(page.getByTestId('event-list').getByText('🔁주간 종료 횟수 테스트')).toHaveCount(
        3
      );

      // 3주간의 목요일 확인 (05/01, 05/08, 05/15)
      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: '🔁주간 종료 횟수 테스트2025-05-01' })
          .first()
      ).toBeVisible();

      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: '🔁주간 종료 횟수 테스트2025-05-08' })
          .first()
      ).toBeVisible();

      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: '🔁주간 종료 횟수 테스트2025-05-15' })
          .first()
      ).toBeVisible();

      // 4번째 주(2025-05-22)는 존재하지 않아야 함
      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: '🔁주간 종료 횟수 테스트2025-05-22' })
      ).toHaveCount(0);

      console.log('✅ 주간 반복 종료 횟수 3개로 정확히 제한됨');
    });
  });

  test.describe('반복일정 삭제', () => {
    test('1. 반복 일정 중 특정 하루의 일정을 삭제하면 단일 일정만 삭제된다.', async ({ page }) => {
      await clearRealEventsData();

      await page.goto('http://localhost:5173/');
      await page.reload();

      //반복일정 등록 useEventForm
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('반복일정 테스트');
      await page.getByLabel('날짜').fill('2025-05-01');
      await page.getByRole('textbox', { name: '시작 시간' }).click();
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).click();
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('반복일정 테스트 하기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('서울');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.getByText('반복 일정').click();
      await page.getByLabel('반복 유형').selectOption('daily');
      await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-05-10');

      await page.getByTestId('event-submit-button').click();

      await page.locator('button:nth-child(2)').first().click();

      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: `🔁반복일정 테스트2025-05-01` })
      ).not.toBeVisible();
    });
  });

  test.describe('반복일정 수정', () => {
    test('1. 반복 일정을 수정하면은 일반 일정으로 변경된다.', async ({ page }) => {
      await clearRealEventsData();

      await page.goto('http://localhost:5173/');
      await page.reload();

      //반복일정 등록 useEventForm
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('반복일정 테스트');
      await page.getByLabel('날짜').fill('2025-05-01');
      await page.getByRole('textbox', { name: '시작 시간' }).click();
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '시작 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).click();
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowRight');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByRole('textbox', { name: '종료 시간' }).press('ArrowUp');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('반복일정 테스트 하기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('서울');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.getByText('반복 일정').click();
      await page.getByLabel('반복 유형').selectOption('daily');
      await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-05-10');

      await page.getByTestId('event-submit-button').click();

      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: `🔁반복일정 테스트2025-05-01` })
          .first()
      ).toBeVisible();

      await page.locator('span').first().click();
      await page.getByRole('button', { name: 'Edit event' }).first().click();
      await page.getByTestId('event-submit-button').click();

      await expect(
        page
          .getByTestId('event-list')
          .locator('div')
          .filter({ hasText: `🔁반복일정 테스트2025-05-01` })
      ).toHaveCount(0);
    });
  });

  test.afterAll(() => {
    // 프로세스 종료
    if (serverProcess) {
      serverProcess.kill();
    }
    if (clientProcess) {
      clientProcess.kill();
    }
  });
});
