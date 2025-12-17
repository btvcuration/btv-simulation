import { supabase } from '../supabaseClient'; // 기존 클라이언트

// 개발용 가짜 데이터 (Supabase 연결 안 될 때 사용)
const MOCK_MOVIES = [
  { id: 1, title: '테스트 영화 1', price: 10000, category: 'Action' },
  { id: 2, title: '테스트 영화 2', price: 5000, category: 'Drama' },
];

// ★ 핵심: 스위치 하나로 실제 DB와 가짜 데이터를 오갈 수 있음
const USE_MOCK_DATA = true; // Supabase 에러나면 이걸 true로 바꾸세요!

export const fetchMoviesAPI = async () => {
  if (USE_MOCK_DATA) {
    console.log("⚠️ Mock Data 모드로 동작 중입니다.");
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_MOVIES), 500));
  }

  try {
    const { data, error } = await supabase.from('movies').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Supabase Error:", error);
    throw error;
  }
};
