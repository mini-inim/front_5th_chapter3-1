import { act, renderHook } from '@testing-library/react';

import { events } from '../../__mocks__/response/realEvents.json';
import { useSearch } from '../../hooks/useSearch.ts';
import type { Event } from '../../types.ts';

describe('useSearch 훅', () => {
  const date = new Date('2025-05-21');
  const eventList = events as Event[];
  let result: any;

  beforeEach(() => {
    ({ result } = renderHook(() => useSearch(eventList, date, 'month')));
  });

  it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
    expect(result.current.searchTerm).toBe('');
    expect(result.current.filteredEvents).toEqual(eventList);
  });

  it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
    act(() => result.current.setSearchTerm('회의'));

    expect(result.current.filteredEvents).toEqual([eventList[0]]);
  });

  it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
    act(() => result.current.setSearchTerm('헬스장'));

    expect(result.current.filteredEvents).toEqual([eventList[4]]);
  });

  it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
    act(() => result.current.setSearchTerm('회의'));

    expect(result.current.filteredEvents).toEqual([eventList[0]]);
  });

  it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
    act(() => result.current.setSearchTerm('점심'));

    expect(result.current.filteredEvents).toEqual([eventList[1]]);
  });
});