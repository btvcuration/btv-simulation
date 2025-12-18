import React, { useState, useEffect } from 'react';

// ==========================================
// 1. Supabase 설정
// ==========================================
const supabaseUrl = 'https://zzzgixizyafwatdmvuxc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6emdpeGl6eWFmd2F0ZG12dXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MjgyNzEsImV4cCI6MjA4MTQwNDI3MX0.iLsQ2sqnd9nNZ3bL9fzM0Px6YJ4Of-YNzh1o1rIBdxg';

// ==========================================
// 2. [실제 데이터 매핑] 제공해주신 편성표 데이터를 변환하였습니다.
// ==========================================
const BTV_REAL_DATA = [
  {
    name: '홈', // 최상위 메뉴
    blocks: [
      // 1. 전환동의 띠배너 (타겟)
      {
        type: 'BAND_BANNER',
        title: '전환동의 띠배너',
        isTarget: true,
        targetSeg: '전환동의_TARGET',
        remarks: '담당자: 월정액리텐션팀 박선경 (5/1~상시)',
        banners: [
          { 
            title: 'B tv+ 전환 동의', 
            landingType: 'URL', 
            landingValue: '/consent/page',
            img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800' // 예시 이미지
          }
        ]
      },
      // 2. B tv+ 요청 띠배너 (타겟)
      {
        type: 'BAND_BANNER',
        title: 'B tv+ 요청 띠배너',
        isTarget: true,
        targetSeg: 'BTV_PLUS_TARGET',
        remarks: 'B tv+팀 요청',
        banners: [{ title: 'B tv+ 혜택 안내', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800' }]
      },
      // 3. 미니블록 (개인화)
      {
        type: 'HORIZONTAL_MINI',
        title: '고객님이 시청중인 콘텐츠',
        contentIdType: 'PERSONAL',
        contentId: 'MY_BLOCK',
        items: [{ title: '이어보기 1' }, { title: '이어보기 2' }, { title: '이어보기 3' }, { title: '이어보기 4' }]
      },
      // 4. FOR YOU (RACE)
      {
        type: 'VERTICAL',
        title: 'FOR YOU (개인 맞춤 추천)',
        contentIdType: 'RACE',
        contentId: '551.RACE',
        remarks: 'Hyper_Personal_Base_N551 / Y551',
        items: [{ title: '추천1' }, { title: '추천2' }, { title: '추천3' }, { title: '추천4' }]
      },
      // 5. ASUM 광고 (1단 배너)
      {
        type: 'BANNER_1',
        title: 'ASUM 광고 빌보드 배너',
        remarks: 'POC 551이상만, 3d71e401-b040... (비식별)',
        banners: [
            { title: 'ASUM 광고 배너', type: '1-COL', img: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800' }
        ]
      },
      // 6. 오늘의 인기 순위 (랭킹)
      {
        type: 'VERTICAL',
        title: '오늘의 인기 순위 #영화',
        contentIdType: 'RACE',
        contentId: 'M_5_RANK_TopMovie_j2886.race',
        jiraLink: 'https://jira.skbroadband.com/browse/BTVEVT-8024',
        // 2단 배너가 포함된 블록
        leadingBanners: [
            { type: '2-COL', title: '랭킹 배너', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800' }
        ],
        items: [{ title: '1위 범죄도시' }, { title: '2위 엘리멘탈' }, { title: '3위 오펜하이머' }, { title: '4위 밀수' }]
      },
      // 7. 전략 콘텐츠 (연말 특집)
      {
        type: 'VERTICAL',
        title: '연말 특집 무비 패키지 #할인 받고 정주행',
        contentIdType: 'LIBRARY',
        contentId: 'NB2000012143',
        jiraLink: 'https://jira.skbroadband.com/browse/BTVEVT-8160',
        leadingBanners: [
            { type: '2-COL', title: '연말 특집 배너', landingType: 'POPUP', img: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?w=800' }
        ],
        items: [{ title: '패키지1' }, { title: '패키지2' }, { title: '패키지3' }, { title: '패키지4' }]
      },
      // 8. 신규 개통고객 (타겟)
      {
        type: 'VERTICAL',
        title: '신규 개통고객 12개월 50% (11/1~)',
        isTarget: true,
        targetSeg: 'NEW_OPEN_USER',
        jiraLink: 'https://jira.skbroadband.com/browse/BTVEVT-7974',
        items: [{ title: '할인 영화 1' }, { title: '할인 영화 2' }]
      },
      // 9. 정주행 TV (메뉴 블록)
      {
        type: 'MENU_BLOCK',
        title: '언제나 무료로 보는 채널 #정주행TV 런칭',
        jiraLink: 'https://jira.skbroadband.com/browse/BTVEVT-7401',
        banners: [
            { title: '문제적남자', type: 'MENU', img: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300' },
            { title: '이혼숙려캠프', type: 'MENU', img: 'https://images.unsplash.com/photo-1522869635100-1f4906a1f951?w=300' },
            { title: '푸른거탑', type: 'MENU', img: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=300' },
            { title: '곽준빈의 기사식당', type: 'MENU', img: 'https://images.unsplash.com/photo-1517604931442-71053e3e2e3c?w=300' }
        ]
      },
      // 10. Youtube Premium 띠배너
      {
        type: 'BAND_BANNER',
        title: 'Youtube Premium 론칭 띠배너',
        remarks: '9/2~12/11, 특정 POC만',
        banners: [{ title: '유튜브 프리미엄 가입하기', landingType: 'VOD_PPM', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800' }]
      },
      // 11. 디즈니 플러스 런칭
      {
        type: 'BAND_BANNER',
        title: '디즈니플러스 런칭 프로모션',
        jiraLink: 'https://jira.skbroadband.com/browse/BTVEVT-8114',
        banners: [{ title: '디즈니+ 쿠폰 받기', landingType: 'COUPON', img: 'https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800' }]
      },
      // 12. 에이닷 검색 배너
      {
        type: 'BAND_BANNER',
        title: '검색 배너 - 에이닷',
        remarks: '김지혜매니저님 요청',
        banners: [{ title: '에이닷에게 물어보세요', landingType: 'A_DOT', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800' }]
      },
      // 13. TAP 블록 예시 (애니메이션)
      {
        type: 'TAB',
        title: '오늘의 인기 순위 #애니메이션',
        tabs: [
          { 
            name: '극장판', 
            contentId: 'M_5_RANK_TopMovieAni_j2886.race', 
            contentIdType: 'RACE',
            items: [{ title: '코난 극장판' }, { title: '짱구는 못말려' }]
          },
          { 
            name: '시리즈', 
            contentId: 'M_5_RANK_TopseriesAni_j2886.race', 
            contentIdType: 'RACE',
            items: [{ title: '귀멸의 칼날' }, { title: '주술회전' }]
          }
        ]
      },
      // 14. 임포트 섹션 (더미 블록들)
      {
        type: 'MULTI',
        title: '재밌는 건 여러 번 시청해요 #소장 [Import]',
        contentId: 'NB2000011803',
        contentIdType: 'LIBRARY',
        showPreview: true,
        items: [{ title: '소장용 영화 1' }, { title: '소장용 영화 2' }, { title: '소장용 영화 3' }, { title: '소장용 영화 4' }]
      },
      {
        type: 'MULTI',
        title: '인공지능 AI가 추천해요 #에이닷 [Import]',
        contentId: 'NB2000011807',
        contentIdType: 'LIBRARY',
        items: [{ title: 'AI 추천 1' }, { title: 'AI 추천 2' }]
      }
    ]
  }
];


// ==========================================
// 3. 마이그레이션 컴포넌트
// ==========================================
export default function DataSeeder() {
  const [status, setStatus] = useState('시스템 초기화 중...');
  const [logs, setLogs] = useState([]);
  const [supabase, setSupabase] = useState(null);

  const addLog = (msg) => setLogs(prev => [...prev, msg]);

  // Supabase 클라이언트 동적 로드 (CDN 방식)
  useEffect(() => {
    const loadSupabase = () => {
      if (window.supabase) {
        const client = window.supabase.createClient(supabaseUrl, supabaseKey);
        setSupabase(client);
        setStatus('준비 완료 (데이터 입력 대기)');
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.async = true;
      script.onload = () => {
        if (window.supabase) {
          const client = window.supabase.createClient(supabaseUrl, supabaseKey);
          setSupabase(client);
          setStatus('준비 완료 (데이터 입력 대기)');
        } else {
          setStatus('오류: Supabase 로드 실패');
        }
      };
      script.onerror = () => {
        setStatus('오류: Supabase 스크립트 로드 실패');
      };
      document.body.appendChild(script);
    };

    loadSupabase();
  }, []);

  const handleResetAndSeed = async () => {
    if (!supabase) {
      alert('Supabase 클라이언트가 아직 준비되지 않았습니다.');
      return;
    }

    if (!window.confirm('경고: 기존 DB 데이터가 모두 삭제되고 위 데이터로 덮어씌워집니다. 진행하시겠습니까?')) return;

    setStatus('데이터 초기화 중...');
    setLogs([]);

    try {
      // 1. 기존 데이터 삭제
      addLog('🗑️ 기존 블록 데이터 삭제 중...');
      const { error: blockErr } = await supabase.from('blocks').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
      if (blockErr) throw blockErr;

      addLog('🗑️ 기존 메뉴 데이터 삭제 중...');
      const { error: gnbErr } = await supabase.from('gnb_menus').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (gnbErr) throw gnbErr;

      // 2. 데이터 주입 시작
      setStatus('데이터 주입 중...');
      
      let gnbSortOrder = 0;

      const insertMenuNode = async (menuData, parentId = null) => {
        addLog(`📂 메뉴 생성 중: ${menuData.name}`);

        // (1) GNB 메뉴 Insert
        const { data: menuResult, error: menuInsertErr } = await supabase
          .from('gnb_menus')
          .insert({
            name: menuData.name,
            parent_id: parentId,
            sort_order: gnbSortOrder++
          })
          .select()
          .single();

        if (menuInsertErr) throw menuInsertErr;
        const currentMenuId = menuResult.id;

        // (2) 해당 메뉴의 Blocks Insert
        if (menuData.blocks && menuData.blocks.length > 0) {
          addLog(`  ㄴ 🧱 블록 ${menuData.blocks.length}개 생성 중...`);
          
          const blocksToInsert = menuData.blocks.map((block, idx) => {
            const contentData = {
              items: block.items || [],
              banners: block.banners || [],
              tabs: block.tabs || [],
              leadingBanners: block.leadingBanners || [],
              showPreview: block.showPreview || false,
              contentId: block.contentId || '',
              contentIdType: block.contentIdType || 'LIBRARY',
              isTarget: block.isTarget || false,
              targetSeg: block.targetSeg || '',
              remarks: block.remarks || '',
              jiraLink: block.jiraLink || ''
            };

            return {
              gnb_id: currentMenuId,
              type: block.type,
              title: block.title,
              block_id_code: `BLK_${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
              show_title: block.showTitle !== false, // default true
              sort_order: idx,
              content: contentData 
            };
          });

          const { error: blockInsertErr } = await supabase.from('blocks').insert(blocksToInsert);
          if (blockInsertErr) throw blockInsertErr;
        }

        if (menuData.children && menuData.children.length > 0) {
          for (const child of menuData.children) {
            await insertMenuNode(child, currentMenuId);
          }
        }
      };

      for (const menu of BTV_REAL_DATA) {
        await insertMenuNode(menu);
      }

      setStatus('✅ 완료! (모든 데이터가 성공적으로 입력되었습니다)');
      addLog('✨ 모든 작업이 완료되었습니다.');

    } catch (e) {
      console.error(e);
      setStatus(`❌ 오류 발생: ${e.message}`);
      addLog(`ERROR: ${e.message}`);
    }
  };

  return (
    <div className="p-10 bg-[#100d1d] min-h-screen text-white font-mono">
      <h1 className="text-2xl font-bold mb-4 text-[#7387ff]">B tv Data Migration Tool</h1>
      <p className="text-sm text-slate-400 mb-6">
        제공해주신 엑셀/문서 데이터를 JSON 형태로 변환하여 탑재하였습니다.<br/>
        아래 버튼을 누르면 Supabase에 실제 데이터 구조로 생성됩니다.
      </p>

      <div className="flex gap-4 items-center mb-6">
        <button 
          onClick={handleResetAndSeed}
          disabled={!supabase}
          className={`px-6 py-3 rounded font-bold shadow-lg transition-transform active:scale-95 ${supabase ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
        >
          🚨 DB 초기화 및 데이터 주입 실행
        </button>
        <span className="text-lg font-bold">{status}</span>
      </div>

      <div className="bg-black/50 p-4 rounded h-96 overflow-y-auto border border-slate-800">
        {logs.map((log, i) => (
          <div key={i} className="mb-1 text-sm text-slate-300">{log}</div>
        ))}
      </div>
    </div>
  );
}
