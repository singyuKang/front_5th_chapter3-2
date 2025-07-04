# 8주차 과제 체크포인트

## 기본 과제

### 필수

- [x] 반복 유형 선택
  - 일정 생성 또는 수정 시 반복 유형을 선택할 수 있다.
  - 반복 유형은 다음과 같다: 매일, 매주, 매월, 매년
    - 만약, 윤년 29일에 또는 31일에 매월 또는 매년 반복일정을 설정한다면 어떻게 처리할까요? 다른 서비스를 참고해보시고 자유롭게 작성해보세요.
- [x] 반복 간격 설정
  - 각 반복 유형에 대해 간격을 설정할 수 있다.
  - 예: 2일마다, 3주마다, 2개월마다 등
- [x] 반복 일정 표시
  - 캘린더 뷰에서 반복 일정을 시각적으로 구분하여 표시한다.
    - 아이콘을 넣든 태그를 넣든 자유롭게 해보세요!
- [x] 반복 종료
  - 반복 종료 조건을 지정할 수 있다.
  - 옵션: 특정 날짜까지, 특정 횟수만큼, 또는 종료 없음 (예제 특성상, 2025-06-30까지)
- [x] 반복 일정 단일 수정
  - 반복일정을 수정하면 단일 일정으로 변경됩니다.
  - 반복일정 아이콘도 사라집니다.
- [x] 반복 일정 단일 삭제
  - 반복일정을 삭제하면 해당 일정만 삭제합니다.

### 선택

- [ ] 예외 날짜 처리:
  - 반복 일정 중 특정 날짜를 제외할 수 있다.
  - 반복 일정 중 특정 날짜의 일정을 수정할 수 있다.
- [ ] 요일 지정 (주간 반복의 경우):
  - 주간 반복 시 특정 요일을 선택할 수 있다.
- [ ] 월간 반복 옵션:
  - 매월 특정 날짜에 반복되도록 설정할 수 있다.
  - 매월 특정 순서의 요일에 반복되도록 설정할 수 있다.
- [ ] 반복 일정 전체 수정 및 삭제
  - 반복 일정의 모든 일정을 수정할 수 있다.
  - 반복 일정의 모든 일정을 삭제할 수 있다.

## 심화 과제

- [x] 이 앱에 적합한 테스트 전략을 만들었나요?

### 각 팀원들의 테스트 전략은?

<details>
<summary>한민구</summary>

순수함수로 뺄 수 있는 것은 최대 한 빼서 유닛 테스트를 하고, 이후 각각의 연계를 생각하면서 훅을 구현 및 테스트를 진행하여야 통합테스트나 e2e에서 내 코드를 신뢰하며 더 큰 단위의 구현 및 테스트를 할 수 있을 것 같다 생각했습니다. 한번에 머리에 넣고 코드를 작성할 수 있는 한계가 있고, 상황을 캐치 할 수 없기 때문입니다.

따라서 작은 단위부터 단단하게, 그리고 점차 큰 단위로 확장해 나가며 진행하는 전략이 필요하다 생각합니다.

</details>

<details>
<summary>전민희</summary>

개인적으로 테스트 전략은 맨 처음에 테스트 종류별로 비율을 생각해서 배치하는 것은 너무 이상적인 경우가 아닌가 생각합니다.
기능이 많지 않은 프로젝트의 경우 E2E나 통합 테스트에 테스트 케이스를 추가하기가 어렵다는 생각이 들었어요.
그리고 현재 과제처럼 TDD로 개발한다면 자연스레 단위 테스트의 비중이 높은 상태일 거란 생각이 듭니다.
저는 오작동하면 사용자 경험이 망가져 일정 CRUD 기능을 핵심 기능이라고 생각을 했습니다.
따라서 이 CRUD 기능을 E2E로 실제 사용자 플로우에 맞춰 act 최소 2개 이상을 다루는 시나리오로 최소한으로만 작성하고(운영 비용이나 러닝 타임 비용 등을 고려하여..),  상태 변경 및 렌더링 검증이 필요한 디테일한 기능은 비교적 비용이 적게 드는 통합 테스트에서 검증해보는 게 맞다고 생각했습니다.
(각 함수의 기능은 TDD를 하며 단위 테스트에서 자연스레 검증을 함. 아마 비율이 가장 높지 않을까?)

</details>

<details>
<summary>이지환</summary>

- 현재 테스트 요구조건이 반복일정 기능에 대한 테스트 코드 작성이므로 그 기능 중심으로 테스트코드를 어떻게 짤지 고민해 봄
- 요구조건에 맞게 **기능별 테스트 그룹화 (Describe 블록 구성) 를 했음**
- 그리고 테스트 시나리오 설계를 하였음
   - 정상적인 테스트 먼저 진행
   - Edge Case 테스트: 윤년, 월말일 등 특수한 경우
   - 에러 케이스 테스트: 잘못된 입력값 처리
- 테스트 구조화 전략 (**Given-When-Then 패턴) 으로 테스트코드 작성함**

- 통합테스트 위주로 짠 이유
   - 반복 일정 기능은 여러 컴포넌트와 로직이 복잡하게 얽혀있었음
   - useEventOperations 훅은 이벤트 상태 관리, API 호출, 에러 처리 등을 통합적으로 처리함
       - 단위 테스트로는 이러한 복잡한 상호작용을 효과적으로 검증하기 어렵다고 판단.
   - Mock API를 통해 실제 서비스와 유사한 환경에서 테스트가 가능함
   - 데이터 흐름과 상태 변화를 실제와 가깝게 검증할 수 있음
   - 단위 테스트를 작성하면 내부 구현이 변경될 때마다 테스트를 수정해야 함
   - 통합 테스트는 내부 구현이 변경되어도 최종 결과만 일치하면 테스트가 통과

</details>

<details>
<summary>홍성우</summary>

유틸함수의 범용성이 너무 크기 때문에 유닛 테스트만 잘 짜놓으면 다른 테스트는 크게 중요하지 않을것 같다고 생각해서 일단 유닛 테스트에 집중했습니다.

- 필수 요구사항에 따른 기본 로직 구현
- 베이스가 되는 eventData를 명세에 따른 방식으로 변환되는 로직 구현이 잘 되었는지 확인
- 케이스별 예외처리 적용이 잘 되는지 여부 확인

통합 테스트는 명세의 내용중 보이는 것에 집중해서 작성했습니다.

- 유틸함수를 통해 만들어진 데이터를 화면에 잘 보여주는지 확인
   - 반복일정에 대한 표시 확인
   - 삭제가 됐을 경우 삭제된 데이터만 화면에 안나오는지 확인
   - 수정도 단일건으로 수정이 잘 되어서 화면에 나오는지 확인

</details>

<details>
<summary>강신규</summary>

- 최종목적은 반복 일정을 설정하여 달력에 알맞은 형태로 뿌려주는것
- 사용자의 흐름을 따라가려고 함
- 반복 일정 클릭 → useEventForm 값 확인 체크
- 반복 유형 선택 → useEventForm 매일, 매주, 매월, 매년 체크
- 반복 간격 + 반복 종료일 선택 → useEventForm 반복 간격, 반복 종료일 체크
- 일정 추가 클릭
- startDate부터 endDate까지 반복 간격에 맞춰서 반복일정을 뿌려준다
   - Month View
       - 해당하는 달의 반복일정 체크
   - Week View
       - 해당하는 주의 반복일정 체크

등등 하위로 쪼개다 보면은 하나의 함수에서 처리가 가능해지면은 단위 테스트

두개 이상의 함수가 교류하면은 통합테스트

이번 과제같은 경우에는 처음과 끝이 굉장히 짧기 때문에 종합테스트 + e2e를 한파일에 동시에 진행해도 되겠다 판단하였습니다

</details>

<details>
<summary>표승훈</summary>

과제할 시간이 부족하여.. 필수요구사항대로 구현을 먼저하게되었습니다. TDD작성을 기본으로 과제를해야하였지만.. 우선 코드분석후 긴으구현에 급급하여 기능 구현이후 간단한 단위 테스트만진행하였습니다.

</details>

<details>
<summary>최서은</summary>

이번 프로젝트의 핵심은 **반복 일정 기능이 옵션에 따라 정확히 생성되고, 화면에 올바르게 렌더링되는지** 확인하는 것이었습니다. 이를 위해 테스트 목적에 따라 다음과 같이 구분하여 작성했습니다:

### 🔹 단위 테스트

- 반복 일정 계산 로직, 종료 조건 처리, 윤년 등
- **입력 → 결과가 명확한 유틸 함수** 위주
- 계산이 핵심인 로직은 이 단계에서 정확히 검증

### 🔹 통합 테스트

- 일정 등록 → 상태 업데이트 → 렌더링 흐름 검증
- 반복 일정 생성 시 아이콘 표시, 뷰 전환 시 일정 유지 등
- **상태와 UI가 연결되는 주요 기능 중심**

### 🔹 E2E 테스트

- 반복 일정 → 단일화 → 삭제 흐름
- 주/월 뷰 전환 후 렌더링 확인
- **실제 사용자 플로우를 시나리오 단위로 재현**

테스트는 기능의 성격에 따라 나눴고, **로직은 단위 / 상태는 통합 / 흐름은 E2E** 로 대응했습니다. 복잡한 기능일수록 테스트를 여러 단계로 나눠서 신뢰도를 높이고자 했습니다.

</details>

## 합의된 테스트 전략과 그 이유는 무엇인가요?

가장 중요한 `기능`이 무엇인지 말해보는 과정을 진행하였습니다.

- 반복 유형 선택
  - 매일, 매주, 매월, 매년
- 반복 간격 설정
  - 2일, 3주 2개월 간격 설정
- 반복 일정 표시
  - 아이콘 or 태그 확인
- 반복 종료
  - 특정 날짜 + 특정 횟수 + 종료 없음 
- 반복 일정 단일 수정
  - 반복일정을 수정하면은 단일 일정 변경
  - 반복일정 아이콘 삭제
- 반복 일정 단일 삭제 
  - 반복일정 삭제시 해당 일정만 삭제

기본적인 기능인 `CRUD에 집중`: 고객 입장에서 가장 중요한 것은 "일정이 제대로 등록되고, 수정되고, 삭제되는지"라는 점을 인식했고, 부수적인 기능보다 CRUD 테스트를 우선하기로 했습니다.

통합 테스트는 촘촘하게: 복잡한 상호작용, 스타일 변화, 상태 변화 등은 React Testing Library + MSW 기반의 통합 테스트로 철저히 검증하기로 합의했습니다.

e2e 테스트는 `최소한의 핵심 시나리오 중심`: E2E는 시간과 리소스가 많이 들기 때문에, 오작동 시 고객이 가장 불편함을 느낄 핵심 흐름 2~3개만 플레이라이트(Playwright)를 통해 검증합니다. 테스트마다 최소 2개 이상의 Act가 포함된 시나리오 기반으로 작성했습니다.

## 추가로 작성된 테스트 코드는 어떤 것들이 있나요?

- 반복 유형 선택
- 반복 간격 설정
- 반복 일정 표시
- 반복 일정 수정
- 반복 일정 삭제

를 기준으로 시나리오를 다시 구성하였고 

과제에서 요구한 `메인기능과 사용자의 액션`에 포커스를 두어 테스트 코드를 추가하였습니다.

---

## 과제 셀프회고

## 사용자의 흐름에 따른 테스트 코드 작성

최종목적은 `반복 일정을 설정`하는 것

이번 과제를 진행하면서 사용자의 흐름을 따라가며 `테스트코드를 작성`하였습니다.

![스크린샷 2025-05-23 오후 12 33 45](https://github.com/user-attachments/assets/3203cae2-e711-4e3c-8442-5b947b261448)

예시)

`일정추가 Form`

- 반복 일정 클릭 → useEventForm 값 확인 체크
- 반복 유형 선택 → useEventForm 매일, 매주, 매월, 매년 체크
- 반복 간격 + 반복 종료일 선택 → useEventForm 반복 간격, 반복 종료일 체크
- 일정 추가 클릭

`일정 보기` 

- startDate부터 endDate까지 반복 간격에 맞춰서 반복일정을 뿌려준다
    - Month View
        - 해당하는 달의 반복일정 체크
    - Week View
        - 해당하는 주의 반복일정 체크

위에 방식처럼 흐름을 끝까지 따라가다 보면은 어느순간 `하나의 함수로 구현이 가능하겠다` 판단이 오는 지점이 도달하게 됩니다.

반복일정을 뿌려주기 위해서는 원하는 날짜를 반환받아야 하고 결국에는 반환받기 위해서는 `윤년에 대한 판단`이 필요하다

-> 윤년을 판단해주는 테스트 코드 작성

```javascript
describe('윤년 확인 함수 테스트', () => {
  it('400으로 나누어 떨어지는 연도는 윤년이어야 함', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1600)).toBe(true);
  });

  it('4로 나누어 떨어지지만 100으로는 나누어 떨어지지 않는 연도는 윤년이어야 함', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2020)).toBe(true);
    expect(isLeapYear(2012)).toBe(true);
  });

  it('100으로 나누어 떨어지지만 400으로는 나누어 떨어지지 않는 연도는 윤년이 아니어야 함', () => {
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2100)).toBe(false);
    expect(isLeapYear(1700)).toBe(false);
  });

  it('4로 나누어 떨어지지 않는 연도는 윤년이 아니어야 함', () => {
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2021)).toBe(false);
    expect(isLeapYear(1)).toBe(false);
  });
});
```

반복일정을 뿌려주기 위해서는 사용자의 액션을 받아 `form`에 저장을 해줘야한다 -> `useForm`에 대한 테스트 작성이 필요하겠네?

이처럼 사용자의 흐름을 기준으로 작성하려 하였습니다.

```javascript
describe('useEventForm', () => {
  describe('setDate 동작 확인', () => {
    it('31일이 없는 달에는 그 전날인 30일로 설정되어야 한다', () => {
      const { result } = renderHook(() => useEventForm());
      act(() => {
        result.current.setDate('2025-04-31');
      });
      expect(result.current.date).toBe('2025-04-30');
    });

    it('31일이 있는 달에는 그대로 설정되어야 한다', () => {
      const { result } = renderHook(() => useEventForm());
      act(() => {
        result.current.setDate('2025-05-31');
      });
      expect(result.current.date).toBe('2025-05-31');
    });

    describe('윤년 날짜 설정', () => {
      it('윤년이 아닌 해의 2월 29일을 그 전날인 2월 28일로 설정되어야 한다', () => {
        const { result } = renderHook(() => useEventForm());
        act(() => {
          result.current.setDate('2025-02-29');
        });
        expect(result.current.date).toBe('2025-02-28');
      });

      it('윤년의 2월 29일은 그대로 설정되어야 한다', () => {
        const { result } = renderHook(() => useEventForm());
        act(() => {
          result.current.setDate('2024-02-29');
        });
        expect(result.current.date).toBe('2024-02-29');
      });
    });
  });
```

## 단위 테스트

저만의 단위 테스트 기준은 `하나의 함수 또는 hook` 으로 테스트가 가능한것을 `단위테스트`로 잡았습니다.

```javascript
export const adjustToValidDate = (dateString: string): string => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  const [yearStr, monthStr, dayStr] = dateString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (isLeapYear(year)) {
    daysInMonth[1] = 29;
  }

  const validDay = Math.min(day, daysInMonth[month - 1]);

  return `${yearStr}-${monthStr}-${validDay.toString().padStart(2, '0')}`;
};

describe('adjustToValidDate 함수 테스트', () => {
  describe('일반적인 경우', () => {
    it('유효한 날짜는 그대로 반환해야 한다', () => {
      expect(adjustToValidDate('2023-01-15')).toBe('2023-01-15');
      expect(adjustToValidDate('2023-06-30')).toBe('2023-06-30');
      expect(adjustToValidDate('2023-12-31')).toBe('2023-12-31');
    });

    it('비어있는 문자열은 그대로 반환해야 한다', () => {
      expect(adjustToValidDate('')).toBe('');
    });

    it('날짜 형식이 아닌 문자열은 그대로 반환해야 한다', () => {
      expect(adjustToValidDate('invalid-date')).toBe('invalid-date');
      expect(adjustToValidDate('2023/05/15')).toBe('2023/05/15');
      expect(adjustToValidDate('not a date')).toBe('not a date');
    });
  });
});
```

## 통합 테스트 + e2e 테스트

`두개의 함수 이상 또는 사용자의 액션`이 들어가는 것을 기준으로 통합 테스트

e2e 테스트는 `초기 렌더링부터 모든 과정을 담아야 한다 싶으면은 e2e 테스트`로 기준을 잡았습니다.

이번 과제 같은경우에는 전체적인 과정이 짧아 하나의 파일로 통합 테스트와 e2e 테스트가 가능하다 판단하여 

`통합테스트 + e2e 테스트 진행`을 하였습니다.

<img width="961" alt="스크린샷 2025-05-23 오전 1 31 37" src="https://github.com/user-attachments/assets/68c0b08e-a9dc-4ed3-8cf8-45c7ecb395bd" />


## playwright ui + codegen
![스크린샷 2025-05-23 오후 1 12 14](https://github.com/user-attachments/assets/5be5c37b-a29c-4a0e-931b-c0dc2f404e55)
![스크린샷 2025-05-23 오후 1 12 52](https://github.com/user-attachments/assets/7a4aeb06-abe4-4ec0-87e2-a364b6f23672)

codegen + playwright ui를 통해 테스트코드 작성과 테스트를 보다 편하게 진행할 수 있었습니다.

codegen은 마우스로 사용자의 액션을 수행하고 그에 맞는 테스트 코드를 작성해줍니다.

이를 통해 작성된 테스트 코르를 playwright ui를 통해 검증하며 어느지점에서 에러가 발생했는지 ui를 통해 빠른 파악이 가능했습니다!


## 리뷰 받고 싶은 내용

이번 과제같은 경우에는 e2e테스트 과정을 전체적으로 짧은거같아 통합 + e2e로 진행을 하였습니다.

코치님의 기준으로는 이번 과제에서는 통합과 e2e를 나누는게 맞는것일까요?! 만약 나눈다면은 어떠한 기준으로 나누어야 할지 궁금합니다!!



## 코치님 코멘트
고생하셨습니다! 드디어 테스트 주차가 마무리 되었네요.
명확하게 테스트 시나리오 맞춰서 잘 작성해주셨고, 검증에 있어서도 API나 작성 방식에 따라 다르겠지만 핵심적인 부분은 잘 구현해주셨어요 ㅎㅎ 이제 테스트 작성에 있어서는 전혀 걱정이 없어 보이시네요.

질문해주신 부분은 아래에 공통으로 남겨보고 마무리 해볼게요!

---

심화 과정에 대한 코멘트입니다.

적절한 비율의 테스트 전략인 것 같아요! 테스트 구성을 구체적이게 잘 작성해주셨어요! 사실 의도했던것은 반복뿐만 아니라 앱 전체에 대해 테스트를 말씀드렸던거긴 한데, 그럼에도 잘 분류해주셨습니다 ㅎㅎ 현재의 분류대로 앱 전체에 대한 테스트를 운영할 때 어느 부분의 보강이 필요한지도 꼭 얘기해보면 좋을것 같아요.

사실 질문을 주신 부분이기도 했지만, 이 전략을 작성하는데 있어서 여러분이 경험하셨던 부분은 정답을 찾는다기보다는 각자의 시각에 있어서 신뢰를 느끼는 테스트는 무엇인지, 그리고 거기까지 도달하는데 얼만큼 테스트를 해야하는지 직접 고민해보게 하는것이였습니다. 누군가는 단위 테스트가 많으면 충분할 것 같았을거고 누군가는 e2e테스트로 모든걸 커버할 수 있다고 생각했을수도 있을 것 같아요. 다만 저희는 정해진 리소스 내에 가장 비용이 적은 방식으로 높은 신뢰를 누려야하고 그러기 위해 계속 테스트 전략을 선택해야 하거든요. 그런 맥락에서 이 과제를 접근해주시면 좋을것 같아요.

제 의견을 물어보신다면, 저는 말씀해주신것처럼 테스트 트로피 형태로 통합 테스트의 비율을 가장 높이고 E2E테스트는 핵심이 되는 시나리오들, 모킹이 과하게 필요한 부분들에 대해서만 처리했을 것 같아요 ㅎㅎ

E2E 테스트도 작성을 잘 해주셨어요. 결국 E2E 테스트도 단위, 통합테스트를 운영하셨던 것처럼 페이지, 그리고 목표에 대해 명확하게 구획하고 시나리오에 맞춰 지금까지 지켜왔던 여러 테스트 원칙을 지켜나가려고 작성해야 하거든요. 추후에 회사에서 운영하시는데 있어서 이런 부분들을 유념해서 작성하신다면 큰 도움이 될 것 같습니다.

우선 이 부분에 있어서 worker를 제한하는건 별로 좋은 방법은 아니긴해요! 병렬로 여러 데이터를 수정하고 삭제한다는 지점에서 영향을 주니 하나의 워커에서 모든 테스트를 수행하는것으로 제한한 것으로 보이는데, 사실은 워커를 여러대 쓸수 있다는 것은 e2e에서 효율에 있어 매우 큰 부분이거든요. 

이럴때는 데이터를 상호 TC간에 영향을 받지 않도록 구성하는것이 중요하고 수정에 있어서는 수정용 데이터를 생성하고 그것에 대해 수정하도록 하는것 삭제에 대해서는 삭제용 데이터를 생성하고 그것에 대해 삭제하도록 하는것 꼭 갯수를 세어야 한다면, 해당 테스트에 대해서 명확한 테스트 환경을 만드는 setup과정을 만드는 게 중요한 것 같아요 ㅎㅎ (사실 요게 어려울거에요) 
 
추가로 서버 분리, DB분리 관점의 고민도 필요할 것 같아요. 추후에 여유가 있다면, 이 부분을 꼭 고려해서 스코프, 파일을 구성하고 병렬로 실행해보시면 좋을것 같습니다.

고생하셨어요!!
