import React, { useState, useRef, useEffect } from 'react';
import {
  Save, Plus, Trash2, GripVertical, GripHorizontal, Smartphone, Monitor, 
  RefreshCw, ChevronRight, ChevronDown, Layout, Home, Video, 
  Star, Grid, FileText, CheckCircle, Download, ArrowRight, X, ArrowRightLeft,
  Inbox, User, ExternalLink, RotateCcw, Calendar as CalendarIcon, Clock, ChevronLeft, Tv, Film, PlayCircle, BookOpen, MessageSquare, Ban,
  Eye, EyeOff, Database, Layers, Hash, Edit3, AlertTriangle, Link, MousePointer, Image as ImageIcon,
  MousePointerClick, Tag, PlusCircle, MoreHorizontal, Target, StickyNote, Settings, Upload, Link2, Box, Filter,
  Menu, History, Rewind, MoreVertical, Minus, Users, Check, XCircle, Send, ArrowRightCircle
} from 'lucide-react';

// ==========================================
// [설정] 개발 모드 (Mock Data) vs 실제 모드 (Supabase)
// true: 가짜 데이터 사용 (UI 테스트용)
// false: 실제 Supabase DB 연동 (상용화용)
// ==========================================
const USE_MOCK_DATA = false;

// --- Supabase Config ---
const supabaseUrl = 'https://zzzgixizyafwatdmvuxc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6emdpeGl6eWFmd2F0ZG12dXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MjgyNzEsImV4cCI6MjA4MTQwNDI3MX0.iLsQ2sqnd9nNZ3bL9fzM0Px6YJ4Of-YNzh1o1rIBdxg';

// --- Mock Supabase Client (껍데기) ---
const mockSupabase = {
  from: () => ({
    select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
    insert: () => Promise.resolve({ error: null, data: [] }),
    update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    eq: () => ({ 
        select: () => Promise.resolve({ data: [], error: null }), 
        update: () => Promise.resolve({ error: null }), 
        delete: () => Promise.resolve({ error: null }),
        eq: () => ({ 
             select: () => Promise.resolve({ data: [], error: null }),
             lte: () => ({
                 order: () => ({
                     limit: () => Promise.resolve({ data: [], error: null })
                 })
             })
        })
    })
  })
};


// --- Mock Initial Data ---
const INITIAL_GNB_TREE = [
    { 
        id: '1', name: '홈', slug: 'home', children: [] 
    },
    { 
        id: '2', name: '영화', slug: 'movie', children: [
            { id: '2-1', name: '추천 영화', slug: 'rec-movie' },
            { id: '2-2', name: '신작', slug: 'new-movie' },
            { id: 'div-1', name: '---', slug: 'div-1' }, 
            { id: '2-3', name: '장르별', slug: 'genre-movie' }
        ] 
    },
    { 
        id: '3', name: 'TV다시보기', slug: 'tv-replay', children: [
            { id: '3-1', name: '전체', slug: 'tv-all' },
            { id: '3-2', name: 'KBS', slug: 'tv-kbs' },
            { id: '3-3', name: 'MBC', slug: 'tv-mbc' },
            { id: '3-4', name: 'SBS', slug: 'tv-sbs' }
        ] 
    },
    { id: '4', name: '키즈', slug: 'kids', children: [] },
    { id: '5', name: '다큐', slug: 'docu', children: [] }
];

const MOCK_BLOCKS = [
  {
    id: 'b1',
    type: 'TODAY_BTV',
    title: 'Today B tv',
    blockId: 'TD_001',
    showTitle: true,
    items: [
      { id: 'tb1', type: 'BANNER', title: '메인 배너', img: '', isTarget: true },
      { id: 'tb2', type: 'CONTENT', title: '인기 영화 1' },
      { id: 'tb3', type: 'CONTENT', title: '인기 영화 2' }
    ]
  },
  {
    id: 'b2',
    type: 'BIG_BANNER',
    title: '빅배너 영역',
    blockId: 'BB_001',
    showTitle: true,
    banners: [
      { id: 'bb1', title: '이달의 추천작', desc: '놓치면 후회할 대작들을 만나보세요.', img: '', isTarget: true },
      { id: 'bb2', title: '두 번째 배너', desc: '설명 텍스트입니다.' }
    ]
  },
  {
    id: 'b3',
    type: 'VERTICAL',
    title: '실시간 인기 콘텐츠',
    blockId: 'RT_001',
    showTitle: true,
    contentIdType: 'RACE',
    contentId: 'RT_POPULAR',
    items: [
        { id: 'v1', title: '영화 A' }, { id: 'v2', title: '영화 B' }, { id: 'v3', title: '영화 C' }
    ]
  },
  {
    id: 'b4',
    type: 'HORIZONTAL',
    title: '주말에 보기 좋은 영화',
    blockId: 'HZ_001',
    showTitle: true,
    contentIdType: 'LIBRARY',
    contentId: 'NM12345',
    items: [
        { id: 'h1', title: '가로 포스터 1' }, { id: 'h2', title: '가로 포스터 2' }
    ]
  }
];

const MOCK_HISTORY_DATA = {
    '2023-10-01': [
        { id: 'h-oct1-1', type: 'TODAY_BTV', title: 'Today B tv (10/1)', items: [{ title: '10월의 시작' }] },
        { id: 'h-oct1-2', type: 'VERTICAL', title: '10월 신작', items: [{ title: '영화 A' }] }
    ],
    '2023-10-15': [
        { id: 'h-oct15-1', type: 'TODAY_BTV', title: 'Today B tv (10/15 변경)', items: [{ title: '가을 특선' }, { title: '단풍놀이' }] },
        { id: 'h-oct15-2', type: 'VERTICAL', title: '10월 인기작', items: [{ title: '영화 B' }, { title: '영화 C' }] },
        { id: 'h-oct15-3', type: 'BIG_BANNER', title: '중간 광고', banners: [{ title: '할인 이벤트' }] }
    ],
    '2023-10-25': [
        { id: 'h-oct25-1', type: 'TODAY_BTV', title: 'Today B tv (10/25 변경)', items: [{ title: '할로윈 주간' }] },
        { id: 'h-oct25-2', type: 'BIG_BANNER', title: '할로윈 특집', banners: [{ title: '공포 영화 50% 할인', desc: '무서운 영화 모음' }] },
        { id: 'h-oct25-3', type: 'HORIZONTAL', title: '가족과 함께', items: [{ title: '코코' }, { title: '몬스터 주식회사' }] }
    ]
};

const MOCK_REQUESTS = [
    { 
        id: 'r1', requester: '김편성', team: '편성1팀', title: '신규 영화 블록 추가 요청', desc: '이번 주 신작 영화 소개를 위한 블록 추가', type: 'VERTICAL', gnb: '홈', status: 'PENDING', location: '상단', remarks: '급함', createdAt: '2023-11-01', changes: [{type: '신규', desc: '신규 블록 추가됨'}],
        originalSnapshot: null, 
        snapshot: null 
    },
    { 
        id: 'r2', requester: '이마케팅', team: '마케팅팀', title: '이벤트 배너 교체', desc: '봄맞이 할인 이벤트 배너', type: 'BIG_BANNER', gnb: '영화', status: 'PENDING', location: '중단', createdAt: '2023-11-02', changes: [{type: '수정', desc: '배너 이미지 교체됨'}],
        originalSnapshot: null,
        snapshot: null
    },
    {
        id: 'r-pub-1', requester: '관리자', team: '편성팀', title: '[편성반영] 11월 1주차 정기 개편', desc: '정기 개편 반영 요청입니다.', type: 'PUBLISH', gnb: '홈', status: 'PENDING', location: '전체', createdAt: '2023-11-05',
        originalSnapshot: JSON.parse(JSON.stringify(MOCK_BLOCKS)),
        snapshot: JSON.parse(JSON.stringify(MOCK_BLOCKS))
    }
];

// Helper to generate slug
const generateSlug = (name) => {
    const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(name);
    if (isKorean || name === '---') {
        return `menu-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    return name.toLowerCase().replace(/\s+/g, '-') + `-${Date.now().toString().slice(-4)}`;
};

// Mock Hook Implementation
const useBtvData = (supabase, viewMode) => {
    const [gnbList, setGnbList] = useState(INITIAL_GNB_TREE);
    const [expandedMenuIds, setExpandedMenuIds] = useState(['2', '3']); 
    const [currentMenuPath, setCurrentMenuPath] = useState('홈');
    const [currentMenuId, setCurrentMenuId] = useState('1');
    const [blocks, setBlocks] = useState(JSON.parse(JSON.stringify(MOCK_BLOCKS)));
    const [originalBlocks, setOriginalBlocks] = useState(JSON.parse(JSON.stringify(MOCK_BLOCKS))); 
    const [requests, setRequests] = useState([...MOCK_REQUESTS]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchGnb = async () => {
      if (USE_MOCK_DATA) {
        if(gnbList.length === 0 || gnbList === INITIAL_GNB_TREE) {
            setGnbList(INITIAL_GNB_TREE);
            setCurrentMenuPath(INITIAL_GNB_TREE[0].name);
            setCurrentMenuId(INITIAL_GNB_TREE[0].id);
        }
        return;
      }
      
      if (!supabase || !supabase.from) return;

      const { data, error } = await supabase
        .from('gnb_menus')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (data && data.length > 0) {
        const tree = [];
        const map = {};
        data.forEach(item => { map[item.id] = { ...item, children: [] }; });
        data.forEach(item => {
            if (item.parent_id) {
                if(map[item.parent_id]) map[item.parent_id].children.push(map[item.id]);
            } else {
                tree.push(map[item.id]);
            }
        });
        setGnbList(tree);
        if (currentMenuId) {
            const current = data.find(d => d.id === currentMenuId);
            if (current) setCurrentMenuPath(current.name);
            else {
                const home = tree.find(m => m.name === '홈') || tree[0];
                if(home) { setCurrentMenuId(home.id); setCurrentMenuPath(home.name); }
            }
        }
      }
    };

    useEffect(() => {
        fetchGnb();
    }, [supabase]);

    useEffect(() => {
        if (!currentMenuId) return;
        if (!USE_MOCK_DATA && currentMenuId === '1') return;

        const fetchBlocks = async () => {
          if (USE_MOCK_DATA) {
             if (blocks.length === 0 || currentMenuId === '1') {
                 setBlocks(JSON.parse(JSON.stringify(MOCK_BLOCKS)));
                 setOriginalBlocks(JSON.parse(JSON.stringify(MOCK_BLOCKS)));
             }
             return;
          }

          if (!supabase || !supabase.from) return;

          const { data, error } = await supabase
            .from('blocks')
            .select('*')
            .eq('gnb_id', currentMenuId)
            .order('sort_order', { ascending: true });

          if (data) {
            const formattedBlocks = data.map(b => ({
              id: b.id, type: b.type, title: b.title, blockId: b.block_id_code, showTitle: b.show_title, isNew: false, ...b.content
            }));
            setBlocks(formattedBlocks);
            setOriginalBlocks(JSON.parse(JSON.stringify(formattedBlocks)));
          } else {
            setBlocks([]);
            setOriginalBlocks([]);
          }
        };
        fetchBlocks();
    }, [currentMenuId, supabase]);

    useEffect(() => {
        const fetchRequests = async () => {
            if (USE_MOCK_DATA) {
                setRequests(MOCK_REQUESTS);
                return;
            }

            if (!supabase || !supabase.from) return;

            const { data } = await supabase
                .from('requests')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (data) {
                const formattedRequests = data.map(r => {
                  let type = r.snapshot_new ? 'PUBLISH' : 'VERTICAL'; 
                  
                  // description에서 [요청 타입] 등 파싱 로직 (기존 유지)
                  if (!r.remarks && r.description) {
                       const typeMatch = r.description.match(/\[요청 타입\]\s*([A-Z0-9_]+)/);
                       if (typeMatch) type = typeMatch[1];
                       
                       const remarksMatch = r.description.match(/\[비고\]\s*(.*)/);
                       if (remarksMatch) r.remarks = remarksMatch[1];
                       
                       const jiraMatch = r.description.match(/\[Jira 티켓\]\s*(.*)/);
                       if (jiraMatch && jiraMatch[1] !== '-') r.jiraLink = jiraMatch[1];
                  }
              
                  // [👇 여기부터 추가/수정된 부분입니다] 
                  // 캘린더 비교를 위해 YYYY-MM-DD 형식의 문자열을 강제로 만듭니다.
                  const rawDateObj = new Date(r.created_at || r.createdAt); 
                  const dateYMD = `${rawDateObj.getFullYear()}-${String(rawDateObj.getMonth() + 1).padStart(2, '0')}-${String(rawDateObj.getDate()).padStart(2, '0')}`;
              
                  return {
                      id: r.id, 
                      title: r.title, 
                      requester: r.requester, 
                      team: r.team, 
                      gnb: r.gnb_target, 
                      type: type, 
                      desc: r.description, 
                      location: r.location, 
                      status: r.status, 
                      
                      // [👇 날짜 관련 필드 수정]
                      date: dateYMD,       // 화면에 보여줄 때도 이 포맷 사용
                      dateYMD: dateYMD,    // 캘린더에서 점(Dot) 찍을 때 비교할 키값 (핵심!)
                      createdAt: new Date(r.created_at || r.createdAt).toLocaleString(),
                      
                      remarks: r.remarks, 
                      jiraLink: r.jira_link,
                      changes: r.changes || [], 
                      snapshot: r.snapshot_new, 
                      originalSnapshot: r.snapshot_original, 
                      menuPath: r.gnb_target 
                  };
              });
              setRequests(formattedRequests);
            }
        };
        fetchRequests(); 
    }, [viewMode, supabase]);

    const toggleExpand = (id) => {
        if (expandedMenuIds.includes(id)) {
            setExpandedMenuIds(expandedMenuIds.filter(eid => eid !== id));
        } else {
            setExpandedMenuIds([...expandedMenuIds, id]);
        }
    };

    const handleMenuChange = (id, path, isLeaf = true) => {
        if (!isLeaf) {
            toggleExpand(id);
            return;
        }
        if (USE_MOCK_DATA) {
            setCurrentMenuId(id);
            setCurrentMenuPath(path);
            const shuffled = [...MOCK_BLOCKS].sort(() => 0.5 - Math.random());
            const newBlocks = id === '1' ? [...MOCK_BLOCKS] : shuffled;
            setBlocks(JSON.parse(JSON.stringify(newBlocks)));
            setOriginalBlocks(JSON.parse(JSON.stringify(newBlocks)));
        } else {
            setCurrentMenuId(id);
            setCurrentMenuPath(path);
        }
    };

    const addGnb = async (name) => {
        const slug = generateSlug(name);
        const newGnb = { id: `gnb-${Date.now()}`, name, slug, children: [] };
        setGnbList(prev => [...prev, newGnb]);

        if (!USE_MOCK_DATA) {
            const { error } = await supabase.from('gnb_menus').insert({ name, slug, sort_order: gnbList.length });
            if(error) fetchGnb(); 
            else fetchGnb(); 
        }
    };

    const addSubMenu = async (parentId, name) => {
        const slug = generateSlug(name);
        setGnbList(prev => prev.map(item => {
            if (item.id === parentId) {
                return { ...item, children: [...(item.children || []), { id: `sub-${Date.now()}`, name, slug }] };
            }
            return item;
        }));
        if (!expandedMenuIds.includes(parentId)) setExpandedMenuIds([...expandedMenuIds, parentId]);

        if (!USE_MOCK_DATA) {
            const parent = gnbList.find(g => g.id === parentId);
            const sortOrder = parent ? parent.children.length : 0;
            const { error } = await supabase.from('gnb_menus').insert({ name, slug, parent_id: parentId, sort_order: sortOrder });
            if(!error) fetchGnb();
        }
    };

const reorderMenu = async (dragId, dropId, type) => {
    if (dragId === dropId) return;
    
    const strDragId = String(dragId);
    const strDropId = String(dropId);

    console.log(`[Move] ${type}: ${strDragId} -> ${strDropId}`);

    const newList = JSON.parse(JSON.stringify(gnbList));

    if (type === 'GNB') {
      // [1] GNB 순서 변경 (기존 동일)
      const dragIndex = newList.findIndex(i => String(i.id) === strDragId);
      const dropIndex = newList.findIndex(i => String(i.id) === strDropId);
      
      if (dragIndex > -1 && dropIndex > -1) {
        const [dragItem] = newList.splice(dragIndex, 1);
        newList.splice(dropIndex, 0, dragItem);
        setGnbList(newList);

        if (!USE_MOCK_DATA) {
          const updates = newList.map((item, index) => 
            supabase.from('gnb_menus').update({ sort_order: index }).eq('id', item.id)
          );
          await Promise.all(updates);
        }
      }
    } else {
      // [2] 하위 메뉴 순서 변경 (디버깅 강화)
      let sourceGnb = null;
      let sourceIndex = -1;
      let targetGnb = null;
      let targetIndex = -1;

      // 위치 찾기
      for (let gnb of newList) {
        const idx = gnb.children.findIndex(c => String(c.id) === strDragId);
        if (idx > -1) { sourceGnb = gnb; sourceIndex = idx; break; }
      }
      for (let gnb of newList) {
        const idx = gnb.children.findIndex(c => String(c.id) === strDropId);
        if (idx > -1) { targetGnb = gnb; targetIndex = idx; break; }
      }

      // 예외: 헤더로 드롭
      if (!targetGnb) {
         const gnbHeaderIndex = newList.findIndex(g => String(g.id) === strDropId);
         if (gnbHeaderIndex > -1 && sourceGnb) {
             targetGnb = newList[gnbHeaderIndex];
             targetIndex = 0;
         } else {
             return;
         }
      }

      if (sourceGnb && targetGnb) {
        const [draggedItem] = sourceGnb.children.splice(sourceIndex, 1);
        targetGnb.children.splice(targetIndex, 0, draggedItem);

        // UI 즉시 반영
        setGnbList(newList);

        // [DB 저장] 데이터 유효성 검사 추가
        if (!USE_MOCK_DATA) {
          // 중요: 부모 ID가 유효한지 확인
          if (!targetGnb.id) {
             console.error('⛔ [Critical] 이동할 타겟 그룹(부모)의 ID가 없습니다!', targetGnb);
             alert('오류: 부모 메뉴의 ID를 찾을 수 없어 저장에 실패했습니다.');
             return;
          }

          try {
            const promises = [];

            // 타겟 그룹 업데이트
            const targetUpdates = targetGnb.children.map((child, index) => {
              // 페이로드 확인용 로그
              // console.log(`업데이트 예정: ID(${child.id}) -> Parent(${targetGnb.id}), Order(${index})`);
              
              if (!child.id) return Promise.resolve(); // ID 없으면 스킵

              return supabase.from('gnb_menus')
                .update({ 
                  sort_order: index, 
                  parent_id: targetGnb.id // 여기서 400 에러 발생 가능성 높음
                })
                .eq('id', child.id);
            });
            promises.push(...targetUpdates);

            // 소스 그룹 업데이트 (다른 그룹 이동 시)
            if (sourceGnb.id !== targetGnb.id) {
              const sourceUpdates = sourceGnb.children.map((child, index) => 
                supabase.from('gnb_menus').update({ sort_order: index }).eq('id', child.id)
              );
              promises.push(...sourceUpdates);
            }

            const results = await Promise.all(promises);
            
            // 400 에러 감지
            const errorResult = results.find(r => r.error);
            if (errorResult) {
                console.error('🔥 Supabase Error (400 Bad Request):', errorResult.error);
                alert(`저장 실패: ${errorResult.error.message}\n(데이터 형식이 맞지 않습니다)`);
            } else {
                console.log('✅ 순서 변경 저장 성공');
            }

          } catch (err) {
            console.error('시스템 오류:', err);
          }
        }
      }
    }
  };
  
    const moveBlock = (index, direction) => {
        // 읽기 전용이거나 히스토리 모드일 때는 작동하지 않음
        if (viewMode === 'HISTORY') return; // readOnly 변수가 없다면 viewMode로만 체크해도 됩니다.
        
        const newBlocks = [...blocks];
        
        if (direction === 'UP') {
            if (index === 0) return; // 맨 위면 무시
            // 위 블록과 현재 블록의 위치 교환
            [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
        } else if (direction === 'DOWN') {
            if (index === newBlocks.length - 1) return; // 맨 아래면 무시
            // 아래 블록과 현재 블록의 위치 교환
            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        }
        setBlocks(newBlocks);
    };

    const deleteGnb = async (id) => {
          setGnbList(prev => prev.filter(item => item.id !== id));
          if (currentMenuId === id) { setCurrentMenuId(null); setCurrentMenuPath(''); }

          if (!USE_MOCK_DATA) {
             await supabase.from('gnb_menus').delete().eq('id', id);
             fetchGnb();
          }
    };

    const deleteSubMenu = async (parentId, childId) => {
          setGnbList(prev => prev.map(item => {
              if (item.id === parentId) {
                  return { ...item, children: item.children.filter(c => c.id !== childId) };
              }
              return item;
          }));
          if (currentMenuId === childId) { setCurrentMenuId(parentId); }

          if (!USE_MOCK_DATA) {
              await supabase.from('gnb_menus').delete().eq('id', childId);
              fetchGnb();
          }
    };

    return {
        gnbList, setGnbList, 
        currentMenuPath, setCurrentMenuPath, 
        currentMenuId, setCurrentMenuId,
        expandedMenuIds, setExpandedMenuIds,
        blocks, setBlocks, 
        originalBlocks, setOriginalBlocks,
        requests, setRequests,
        isLoading, setIsLoading,
        handleMenuChange, toggleExpand, 
        addGnb, addSubMenu, deleteGnb, deleteSubMenu, reorderMenu, moveBlock
    };
};

// --- Constants & Styles ---
const COLORS = { bg: '#100d1d', cardBg: '#191b23', cardHover: '#2e3038', primary: '#7387ff', textMain: '#f5f5ff', textSub: '#a9abb4', border: '#2e3038' };
const BANNER_STYLE = { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', hover: 'hover:border-orange-400' };
const CONTENT_STYLE = { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-600', hover: 'hover:border-slate-500' };
const BLOCK_STYLES = {
  TODAY: { bg: 'bg-blue-900/10', border: 'border-blue-500/30', badge: 'bg-blue-900/50 text-blue-300' },
  MULTI: { bg: 'bg-purple-900/10', border: 'border-purple-500/30', badge: 'bg-purple-900/50 text-purple-300' },
  BANNER: { bg: 'bg-orange-900/10', border: 'border-orange-500/30', badge: 'bg-orange-900/50 text-orange-300' },
  CONTENT: { bg: 'bg-[#191b23]', border: 'border-[#44464f]', badge: 'border-slate-700 text-slate-500' }
};

// [수정된 BlockRenderer] Today B tv(22:10), 빅배너(21:9) 비율 적용
const BlockRenderer = ({ block, isDragging, isOriginal, onUpdate, onEditId, onEditBannerId, onEditContentId, onEditTabName, onAddTab, readOnly = false, hideTargets = false, showExpired = false, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isBannerMenuOpen, setIsBannerMenuOpen] = useState(false);
  const bannerDragItem = useRef(null);
  const bannerDragOverItem = useRef(null);

  // [Helper] 날짜 유효성 체크
  const isBannerActive = (item) => {
    if (showExpired) return true;
    if (!item.startDate && !item.endDate) return true;
    const today = new Date().toISOString().split('T')[0];
    const start = item.startDate || '0000-00-00';
    const end = item.endDate || '9999-12-31';
    return today >= start && today <= end;
  };

  const isMulti = block.type === 'MULTI';
  const isBannerBlock = ['BIG_BANNER', 'BAND_BANNER', 'LONG_BANNER', 'FULL_PROMOTION', 'BANNER_1', 'BANNER_2', 'BANNER_3', 'MENU_BLOCK'].includes(block.type);
  const isToday = block.type === 'TODAY_BTV' || block.type === 'BIG_BANNER';
  
  const containerStyle = isOriginal ? 'opacity-60 grayscale border-dashed' : '';
  const dragStyle = isDragging ? 'border-[#7387ff] shadow-lg scale-[1.02] z-50' : 'border-transparent';
  
  let blockStyle = BLOCK_STYLES.CONTENT;
  if (isMulti) blockStyle = BLOCK_STYLES.MULTI;
  else if (isBannerBlock) blockStyle = BLOCK_STYLES.BANNER;
  else if (isToday) blockStyle = BLOCK_STYLES.TODAY;

  const togglePreview = (e) => { e.stopPropagation(); if (readOnly || !onUpdate) return; onUpdate({ showPreview: !block.showPreview }); };

  const addBanner = (e, type) => {
    e.stopPropagation(); if (readOnly || !onUpdate) return;
    const today = new Date().toISOString().split('T')[0];
    const newBanner = { id: `new-bn-${Date.now()}`, type: type, title: '배너', landingType: '', landingValue: '', img: '', eventId: '', isTarget: false, targetSeg: '', remarks: '', jiraLink: '', startDate: today, endDate: '9999-12-31' };
    
    if (block.type === 'BIG_BANNER') { onUpdate({ banners: [newBanner, ...(block.banners || [])] }); } 
    else if (block.type === 'TAB') { const newTabs = [...block.tabs]; newTabs[activeTab] = { ...newTabs[activeTab], leadingBanners: [...(newTabs[activeTab].leadingBanners || []), newBanner] }; onUpdate({ tabs: newTabs }); } 
    else if (['VERTICAL', 'HORIZONTAL', 'HORIZONTAL_MINI'].includes(block.type)) { onUpdate({ leadingBanners: [...(block.leadingBanners || []), newBanner] }); } 
    else if (block.type === 'TODAY_BTV') { onUpdate({ items: [...(block.items || []), { ...newBanner, type: 'BANNER' }] }); } 
    else { onUpdate({ banners: [...(block.banners || (block.banner ? [block.banner] : [])), newBanner] }); }
    setIsBannerMenuOpen(false);
  };

  const addContentToToday = (e) => { e.stopPropagation(); if (readOnly || !onUpdate) return; const today = new Date().toISOString().split('T')[0]; const newContent = { id: `new-ct-${Date.now()}`, type: 'CONTENT', title: '새 콘텐츠', img: '', seriesId: '', startDate: today, endDate: '9999-12-31' }; onUpdate({ items: [...(block.items || []), newContent] }); setIsBannerMenuOpen(false); };

  const onBannerDragStart = (e, idx, listType) => { if(readOnly) return; e.stopPropagation(); bannerDragItem.current = { index: idx, type: listType }; e.dataTransfer.effectAllowed = 'move'; };
  const onBannerDragEnter = (e, idx) => { if(readOnly) return; e.stopPropagation(); e.preventDefault(); bannerDragOverItem.current = idx; };
  const onBannerDrop = (e, listType) => {
      if(readOnly || !bannerDragItem.current) return;
      e.stopPropagation(); e.preventDefault();
      const dragIndex = bannerDragItem.current?.index; const hoverIndex = bannerDragOverItem.current;
      if (dragIndex === undefined || hoverIndex === null || dragIndex === hoverIndex || bannerDragItem.current?.type !== listType) return;
      
      if (block.type === 'TAB') { const newTabs = [...block.tabs]; const currentList = [...(newTabs[activeTab].leadingBanners || [])]; const [dragged] = currentList.splice(dragIndex, 1); currentList.splice(hoverIndex, 0, dragged); newTabs[activeTab].leadingBanners = currentList; onUpdate({ tabs: newTabs }); }
      else if (block.type === 'TODAY_BTV') { const currentList = [...(block.items || [])]; const [dragged] = currentList.splice(dragIndex, 1); currentList.splice(hoverIndex, 0, dragged); onUpdate({ items: currentList }); }
      else if (block.type === 'BIG_BANNER') { const currentList = [...(block.banners || [])]; const [dragged] = currentList.splice(dragIndex, 1); currentList.splice(hoverIndex, 0, dragged); onUpdate({ banners: currentList }); }
      else { const listKey = listType === 'LEADING' ? 'leadingBanners' : 'banners'; const currentList = [...(block[listKey] || [])]; const [dragged] = currentList.splice(dragIndex, 1); currentList.splice(hoverIndex, 0, dragged); onUpdate({ [listKey]: currentList }); }
      bannerDragItem.current = null; bannerDragOverItem.current = null;
  };

  const handleEditIdClick = (e) => { e.stopPropagation(); if (readOnly || !onEditId) return; onEditId(block.type === 'TAB' ? activeTab : null); };
  const handleBannerClick = (e, item, index = null, isLeading = false) => { e.stopPropagation(); if(readOnly) return; if(item.type === 'CONTENT') { if(onEditContentId) onEditContentId(item, index); } else { if (onEditBannerId) onEditBannerId(item, index, isLeading, block.type === 'TAB' ? activeTab : null); } };
  const handlePreviewSelect = (e, index) => { e.stopPropagation(); setPreviewIndex(index); }
  const handleMainPreviewClick = (e) => { e.stopPropagation(); if(readOnly) return; const items = block.type === 'TODAY_BTV' ? block.items : block.banners; if (items && items[previewIndex]) handleBannerClick(e, items[previewIndex], previewIndex); }
  const handleTabClick = (idx, name) => { setActiveTab(idx); }

  const getDisplayCount = (type) => 3;
  const displayCount = getDisplayCount(block.type);
  const currentIdType = block.type === 'TAB' && block.tabs && block.tabs[activeTab] ? block.tabs[activeTab]?.contentIdType : block.contentIdType;
  const currentIdValue = block.type === 'TAB' && block.tabs && block.tabs[activeTab] ? block.tabs[activeTab]?.contentId : block.contentId;
  const itemsToRender = (Array.isArray(block.items) ? block.items : []).filter(item => (!hideTargets || !item.isTarget) && isBannerActive(item));
  const tabsToRender = (Array.isArray(block.tabs) ? block.tabs : []).map(tab => ({ ...tab, leadingBanners: (tab.leadingBanners || []).filter(b => (!hideTargets || !b.isTarget) && isBannerActive(b)), items: (tab.items || []).filter(i => (!hideTargets || !i.isTarget) && isBannerActive(i)) }));
  const filteredBanners = (block.banners || []).filter(b => (!hideTargets || !b.isTarget) && isBannerActive(b));
  const filteredLeadingBanners = (block.leadingBanners || []).filter(b => (!hideTargets || !b.isTarget) && isBannerActive(b));
  const canAddBanner = !readOnly && ['VERTICAL', 'HORIZONTAL', 'HORIZONTAL_MINI', 'TAB', 'BIG_BANNER', 'BANNER_1', 'BANNER_2', 'BANNER_3', 'MENU_BLOCK', 'TODAY_BTV', 'LONG_BANNER', 'FULL_PROMOTION'].includes(block.type);
  const canPreview = ['VERTICAL', 'HORIZONTAL', 'HORIZONTAL_MINI', 'TAB', 'MULTI'].includes(block.type);
  const canEditId = !readOnly;

  const PosterItem = ({ type, text, isBanner, bannerType, img, onClick, onDragStart, onDragEnter, onDrop, draggable, isTarget, jiraLink, isSelected }) => {
    let sizeClass = "w-24 h-36"; 
    let bgClass = "bg-slate-700"; let textClass = "text-slate-500";
    if (type === 'HORIZONTAL') sizeClass = "w-[200px] h-36";
    if (type === 'HORIZONTAL_MINI') sizeClass = "w-24 h-16";
    if (isBanner) {
      bgClass = `${BANNER_STYLE.bg} ${BANNER_STYLE.border} ${BANNER_STYLE.hover} cursor-pointer`; 
      textClass = BANNER_STYLE.text;
      if (isTarget) bgClass = "bg-pink-900/20 border-pink-500/50 hover:border-pink-400 cursor-pointer";
      if (bannerType === '1-COL') sizeClass = "w-24 h-36";
      if (bannerType === '2-COL') sizeClass = "w-[200px] h-36"; 
      if (bannerType === '3-COL') sizeClass = "w-[304px] h-36";
      if (bannerType === 'MENU') sizeClass = "w-[200px] h-[88px]"; 
      if (bannerType === 'FULL') sizeClass = "w-[200px] h-[160px]";
    }
    if ((block.type === 'TODAY_BTV' || block.type === 'BIG_BANNER') && !isBanner) { bgClass = `${CONTENT_STYLE.bg} ${CONTENT_STYLE.border} ${CONTENT_STYLE.hover} cursor-pointer`; textClass = CONTENT_STYLE.text; }
    const hasImage = img && img.length > 0;
    const displayText = typeof text === 'string' ? text : 'Content';

    return (
      <div draggable={draggable && !readOnly} onDragStart={onDragStart} onDragEnter={onDragEnter} onDragOver={(e) => e.preventDefault()} onDrop={onDrop} onClick={onClick} className={`flex-shrink-0 relative group/poster ${draggable && !readOnly ? 'cursor-grab active:cursor-grabbing' : ''}`} title={readOnly ? '' : "클릭하여 미리보기"}>
        <div className={`${sizeClass} ${bgClass} ${isSelected ? 'ring-2 ring-[#7387ff] scale-[1.02]' : 'opacity-80 hover:opacity-100'} rounded border ${isBanner ? '' : 'border-slate-700'} overflow-hidden flex items-center justify-center ${textClass} text-[10px] font-medium relative bg-cover bg-center transition-all`} style={hasImage ? { backgroundImage: `url(${img})` } : {}}>
          {!hasImage && block.type !== 'TODAY_BTV' && block.type !== 'BIG_BANNER' && displayText}
          <div className="absolute top-1 left-1 flex flex-col gap-1 z-10">
            {isBanner && <span className={`text-[8px] ${isTarget ? 'bg-pink-600' : 'bg-orange-600/80'} text-white px-1 rounded font-bold shadow`}>{isTarget ? 'TARGET' : 'BANNER'}</span>}
            {!isBanner && (block.type === 'TODAY_BTV' || block.type === 'BIG_BANNER') && <span className="text-[8px] bg-slate-600/90 text-white px-1 rounded shadow backdrop-blur-sm">CONTENT</span>}
          </div>
          {isBanner && jiraLink && <div className="absolute top-1 right-1 z-10 text-white bg-[#0052cc] rounded-full p-0.5" title="Jira 링크 있음"><Link2 size={8}/></div>}
          {isBanner && !hasImage && <MousePointerClick className="absolute bottom-1 right-1 opacity-50" size={12}/>}
          {hasImage && <div className="absolute inset-0 bg-black/10 group-hover/poster:bg-black/0 transition-colors"></div>}
        </div>
      </div>
    );
  };

  return (
    <div className={`p-4 rounded-lg border ${blockStyle.border} ${blockStyle.bg} ${containerStyle} ${dragStyle} relative transition-colors pt-6`}>
      {!readOnly && !isOriginal && (
         <div className="absolute -top-3 left-0 right-0 h-6 flex justify-center items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="flex items-center gap-1 bg-[#161820] border border-slate-600 rounded-full px-2 py-0.5 shadow-md">
                 <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={isFirst} className={`p-1 hover:text-white hover:bg-slate-600 rounded-full transition-colors ${isFirst ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 cursor-pointer'}`} title="위로 이동"><ChevronDown size={12} className="rotate-180"/></button>
                 <div className="w-px h-3 bg-slate-600 mx-1"></div>
                 <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={isLast} className={`p-1 hover:text-white hover:bg-slate-600 rounded-full transition-colors ${isLast ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 cursor-pointer'}`} title="아래로 이동"><ChevronDown size={12} /></button>
             </div>
         </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1">
          <div className={`flex items-center gap-2 ${block.showTitle === false ? 'opacity-50' : ''}`}>
            <h3 className={`text-sm font-bold truncate ${isMulti ? 'text-purple-300' : 'text-slate-200'}`}>{block.title || 'Untitled Block'}</h3>
            {block.blockId && <span className="text-[10px] bg-slate-700 text-slate-300 px-1 rounded font-mono">{block.blockId}</span>}
            {block.isNew && <span className="text-[10px] bg-red-500 text-white px-1 rounded">NEW</span>}
            {block.isTarget && <span className="text-[10px] bg-pink-600 text-white px-1 rounded flex items-center gap-0.5 font-bold"><Target size={8}/> TARGET</span>}
          </div>
          {block.remarks && <p className="text-[10px] text-slate-500 flex items-center gap-1"><StickyNote size={10}/> {block.remarks}</p>}
          {!isOriginal && !readOnly && (
            <div className="flex items-center gap-2 text-[10px]">
              {canAddBanner && (
                <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); setIsBannerMenuOpen(!isBannerMenuOpen); }} className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-orange-500/30 text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 transition-colors cursor-pointer" title="추가"><PlusCircle size={10} /> 추가</button>
                  {isBannerMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-[#1e2029] border border-[#2e3038] rounded shadow-xl z-20 overflow-hidden flex flex-col w-28">
                      {!isToday && !['MENU_BLOCK', 'BIG_BANNER', 'FULL_PROMOTION'].includes(block.type) && (
                        <>
                          <button onClick={(e) => addBanner(e, '1-COL')} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300 border-b border-[#2e3038]/50">1단 배너</button>
                          <button onClick={(e) => addBanner(e, '2-COL')} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300 border-b border-[#2e3038]/50">2단 배너</button>
                          <button onClick={(e) => addBanner(e, '3-COL')} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300">3단 배너</button>
                        </>
                      )}
                      {block.type === 'MENU_BLOCK' && <button onClick={(e) => addBanner(e, 'MENU')} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300">메뉴 배너</button>}
                      {block.type === 'FULL_PROMOTION' && <button onClick={(e) => addBanner(e, 'FULL')} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300">풀 프로모션 배너</button>}
                      {(block.type === 'TODAY_BTV' || block.type === 'BIG_BANNER') && (
                        <>
                          <button onClick={(e) => addBanner(e, '1-COL')} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300 border-b border-[#2e3038]/50">배너 추가</button>
                          {block.type === 'TODAY_BTV' && <button onClick={addContentToToday} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300">콘텐츠 추가</button>}
                        </>
                      )}
                    </div>
                  )}
                  {isBannerMenuOpen && <div className="fixed inset-0 z-10" onClick={() => setIsBannerMenuOpen(false)}></div>}
                </div>
              )}
              {canPreview && (
                <button onClick={togglePreview} className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition-colors cursor-pointer hover:opacity-80 ${block.showPreview ? 'text-[#7387ff] border-[#7387ff]/30 bg-[#7387ff]/10' : 'text-slate-500 border-slate-700 bg-slate-800'}`}>
                  {block.showPreview ? <Eye size={10}/> : <EyeOff size={10}/>} {block.showPreview ? '프리뷰 ON' : '프리뷰 OFF'}
                </button>
              )}
              {canEditId && (
                <div className="flex items-center rounded border border-slate-700 bg-slate-800 overflow-hidden">
                  {!isBannerBlock && !isToday && (
                    <button onClick={handleEditIdClick} className="px-1.5 py-0.5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border-r border-slate-700 flex items-center gap-1">
                      {currentIdType === 'RACE' ? <RefreshCw size={10} className="text-orange-400"/> : <Database size={10} className="text-blue-400"/>} 
                      <span className="font-mono">{currentIdValue || 'ID 설정'}</span>
                    </button>
                  )}
                  <button onClick={handleEditIdClick} className="px-2 py-0.5 text-slate-300 font-mono hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1" title="블록 설정"><Settings size={10} className="text-slate-400"/> </button>
                </div>
              )}
            </div>
          )}
        </div>
        <span className={`text-[10px] border px-1.5 py-0.5 rounded flex items-center gap-1 ${blockStyle.badge}`}>{isMulti ? 'MULTI' : isToday ? 'TODAY' : block.type.includes('BANNER') || block.type === 'MENU_BLOCK' ? <ImageIcon size={10}/> : block.type === 'TAB' ? <Layers size={10}/> : <Grid size={10}/>}{!isMulti && block.type}</span>
      </div>

      {(block.type === 'TODAY_BTV' || block.type === 'BIG_BANNER') && (
        <div className={`relative w-full h-auto bg-slate-900 rounded-lg overflow-hidden border ${block.type === 'TODAY_BTV' ? 'border-blue-500/30' : 'border-orange-500/30'} flex flex-col`}>
            
            {/* [수정] Today B tv: aspect-[22/10], 빅배너: aspect-[21/9] 적용 */}
            <div className={`w-full ${block.type === 'TODAY_BTV' ? 'aspect-[22/10]' : 'aspect-[21/7]'} bg-cover relative group cursor-pointer`}
                 style={{
                     backgroundImage: (block.type === 'TODAY_BTV' ? itemsToRender : filteredBanners)?.[previewIndex]?.img ? `url(${(block.type === 'TODAY_BTV' ? itemsToRender : filteredBanners)[previewIndex].img})` : 'none',
                     backgroundPosition: 'right top'
                 }}
                 onClick={handleMainPreviewClick}
            >
               {!(block.type === 'TODAY_BTV' ? itemsToRender : filteredBanners)?.[previewIndex]?.img && (
                   <div className={`absolute inset-0 flex items-center justify-center font-bold ${block.type === 'TODAY_BTV' ? 'text-blue-300' : 'text-orange-300'}`}>
                       {(block.type === 'TODAY_BTV' ? itemsToRender : filteredBanners)?.[previewIndex]?.title || '메인 영역 (이미지 없음)'}
                   </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
               
               {(block.type === 'TODAY_BTV' ? itemsToRender : filteredBanners)?.[previewIndex]?.isTarget && (
                   <div className="absolute top-3 left-3 z-20"><span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md flex items-center gap-1"><Target size={10} /> TARGET</span></div>
               )}

               <div className="absolute bottom-4 left-4 z-10">
                   <h3 className="text-white font-extrabold text-2xl drop-shadow-md">{(block.type === 'TODAY_BTV' ? itemsToRender : filteredBanners)?.[previewIndex]?.title || '타이틀'}</h3>
                   {block.type === 'BIG_BANNER' && <p className="text-slate-300 text-sm mt-1 line-clamp-2 max-w-[80%] bg-black/30 px-2 py-1 rounded backdrop-blur-sm">소개 문구 영역</p>}
               </div>

               {!readOnly && (
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="bg-black/50 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1 backdrop-blur"><Edit3 size={12}/> 설정 편집</span></div>
               )}
            </div>

            <div className="h-28 bg-[#161820] flex items-center px-4 gap-3 overflow-x-auto border-t border-slate-800 shrink-0">
               {(block.type === 'TODAY_BTV' ? itemsToRender : filteredBanners)?.map((item, idx) => (
                  <div key={idx} 
                       onClick={(e) => handlePreviewSelect(e, idx)}
                       draggable={!isOriginal && !readOnly}
                       onDragStart={(e) => onBannerDragStart(e, idx, 'BANNER')}
                       onDragEnter={(e) => onBannerDragEnter(e, idx)}
                       onDrop={(e) => onBannerDrop(e, 'BANNER')}
                       onDragOver={(e) => e.preventDefault()}
                       className={`flex-shrink-0 w-32 h-20 rounded relative cursor-pointer transition-all ${idx === previewIndex ? 'ring-2 ring-[#7387ff] scale-105' : 'opacity-60 hover:opacity-100'} bg-cover bg-center ${item.type === 'CONTENT' ? 'border border-slate-600' : 'border border-orange-500/30'} group/item overflow-hidden`}
                       style={item.img ? {backgroundImage: `url(${item.img})`} : {backgroundColor: item.type === 'CONTENT' ? '#1e293b' : 'rgba(249, 115, 22, 0.1)'}}
                  >
                      {!isOriginal && !readOnly && (
                        <button onClick={(e) => { e.stopPropagation(); const currentList = block.type === 'TODAY_BTV' ? [...(block.items || [])] : [...(block.banners || [])]; currentList.splice(idx, 1); onUpdate(block.type === 'TODAY_BTV' ? { items: currentList } : { banners: currentList }); if (previewIndex >= currentList.length) setPreviewIndex(Math.max(0, currentList.length - 1)); }} className="absolute -top-1 -right-1 z-20 bg-[#2e3038] text-slate-400 hover:text-red-500 border border-slate-600 rounded-full p-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg scale-75" title="삭제"><Trash2 size={12} /></button>
                      )}
                      {!item.img && <div className={`flex items-center justify-center h-full text-center px-1 font-bold break-keep ${item.type === 'CONTENT' ? 'text-slate-300' : 'text-orange-300'}`}><span className="text-[10px] line-clamp-2">{item.title}</span></div>}
                      {item.isTarget && <div className="absolute top-1 left-1 z-10"><span className="bg-pink-600 text-white text-[8px] font-bold px-1 rounded shadow-sm">TARGET</span></div>}
                      <div className={`absolute bottom-0 left-0 right-0 text-[8px] text-white px-1 py-0.5 font-bold backdrop-blur-sm text-center truncate ${item.type === 'CONTENT' ? 'bg-slate-900/80' : 'bg-orange-900/80'}`}>{item.title}</div>
                  </div>
               ))}
            </div>
        </div>
      )}

      {['BAND_BANNER', 'LONG_BANNER', 'BANNER_1', 'BANNER_2', 'BANNER_3', 'TAB', 'VERTICAL', 'HORIZONTAL', 'HORIZONTAL_MINI', 'MULTI', 'MENU_BLOCK', 'FULL_PROMOTION'].includes(block.type) && (
        <div className={`flex gap-2 ${['BAND_BANNER'].includes(block.type) ? 'flex-col' : block.type === 'LONG_BANNER' || block.type === 'MULTI' ? '' : block.type === 'TAB' ? 'flex-col' : 'items-center'} overflow-x-auto flex-nowrap min-h-[50px] pb-2`}>
           {block.type === 'TAB' ? (
               <div className="w-full bg-[#100d1d] rounded-lg p-3 border border-slate-700/50">
                  <div className="flex gap-1 mb-3 border-b border-slate-700 overflow-x-auto items-center">
                    {tabsToRender.map((tab, idx) => (
                      <button key={tab.id || idx} onClick={(e) => { e.stopPropagation(); handleTabClick(idx, tab.name); }} className={`px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors whitespace-nowrap flex items-center gap-1 group ${activeTab === idx ? 'bg-[#7387ff] text-white' : 'text-slate-500 hover:text-slate-300'}`}>{tab.name || `Tab ${idx + 1}`}{activeTab === idx && !isOriginal && !readOnly && <Edit3 size={8} className="opacity-50 group-hover:opacity-100" />}</button>
                    ))}
                    {!isOriginal && !readOnly && <button onClick={(e) => { e.stopPropagation(); onAddTab(); }} className="px-2 py-1 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors"><Plus size={12}/></button>}
                  </div>
                  <div className="flex gap-2 overflow-x-auto flex-nowrap min-h-[100px] items-center pb-2">
                    {tabsToRender[activeTab]?.leadingBanners?.map((banner, idx) => (
                      <PosterItem key={`tab-bn-${idx}`} type="VERTICAL" isBanner={true} isTarget={banner.isTarget} jiraLink={banner.jiraLink} bannerType={banner.type} text={banner.title || '배너'} img={banner.img} onClick={(e) => handleBannerClick(e, banner, idx, true)} draggable={!isOriginal && !readOnly} onDragStart={(e) => onBannerDragStart(e, idx, 'LEADING')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'LEADING')} />
                    ))}
                    {tabsToRender[activeTab]?.items?.slice(0,4).map((item, i) => <PosterItem key={i} type="VERTICAL" text={item.title} />)}
                  </div>
               </div>
           ) : (
             <>
               {filteredBanners?.map((banner, idx) => (
                 <div key={`bn-${idx}`} className={block.type === 'BAND_BANNER' ? 'w-full shrink-0' : 'shrink-0'}>
                   {block.type === 'BAND_BANNER' ? (
                      <div draggable={!isOriginal && !readOnly} onDragStart={(e) => onBannerDragStart(e, idx, 'BANNER')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'BANNER')} onDragOver={(e) => e.preventDefault()} onClick={(e) => handleBannerClick(e, banner, idx)} 
                           className={`w-full h-auto aspect-[8/1] ${BANNER_STYLE.bg} border ${banner.isTarget ? 'border-pink-500/50' : BANNER_STYLE.border} ${BANNER_STYLE.hover} cursor-pointer rounded flex items-center justify-center ${BANNER_STYLE.text} text-[10px] font-bold relative bg-cover bg-center transition-colors group/band`} 
                           style={banner.img ? { backgroundImage: `url(${banner.img})` } : {}}>
                        {!banner.img && (banner.title || '배너')}
                        <div className="absolute right-2 top-2 flex flex-col gap-1 items-end">{banner.isTarget && <span className="text-[8px] bg-pink-600 text-white px-1 rounded font-bold flex items-center gap-0.5"><Target size={6}/> TARGET</span>}{banner.landingType && <span className="text-[9px] bg-black/50 text-white px-1 rounded">{banner.landingType}</span>}{banner.jiraLink && <span className="text-[8px] bg-[#0052cc] text-white px-1 rounded flex items-center gap-0.5"><Link2 size={6}/> Jira</span>}</div>
                        {!isOriginal && !readOnly && <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/band:opacity-50 text-white cursor-grab"><GripVertical size={16}/></div>}
                      </div>
                   ) : block.type === 'LONG_BANNER' ? (
                      <div draggable={!isOriginal && !readOnly} onDragStart={(e) => onBannerDragStart(e, idx, 'BANNER')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'BANNER')} onDragOver={(e) => e.preventDefault()} onClick={(e) => handleBannerClick(e, banner, idx)} className={`flex-shrink-0 w-48 h-[270px] ${BANNER_STYLE.bg} border ${banner.isTarget ? 'border-pink-500/50' : BANNER_STYLE.border} ${BANNER_STYLE.hover} cursor-pointer rounded flex flex-col items-center justify-center ${BANNER_STYLE.text} text-[10px] font-bold relative p-4 text-center bg-cover bg-center transition-colors group/long`} style={banner.img ? { backgroundImage: `url(${banner.img})` } : {}}>
                        {!banner.img && <><span className="mb-2">{banner.title || '배너'}</span><span className="text-[9px] opacity-70 font-normal">1032 x 1452 비율</span></>}
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">{banner.isTarget && <span className="text-[8px] bg-pink-600 text-white px-1 rounded font-bold">TARGET</span>}{banner.landingType && <span className="text-[9px] bg-black/50 text-white px-1 rounded">{banner.landingType}</span>}{banner.jiraLink && <span className="text-[8px] bg-[#0052cc] text-white px-1 rounded flex items-center gap-0.5"><Link2 size={6}/></span>}</div>
                        {!isOriginal && !readOnly && <div className="absolute top-2 right-2 opacity-0 group-hover/long:opacity-50 text-white cursor-grab"><GripVertical size={14}/></div>}
                      </div>
                   ) : block.type === 'FULL_PROMOTION' ? (
                      <PosterItem type="VERTICAL" isBanner={true} isTarget={banner.isTarget} jiraLink={banner.jiraLink} bannerType="FULL" text={banner.title} img={banner.img} onClick={(e) => handleBannerClick(e, banner, idx)} draggable={!isOriginal && !readOnly} onDragStart={(e) => onBannerDragStart(e, idx, 'BANNER')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'BANNER')} />
                   ) : block.type === 'MENU_BLOCK' ? (
                        <PosterItem type="VERTICAL" isBanner={true} isTarget={banner.isTarget} jiraLink={banner.jiraLink} bannerType={banner.type} text={banner.title} img={banner.img} onClick={(e) => handleBannerClick(e, banner, idx)} draggable={!isOriginal && !readOnly} onDragStart={(e) => onBannerDragStart(e, idx, 'BANNER')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'BANNER')} />
                   ) : (
                      <PosterItem type="VERTICAL" isBanner={true} isTarget={banner.isTarget} jiraLink={banner.jiraLink} bannerType={banner.type || (block.type === 'BANNER_1' ? '1-COL' : block.type === 'BANNER_2' ? '2-COL' : '3-COL')} text={banner.title} img={banner.img} onClick={(e) => handleBannerClick(e, banner, idx)} draggable={!isOriginal && !readOnly} onDragStart={(e) => onBannerDragStart(e, idx, 'BANNER')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'BANNER')} />
                   )}
                 </div>
               ))}
               {filteredLeadingBanners?.map((banner, idx) => (
                 <PosterItem key={`lb-${idx}`} type={block.type} isBanner={true} isTarget={banner.isTarget} jiraLink={banner.jiraLink} bannerType={banner.type} text={banner.title || '배너'} img={banner.img} onClick={(e) => handleBannerClick(e, banner, idx, true)} draggable={!isOriginal && !readOnly} onDragStart={(e) => onBannerDragStart(e, idx, 'LEADING')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'LEADING')} />
               ))}
               {itemsToRender.slice(0, displayCount).map((item, idx) => <PosterItem key={idx} type={block.type} text={item.title} />)}
               {itemsToRender.length > displayCount && <div className="flex items-center text-slate-600 text-xs pl-1">...</div>}
             </>
           )}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const getLocalTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [viewMode, setViewMode] = useState('EDITOR');
  const [compareMode, setCompareMode] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isViewFilterOpen, setIsViewFilterOpen] = useState(false); 
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // 메인 이력 화면(리스트+비교) 노출 여부
  const [isCalendarPopupOpen, setIsCalendarPopupOpen] = useState(false); // 1차 진입 시 뜨는 '달력 팝업' 노출 여부
  const [historySelectedDate, setHistorySelectedDate] = useState(getLocalTodayString());
  const [historyDetailReq, setHistoryDetailReq] = useState(null); // 상세 비교할 데이터
  
  // [NEW] 통합 뷰 옵션
  const [viewOptions, setViewOptions] = useState({
      hideTargets: false,
      showExpired: false
  });

  const [supabase, setSupabase] = useState(USE_MOCK_DATA ? mockSupabase : null);

  const {
    gnbList,
    setGnbList,
    currentMenuPath,
    currentMenuId,
    setCurrentMenuId,
    expandedMenuIds,
    toggleExpand,
    blocks,
    setBlocks,
    originalBlocks,
    setOriginalBlocks,
    requests,
    setRequests,
    isLoading,
    handleMenuChange,
    addGnb,
    addSubMenu,
    deleteGnb,
    deleteSubMenu,
    reorderMenu,
    moveBlock
  } = useBtvData(supabase, viewMode);

  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null, position: 'BOTTOM' });

  // 2. 스크롤 박스 제어용 Ref
  const scrollContainerRef = useRef(null);

  // 3. 드래그 시 자동 스크롤 함수
  const handleScrollOnDrag = (e) => {
    if (!isDragEnabled || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const { top, bottom } = container.getBoundingClientRect();
    const mouseY = e.clientY;
    
    // 감지 영역 (상하단 100px)
    const threshold = 100;
    const scrollSpeed = 20; // 스크롤 속도

    // 마우스가 상단 영역 -> 위로 스크롤
    if (mouseY < top + threshold) {
        container.scrollTop -= scrollSpeed;
    }
    // 마우스가 하단 영역 -> 아래로 스크롤
    else if (mouseY > bottom - threshold) {
        container.scrollTop += scrollSpeed;
    }
  };

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.async = true;
        script.onload = () => {
          if (window.supabase) {
            const client = window.supabase.createClient(supabaseUrl, supabaseKey);
            setSupabase(client);
          }
        };
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
      } catch (e) {
        console.error("Supabase Init Error", e);
      }
    }
  }, []);

  const [unaFilter, setUnaFilter] = useState('ALL');
  const [inboxFilter, setInboxFilter] = useState('ALL');

  useEffect(() => {
    if (viewMode === 'REQUEST' && currentMenuPath) {
      setUnaFilter(currentMenuPath);
    }
  }, [currentMenuPath, viewMode]);

  const inboxRequests = requests
    .filter(r => !r.snapshot) 
    .filter(req => inboxFilter === 'ALL' || req.gnb === inboxFilter)
    .filter(r => r.status === 'PENDING');

  const unaRequests = requests
    .filter(r => r.snapshot) 
    .filter(req => {
      if (unaFilter === 'ALL') return true;
      return req.menuPath && req.menuPath.includes(unaFilter);
    });

  const unaPendingCount = unaRequests.filter(r => r.status === 'PENDING').length;

  const [viewRequest, setViewRequest] = useState(null);
  const [historyDate, setHistoryDate] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null, position: 'BOTTOM' });
  const scrollContainerRef = useRef(null);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [newRequestData, setNewRequestData] = useState({ 
      requester: '', team: '', headline: '', location: '', desc: '', remarks: '', 
      type: 'VERTICAL', jiraLink: '', gnb: '홈',
      isTarget: false, startDate: todayStr, endDate: '9999-12-31' 
  });

  const [blockCategory, setBlockCategory] = useState('CONTENT');
  const [newBlockData, setNewBlockData] = useState({ title: '', type: 'VERTICAL', showPreview: false, contentIdType: 'LIBRARY', contentId: '', remarks: '', isTarget: false, targetSeg: '', useLeadingBanner: false, leadingBannerType: '1-COL', leadingBannerTitle: '배너', bannerTitle: '배너', showTitle: true });
  const [editIdData, setEditIdData] = useState({ blockId: null, tabIndex: null, idType: 'LIBRARY', idValue: '', blockIdCode: '', isTarget: false, targetSeg: '', remarks: '', title: '', showTitle: true });
  
  const [editBannerData, setEditBannerData] = useState({ 
      blockId: null, isLeading: false, bannerIndex: null, tabIndex: null, 
      landingType: '', landingValue: '', img: '', eventId: '', jiraLink: '', 
      isTarget: false, targetSeg: '', remarks: '', title: '', desc: '',
      startDate: '', endDate: '' 
  });
  
  const [editContentData, setEditContentData] = useState({ blockId: null, itemIndex: null, title: '', seriesId: '', img: '' });
  const [editTabNameData, setEditTabNameData] = useState({ blockId: null, tabIndex: null, name: '' });
  const [scheduleDate, setScheduleDate] = useState('');
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [diffSummary, setDiffSummary] = useState([]);
  const [menuNameInput, setMenuNameInput] = useState('');
  const [isDivider, setIsDivider] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date()); // 오늘 날짜로 변경

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const dragType = useRef(null);
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState(null);

  // [Helper] Display Blocks Filtering
  const displayedBlocks = blocks.filter(block => !viewOptions.hideTargets || !block.isTarget);

  const generateDiffs = () => {
    const changes = [];
    const orgMap = new Map(originalBlocks.map(b => [b.id, b]));

    // 1. 삭제된 블록 감지
    originalBlocks.forEach(org => { 
        if (!blocks.find(b => b.id === org.id)) {
            changes.push({ type: '삭제', block: org, desc: `[${org.type}] '${org.title}' 블록 삭제` }); 
        }
    });

    // 2. 신규 및 수정된 블록 감지
    blocks.forEach((block) => {
      const original = orgMap.get(block.id);
      
      if (!original) {
          // 신규 블록
          changes.push({ type: '신규', block, desc: `[${block.type}] '${block.title}' 블록 신규 추가` });
      } else {
        // 수정된 블록 (상세 비교)
        const diffs = [];
        
        // (1) 타이틀 변경
        if (block.title !== original.title) diffs.push(`타이틀 변경`);
        
        // (2) [NEW] 블록명 노출 여부 변경
        if (block.showTitle !== original.showTitle) {
            diffs.push(`블록명 ${block.showTitle ? '노출' : '숨김'} 처리`);
        }

        // (3) [NEW] ID (Library/Race) 변경
        if (block.contentId !== original.contentId) {
            diffs.push(`ID 변경(${original.contentId || '없음'} → ${block.contentId})`);
        }
        
        // (4) 배너/아이템 변경 감지
        const newBanners = block.banners || block.items || [];
        const oldBanners = original.banners || original.items || [];
        
        if (newBanners.length !== oldBanners.length) {
            diffs.push(`배너 수 변경(${oldBanners.length}→${newBanners.length})`);
        } else {
            // 배너 내부 속성(기간 등) 비교
            newBanners.forEach((nb, idx) => {
                const ob = oldBanners[idx];
                if (ob) {
                    if (nb.startDate !== ob.startDate || nb.endDate !== ob.endDate) {
                        diffs.push(`배너#${idx+1} 기간 변경`);
                    }
                    if (nb.img !== ob.img) {
                        diffs.push(`배너#${idx+1} 이미지 교체`);
                    }
                }
            });
        }

        // 변경사항이 하나라도 있으면 changes에 추가
        if (diffs.length > 0) {
            changes.push({ type: '수정', block, desc: `[${block.title}] ${diffs.join(', ')}` });
        }
      }
    });
    return changes;
  };

  const handleUpdateBlock = (blockId, updates) => setBlocks(prev => prev.map(block => block.id === blockId ? { ...block, ...updates } : block));
  const openAddBlockModal = (position = 'BOTTOM') => {
    setBlockCategory('CONTENT');
    setNewBlockData({ title: '', type: 'VERTICAL', showPreview: false, contentIdType: 'LIBRARY', contentId: '', remarks: '', isTarget: false, targetSeg: '', useLeadingBanner: false, leadingBannerType: '1-COL', leadingBannerTitle: '배너', bannerTitle: '배너', showTitle: true });
    // 모달 state에 position 저장
    setModalState({ isOpen: true, type: 'ADD_BLOCK', data: null, position }); 
  };

  const confirmAddBlock = () => {
    if (!newBlockData.title) return alert('블록 타이틀을 입력해주세요.');
    
    // 기본 블록 데이터 구조 생성
    let newBlock = { 
      id: `new-${Date.now()}`, 
      title: newBlockData.title, 
      isNew: true, 
      remarks: newBlockData.remarks, 
      isTarget: newBlockData.isTarget, 
      targetSeg: newBlockData.targetSeg, 
      type: newBlockData.type, 
      showTitle: newBlockData.showTitle, 
      blockId: newBlockData.contentId 
    };

    // [수정된 부분] 배너 카테고리일 때 초기 배너 생성 로직
    if (blockCategory === 'BANNER') {
      newBlock.type = newBlockData.type;
      
      // 1. 배너 타입에 따라 알맞은 사이즈(Col Type) 결정
      let initialBannerType = '1-COL';
      if (newBlockData.type === 'BANNER_2') initialBannerType = '2-COL';
      else if (newBlockData.type === 'BANNER_3') initialBannerType = '3-COL';
      else if (newBlockData.type === 'MENU_BLOCK') initialBannerType = 'MENU';
      else if (newBlockData.type === 'FULL_PROMOTION') initialBannerType = 'FULL'; // [NEW] 핵심: 풀 프로모션 추가

      // 2. 결정된 타입으로 초기 배너 1개 생성
      newBlock.banners = [{ 
          id: `bn-${Date.now()}`, 
          title: newBlockData.bannerTitle || '배너', 
          type: initialBannerType 
      }];

      // 3. 예외 케이스 처리
      if (newBlockData.type === 'BIG_BANNER') newBlock.banners[0].desc = "";
      if (newBlockData.type === 'MENU_BLOCK') newBlock.showTitle = false;
    
    } else if (blockCategory === 'MULTI') {
      newBlock.type = 'MULTI'; newBlock.items = [{ title: '추천1' }];
    } else if (blockCategory === 'SPECIAL') {
      newBlock.type = 'TODAY_BTV'; newBlock.items = [{ id: `t-item-${Date.now()}`, type: 'CONTENT', title: '대표 콘텐츠', img: '' }];
    } else {
      newBlock.type = newBlockData.type;
      newBlock.items = [
        { id: `ni-1-${Date.now()}`, title: '콘텐츠 1' },
        { id: `ni-2-${Date.now()}`, title: '콘텐츠 2' },
        { id: `ni-3-${Date.now()}`, title: '콘텐츠 3' }
      ];
      if (newBlockData.type === 'TAB') newBlock.tabs = [{ id: 't1', name: '탭 1', items: [{ title: '콘텐츠 1' }, { title: '콘텐츠 2' }, { title: '콘텐츠 3' }] }];
      if (newBlockData.useLeadingBanner) newBlock.leadingBanners = [{ title: newBlockData.leadingBannerTitle || '배너' }];
    }
    
    // 위치(TOP/BOTTOM)를 구분하여 추가하는 방식 (이걸로 교체)
    setBlocks(prev => {
        const newBlocks = [...prev];
        
        if (modalState.position === 'TOP') {
            // 상단 추가: 고정형 블록(빅배너 등) 다음 위치에 삽입
            let insertIndex = 0;
            for (let i = 0; i < newBlocks.length; i++) {
                if (['BIG_BANNER', 'TODAY_BTV'].includes(newBlocks[i].type)) {
                    insertIndex = i + 1;
                } else {
                    break;
                }
            }
            newBlocks.splice(insertIndex, 0, newBlock);
            return newBlocks;
        } else {
            // 하단 추가: 맨 뒤에 추가
            return [...newBlocks, newBlock];
        }
    });
    
    setModalState({ isOpen: false, type: null, data: null });
  };
  const handleDelete = (id, e) => { e.preventDefault(); e.stopPropagation(); setModalState({ isOpen: true, type: 'DELETE_BLOCK', data: id }); };
  const handleReset = () => { setBlocks(JSON.parse(JSON.stringify(originalBlocks))); };
  const reqDeleteRequest = (id, e) => { e.stopPropagation(); setModalState({ isOpen: true, type: 'DELETE_REQUEST', data: id }); };
  const reqApprove = (req) => setModalState({ isOpen: true, type: 'APPROVE', data: req });
  const handleRejectRequest = async (id, e) => { e.stopPropagation(); if (window.confirm('거절하시겠습니까?')) { await supabase.from('requests').update({ status: 'REJECTED' }).eq('id', id); setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r)); } };

  const openEditIdModal = (block, tabIndex) => {
    let cType, cVal, cTarget, cSeg, cRemark;
    if (block.type === 'TAB' && tabIndex !== null && block.tabs[tabIndex]) {
      cType = block.tabs[tabIndex].contentIdType;
      cVal = block.tabs[tabIndex].contentId;
    } else {
      cType = block.contentIdType;
      cVal = block.contentId;
      cTarget = block.isTarget;
      cSeg = block.targetSeg;
      cRemark = block.remarks;
    }
    setEditIdData({
      blockId: block.id,
      tabIndex,
      idType: cType,
      idValue: cVal,
      blockIdCode: block.blockId || '',
      isTarget: cTarget || false,
      targetSeg: cSeg || '',
      remarks: cRemark || '',
      title: block.title || '',
      showTitle: block.showTitle !== false
    });
    setModalState({ isOpen: true, type: 'EDIT_ID', data: null });
  };
  const saveEditedId = () => {
    const { blockId, tabIndex, idType, idValue, blockIdCode, isTarget, targetSeg, remarks, title, showTitle } = editIdData;
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    let updates = { title, showTitle, blockId: blockIdCode };
    if (block.type === 'TAB' && tabIndex !== null) {
      const newTabs = [...block.tabs];
      newTabs[tabIndex] = { ...newTabs[tabIndex], contentIdType: idType, contentId: idValue };
      updates.tabs = newTabs;
    } else {
      updates = { ...updates, contentIdType: idType, contentId: idValue, isTarget, targetSeg, remarks };
    }
    handleUpdateBlock(blockId, updates);
    setModalState({ ...modalState, isOpen: false });
  };
  
  const handleBannerEdit = (block, bannerData, bannerIndex, isLeading, tabIndex = null) => { 
      setEditBannerData({ 
          blockId: block.id, isLeading, bannerIndex, tabIndex, 
          landingType: bannerData.landingType || '', landingValue: bannerData.landingValue || '', 
          img: bannerData.img || '', eventId: bannerData.eventId || '', jiraLink: bannerData.jiraLink || '', 
          isTarget: bannerData.isTarget || false, targetSeg: bannerData.targetSeg || '', 
          remarks: bannerData.remarks || '', title: bannerData.title || '', desc: bannerData.desc || '',
          startDate: bannerData.startDate || todayStr,
          endDate: bannerData.endDate || '9999-12-31'
      }); 
      setModalState({ isOpen: true, type: 'EDIT_BANNER', data: null }); 
  };
  
  const saveEditedBanner = () => { 
      const { blockId, isLeading, bannerIndex, tabIndex, landingType, landingValue, img, eventId, jiraLink, isTarget, targetSeg, remarks, title, desc, startDate, endDate } = editBannerData; 
      setBlocks(prev => prev.map(b => { 
          if (b.id !== blockId) return b; 
          const newBlock = { ...b }; 
          const newBannerData = { landingType, landingValue, img, eventId, jiraLink, isTarget, targetSeg, remarks, title, desc, startDate, endDate }; 
          if (b.type === 'TAB' && tabIndex !== null) { 
              const newTabs = [...b.tabs]; 
              if (isLeading) { 
                  const currentTab = newTabs[tabIndex]; 
                  const newLeadingBanners = [...(currentTab.leadingBanners || [])]; 
                  if (newLeadingBanners[bannerIndex]) newLeadingBanners[bannerIndex] = { ...newLeadingBanners[bannerIndex], ...newBannerData }; 
                  newTabs[tabIndex] = { ...currentTab, leadingBanners: newLeadingBanners }; 
              } 
              newBlock.tabs = newTabs; 
          } else if (isLeading) { 
              const newLeadingBanners = [...(newBlock.leadingBanners || [])]; 
              if (newLeadingBanners[bannerIndex]) newLeadingBanners[bannerIndex] = { ...newLeadingBanners[bannerIndex], ...newBannerData }; 
              newBlock.leadingBanners = newLeadingBanners; 
          } else if (newBlock.type === 'TODAY_BTV') { 
              const newItems = [...(newBlock.items || [])]; 
              if(newItems[bannerIndex]) newItems[bannerIndex] = { ...newItems[bannerIndex], ...newBannerData }; 
              newBlock.items = newItems; 
          } else if (newBlock.banners) { 
              const newBanners = [...newBlock.banners]; 
              if (newBanners[bannerIndex]) newBanners[bannerIndex] = { ...newBanners[bannerIndex], ...newBannerData }; 
              newBlock.banners = newBanners; 
          } else if (newBlock.banner) { 
              newBlock.banner = { ...newBlock.banner, ...newBannerData }; 
          } 
          return newBlock; 
      })); 
      setModalState({ ...modalState, isOpen: false }); 
  };

  const handleEditContent = (blockId, itemIndex, currentData) => { setEditContentData({ blockId, itemIndex, title: currentData.title || '', seriesId: currentData.seriesId || '', img: currentData.img || '' }); setModalState({ isOpen: true, type: 'EDIT_CONTENT', data: null }); };
  const saveEditedContent = () => { const { blockId, itemIndex, title, seriesId, img } = editContentData; setBlocks(prev => prev.map(b => { if (b.id !== blockId) return b; const newItems = [...(b.items || [])]; if (newItems[itemIndex]) { newItems[itemIndex] = { ...newItems[itemIndex], title, seriesId, img }; } return { ...b, items: newItems }; })); setModalState({ ...modalState, isOpen: false }); };
  const confirmDeleteBanner = () => { setModalState({ ...modalState, type: 'DELETE_BANNER_CONFIRM' }); };
  const handleDeleteBanner = () => { const { blockId, isLeading, bannerIndex, tabIndex } = editBannerData; setBlocks(prev => prev.map(b => { if (b.id !== blockId) return b; if (b.type === 'TAB' && tabIndex !== null) { const newTabs = [...b.tabs]; if (isLeading) { const currentTab = newTabs[tabIndex]; const newLeadingBanners = (currentTab.leadingBanners || []).filter((_, idx) => idx !== bannerIndex); newTabs[tabIndex] = { ...currentTab, leadingBanners: newLeadingBanners }; } return { ...b, tabs: newTabs }; } if (isLeading) { const newLeadingBanners = (b.leadingBanners || []).filter((_, idx) => idx !== bannerIndex); return { ...b, leadingBanners: newLeadingBanners }; } else if (b.type === 'TODAY_BTV') { const newItems = (b.items || []).filter((_, idx) => idx !== bannerIndex); return { ...b, items: newItems }; } else if (b.banners) { const newBanners = b.banners.filter((_, idx) => idx !== bannerIndex); if (newBanners.length === 0 && ['BAND_BANNER', 'LONG_BANNER', 'BANNER_1', 'BANNER_2', 'BANNER_3', 'MENU_BLOCK'].includes(b.type)) return null; return { ...b, banners: newBanners }; } return b; }).filter(Boolean)); setModalState({ ...modalState, isOpen: false }); };
  const handleAddTab = (blockId) => { setBlocks(prev => prev.map(b => { if (b.id !== blockId) return b; const newTabs = [...(b.tabs || [])]; newTabs.push({ id: `tab-new-${Date.now()}`, name: `새 탭 ${newTabs.length + 1}`, contentId: '', items: [1, 2, 3, 4].map(i => ({ title: `콘텐츠 ${i}` })) }); return { ...b, tabs: newTabs }; })); };
  const handleEditTabName = (blockId, tabIndex, currentName) => { setEditTabNameData({ blockId, tabIndex, name: currentName }); setModalState({ isOpen: true, type: 'EDIT_TAB_NAME', data: null }); };
  const saveTabName = () => { const { blockId, tabIndex, name } = editTabNameData; setBlocks(prev => prev.map(b => { if (b.id !== blockId) return b; const newTabs = [...b.tabs]; newTabs[tabIndex] = { ...newTabs[tabIndex], name }; return { ...b, tabs: newTabs }; })); setModalState({ ...modalState, isOpen: false }); };
  const handleOpenSaveModal = () => { 
    const today = new Date(); 
    today.setDate(today.getDate() + 3); 
    setScheduleDate(today.toISOString().split('T')[0]); 
    setRequestTitle(`[편성요청] ${currentMenuPath} 정기 개편`); 
    setRequestDescription(''); // [신규] 상세 설명 초기화
    
    const diffs = generateDiffs(); 
    // 변경 사항이 없어도 저장은 가능하게 하되, 요약에는 '변경 사항 없음' 표시
    setDiffSummary(diffs.length > 0 ? diffs : []); 
    
    setModalState({ isOpen: true, type: 'SAVE', data: null }); 
  };

  const handleCreateRequest = async () => {
    if (!newRequestData.headline || !newRequestData.requester) return alert('요청자 및 제목을 입력해주세요.');

    let requestType = newRequestData.type;
    let finalRemarks = newRequestData.remarks || '';

    if (requestType === 'TODAY_BTV_BANNER') {
      requestType = 'TODAY_BTV';
      finalRemarks = `[Today B tv] ${finalRemarks || ''}`;
    }

    let finalDescription = newRequestData.desc || '';
    finalDescription += `\n\n[요청 타입] ${requestType}`;
    finalDescription += `\n[기간] ${newRequestData.startDate} ~ ${newRequestData.endDate}`;
    finalDescription += `\n[타겟여부] ${newRequestData.isTarget ? 'Y' : 'N'}`;
    
    if (finalRemarks) finalDescription += `\n[비고] ${finalRemarks}`;
    if (newRequestData.jiraLink) finalDescription += `\n[Jira 티켓] ${newRequestData.jiraLink}`;

    if (USE_MOCK_DATA) {
      alert('(Mock) 요청이 등록되었습니다. (실제 DB 저장 X)');
      const mockNewReq = { id: `req-${Date.now()}`, requester: newRequestData.requester, team: newRequestData.team, title: newRequestData.headline, gnb: newRequestData.gnb, desc: finalDescription, location: newRequestData.location, status: 'PENDING', type: requestType, remarks: finalRemarks, jiraLink: newRequestData.jiraLink, snapshot_new: null, startDate: newRequestData.startDate, endDate: newRequestData.endDate, isTarget: newRequestData.isTarget };
      setRequests(prev => [mockNewReq, ...prev]);
      setModalState({ ...modalState, isOpen: false });
      return;
    }

    if (!supabase) return;

    const { error } = await supabase.from('requests').insert({
      requester: newRequestData.requester,
      team: newRequestData.team,
      title: newRequestData.headline,
      gnb_target: newRequestData.gnb,
      description: finalDescription,
      location: newRequestData.location,
      status: 'PENDING',
      snapshot_new: null,
      snapshot_original: null
    });

    if (!error) {
      alert('요청이 등록되었습니다.');
      window.location.reload();
    } else {
      console.error(error);
      alert('요청 등록 실패: ' + (error.message || '알 수 없는 오류'));
    }
    setModalState({ ...modalState, isOpen: false });
  };

  const handleAddMenu = () => {
    const { parentId } = modalState.data || {};
    const nameToAdd = isDivider ? '---' : menuNameInput;
    if (!nameToAdd) return alert('메뉴 이름을 입력해주세요.');
    if (modalState.type === 'ADD_GNB') { addGnb(nameToAdd); }
    else if (modalState.type === 'ADD_SUBMENU') { addSubMenu(parentId, nameToAdd); }
    setMenuNameInput(''); setIsDivider(false); setModalState({ isOpen: false, type: null, data: null });
  };
  const confirmDeleteGnb = (id) => { if (window.confirm('정말 삭제하시겠습니까? 하위 메뉴도 모두 삭제됩니다.')) { deleteGnb(id); } };
  const confirmDeleteSubMenu = (parentId, childId) => { if (window.confirm('정말 삭제하시겠습니까?')) { deleteSubMenu(parentId, childId); } };

  // --- [Calendar Logic for History] ---
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1));

  const findClosestHistoryDate = (targetDate) => {
    const historyDates = Object.keys(MOCK_HISTORY_DATA).sort();
    let closest = null;
    for (const hDate of historyDates) { if (hDate <= targetDate) closest = hDate; else break; }
    return closest;
  };

  const handleHistorySelect = async (selectedDateStr) => {
    setModalState({ ...modalState, isOpen: false });
    if (USE_MOCK_DATA) {
      const validHistoryDate = findClosestHistoryDate(selectedDateStr);
      if (!validHistoryDate) { alert(`${selectedDateStr} 이전의 이력 데이터가 없습니다.`); return; }
      const historyBlocks = MOCK_HISTORY_DATA[validHistoryDate] || [];
      setHistoryDate(selectedDateStr); setBlocks(historyBlocks);
      if (validHistoryDate !== selectedDateStr) alert(`선택하신 날짜(${selectedDateStr})의 변경분은 없어서,\n가장 최근 변경일(${validHistoryDate})의 데이터를 불러왔습니다.`);
      return;
    }
    if (!supabase) return;
    const { data } = await supabase.from('requests').select('*').eq('status', 'APPROVED').eq('gnb_target', currentMenuPath).lte('created_at', selectedDateStr + ' 23:59:59').order('created_at', { ascending: false }).limit(1);
    if (data && data.length > 0) {
      const req = data[0];
      setHistoryDate(selectedDateStr);
      const snapshot = req.snapshot_new.map(b => ({ id: b.id, type: b.type, title: b.title, blockId: b.block_id_code, showTitle: b.show_title, isNew: false, ...b.content }));
      setBlocks(snapshot);
      const reqDate = new Date(req.created_at).toLocaleDateString();
      if (reqDate !== new Date(selectedDateStr).toLocaleDateString()) alert(`선택하신 날짜(${selectedDateStr})의 변경분은 없어서,\n가장 최근 변경일(${reqDate})의 데이터를 불러왔습니다.`);
    } else alert(`${selectedDateStr} 이전의 이력 데이터가 없습니다.`);
  };

  const renderCalendar = () => {
    // 1. 현재 보고 있는 달력의 연/월
    const currentYear = currentCalendarDate.getFullYear();
    const currentMonth = currentCalendarDate.getMonth(); // 0(1월) ~ 11(12월)
    
    const daysInMonth = getDaysInMonth(currentCalendarDate);
    const firstDay = getFirstDayOfMonth(currentCalendarDate);
    
    // 2. '진짜 오늘' 날짜 정보 가져오기 (시스템 시간 기준)
    const now = new Date();
    const realTodayYear = now.getFullYear();
    const realTodayMonth = now.getMonth();
    const realTodayDate = now.getDate();

    const days = [];
    
    // 빈 칸 (지난달)
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="min-h-[3.5rem] w-full pointer-events-none"></div>);
    }
    
    // 날짜 채우기
    for (let d = 1; d <= daysInMonth; d++) {
      // ✅ [핵심 수정] 문자열이 아닌 '숫자'로 정확하게 비교합니다.
      const isToday = (currentYear === realTodayYear) && 
                      (currentMonth === realTodayMonth) && 
                      (d === realTodayDate);

      // 비교용 문자열 (이력 데이터 확인용)
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      const hasHistory = requests.some(r => {
          const rawDate = r.created_at || r.createdAt || r.date;
          if (!rawDate) return false;
          // 날짜 문자열 앞부분만 잘라서 비교 (YYYY-MM-DD)
          const rDateStr = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;
          return (r.status === 'APPROVED' || r.status === 'PENDING') && rDateStr === dateStr;
      });

      days.push(
        <button 
          key={d} 
          onClick={() => {
             setHistorySelectedDate(dateStr); 
             setIsCalendarPopupOpen(false); 
             setIsHistoryModalOpen(true);
             setHistoryDetailReq(null);
          }} 
          className={`
            w-full min-h-[3.5rem] p-1 rounded-lg flex flex-col items-start justify-start gap-1 transition-all border relative overflow-visible
            ${isToday 
                ? 'border-[#7387ff] bg-[#7387ff]/10 shadow-[inset_0_0_0_1px_#7387ff]' // 오늘: 파란 테두리 + 배경
                : 'border-transparent hover:bg-[#2e3038] hover:border-slate-600'}
            ${!isToday && hasHistory ? 'bg-[#2e3038] text-slate-200' : ''}
            ${!isToday && !hasHistory ? 'text-slate-500' : ''}
          `}
        >
          <div className="flex justify-between w-full items-start">
            {/* 날짜 숫자 */}
            <span className={`text-sm leading-none pl-1 pt-1 ${isToday ? 'font-bold text-white' : ''}`}>
                {d}
            </span>

            {/* ✅ [TODAY 뱃지] 절대 위치 대신 Flex 레이아웃 안에서 우측 상단 배치 */}
            {isToday && (
                <span className="text-[9px] bg-[#7387ff] text-white px-1.5 py-0.5 rounded font-bold shadow-sm leading-none mr-1 mt-1">
                  TODAY
                </span>
            )}
          </div>

          {/* 이력 점 (하단 배치) */}
          {hasHistory && (
             <div className="flex gap-0.5 mt-auto pl-1 pb-1">
                 <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-[#7387ff]' : 'bg-[#7387ff]'}`}></div>
             </div>
          )}
        </button>
      );
    }
    return days;
  };

  const findGnbIdByName = (list, name) => {
    for (const item of list) {
      if (item.name === name) return item.id;
      if (item.children && item.children.length > 0) {
        const childId = findGnbIdByName(item.children, name);
        if (childId) return childId;
      }
    }
    return null;
  };
  // [신규 추가] "상위 > 하위" 경로를 해석해서 정확한 ID를 찾는 함수
  const findIdByPath = (list, pathStr) => {
    if (!pathStr) return null;
    
    // " > " 를 기준으로 쪼갭니다 (예: ["무료", "무료 홈"])
    const names = pathStr.split('>').map(s => s.trim());
    
    let currentList = list;
    let targetId = null;
  
    for (const name of names) {
      // 현재 레벨에서 이름이 일치하는 메뉴 찾기
      const foundItem = currentList.find(item => item.name === name);
      
      if (!foundItem) return null; // 경로가 끊기면 실패
      
      targetId = foundItem.id; // 찾은 ID 저장
      currentList = foundItem.children || []; // 자식 레벨로 이동
    }
    
    return targetId;
  };

  const handleConfirmAction = async () => {
    const { type, data } = modalState;

    if (type === 'DELETE_BLOCK') {
      setBlocks(prev => prev.filter(b => b.id !== data));
    }
    else if (type === 'DELETE_REQUEST') {
      if (!USE_MOCK_DATA && supabase) await supabase.from('requests').delete().eq('id', data);
      setRequests(prev => prev.filter(r => r.id !== data));
      if (viewRequest?.id === data) setViewRequest(null);
    }
    else if (type === 'RESET') {
      setBlocks(JSON.parse(JSON.stringify(originalBlocks)));
      setRequests([]);
    }
    else if (type === 'SAVE') {
      
      // [수정] 1. 상세 설명과 자동 변경 내역 병합
      const manualChange = requestDescription ? [{ type: '설명', desc: requestDescription }] : [];
      // 변경 내역이 없으면 '변경 사항 없음'이라도 넣어줌
      const autoChanges = diffSummary.length > 0 ? diffSummary : [{ type: '알림', desc: '자동 감지된 블록 변경 사항이 없습니다.' }];
      
      const finalChanges = [...manualChange, ...autoChanges];

      if (USE_MOCK_DATA) {
        alert('(Mock) 저장 완료 흉내');
        const newSavedReq = { 
            id: `saved-${Date.now()}`, 
            title: requestTitle, 
            status: 'PENDING', 
            createdAt: new Date().toISOString().split('T')[0], 
            date: scheduleDate, 
            requester: '관리자 (Mock)', 
            changes: finalChanges, // [중요] 합친 내역 저장
            menuPath: currentMenuPath, 
            originalSnapshot: JSON.parse(JSON.stringify(originalBlocks)), 
            snapshot: JSON.parse(JSON.stringify(blocks)), 
            snapshot_new: JSON.parse(JSON.stringify(blocks)) 
        };
        setRequests(prev => [newSavedReq, ...prev]);
      } else {
        if (!supabase) return;
        
        const snapshot = blocks.map((b, idx) => ({ ...b, sort_order: idx }));
        
        // [중요] 실제 DB insert 시 'changes' 컬럼에 JSON 데이터 저장
        // (Supabase requests 테이블에 changes 컬럼(jsonb 타입)이 있어야 합니다)
        const { error } = await supabase.from('requests').insert({ 
            requester: '관리자', 
            title: requestTitle, 
            gnb_target: currentMenuPath, 
            snapshot_new: snapshot, 
            snapshot_original: originalBlocks, 
            status: 'PENDING',
            changes: finalChanges, // [추가됨] 변경 내역 저장
            description: requestDescription // 필요하다면 description 컬럼에도 저장
        });
        
        if (!error) { 
            alert('편성 요청이 저장되었습니다.'); 
            window.location.reload(); 
        } else { 
            alert('저장 실패: ' + error.message); 
        }
      }
    }
    else if (type === 'APPROVE') {
      const targetReqId = data.id;
      const targetGnbName = data.gnb; // 데이터 예시: "무료 > 무료 홈"

      // [1순위] 경로 기반으로 정확하게 탐색 ("무료" -> "무료 홈" 순서로 찾기)
      let targetGnbId = findIdByPath(gnbList, targetGnbName);
      if (!targetGnbId) {
          const simpleName = targetGnbName.includes('>') 
            ? targetGnbName.split('>').pop().trim() 
            : targetGnbName;
            
          targetGnbId = findGnbIdByName(gnbList, simpleName);
      }

      // 그래도 못 찾으면 진짜 없는 것
      if (!targetGnbId) {
        alert(`오류: 요청된 메뉴 '${targetGnbName}'를 찾을 수 없습니다.\n해당 메뉴가 삭제되었거나 이름이 변경되었는지 확인해주세요.`);
        setModalState({ isOpen: false, type: null, data: null });
        return;
      }

      if (USE_MOCK_DATA) {
        // ... (기존 Mock 로직 유지) ...
        setRequests(prev => prev.map(r => r.id === targetReqId ? { ...r, status: 'APPROVED' } : r));
        if (currentMenuId === targetGnbId && data.snapshot) {
          const newSnapshot = JSON.parse(JSON.stringify(data.snapshot));
          setBlocks(newSnapshot);
          setOriginalBlocks(JSON.parse(JSON.stringify(newSnapshot)));
        }
        alert(`'${targetGnbName}' 메뉴에 편성이 반영(배포)되었습니다.`);
      }
      else {
        if (!supabase) return;
        
        // 1. 기존 블록 삭제
        await supabase.from('blocks').delete().eq('gnb_id', targetGnbId);
        
        // 2. [수정됨] 신규 블록 Insert 데이터 구성 (매핑 주의!)
        const newBlocksData = data.snapshot.map((b, idx) => ({
          gnb_id: targetGnbId,
          type: b.type,
          title: b.title,
          
          // [중요] State의 camelCase 속성을 DB의 snake_case 컬럼으로 정확히 매핑
          block_id_code: b.contentId,  // State: contentId -> DB: block_id_code
          show_title: b.showTitle,     // State: showTitle -> DB: show_title
          
          sort_order: idx,
          
          // content JSON 컬럼에는 전체 데이터를 덤프
          content: {
            items: b.items,
            banners: b.banners,
            tabs: b.tabs,
            leadingBanners: b.leadingBanners,
            showPreview: b.showPreview,
            
            contentId: b.contentId,
            contentIdType: b.contentIdType,
            
            isTarget: b.isTarget,
            targetSeg: b.targetSeg,
            remarks: b.remarks
          }
        }));

        const { error } = await supabase.from('blocks').insert(newBlocksData);
        
        if (!error) {
          await supabase.from('requests').update({ status: 'APPROVED' }).eq('id', data.id);
          
          // 현재 보고 있는 메뉴라면 화면도 즉시 갱신 (새로고침 없이)
          if (currentMenuId === targetGnbId) {
             const newSnapshot = JSON.parse(JSON.stringify(data.snapshot));
             setBlocks(newSnapshot);
             setOriginalBlocks(JSON.parse(JSON.stringify(newSnapshot))); // 원본 데이터도 갱신하여 '비교' 모드 리셋
             alert('편성이 반영(배포)되었습니다!');
          } else {
             alert(`'${targetGnbName}' 메뉴에 편성이 정상적으로 반영되었습니다.`);
             setRequests(prev => prev.map(r => r.id === data.id ? { ...r, status: 'APPROVED' } : r));
          }
        } else {
          console.error(error);
          alert('반영 실패: ' + error.message);
        }
      }
    }
    else if (type === 'DELETE_BANNER_CONFIRM') { handleDeleteBanner(); return; }

    setModalState({ isOpen: false, type: null, data: null });
  };

  const onDragStart = (e, index, type = 'BLOCK', data = null) => {
    dragItem.current = index; dragType.current = type; e.dataTransfer.effectAllowed = 'move';
    if (type === 'REQUEST' && data) e.dataTransfer.setData('requestData', JSON.stringify(data));
    if (type === 'GNB' || type === 'SUBMENU') e.dataTransfer.setData('menuId', data.id);
  };
  const onDragEnd = (e) => {
    if (dragType.current === 'BLOCK' && dragItem.current !== null && dragOverItem.current !== null) {
      const _blocks = [...blocks]; const dragBlock = _blocks[dragItem.current]; _blocks.splice(dragItem.current, 1); _blocks.splice(dragOverItem.current, 0, dragBlock); setBlocks(_blocks);
    }
    dragItem.current = null; dragOverItem.current = null; dragType.current = null; setIsDragEnabled(false);
  };
  const onMenuDrop = (e, targetId, type) => {
    e.stopPropagation(); e.preventDefault();
    const draggedId = e.dataTransfer.getData('menuId');
    if (draggedId && draggedId !== targetId) reorderMenu(draggedId, targetId, type);
  };
  
  // [수정] onDropFromInbox - 2단 배너 병합 및 기간 정보 처리
  const onDropFromInbox = async (e, dropIndex) => {
    e.preventDefault(); e.stopPropagation();
    const str = e.dataTransfer.getData('requestData');

    if (str) {
      const req = JSON.parse(str);
      let targetBlockIndex = -1;
      let targetType = req.type;

      // 파싱 (req 객체에 없으면 description에서 추출)
      let reqStartDate = req.startDate || todayStr;
      let reqEndDate = req.endDate || '9999-12-31';
      let reqIsTarget = req.isTarget || false;

      if (!req.startDate && req.desc) {
          const dateMatch = req.desc.match(/\[기간\]\s*([0-9-]+)\s*~\s*([0-9-]+)/);
          if (dateMatch) { reqStartDate = dateMatch[1]; reqEndDate = dateMatch[2]; }
          const targetMatch = req.desc.match(/\[타겟여부\]\s*([YN])/);
          if (targetMatch) reqIsTarget = targetMatch[1] === 'Y';
      }

      // 생성할 배너 객체 템플릿
      const newBannerObj = {
          id: `req-bn-${Date.now()}`,
          title: req.title,
          desc: req.desc || '',
          landingType: 'NONE',
          isNew: true,
          startDate: reqStartDate,
          endDate: reqEndDate,
          isTarget: reqIsTarget
      };

      const ALL_BANNER_TYPES = ['BIG_BANNER', 'BAND_BANNER', 'LONG_BANNER', 'FULL_PROMOTION', 'BANNER_1', 'BANNER_2', 'BANNER_3', 'MENU_BLOCK'];
      const UNIQUE_TYPES = ['BIG_BANNER', 'TODAY_BTV', 'TODAY_BTV_BANNER'];
      const MULTI_BANNER_TYPES = ['LONG_BANNER', 'BANNER_1', 'BANNER_2', 'BANNER_3'];
      const LEADING_COMPATIBLE_REQ = ['BANNER_1', 'BANNER_2', 'BANNER_3'];
      const CONTENT_BLOCK_TYPES = ['VERTICAL', 'HORIZONTAL', 'HORIZONTAL_MINI'];

      // [병합 대상 찾기]
      if (UNIQUE_TYPES.includes(req.type)) {
          if (targetType === 'TODAY_BTV_BANNER') targetType = 'TODAY_BTV';
          targetBlockIndex = blocks.findIndex(b => b.type === targetType);
      } else if (dropIndex !== undefined && blocks[dropIndex]) {
          const droppedBlock = blocks[dropIndex];
          if (MULTI_BANNER_TYPES.includes(req.type) && droppedBlock.type === req.type) targetBlockIndex = dropIndex;
          else if (LEADING_COMPATIBLE_REQ.includes(req.type) && CONTENT_BLOCK_TYPES.includes(droppedBlock.type)) targetBlockIndex = dropIndex;
      }

      // [병합 실행]
      if (targetBlockIndex !== -1) {
          const newBlocks = [...blocks];
          const targetBlock = { ...newBlocks[targetBlockIndex] };
          let bannerColType = '1-COL';
          if (req.type === 'BANNER_2') bannerColType = '2-COL';
          else if (req.type === 'BANNER_3') bannerColType = '3-COL';
          else if (req.type === 'MENU_BLOCK') bannerColType = 'MENU';

          if (targetBlock.type === 'TODAY_BTV') {
              const newItems = [...(targetBlock.items || [])];
              newItems.unshift({ ...newBannerObj, id: `req-tb-${Date.now()}`, type: 'BANNER' });
              targetBlock.items = newItems;
          } else if (CONTENT_BLOCK_TYPES.includes(targetBlock.type)) {
              const newLeadingBanners = [...(targetBlock.leadingBanners || [])];
              newLeadingBanners.unshift({ ...newBannerObj, type: bannerColType });
              targetBlock.leadingBanners = newLeadingBanners;
          } else {
              const newBanners = [...(targetBlock.banners || [])];
              newBanners.unshift({ ...newBannerObj, type: bannerColType });
              targetBlock.banners = newBanners;
          }
          newBlocks[targetBlockIndex] = targetBlock;
          setBlocks(newBlocks);
          setRequests(prev => prev.filter(r => r.id !== req.id));
          if (!USE_MOCK_DATA && supabase) await supabase.from('requests').update({ status: 'COMPLETED' }).eq('id', req.id);
          return;
      }

      // [신규 생성]
      const newBlock = { id: `req-${Date.now()}`, title: req.title, isNew: true, contentId: 'REQ_ID', remarks: req.remarks, showTitle: true };
      if (ALL_BANNER_TYPES.includes(req.type)) {
          newBlock.type = req.type;
          let bannerType = '1-COL';
          if (req.type === 'BANNER_2') bannerType = '2-COL';
          else if (req.type === 'BANNER_3') bannerType = '3-COL';
          else if (req.type === 'MENU_BLOCK') bannerType = 'MENU';
          else if (req.type === 'FULL_PROMOTION') bannerType = 'FULL';
          newBlock.banners = [{ ...newBannerObj, type: bannerType }];
      } else if (req.type === 'MULTI') {
          newBlock.type = 'MULTI';
          newBlock.items = [1, 2, 3, 4].map(i => ({ id: `req-m-${i}`, title: '추천' }));
      } else {
          newBlock.type = req.type || 'VERTICAL';
          newBlock.contentIdType = 'RACE';
          if (req.type === 'TODAY_BTV' || req.type === 'TODAY_BTV_BANNER') {
              newBlock.type = 'TODAY_BTV'; 
              newBlock.items = [{ ...newBannerObj, id: `req-tb-${Date.now()}`, type: 'BANNER' }];
          } else {
              newBlock.items = [{ id: 'i1', title: 'Content' }];
          }
      }
      const _blocks = [...blocks];
      _blocks.splice(dropIndex !== undefined ? dropIndex : _blocks.length, 0, newBlock);
      setBlocks(_blocks);
      setRequests(prev => prev.filter(r => r.id !== req.id));
      if (!USE_MOCK_DATA && supabase) await supabase.from('requests').update({ status: 'COMPLETED' }).eq('id', req.id);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#100d1d] text-slate-300 gap-4">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-[#7387ff] rounded-full animate-spin"></div>
        <div className="text-sm font-bold">B tv 편성 데이터를 불러오고 있습니다...{USE_MOCK_DATA && <span className="ml-2 bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs border border-orange-500/50">TEST MODE</span>}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-200 font-sans" style={{ backgroundColor: COLORS.bg }}>
      <aside className={`${isSidebarOpen ? 'w-64 border-r' : 'w-0 border-none'} flex flex-col border-[#2e3038] bg-[#161820] flex-shrink-0 z-20 transition-all duration-300 overflow-hidden`}>
        <div className="w-64 flex flex-col h-full">
          <div className="p-4 border-b border-[#2e3038] flex items-center justify-between">
            <div className="flex items-center gap-2"><div className="w-1.5 h-5 bg-[#7387ff] rounded-sm"></div><h1 className="text-lg font-bold text-white">B tv simulator</h1></div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {gnbList.map(menu => {
              const isDivider = menu.name === '---';
              if (isDivider) {
                return (
                  <div key={menu.id} draggable onDragStart={(e) => onDragStart(e, null, 'GNB', menu)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onMenuDrop(e, menu.id, 'GNB')}>
                    <div className="px-4 py-2 cursor-move group relative">
                      <div className="h-px bg-[#44464f] w-full my-1"></div>
                      <div className="hidden group-hover:block absolute right-2 top-1/2 -translate-y-1/2 bg-[#2e3038] p-1 rounded cursor-pointer" onClick={(e) => { e.stopPropagation(); confirmDeleteGnb(menu.id); }}><Trash2 size={10} className="text-red-400" /></div>
                    </div>
                  </div>
                )
              }
              return (
                <div key={menu.id} className="mb-1" draggable onDragStart={(e) => onDragStart(e, null, 'GNB', menu)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onMenuDrop(e, menu.id, 'GNB')}>
                  <div className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-white/5 group ${currentMenuId === menu.id ? 'bg-white/10' : ''}`} onClick={() => handleMenuChange(menu.id, menu.name, (menu.children || []).length === 0)}>
                    <div className={`flex-1 flex items-center gap-2 ${currentMenuId === menu.id || (menu.children?.length > 0 && expandedMenuIds.includes(menu.id)) ? 'text-white font-bold' : 'text-slate-400'}`}>
                      <span className="text-sm">{menu.name}</span>
                      {menu.children && menu.children.length > 0 && <span className="opacity-70 ml-auto">{expandedMenuIds.includes(menu.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setMenuNameInput(''); setIsDivider(false); setModalState({ isOpen: true, type: 'ADD_SUBMENU', data: { parentId: menu.id } }); }} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="하위 메뉴 추가"><Plus size={12} /></button>
                      <button onClick={(e) => { e.stopPropagation(); confirmDeleteGnb(menu.id); }} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400" title="삭제"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  {menu.children && menu.children.length > 0 && expandedMenuIds.includes(menu.id) && (
                    <div className="bg-black/20 pb-1">
                      {menu.children.map(child => {
                        const isSubDivider = child.name === '---';
                        if (isSubDivider) {
                          return (
                            <div key={child.id} draggable onDragStart={(e) => onDragStart(e, null, 'SUBMENU', child)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onMenuDrop(e, child.id, 'SUBMENU')} className="pl-8 pr-4 py-1 group relative cursor-move">
                              <div className="h-px bg-[#44464f] w-full my-1"></div>
                              <div className="hidden group-hover:block absolute right-2 top-1/2 -translate-y-1/2 bg-[#2e3038] p-0.5 rounded cursor-pointer" onClick={(e) => { e.stopPropagation(); confirmDeleteSubMenu(menu.id, child.id); }}><Trash2 size={8} className="text-red-400" /></div>
                            </div>
                          )
                        }
                        return (
                          <div key={child.id} draggable onDragStart={(e) => onDragStart(e, null, 'SUBMENU', child)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onMenuDrop(e, child.id, 'SUBMENU')} className={`pl-8 pr-4 py-1.5 flex items-center justify-between group/sub cursor-pointer hover:bg-white/5 ${currentMenuId === child.id ? 'text-[#7387ff] font-bold bg-[#7387ff]/10 border-r-2 border-[#7387ff]' : 'text-slate-500'}`} onClick={(e) => { e.stopPropagation(); handleMenuChange(child.id, `${menu.name} > ${child.name}`, true); }}>
                            <span className="text-xs">{child.name}</span>
                            <button onClick={(e) => { e.stopPropagation(); confirmDeleteSubMenu(menu.id, child.id); }} className="opacity-0 group-hover/sub:opacity-100 p-0.5 hover:bg-slate-700 rounded text-slate-500 hover:text-red-400"><Trash2 size={10} /></button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="p-4 border-t border-[#2e3038]"><button onClick={() => { setMenuNameInput(''); setIsDivider(false); setModalState({ isOpen: true, type: 'ADD_GNB', data: null }); }} className="w-full py-2 border border-[#2e3038] hover:border-slate-500 rounded text-xs text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors"><Plus size={14} /> 메뉴 추가</button></div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-14 border-b border-[#2e3038] bg-[#100d1d]/95 backdrop-blur flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-3 overflow-hidden mr-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-[#2e3038] rounded text-slate-400 hover:text-white transition-colors shrink-0"><Menu size={20} /></button>
            <div className="text-sm font-bold text-[#7387ff] truncate">{currentMenuPath}</div>
            {viewMode === 'HISTORY' && historyDate && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"><Rewind size={10} /> {historyDate}</span>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {viewMode === 'EDITOR' && (
              <div className="relative mr-2">
                  <button onClick={() => setIsViewFilterOpen(!isViewFilterOpen)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold border transition-all ${isViewFilterOpen || viewOptions.hideTargets || viewOptions.showExpired ? 'border-[#7387ff] text-[#7387ff] bg-[#7387ff]/10' : 'border-[#2e3038] text-slate-400 bg-[#191b23]'}`}>
                      <Filter size={12}/> View 설정
                  </button>
                  {isViewFilterOpen && (
                      <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsViewFilterOpen(false)}></div>
                          <div className="absolute right-0 top-full mt-2 w-48 bg-[#191b23] border border-[#2e3038] rounded-lg shadow-xl z-50 overflow-hidden flex flex-col p-2 space-y-1">
                              <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#2e3038] rounded cursor-pointer select-none">
                                  <input type="checkbox" className="accent-pink-500" checked={viewOptions.hideTargets} onChange={e => setViewOptions({...viewOptions, hideTargets: e.target.checked})} />
                                  <span className={`text-xs ${viewOptions.hideTargets ? 'text-pink-400 font-bold' : 'text-slate-400'}`}>Target 제외 보기</span>
                              </label>
                              <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#2e3038] rounded cursor-pointer select-none">
                                  <input type="checkbox" className="accent-orange-500" checked={viewOptions.showExpired} onChange={e => setViewOptions({...viewOptions, showExpired: e.target.checked})} />
                                  <span className={`text-xs ${viewOptions.showExpired ? 'text-orange-400 font-bold' : 'text-slate-400'}`}>만료된 배너 포함</span>
                              </label>
                          </div>
                      </>
                  )}
              </div>
            )}
            <div className="relative">
              <select 
                value={viewMode} 
                onChange={(e) => { 
                  const selected = e.target.value;
                  
                  if (selected === 'HISTORY') {
                    // 1. 달력 팝업 열기
                    setIsCalendarPopupOpen(true);
                    // 2. [추가됨] 달력을 '오늘'이 있는 달로 리셋
                    setCurrentCalendarDate(new Date());
                    // 3. 선택된 날짜 값도 오늘로 리셋 (원하시면 유지해도 됨)
                    setHistorySelectedDate(getLocalTodayString());
                  } else {
                    setViewMode(selected);
                    if (selected === 'EDITOR') setHistoryDate(''); 
                  }
                }} 
                className="bg-[#191b23] border border-[#2e3038] hover:border-[#7387ff] rounded px-3 py-1.5 text-xs font-bold text-white outline-none cursor-pointer appearance-none pr-8"
              >
                <option value="EDITOR">에디터</option>
                <option value="REQUEST">UNA ({unaPendingCount})</option>
                <option value="HISTORY">이력</option> {/* (History) 제거됨 */}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronDown size={12} /></div>
            </div>
            {viewMode === 'EDITOR' && (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <button onClick={() => setCompareMode(!compareMode)} className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-colors ${compareMode ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-[#191b23] text-slate-400 border border-[#2e3038] hover:text-white'}`}>비교</button>
                  <button onClick={() => setShowInbox(!showInbox)} className={`relative px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors ${showInbox ? 'bg-slate-700 text-white' : 'bg-[#191b23] text-slate-400 border border-[#2e3038] hover:text-white'}`}><Inbox size={14} /> 요청함</button>
                  <button onClick={() => openAddBlockModal('TOP')} className="px-3 py-1.5 bg-[#191b23] border border-[#2e3038] hover:bg-[#2e3038] rounded text-xs text-white flex items-center gap-1 transition-colors"><Plus size={14} /> 추가</button>
                  <button onClick={openAddBlockModal} className="px-3 py-1.5 bg-[#191b23] border border-[#2e3038] hover:bg-[#2e3038] rounded text-xs text-white flex items-center gap-1 transition-colors"><Plus size={14} /> 추가</button>
                </div>
                <button onClick={handleOpenSaveModal} className="bg-[#7387ff] hover:bg-[#5b6dbf] text-white p-2 md:px-4 md:py-1.5 rounded text-xs font-bold flex items-center gap-1 shadow-lg shadow-indigo-500/20 transition-colors" title="저장"><Save size={16} /> <span className="hidden md:inline">저장</span></button>
                <div className="md:hidden relative">
                  <button onClick={() => setIsActionMenuOpen(!isActionMenuOpen)} className="p-1.5 hover:bg-[#2e3038] rounded text-slate-400 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                  {isActionMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-[#191b23] border border-[#2e3038] rounded-lg shadow-xl w-32 overflow-hidden flex flex-col z-50">
                      <button onClick={() => { setCompareMode(!compareMode); setIsActionMenuOpen(false); }} className="px-4 py-3 text-xs text-left hover:bg-[#2e3038] text-slate-300 border-b border-[#2e3038]">비교 모드 {compareMode ? 'OFF' : 'ON'}</button>
                      <button onClick={() => { setShowInbox(!showInbox); setIsActionMenuOpen(false); }} className="px-4 py-3 text-xs text-left hover:bg-[#2e3038] text-slate-300 border-b border-[#2e3038]">요청함 열기</button>
                      <button onClick={() => { openAddBlockModal('TOP'); setIsActionMenuOpen(false); }} className="px-4 py-3 text-xs text-left hover:bg-[#2e3038] text-white font-bold">블록 추가</button>
                      <button onClick={() => { openAddBlockModal(); setIsActionMenuOpen(false); }} className="px-4 py-3 text-xs text-left hover:bg-[#2e3038] text-white font-bold">블록 추가</button>
                    </div>
                  )}
                  {isActionMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsActionMenuOpen(false)}></div>}
                </div>
              </>
            )}
            {viewMode === 'HISTORY' && <button onClick={() => { setViewMode('EDITOR'); setHistoryDate(''); setBlocks(JSON.parse(JSON.stringify(originalBlocks))); }} className="px-3 py-1.5 bg-[#7387ff] hover:bg-[#5b6dbf] rounded text-xs font-bold text-white flex items-center gap-1 transition-colors">복귀</button>}
          </div>
        </header>

        {/* EDITOR & HISTORY VIEW */}
        {(viewMode === 'EDITOR' || viewMode === 'HISTORY') && (
          <div className="flex-1 flex overflow-hidden">
            <div 
                ref={scrollContainerRef}
                onDragOver={(e) => { e.preventDefault(); handleScrollOnDrag(e); }}
                className={`flex-1 overflow-y-auto p-6 relative bg-gradient-to-b from-[#100d1d] to-[#0a0812] ${viewMode === 'HISTORY' ? 'grayscale-[0.3]' : ''}`}
            >
              <div className={`max-w-[1400px] mx-auto transition-all ${compareMode ? 'grid grid-cols-2 gap-8' : ''}`}>
                {compareMode && (<div className="relative"><div className="sticky top-0 z-10 mb-4 flex justify-between items-center bg-[#100d1d]/80 backdrop-blur py-2 border-b border-orange-500/30"><span className="text-orange-400 text-sm font-bold flex items-center gap-2">변경 전 (As-Is)</span></div><div className="space-y-3 opacity-70 pointer-events-none grayscale-[0.5]">{originalBlocks.map((block, index) => (<div key={`orig-${block.id}`} className="relative"><div className="absolute -left-2 top-2 z-10 w-5 h-5 bg-slate-700 text-slate-400 rounded-full flex items-center justify-center text-xs font-mono">{index + 1}</div><BlockRenderer block={block} isOriginal={true} readOnly={true} hideTargets={viewOptions.hideTargets} /></div>))}</div></div>)}
                <div className={!compareMode ? 'max-w-[800px] mx-auto' : 'relative'}>
                  {compareMode && (<div className="sticky top-0 z-10 mb-4 flex justify-between items-center bg-[#100d1d]/80 backdrop-blur py-2 border-b border-[#7387ff]/30"><span className="text-[#7387ff] text-sm font-bold flex items-center gap-2"><CheckCircle size={14} /> 변경 후 (To-Be)</span></div>)}
                  <div className="space-y-3 pb-20">
                    {displayedBlocks.map((block, index) => {
                      const draggable = isDragEnabled && hoveredBlockIndex === index && !compareMode && viewMode !== 'HISTORY';
                      return (
                        <div key={block.id} draggable={draggable} onDragStart={(e) => onDragStart(e, index)} onDragEnter={(e) => { e.preventDefault(); dragOverItem.current = index; }} onDragEnd={onDragEnd} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropFromInbox(e, index)} onMouseEnter={() => setHoveredBlockIndex(index)} onMouseLeave={() => { setHoveredBlockIndex(null); setIsDragEnabled(false); }} className={`relative group transition-all duration-200 ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}>
                          {!compareMode && viewMode !== 'HISTORY' && (<><div onMouseEnter={() => setIsDragEnabled(true)} onMouseLeave={() => setIsDragEnabled(false)} className="absolute -left-10 top-0 bottom-0 w-10 flex items-center justify-center cursor-grab text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"><GripVertical size={20} /></div><button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => handleDelete(block.id, e)} className="absolute -right-2 -top-2 z-20 p-1.5 bg-[#2e3038] text-slate-400 hover:text-red-400 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all border border-[#44464f] hover:scale-110 cursor-pointer" title="블록 삭제"><Trash2 size={12} /></button></>)}
                          <div className={`absolute -left-2 top-2 z-10 w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow-lg ${compareMode ? 'bg-[#7387ff] text-white' : 'bg-[#191b23] border border-[#7387ff] text-[#7387ff]'}`}>{index + 1}</div>
                          <BlockRenderer 
                            block={block} 
                            isOriginal={false} 
                            readOnly={viewMode === 'HISTORY' || compareMode} 
                            onUpdate={(updates) => handleUpdateBlock(block.id, updates)} 
                            onEditId={(tabIndex) => openEditIdModal(block, tabIndex)} 
                            onEditBannerId={(data, idx, isLead, tabIdx) => handleBannerEdit(block, data, idx, isLead, tabIdx)} 
                            onEditContentId={(item, idx) => handleEditContent(block.id, idx, item)} 
                            onEditTabName={(idx, name) => handleEditTabName(block.id, idx, name)} 
                            onAddTab={() => handleAddTab(block.id)} 
                            hideTargets={viewOptions.hideTargets} 
                            showExpired={viewOptions.showExpired}
                            onMoveUp={() => moveBlock(index, 'UP')}
                            onMoveDown={() => moveBlock(index, 'DOWN')}
                            isFirst={index === 0}
                            isLast={index === displayedBlocks.length - 1}
                          />
                        </div>
                      );
                    })}
                    {!compareMode && viewMode !== 'HISTORY' && (
                      <div 
                          onClick={() => openAddBlockModal('BOTTOM')} 
                          onDragOver={(e) => e.preventDefault()} 
                          onDrop={(e) => onDropFromInbox(e)} 
                          className="h-20 border-2 border-dashed border-[#2e3038] rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-[#7387ff] hover:text-[#7387ff] hover:bg-[#7387ff]/5 cursor-pointer transition-all gap-1 mt-4"
                      >
                          <Plus size={20} /><span className="text-xs font-bold">블록 추가 또는 요청 드래그</span>
                      </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
            {/* Inbox UI 유지 */}
            <div className={`fixed right-0 top-14 bottom-0 w-80 bg-[#161820] border-l border-[#2e3038] shadow-2xl transition-transform duration-300 z-30 flex flex-col ${showInbox ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-4 border-b border-[#2e3038] bg-[#191b23]">
                <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-bold text-white flex items-center gap-2"><Inbox size={16} className="text-[#7387ff]" /> 프로모션 요청함 <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{inboxRequests.length}</span></h3><button onClick={() => setShowInbox(false)}><X size={16} className="text-slate-500 hover:text-white" /></button></div>
                <div className="flex items-center gap-2">
                  <Filter size={12} className="text-slate-500" />
                  <select className="bg-[#100d1d] border border-[#2e3038] rounded px-2 py-1 text-xs text-slate-300 outline-none flex-1" value={inboxFilter} onChange={(e) => setInboxFilter(e.target.value)}>
                    <option value="ALL">전체 메뉴</option>{gnbList.map(m => (<React.Fragment key={m.id}><option value={m.name}>{m.name}</option></React.Fragment>))}
                  </select>
                </div>
              </div>
              <div className="p-4 border-b border-[#2e3038]"><button onClick={() => setModalState({ isOpen: true, type: 'NEW_REQUEST', data: null })} className="w-full py-2 bg-[#2e3038] hover:bg-[#3e404b] text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"><Plus size={14} /> 신규 요청 등록</button></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">{inboxRequests.length === 0 ? <div className="text-center text-slate-500 text-xs py-10">요청이 없습니다.</div> : inboxRequests.map(req => (<div key={req.id} draggable={req.status === 'PENDING'} onDragStart={(e) => onDragStart(e, null, 'REQUEST', req)} className={`border p-3 rounded-lg transition-colors group relative ${req.status === 'PENDING' ? 'bg-[#100d1d] border-[#2e3038] cursor-grab hover:border-[#7387ff] active:cursor-grabbing' : 'bg-[#191b23] border-[#2e3038] opacity-50 cursor-default'}`}>
                <button onClick={(e) => reqDeleteRequest(req.id, e)} className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 hover:bg-[#2e3038] rounded transition-colors" title="요청 삭제"><Trash2 size={12} /></button>
                <div className="flex justify-between items-start mb-2"><span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded flex items-center gap-1"><User size={8} /> {req.requester}</span>{req.status === 'REJECTED' && <span className="text-[10px] text-red-500 font-bold border border-red-500/50 px-1 rounded">거절됨</span>}</div><h4 className="text-sm font-bold text-slate-200 mb-1">{req.title}</h4><div className="text-[10px] text-slate-500 mb-2 space-y-0.5"><p>{req.desc}</p><p className="text-slate-400">위치: {req.location || '-'}</p>{req.remarks && <p className="text-yellow-500/70">비고: {req.remarks}</p>}</div><div className="mt-2 flex justify-between items-center"><span className="text-[9px] text-[#7387ff] border border-[#7387ff]/30 px-1.5 py-0.5 rounded">{req.type}</span><span className="text-[9px] text-slate-500">{req.gnb}</span></div></div>))}</div>
            </div>
          </div>
        )}

        {/* UNA (REQUEST HISTORY) VIEW */}
        {viewMode === 'REQUEST' && (
          <div className="flex-1 overflow-y-auto p-6 bg-[#100d1d]">
            <div className="max-w-5xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Inbox className="text-[#7387ff]" /> UNA (편성 반영 내역)</h2>
                <div className="flex items-center gap-2">
                  {unaFilter !== 'ALL' && (
                    <button onClick={() => setUnaFilter('ALL')} className="text-xs bg-red-500/10 text-red-400 border border-red-500/50 px-2 py-1 rounded hover:bg-red-500/20 flex items-center gap-1">
                      <XCircle size={12} /> 필터 해제 ({unaFilter})
                    </button>
                  )}
                  <span className="text-slate-500 text-xs">메뉴 필터:</span>
                  <select className="bg-[#191b23] border border-[#2e3038] rounded px-3 py-1.5 text-xs text-slate-300 outline-none max-w-[150px]" value={gnbList.some(g => g.name === unaFilter) ? unaFilter : 'ALL'} onChange={(e) => setUnaFilter(e.target.value)}>
                    <option value="ALL">전체 보기</option>
                    {gnbList.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {unaRequests.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 border border-dashed border-[#2e3038] rounded-lg">
                    {unaFilter !== 'ALL' ? `'${unaFilter}' 메뉴에 대한 편성 반영 내역이 없습니다.` : '편성 반영 내역이 없습니다.'}
                  </div>
                ) : (
                  unaRequests.map(req => (
                    <div key={req.id} onClick={() => setModalState({ isOpen: true, type: 'VIEW_UNA_DETAIL', data: req })} className={`bg-[#191b23] border border-[#2e3038] rounded-lg p-5 transition-all hover:border-[#7387ff]/50 flex gap-4 cursor-pointer relative group ${req.status === 'APPROVED' ? 'opacity-70' : ''}`}>
                      <button onClick={(e) => reqDeleteRequest(req.id, e)} className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-400 hover:bg-[#2e3038] rounded transition-colors z-10 opacity-0 group-hover:opacity-100" title="내역 삭제"><Trash2 size={16} /></button>
                      <div className="flex flex-col items-center pt-1 gap-2 min-w-[60px]">
                        {req.status === 'PENDING' ? <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center animate-pulse"><Send size={20} /></div>
                          : req.status === 'APPROVED' ? <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center"><Check size={20} /></div>
                            : <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center"><XCircle size={20} /></div>}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${req.status === 'PENDING' ? 'bg-blue-900/30 text-blue-500' : req.status === 'APPROVED' ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}`}>{req.status === 'PENDING' ? '반영 대기' : '반영 완료'}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-slate-200 mb-1">{req.title}</h3>
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              <span className="flex items-center gap-1"><User size={12} /> {req.requester} ({req.team})</span>
                              <span className="flex items-center gap-1"><CalendarIcon size={12} /> {req.createdAt}</span>
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-[#2e3038] rounded text-slate-300">{req.gnb}</span>
                            </div>
                          </div>
                        </div>
                        {req.changes && req.changes.length > 0 && (
                          <div className="space-y-1 bg-[#100d1d] rounded p-3 border border-[#2e3038]">
                            <p className="text-xs font-bold text-slate-500 mb-2">변경 내역 요약:</p>
                            {req.changes.slice(0, 3).map((change, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${change.type === '신규' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>{change.type}</span>
                                <span className="text-slate-300 truncate">{change.desc}</span>
                              </div>
                            ))}
                            {req.changes.length > 3 && <div className="text-[10px] text-slate-500 pl-2">...외 {req.changes.length - 3}건</div>}
                          </div>
                        )}
                        <div className="mt-3 text-xs text-[#7387ff] font-bold flex items-center gap-1">상세 보기 및 반영 <ArrowRightCircle size={12} /></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {modalState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className={`bg-[#191b23] rounded-xl border border-[#2e3038] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${modalState.type === 'VIEW_UNA_DETAIL' ? 'w-[95vw] max-w-[1800px] h-[90vh]' : modalState.type === 'NEW_REQUEST' || modalState.type === 'ADD_BLOCK' || modalState.type === 'HISTORY_SELECT' ? 'w-[500px]' : 'w-[450px]'}`}>
              <div className="p-5 border-b border-[#2e3038] flex justify-between items-center bg-[#1e2029] shrink-0">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {modalState.type === 'HISTORY_SELECT' ? '히스토리 탐색' : modalState.type === 'NEW_REQUEST' ? '신규 프로모션 요청 등록' : modalState.type === 'ADD_BLOCK' ? '신규 블록 생성' : modalState.type === 'SAVE' ? '편성 반영 정보 입력' : modalState.type === 'APPROVE' ? '편성 반영 확인' : modalState.type === 'VIEW_UNA_DETAIL' ? '편성 변경 상세 비교' : modalState.type === 'EDIT_ID' ? '블록 설정 수정' : modalState.type === 'EDIT_BANNER' ? '배너 수정' : modalState.type === 'EDIT_CONTENT' ? '콘텐츠 수정' : modalState.type === 'EDIT_TAB_NAME' ? '탭 이름 수정' : modalState.type === 'ADD_GNB' ? '최상위 메뉴 추가' : modalState.type === 'ADD_SUBMENU' ? '하위 메뉴 추가' : modalState.type === 'DELETE_BANNER_CONFIRM' ? '삭제 확인' : modalState.type === 'DELETE_REQUEST' ? '요청 삭제 확인' : '확인'}
                </h3>
                <button onClick={() => setModalState({ ...modalState, isOpen: false })}><X size={18} className="text-slate-500 hover:text-white" /></button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {/* 1. UNA 상세 비교 (VIEW_UNA_DETAIL) */}
                {modalState.type === 'VIEW_UNA_DETAIL' && modalState.data && (
                  <div className="h-full flex flex-col gap-4 overflow-hidden">
                    <div className="grid grid-cols-2 gap-8 flex-1 overflow-y-auto pr-2 relative p-2">
                      {/* Before Column */}
                      <div className="flex flex-col border border-[#2e3038] rounded-lg bg-[#100d1d] h-fit min-h-full shadow-lg">
                        <div className="sticky top-0 z-20 p-4 bg-[#1e2029] border-b border-orange-500/30 flex justify-between items-center shadow-md rounded-t-lg">
                          <span className="text-orange-400 font-bold text-base flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div> 변경 전 (Original)
                          </span>
                        </div>
                        <div className="p-6 space-y-5 opacity-80 grayscale-[0.3]">
                          {modalState.data.originalSnapshot && modalState.data.originalSnapshot.map((block, idx) => (
                            <div key={`prev-${idx}`} className="relative">
                              <div className="absolute -left-3 top-2 z-10 w-6 h-6 bg-slate-700 text-slate-300 rounded-full flex items-center justify-center text-sm font-mono border border-slate-600 shadow">{idx + 1}</div>
                              <BlockRenderer block={block} isOriginal={true} readOnly={true} />
                            </div>
                          ))}
                          {(!modalState.data.originalSnapshot || modalState.data.originalSnapshot.length === 0) && (
                            <div className="text-slate-500 text-center py-20 text-sm">데이터 없음</div>
                          )}
                        </div>
                      </div>
                      
                      {/* After Column */}
                      <div className="flex flex-col border-2 border-[#7387ff]/30 rounded-lg bg-[#100d1d] h-fit min-h-full shadow-xl shadow-[#7387ff]/5">
                        <div className="sticky top-0 z-20 p-4 bg-[#1e2029] border-b border-[#7387ff]/50 flex justify-between items-center shadow-md rounded-t-lg">
                          <span className="text-[#7387ff] font-bold text-base flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#7387ff]"></div> 변경 후 (New)
                          </span>
                        </div>
                        <div className="p-6 space-y-5">
                          {modalState.data.snapshot && modalState.data.snapshot.map((block, idx) => (
                            <div key={`new-${idx}`} className="relative">
                              <div className="absolute -left-3 top-2 z-10 w-6 h-6 bg-[#7387ff] text-white rounded-full flex items-center justify-center text-sm font-mono font-bold shadow-lg ring-2 ring-[#100d1d]">{idx + 1}</div>
                              <BlockRenderer block={block} isOriginal={false} readOnly={true} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Summary Footer */}
                    <div className="bg-[#191b23] p-5 rounded-lg border border-[#2e3038] shrink-0 z-30 shadow-2xl">
                      <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <FileText size={16} className="text-slate-400"/> 변경 내역 요약
                      </h4>
                      {modalState.data.changes && modalState.data.changes.length > 0 ? (
                        <ul className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                          {modalState.data.changes.map((change, idx) => (
                            <li key={idx} className="text-sm text-slate-300 flex items-start gap-3 bg-[#100d1d] p-2.5 rounded border border-[#2e3038]">
                              <span className={`mt-0.5 shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${change.type === '설명' ? 'bg-purple-500/20 text-purple-400' : change.type === '신규' ? 'bg-blue-500/20 text-blue-400' : change.type === '삭제' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                {change.type}
                              </span>
                              <span className="leading-relaxed">{change.desc}</span>
                            </li>
                          ))}
                        </ul>
                      ) : <p className="text-sm text-slate-500">변경 내역 텍스트가 없습니다.</p>}
                    </div>
                  </div>
                )}

                {/* 2. 히스토리 선택 (HISTORY_SELECT) */}
                {modalState.type === 'HISTORY_SELECT' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-400 mb-2">확인하고 싶은 과거 날짜를 선택해주세요.</p>
                    <div className="bg-[#100d1d] border border-[#2e3038] rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4"><button onClick={handlePrevMonth} className="p-1 hover:bg-[#2e3038] rounded text-slate-400 hover:text-white"><ChevronLeft size={16} /></button><span className="text-sm font-bold text-white">{currentCalendarDate.getFullYear()}년 {currentCalendarDate.getMonth() + 1}월</span><button onClick={handleNextMonth} className="p-1 hover:bg-[#2e3038] rounded text-slate-400 hover:text-white"><ChevronRight size={16} /></button></div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div>
                      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2"><div className="w-2 h-2 bg-[#7387ff] rounded-full"></div><span>변경 이력이 있는 날짜</span></div>
                  </div>
                )}

                {/* 3. 메뉴 추가 (ADD_GNB / ADD_SUBMENU) */}
                {(modalState.type === 'ADD_GNB' || modalState.type === 'ADD_SUBMENU') && (
                  <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">{modalState.type === 'ADD_GNB' ? 'GNB 메뉴 이름' : '하위 메뉴 이름'}</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={menuNameInput} onChange={e => setMenuNameInput(e.target.value)} placeholder="메뉴 이름 입력" autoFocus disabled={isDivider} onKeyDown={(e) => { if (e.key === 'Enter') handleAddMenu(); }} /></div>
                    <div className="flex items-center pt-2"><label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300"><input type="checkbox" checked={isDivider} onChange={e => { setIsDivider(e.target.checked); if (e.target.checked) setMenuNameInput('---'); else setMenuNameInput(''); }} className="accent-[#7387ff]" />구분선 추가</label></div>
                  </div>
                )}

                {/* 4. 신규 요청 등록 (NEW_REQUEST) */}
                {modalState.type === 'NEW_REQUEST' && (
                    <div className="space-y-4">
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">GNB 메뉴 (대상)</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.gnb} onChange={e => setNewRequestData({ ...newRequestData, gnb: e.target.value })}>{gnbList.map(m => (<React.Fragment key={m.id}><option value={m.name}>{m.name}</option></React.Fragment>))}</select></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold text-slate-500 mb-1">요청자</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.requester} onChange={e => setNewRequestData({ ...newRequestData, requester: e.target.value })} placeholder="요청자 이름" /></div>
                            <div><label className="block text-xs font-bold text-slate-500 mb-1">소속 팀</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.team} onChange={e => setNewRequestData({ ...newRequestData, team: e.target.value })} placeholder="예: 편성1팀" /></div>
                        </div>
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">제목</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.headline} onChange={e => setNewRequestData({ ...newRequestData, headline: e.target.value })} placeholder="요청 제목 입력" /></div>
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">편성 유형</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.type} onChange={e => setNewRequestData({ ...newRequestData, type: e.target.value })}><optgroup label="배너"><option value="BIG_BANNER">빅배너</option><option value="TODAY_BTV_BANNER">Today B tv 배너</option><option value="BAND_BANNER">띠배너</option><option value="LONG_BANNER">롱배너</option><option value="FULL_PROMOTION">풀 프로모션 배너</option><option value="BANNER_1">1단 배너</option><option value="BANNER_2">2단 배너</option><option value="BANNER_3">3단 배너</option></optgroup></select></div>
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">편성 요청 위치</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.location} onChange={e => setNewRequestData({ ...newRequestData, location: e.target.value })} placeholder="예: TV 방송 홈 상단" /></div>
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">상세 내용</label><textarea className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none h-20" value={newRequestData.desc} onChange={e => setNewRequestData({ ...newRequestData, desc: e.target.value })} placeholder="요청 상세 내용 입력" /></div>
                        
                        <div className="bg-[#100d1d] p-3 rounded border border-[#2e3038] space-y-3">
                            <div className="text-xs font-bold text-[#7387ff] mb-1">편성 상세 설정</div>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                                <input type="checkbox" checked={newRequestData.isTarget} onChange={e => setNewRequestData({...newRequestData, isTarget: e.target.checked})} className="accent-pink-500" /> 
                                타겟팅 배너 (Target)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] text-slate-500 mb-1">게시 시작일</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                                        value={newRequestData.startDate} 
                                        onChange={e => setNewRequestData({...newRequestData, startDate: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-slate-500 mb-1">게시 종료일</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                                        value={newRequestData.endDate} 
                                        onChange={e => setNewRequestData({...newRequestData, endDate: e.target.value})} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div><label className="block text-xs font-bold text-slate-500 mb-1">비고</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.remarks} onChange={e => setNewRequestData({ ...newRequestData, remarks: e.target.value })} placeholder="특이사항 입력" /></div>
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">Jira 티켓 링크</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.jiraLink} onChange={e => setNewRequestData({ ...newRequestData, jiraLink: e.target.value })} placeholder="http://jira..." /></div>
                    </div>
                  )}

                {/* 5. 블록 추가 (ADD_BLOCK) */}
                {modalState.type === 'ADD_BLOCK' && (
                  <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">블록 타이틀</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newBlockData.title} onChange={e => setNewBlockData({ ...newBlockData, title: e.target.value })} /></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-2">블록 종류</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={blockCategory} onChange={(e) => setBlockCategory(e.target.value)}><option value="CONTENT">콘텐츠 블록</option><option value="BANNER">배너 블록</option><option value="MULTI">멀티 블록</option><option value="SPECIAL">스페셜 (Today B tv)</option></select></div>
                    {blockCategory === 'CONTENT' && (
                      <div className="space-y-4 pt-2 border-t border-[#2e3038]">
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-xs font-bold text-slate-500 mb-1">상세 유형</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newBlockData.type} onChange={e => setNewBlockData({ ...newBlockData, type: e.target.value })}><option value="VERTICAL">세로 포스터</option><option value="HORIZONTAL">가로 포스터</option><option value="HORIZONTAL_MINI">미니 가로</option><option value="TAB">탭 블록</option></select></div>
                          <div className="flex items-center pt-6"><label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300"><input type="checkbox" checked={newBlockData.showPreview} onChange={e => setNewBlockData({ ...newBlockData, showPreview: e.target.checked })} className="accent-[#7387ff]" />프리뷰 영역 노출</label></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1"><label className="block text-xs font-bold text-slate-500 mb-1">ID 유형</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none" value={newBlockData.contentIdType} onChange={e => setNewBlockData({ ...newBlockData, contentIdType: e.target.value })}><option value="LIBRARY">라이브러리</option><option value="RACE">RACE</option></select></div>
                          <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 mb-1">ID값 (블록 ID)</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none font-mono" value={newBlockData.contentId} onChange={e => setNewBlockData({ ...newBlockData, contentId: e.target.value })} placeholder="예: TD_002" /></div>
                        </div>
                        <div className="bg-[#100d1d] p-3 rounded border border-[#2e3038] space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300"><input type="checkbox" checked={newBlockData.useLeadingBanner} onChange={e => setNewBlockData({ ...newBlockData, useLeadingBanner: e.target.checked })} className="accent-[#7387ff]" />앞단 배너 추가</label>
                          {newBlockData.useLeadingBanner && (
                            <div className="pl-5 space-y-2 border-l-2 border-[#2e3038] ml-1">
                              <div><label className="block text-[10px] text-slate-500 mb-1">배너명</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.leadingBannerTitle} onChange={e => setNewBlockData({ ...newBlockData, leadingBannerTitle: e.target.value })} placeholder="배너 이름 입력" /></div>
                              <div><label className="block text-[10px] text-slate-500 mb-1">배너 크기</label><select className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.leadingBannerType} onChange={e => setNewBlockData({ ...newBlockData, leadingBannerType: e.target.value })}><option value="1-COL">1단</option><option value="2-COL">2단</option><option value="3-COL">3단</option></select></div>
                              <div className="grid grid-cols-2 gap-2"><div><label className="block text-[10px] text-slate-500 mb-1">랜딩 유형</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.leadingBannerLanding} onChange={e => setNewBlockData({ ...newBlockData, leadingBannerLanding: e.target.value })} placeholder="직접 입력" /></div><div><label className="block text-[10px] text-slate-500 mb-1">랜딩 값</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.leadingBannerValue} onChange={e => setNewBlockData({ ...newBlockData, leadingBannerValue: e.target.value })} /></div></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {blockCategory === 'BANNER' && (
                      <div className="space-y-4 pt-2 border-t border-[#2e3038]">
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">배너 유형</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-orange-500 outline-none" value={newBlockData.type} onChange={e => setNewBlockData({ ...newBlockData, type: e.target.value })}><option value="BANNER_1">1단 배너</option><option value="BANNER_2">2단 배너</option><option value="BANNER_3">3단 배너</option><option value="BAND_BANNER">띠배너</option><option value="BIG_BANNER">빅배너</option><option value="LONG_BANNER">롱배너</option><option value="FULL_PROMOTION">풀 프로모션 배너</option><option value="MENU_BLOCK">메뉴 블록</option></select></div>
                        <div className="bg-[#100d1d] p-3 rounded border border-[#2e3038] space-y-3">
                          <div className="text-xs font-bold text-orange-500 mb-1">초기 배너 속성</div>
                          <div><label className="block text-[10px] text-slate-500 mb-1">배너명</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.bannerTitle} onChange={e => setNewBlockData({ ...newBlockData, bannerTitle: e.target.value })} placeholder="배너 이름 입력" /></div>
                          <div className="grid grid-cols-2 gap-2"><div><label className="block text-[10px] text-slate-500 mb-1">랜딩 유형</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.bannerLanding} onChange={e => setNewBlockData({ ...newBlockData, bannerLanding: e.target.value })} placeholder="직접 입력" /></div><div><label className="block text-[10px] text-slate-500 mb-1">랜딩 값</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.bannerValue} onChange={e => setNewBlockData({ ...newBlockData, bannerValue: e.target.value })} /></div></div>
                        </div>
                      </div>
                    )}
                    {blockCategory === 'MULTI' && (
                      <div className="space-y-4 pt-2 border-t border-[#2e3038]">
                        <div className="grid grid-cols-3 gap-2"><div className="col-span-1"><label className="block text-xs font-bold text-slate-500 mb-1">ID 유형</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none" value={newBlockData.contentIdType} onChange={e => setNewBlockData({ ...newBlockData, contentIdType: e.target.value })}><option value="LIBRARY">라이브러리</option></select></div><div className="col-span-2"><label className="block text-xs font-bold text-slate-500 mb-1">ID값</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none font-mono" value={newBlockData.contentId} onChange={e => setNewBlockData({ ...newBlockData, contentId: e.target.value })} placeholder="NB..." /></div></div>
                        <div className="flex items-center pt-2"><label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300"><input type="checkbox" checked={newBlockData.showPreview} onChange={e => setNewBlockData({ ...newBlockData, showPreview: e.target.checked })} className="accent-[#7387ff]" />프리뷰 영역 노출</label></div>
                      </div>
                    )}
                    <div className="border-t border-[#2e3038] pt-4 space-y-4">
                      <div className="flex items-center justify-between"><label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300"><input type="checkbox" checked={newBlockData.isTarget} onChange={e => setNewBlockData({ ...newBlockData, isTarget: e.target.checked })} className="accent-pink-500" /> 타겟 설정</label></div>
                      {newBlockData.isTarget && <div><label className="block text-xs font-bold text-slate-500 mb-1">Filter Seg 값</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-pink-500 outline-none" value={newBlockData.targetSeg} onChange={e => setNewBlockData({ ...newBlockData, targetSeg: e.target.value })} placeholder="예: Promotion_1234" /></div>}
                      <div><label className="block text-xs font-bold text-slate-500 mb-1">비고</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newBlockData.remarks} onChange={e => setNewBlockData({ ...newBlockData, remarks: e.target.value })} placeholder="추가 요청사항 입력" /></div>
                    </div>
                  </div>
                )}

                {/* 6. 블록 ID 수정 (EDIT_ID) */}
                {modalState.type === 'EDIT_ID' && (
                  <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">블록명</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#7387ff]" value={editIdData.title} onChange={e => setEditIdData({ ...editIdData, title: e.target.value })} /></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">블록 ID (고유코드)</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#7387ff]" value={editIdData.blockIdCode} onChange={e => setEditIdData({ ...editIdData, blockIdCode: e.target.value })} placeholder="예: TD_002" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">ID 유형</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#7387ff]" value={editIdData.idType} onChange={e => setEditIdData({ ...editIdData, idType: e.target.value })}><option value="LIBRARY">라이브러리</option><option value="RACE">RACE</option></select></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">ID 값</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#7387ff]" value={editIdData.idValue} onChange={e => setEditIdData({ ...editIdData, idValue: e.target.value })} autoFocus /></div>
                    <div className="flex items-center pt-2"><label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300"><input type="checkbox" checked={editIdData.showTitle} onChange={e => setEditIdData({ ...editIdData, showTitle: e.target.checked })} className="accent-[#7387ff]" /> 블록명 노출</label></div>
                    <div className="border-t border-[#2e3038] pt-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300 mb-2"><input type="checkbox" checked={editIdData.isTarget} onChange={e => setEditIdData({ ...editIdData, isTarget: e.target.checked })} className="accent-pink-500" /> 타겟 설정</label>
                      {editIdData.isTarget && <div><label className="block text-xs font-bold text-slate-500 mb-1">Filter Seg 값</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-pink-500 outline-none" value={editIdData.targetSeg} onChange={e => setEditIdData({ ...editIdData, targetSeg: e.target.value })} placeholder="예: Promotion_1234" /></div>}
                    </div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">비고</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#7387ff]" value={editIdData.remarks} onChange={e => setEditIdData({ ...editIdData, remarks: e.target.value })} /></div>
                  </div>
                )}

                {/* 7. 탭 이름 수정 (EDIT_TAB_NAME) */}
                {modalState.type === 'EDIT_TAB_NAME' && (
                  <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">탭 이름</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={editTabNameData.name} onChange={e => setEditTabNameData({ ...editTabNameData, name: e.target.value })} autoFocus /></div>
                    <div className="flex justify-end pt-2"><button onClick={saveTabName} className="px-4 py-2 bg-[#7387ff] hover:bg-[#5b6dbf] rounded text-white text-xs font-bold">저장</button></div>
                  </div>
                )}

                {/* 8. 배너 수정 (EDIT_BANNER) */}
                {modalState.type === 'EDIT_BANNER' && (
                  <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">배너명</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.title} onChange={e => setEditBannerData({ ...editBannerData, title: e.target.value })} /></div>
                    <div className="flex gap-2 items-end"><div className="flex-1"><label className="block text-xs font-bold text-slate-500 mb-1">이미지 URL</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.img} onChange={e => setEditBannerData({ ...editBannerData, img: e.target.value })} /></div><label className="cursor-pointer p-2 bg-[#2e3038] hover:bg-[#3e404b] rounded mb-0.5 border border-slate-600"><Upload size={16} className="text-slate-400" /><input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) setEditBannerData({ ...editBannerData, img: URL.createObjectURL(file) }); }} /></label></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">이벤트 ID</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.eventId} onChange={e => setEditBannerData({ ...editBannerData, eventId: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-slate-500 mb-1">랜딩 유형</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.landingType} onChange={e => setEditBannerData({ ...editBannerData, landingType: e.target.value })} /></div><div><label className="block text-xs font-bold text-slate-500 mb-1">랜딩 값</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-orange-500" value={editBannerData.landingValue} onChange={e => setEditBannerData({ ...editBannerData, landingValue: e.target.value })} /></div></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">Jira 링크</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.jiraLink} onChange={e => setEditBannerData({ ...editBannerData, jiraLink: e.target.value })} /></div>
                    
                    <div className="grid grid-cols-2 gap-2 border-t border-[#2e3038] pt-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">시작일</label>
                            <input 
                                type="date" 
                                className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                                value={editBannerData.startDate} 
                                onChange={e => setEditBannerData({...editBannerData, startDate: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">종료일</label>
                            <input 
                                type="date" 
                                className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                                value={editBannerData.endDate} 
                                onChange={e => setEditBannerData({...editBannerData, endDate: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div className="border-t border-[#2e3038] pt-3"><label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300 mb-2"><input type="checkbox" checked={editBannerData.isTarget} onChange={e => setEditBannerData({ ...editBannerData, isTarget: e.target.checked })} className="accent-pink-500" /> 타겟 설정</label>{editBannerData.isTarget && <div><label className="block text-xs font-bold text-slate-500 mb-1">Filter Seg 값</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-pink-500 outline-none" value={editBannerData.targetSeg} onChange={e => setEditBannerData({ ...editBannerData, targetSeg: e.target.value })} /></div>}</div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">비고</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.remarks} onChange={e => setEditBannerData({ ...editBannerData, remarks: e.target.value })} /></div>
                  </div>
                )}

                {/* 9. 콘텐츠 수정 (EDIT_CONTENT) */}
                {modalState.type === 'EDIT_CONTENT' && (
                  <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">콘텐츠명</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-slate-500" value={editContentData.title} onChange={e => setEditContentData({ ...editContentData, title: e.target.value })} /></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">시리즈 ID</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-slate-500 font-mono" value={editContentData.seriesId} onChange={e => setEditContentData({ ...editContentData, seriesId: e.target.value })} /></div>
                    <div className="flex gap-2 items-end"><div className="flex-1"><label className="block text-xs font-bold text-slate-500 mb-1">이미지 URL</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-slate-500" value={editContentData.img} onChange={e => setEditContentData({ ...editContentData, img: e.target.value })} /></div><label className="cursor-pointer p-2 bg-[#2e3038] hover:bg-[#3e404b] rounded mb-0.5 border border-slate-600"><Upload size={16} className="text-slate-400" /><input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) setEditContentData({ ...editContentData, img: URL.createObjectURL(file) }); }} /></label></div>
                    <div className="flex justify-end pt-2"><button onClick={saveEditedContent} className="px-4 py-2 bg-[#7387ff] hover:bg-[#5b6dbf] rounded text-white text-xs font-bold">저장</button></div>
                  </div>
                )}

                {/* 기타 확인/삭제 메시지 */}
                {modalState.type === 'DELETE_BANNER_CONFIRM' && (<div className="text-center p-4"><AlertTriangle className="mx-auto text-red-500 mb-2" size={32} /><p className="text-white font-bold mb-1">배너를 삭제하시겠습니까?</p><p className="text-xs text-slate-400">삭제 후에는 복구할 수 없습니다.</p></div>)}
                {modalState.type === 'DELETE_REQUEST' && (<div className="text-center p-4"><AlertTriangle className="mx-auto text-red-500 mb-2" size={32} /><p className="text-white font-bold mb-1">요청을 삭제하시겠습니까?</p><p className="text-xs text-slate-400">삭제 후에는 복구할 수 없습니다.</p></div>)}
                
                {/* 10. 저장 (SAVE) */}
                {modalState.type === 'SAVE' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">요청 제목</label>
                      <input type="text" value={requestTitle} onChange={e => setRequestTitle(e.target.value)} className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#7387ff]" />
                    </div>
                    
                    {/* [신규] 상세 설명 입력란 추가 */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">상세 설명 (선택)</label>
                      <textarea 
                        value={requestDescription} 
                        onChange={e => setRequestDescription(e.target.value)} 
                        placeholder="이번 변경 건에 대한 상세한 설명이나 사유를 적어주세요."
                        className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#7387ff] h-24 resize-none"
                      />
                    </div>

                    <div className="bg-[#100d1d] p-3 rounded border border-[#2e3038]">
                        <p className="text-xs font-bold text-slate-500 mb-2">자동 감지된 변경 내역</p>
                        {diffSummary.length > 0 ? (
                            <div className="max-h-32 overflow-y-auto space-y-1">
                                {diffSummary.map((d, i) => (
                                    <div key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                                        <span className={`shrink-0 px-1 rounded text-[10px] ${d.type === '신규' ? 'bg-blue-500/20 text-blue-400' : d.type === '삭제' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>{d.type}</span>
                                        <span>{d.desc}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-600">변경 사항이 없습니다.</p>
                        )}
                    </div>
                  </div>
                )}
                
                {/* 11. 반영 승인 (APPROVE) */}
                {modalState.type === 'APPROVE' && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#7387ff]/20 text-[#7387ff] rounded-full flex items-center justify-center mx-auto mb-4"><Send size={24} /></div>
                    <h4 className="text-lg font-bold text-white mb-2">편성을 반영하시겠습니까?</h4>
                    <p className="text-sm text-slate-400 mb-4">
                      '{modalState.data?.title}' 내용을<br />
                      실제 서비스에 반영(배포)합니다.
                    </p>
                  </div>
                )}
                
                {['DELETE_BLOCK', 'DELETE_REQUEST', 'RESET'].includes(modalState.type) && <p className="text-slate-300 text-sm">작업을 계속 진행하시겠습니까?</p>}
              </div>
              
              <div className="p-4 bg-[#161820] flex justify-end gap-2 border-t border-[#2e3038] shrink-0">
                {modalState.type === 'EDIT_BANNER' && <button onClick={confirmDeleteBanner} className="mr-auto px-4 py-2 rounded text-red-400 text-xs font-bold hover:bg-red-900/20 border border-red-900/50">삭제</button>}
                {modalState.type !== 'EDIT_TAB_NAME' && modalState.type !== 'EDIT_CONTENT' && modalState.type !== 'ADD_GNB' && modalState.type !== 'ADD_SUBMENU' && modalState.type !== 'HISTORY_SELECT' && <button onClick={() => setModalState({ ...modalState, isOpen: false })} className="px-4 py-2 rounded text-slate-400 text-xs font-bold hover:bg-[#2e3038]">취소</button>}
                {modalState.type === 'VIEW_UNA_DETAIL' ? (
                  <>
                    <button onClick={() => setModalState({ ...modalState, isOpen: false })} className="px-4 py-2 rounded text-slate-400 text-xs font-bold hover:bg-[#2e3038]">닫기</button>
                    {modalState.data.status === 'PENDING' && <button onClick={() => reqApprove(modalState.data)} className="px-6 py-2 rounded text-white text-xs font-bold shadow-lg bg-[#7387ff] hover:bg-[#5b6dbf] flex items-center gap-1"><Send size={12} /> 편성 반영 완료</button>}
                  </>
                ) : modalState.type !== 'EDIT_TAB_NAME' && modalState.type !== 'EDIT_CONTENT' && modalState.type !== 'HISTORY_SELECT' && <button onClick={modalState.type === 'NEW_REQUEST' ? handleCreateRequest : modalState.type === 'ADD_BLOCK' ? confirmAddBlock : modalState.type === 'EDIT_ID' ? saveEditedId : modalState.type === 'EDIT_BANNER' ? saveEditedBanner : modalState.type === 'ADD_GNB' || modalState.type === 'ADD_SUBMENU' ? handleAddMenu : handleConfirmAction} className={`px-6 py-2 rounded text-white text-xs font-bold shadow-lg ${modalState.type === 'DELETE_BANNER_CONFIRM' || modalState.type === 'DELETE_REQUEST' ? 'bg-red-600 hover:bg-red-500' : modalState.type === 'EDIT_BANNER' || (modalState.type === 'ADD_BLOCK' && blockCategory === 'BANNER') ? 'bg-orange-600 hover:bg-orange-500' : 'bg-[#7387ff] hover:bg-[#5b6dbf]'}`}>{modalState.type === 'DELETE_BANNER_CONFIRM' || modalState.type === 'DELETE_REQUEST' ? '삭제 확인' : '확인'}</button>}
                {modalState.type === 'HISTORY_SELECT' && <button onClick={() => setModalState({ ...modalState, isOpen: false })} className="px-4 py-2 rounded text-slate-400 text-xs font-bold hover:bg-[#2e3038]">닫기</button>}
              </div>
            </div>
          </div>
        )}
        {/* ===================================================================================== */}
        {/* 3단계: 이력 UI 컴포넌트 (달력 팝업 + 메인 모달) */}
        {/* 이 코드를 </main> 태그 바로 위에 붙여넣으세요. */}
        {/* ===================================================================================== */}
  
        {/* 1. [진입 단계] 날짜 선택 팝업 (Select에서 '이력' 선택 시 가장 먼저 뜸) */}
        {isCalendarPopupOpen && (
          <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-[#191b23] border border-[#2e3038] rounded-xl shadow-2xl p-6 w-[340px] flex flex-col items-center">
              <h3 className="text-lg font-bold text-white mb-1">이력 조회 날짜 선택</h3>
              <p className="text-xs text-slate-400 mb-4">조회하고 싶은 과거 날짜를 선택해주세요.</p>
              
              {/* 달력 컨트롤러 */}
              <div className="w-full bg-[#100d1d] rounded-lg p-4 mb-4 border border-[#2e3038]">
                 <div className="flex justify-between items-center mb-4">
                   <button onClick={handlePrevMonth} className="p-1 hover:bg-[#2e3038] rounded text-slate-400"><ChevronLeft size={16}/></button>
                   <span className="text-sm font-bold text-white">{currentCalendarDate.getFullYear()}.{String(currentCalendarDate.getMonth() + 1).padStart(2,'0')}</span>
                   <button onClick={handleNextMonth} className="p-1 hover:bg-[#2e3038] rounded text-slate-400"><ChevronRight size={16}/></button>
                 </div>
                 
                 {/* 요일 헤더 */}
                 <div className="grid grid-cols-7 gap-1 text-center mb-2">
                   {['일','월','화','수','목','금','토'].map(d => <span key={d} className="text-[10px] text-slate-500">{d}</span>)}
                 </div>

                 {/* 날짜 그리드 */}
                 <div className="grid grid-cols-7 gap-1">
                   {(() => {
                     const daysInMonth = getDaysInMonth(currentCalendarDate);
                     const firstDay = getFirstDayOfMonth(currentCalendarDate);
                     
                     // [추가됨] 오늘 날짜 비교를 위한 변수 정의
                     const now = new Date();
                     const realTodayYear = now.getFullYear();
                     const realTodayMonth = now.getMonth();
                     const realTodayDate = now.getDate();

                     const days = [];
                     // 빈 칸 채우기
                     for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-8"></div>);
                     
                     // 날짜 채우기
                     for (let d = 1; d <= daysInMonth; d++) {
                       const year = currentCalendarDate.getFullYear();
                       const month = currentCalendarDate.getMonth() + 1;
                       const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                       
                       // 해당 날짜에 데이터가 있는지 확인
                       const hasHistory = requests.some(r => r.status === 'APPROVED' && (r.date === dateStr || r.created_at?.startsWith(dateStr)));
                       
                       // [추가됨] 오늘 날짜인지 판별
                       const isToday = (currentCalendarDate.getFullYear() === realTodayYear) && 
                                       (currentCalendarDate.getMonth() === realTodayMonth) && 
                                       (d === realTodayDate);

                       days.push(
                         <button 
                           key={d} 
                           onClick={() => { 
                             setHistorySelectedDate(dateStr); 
                             setIsCalendarPopupOpen(false); 
                             setIsHistoryModalOpen(true);
                             setHistoryDetailReq(null);
                           }}
                           className={`h-8 rounded text-xs flex items-center justify-center transition-all
                             ${isToday 
                               ? 'bg-[#7387ff] text-white font-bold shadow-[0_0_10px_rgba(115,135,255,0.4)] ring-1 ring-[#7387ff]' // [오늘] 파란 배경 강조
                               : hasHistory 
                                 ? 'bg-[#7387ff]/20 text-[#7387ff] font-bold border border-[#7387ff]/50 hover:bg-[#2e3038]' // [이력있음] 연한 파랑 + 테두리
                                 : 'text-slate-400 hover:bg-[#2e3038] hover:text-white' // [일반]
                             }
                           `}
                         >
                           {d}
                         </button>
                       );
                     }
                     return days;
                   })()}
                 </div>
              </div>

              <button 
                onClick={() => setIsCalendarPopupOpen(false)} 
                className="text-xs text-slate-500 hover:text-white underline decoration-slate-600 underline-offset-4"
              >
                취소하고 돌아가기
              </button>
            </div>
          </div>
        )}
  
        {/* 2. [메인 단계] 이력 관리 모달 (날짜 선택 후에만 뜸) */}
        {isHistoryModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-[#161820] w-full h-full max-w-[1600px] rounded-xl border border-[#2e3038] shadow-2xl flex flex-col overflow-hidden relative">
              
              {/* 상단 헤더 */}
              <div className="h-14 border-b border-[#2e3038] flex items-center justify-between px-5 bg-[#191b23] shrink-0">
                <div className="flex items-center gap-4">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <History className="text-[#7387ff]" size={18} /> 이력 관리 (History)
                  </h2>
                  <div className="h-4 w-px bg-[#44464f]"></div>
                  
                  {/* 현재 선택된 날짜 (클릭 시 다시 달력 팝업으로 이동) */}
                  <button 
                    onClick={() => { setIsHistoryModalOpen(false); setIsCalendarPopupOpen(true); }}
                    className="flex items-center gap-2 text-sm text-white bg-[#100d1d] border border-[#2e3038] px-3 py-1.5 rounded hover:border-[#7387ff] transition-colors"
                  >
                    <CalendarIcon size={14} className="text-slate-400"/> 
                    <span className="font-mono font-bold">{historySelectedDate}</span>
                    <span className="text-[10px] text-slate-500 ml-1 hover:text-[#7387ff]">(날짜 변경)</span>
                  </button>
                </div>
                <button onClick={() => setIsHistoryModalOpen(false)} className="p-2 hover:bg-[#2e3038] rounded-full text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
  
              <div className="flex-1 flex overflow-hidden">
                {/* 좌측: 리스트 영역 */}
                <div className="w-80 border-r border-[#2e3038] bg-[#100d1d] flex flex-col">
                  <div className="p-4 border-b border-[#2e3038] bg-[#161820]">
                    <h3 className="text-xs font-bold text-slate-400 mb-1">UNA 편성반영 내역</h3>
                    <div className="text-[10px] text-slate-500">선택한 날짜의 반영 완료 건만 표시</div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {(() => {
                      const dailyHistory = requests.filter(r => {
                         // [수정됨] 저장된 시간을 Date 객체로 만든 뒤 로컬 날짜 문자열과 비교
                         let rDateStr = '';
                         if (r.created_at) {
                             const d = new Date(r.created_at);
                             const year = d.getFullYear();
                             const month = String(d.getMonth() + 1).padStart(2, '0');
                             const day = String(d.getDate()).padStart(2, '0');
                             rDateStr = `${year}-${month}-${day}`;
                         } else {
                             rDateStr = r.date; // Mock 데이터용 fallback
                         }
                         
                         const statusCheck = USE_MOCK_DATA ? true : r.status === 'APPROVED';
                         return rDateStr === historySelectedDate && statusCheck;
                      });
                      if (dailyHistory.length === 0) return <div className="text-center py-10 text-slate-500 text-xs">내역이 없습니다.</div>;
  
                      return dailyHistory.map(req => (
                        <div 
                          key={req.id} 
                          onClick={() => setHistoryDetailReq(req)}
                          className={`p-3 rounded border cursor-pointer transition-all ${historyDetailReq?.id === req.id ? 'bg-[#7387ff]/10 border-[#7387ff]' : 'bg-[#191b23] border-[#2e3038] hover:border-slate-500'}`}
                        >
                           <div className="flex justify-between items-center mb-1">
                             <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${req.status === 'APPROVED' ? 'bg-green-900/30 text-green-500' : 'bg-slate-700 text-slate-400'}`}>{req.status}</span>
                             <span className="text-[10px] text-slate-500">{req.createdAt ? req.createdAt.split(' ')[1] : ''}</span>
                           </div>
                           <div className="text-sm font-bold text-slate-200 mb-1 line-clamp-2">{req.title}</div>
                           <div className="text-[10px] text-slate-500 flex items-center gap-2">
                              <span>{req.requester}</span>
                              <span className="w-px h-2 bg-slate-700"></span>
                              <span>{req.gnb}</span>
                           </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
  
                {/* 우측: 상세 비교 (Diff View) 영역 */}
                <div className="flex-1 bg-[#0a0812] overflow-hidden flex flex-col">
                  {historyDetailReq ? (
                    <>
                       <div className="p-3 border-b border-[#2e3038] bg-[#191b23] flex justify-between items-center shadow-md z-10">
                          <div className="flex items-center gap-2">
                               <h3 className="text-sm font-bold text-white">{historyDetailReq.title}</h3>
                               <span className="text-[10px] text-slate-400 px-1.5 border border-[#2e3038] rounded">ID: {historyDetailReq.id}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold">
                             <span className="flex items-center gap-1 text-orange-400"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> 변경 전</span>
                             <ArrowRight size={12} className="text-slate-600"/>
                             <span className="flex items-center gap-1 text-[#7387ff]"><div className="w-2 h-2 bg-[#7387ff] rounded-full"></div> 변경 후</span>
                          </div>
                       </div>
                       <div className="flex-1 overflow-y-auto p-4">
                          <div className="grid grid-cols-2 gap-4 min-h-full">
                             {/* Before */}
                             <div className="border border-[#2e3038] rounded bg-[#100d1d] p-3">
                                {historyDetailReq.originalSnapshot ? (
                                  historyDetailReq.originalSnapshot.map((block, idx) => (
                                    <div key={`h-old-${idx}`} className="mb-4 opacity-70 grayscale-[0.3] pointer-events-none">
                                      <BlockRenderer block={block} isOriginal={true} readOnly={true} />
                                    </div>
                                  ))
                                ) : <div className="text-slate-500 text-center py-20 text-xs">이전 데이터 없음</div>}
                             </div>
                             {/* After */}
                             <div className="border border-[#7387ff]/30 rounded bg-[#100d1d] p-3 shadow-[0_0_20px_rgba(115,135,255,0.05)]">
                                {historyDetailReq.snapshot ? (
                                  historyDetailReq.snapshot.map((block, idx) => (
                                    <div key={`h-new-${idx}`} className="mb-4 pointer-events-none">
                                      <BlockRenderer block={block} isOriginal={false} readOnly={true} />
                                    </div>
                                  ))
                                ) : <div className="text-slate-500 text-center py-20 text-xs">데이터 없음</div>}
                             </div>
                          </div>
                       </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-2">
                      <History size={40} className="opacity-20"/>
                      <p className="text-sm">좌측 리스트에서 상세 내역을 선택해주세요.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
