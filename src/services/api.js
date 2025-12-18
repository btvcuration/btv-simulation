// src/services/api.js
import { createClient } from '@supabase/supabase-js'; 
// CDN 사용시: import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ★★★ 여기가 핵심 스위치입니다 ★★★
// true: Supabase 연결 안 하고 가짜 데이터 사용 (에러 해결용)
// false: 실제 Supabase DB 연결
export const USE_MOCK_DATA = false; 

// --- Supabase 설정 ---
const supabaseUrl = 'https://zzzgixizyafwatdmvuxc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6emdpeGl6eWFmd2F0ZG12dXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MjgyNzEsImV4cCI6MjA4MTQwNDI3MX0.iLsQ2sqnd9nNZ3bL9fzM0Px6YJ4Of-YNzh1o1rIBdxg';
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Mock Data (가짜 데이터) ---
const MOCK_GNB = [
  { id: 1, name: '홈', slug: 'home', sort_order: 1 },
  { id: 2, name: '영화', slug: 'movie', sort_order: 2 },
  { id: 3, name: 'TV방송', slug: 'tv', sort_order: 3 },
];

const MOCK_BLOCKS = [
  {
    id: 'mock-1', type: 'TODAY_BTV', title: 'Today B tv', show_title: false,
    content: { items: [{ type: 'BANNER', title: '메인 배너', img: '' }, { type: 'CONTENT', title: '인기 영화 1' }, { type: 'CONTENT', title: '인기 영화 2' }] }
  },
  {
    id: 'mock-2', type: 'VERTICAL', title: '최신 인기 영화', show_title: true,
    content: { items: [{ title: '영화 A' }, { title: '영화 B' }, { title: '영화 C' }, { title: '영화 D' }] }
  },
  {
      id: 'mock-3', type: 'BIG_BANNER', title: '이벤트 배너', show_title: false,
      content: { banners: [{ title: '빅배너 타이틀', desc: '설명 텍스트입니다.' }] }
  }
];

// --- API Functions ---

export const api = {
  // GNB 메뉴 가져오기
  fetchGnb: async () => {
    if (USE_MOCK_DATA) return MOCK_GNB;
    try {
      const { data, error } = await supabase.from('gnb_menus').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Supabase Error (GNB):", e);
      return MOCK_GNB; // 에러나면 자동으로 Mock 데이터 반환
    }
  },

  // 블록 데이터 가져오기
  fetchBlocks: async (gnbId) => {
    if (USE_MOCK_DATA) return MOCK_BLOCKS;
    try {
      const { data, error } = await supabase.from('blocks').select('*').eq('gnb_id', gnbId).order('sort_order', { ascending: true });
      if (error) throw error;
      
      // DB 포맷을 프론트엔드 포맷으로 변환
      return data.map(b => ({
        id: b.id,
        type: b.type,
        title: b.title,
        blockId: b.block_id_code,
        showTitle: b.show_title,
        isNew: false,
        ...b.content // JSONB 병합
      }));
    } catch (e) {
      console.error("Supabase Error (Blocks):", e);
      return MOCK_BLOCKS;
    }
  },

  // 요청(Request) 가져오기
  fetchRequests: async () => {
    if (USE_MOCK_DATA) return []; // Mock 모드일 땐 빈 배열 혹은 더미 요청
    try {
        const { data, error } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
        if(error) throw error;
        return data;
    } catch(e) {
        console.error("Supabase Error (Requests):", e);
        return [];
    }
  }
};
