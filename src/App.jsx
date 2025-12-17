import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, Plus, Trash2, GripVertical, Smartphone, Monitor, 
  RefreshCw, ChevronRight, Layout, Home, Video, 
  Star, Grid, FileText, CheckCircle, Download, ArrowRight, X, ArrowRightLeft,
  Inbox, User, ExternalLink, RotateCcw, Calendar, Clock, ChevronLeft, Tv, Film, PlayCircle, BookOpen, MessageSquare, Ban,
  Eye, EyeOff, Database, Layers, Hash, Edit3, AlertTriangle, Link, MousePointer, Image as ImageIcon,
  MousePointerClick, Image, Tag, PlusCircle, MoreHorizontal, GripHorizontal, Target, StickyNote, Settings, Upload, Link2, Box, Filter
} from 'lucide-react';

// --- Constants & Styles ---
const COLORS = {
  bg: '#100d1d',
  cardBg: '#191b23',
  cardHover: '#2e3038',
  primary: '#7387ff',
  textMain: '#f5f5ff',
  textSub: '#a9abb4',
  border: '#2e3038'
};

const BANNER_STYLE = {
  bg: 'bg-orange-500/10',
  border: 'border-orange-500/30',
  text: 'text-orange-400',
  hover: 'hover:border-orange-400'
};

const CONTENT_STYLE = {
  bg: 'bg-slate-800',
  border: 'border-slate-700',
  text: 'text-slate-600',
  hover: 'hover:border-slate-500'
};

// Block Styles Definition
const BLOCK_STYLES = {
  TODAY: { bg: 'bg-blue-900/10', border: 'border-blue-500/30', badge: 'bg-blue-900/50 text-blue-300' },
  MULTI: { bg: 'bg-purple-900/10', border: 'border-purple-500/30', badge: 'bg-purple-900/50 text-purple-300' },
  BANNER: { bg: 'bg-orange-900/10', border: 'border-orange-500/30', badge: 'bg-orange-900/50 text-orange-300' },
  CONTENT: { bg: 'bg-[#191b23]', border: 'border-[#44464f]', badge: 'border-slate-700 text-slate-500' }
};

const GNB_MENU = [
  { id: 'ticket', name: '콘텐츠이용권', icon: FileText },
  { id: 'game', name: '게임&앱', icon: Grid },
  { id: 'kids', name: '키즈', icon: Star },
  { id: 'senior', name: '해피시니어', icon: Star },
  { id: 'free', name: '무료', icon: Video },
  { id: 'home', name: '홈', icon: Home }, // B tv+ 위
  { id: 'btvplus', name: 'B tv+', icon: Plus },
  { 
    id: 'tv', 
    name: 'TV 방송', 
    icon: Tv, 
    isOpen: true,
    children: [
      { id: 'tv_home', name: 'TV 방송 홈' },
      { id: 'kbs', name: 'KBS' },
      { id: 'mbc', name: 'MBC' },
      { id: 'sbs', name: 'SBS' },
      { id: 'cjenm', name: 'CJ ENM' },
      { id: 'jtbc', name: 'JTBC' },
      { id: 'tvchosun', name: 'TV CHOSUN' },
      { id: 'channela', name: '채널A' },
      { id: 'mbn', name: 'MBN' },
      { id: 'ebs', name: 'EBS' },
      { id: 'cable', name: '케이블' },
      { id: 'spotv', name: 'SPOTV' },
    ]
  },
  { id: 'movie', name: '영화/시리즈', icon: Film },
  { id: 'ani', name: '애니메이션', icon: PlayCircle },
  { id: 'docu', name: '다큐/라이프', icon: BookOpen },
];

/* Block Types & Data Structure */
const MASTER_BLOCKS = [
  {
    id: 'block-today-1',
    type: 'TODAY_BTV',
    title: 'Today B tv',
    blockId: 'NM2000045999',
    showPreview: true,
    showTitle: false, 
    items: [
        { id: 'td-1', type: 'BANNER', title: '오늘의 추천작', img: 'https://placehold.co/1200x500/1a237e/FFF?text=Today+Pick', landingType: 'ID', landingValue: 'MV_001' },
        { id: 'td-2', type: 'CONTENT', title: '인기 콘텐츠', img: 'https://placehold.co/800x400/283593/FFF?text=Content', seriesId: 'CS10001234' }
    ]
  },
  {
    id: 'block-big-1',
    type: 'BIG_BANNER',
    title: '홈 상단 빅배너',
    blockId: 'NM2000045001',
    showPreview: true,
    showTitle: true,
    banners: [
      { id: 'bb-1', title: '빅배너 타이틀 1', desc: '빅배너 설명 텍스트입니다.', eventId: 'NA2000036294', img: 'https://placehold.co/600x300/e65100/FFF?text=Image', landingType: 'URL', landingValue: 'https://btv.com/event/1', isTarget: true, targetSeg: 'VIP_001', remarks: 'VIP 전용 노출', jiraLink: 'http://jira.sk/123' },
      { id: 'bb-2', title: '빅배너 타이틀 2', desc: '두 번째 배너 설명입니다.', eventId: 'NA2000036295', img: 'https://placehold.co/600x300/bf360c/FFF?text=Image', landingType: 'ID', landingValue: 'NM203491', jiraLink: '' }
    ]
  },
  {
    id: 'block-menu-1',
    type: 'MENU_BLOCK',
    title: '메뉴 블록',
    blockId: 'NM2000045002',
    showPreview: false,
    showTitle: false,
    banners: [
        { id: 'mn-1', title: '편성표', img: 'https://placehold.co/148x148/006064/FFF?text=EPG', landingType: 'ID', landingValue: 'MENU_01' },
        { id: 'mn-2', title: '쿠폰함', img: 'https://placehold.co/148x148/004d40/FFF?text=Coupon', landingType: 'ID', landingValue: 'MENU_02' },
        { id: 'mn-3', title: '이벤트', img: 'https://placehold.co/148x148/1b5e20/FFF?text=Event', landingType: 'ID', landingValue: 'MENU_03' },
        { id: 'mn-4', title: '마이', img: 'https://placehold.co/148x148/33691e/FFF?text=My', landingType: 'ID', landingValue: 'MENU_04' },
    ]
  },
  {
    id: 'block-multi-1',
    type: 'MULTI',
    title: 'AI 추천 큐레이션 (멀티)',
    blockId: 'NM2000045285',
    showPreview: true,
    showTitle: true,
    contentIdType: 'LIBRARY',
    contentId: 'NB1000006137',
    remarks: '개인화 엔진 연동 필요',
    items: [1,2,3,4].map(i => ({ id: `m-${i}`, title: `추천 ${i}` })) 
  },
  {
    id: 'block-0',
    type: 'HORIZONTAL',
    title: '메인 프로모션 (2단 배너 포함)',
    blockId: 'NM2000045100',
    showPreview: true,
    showTitle: true,
    contentIdType: 'LIBRARY',
    contentId: 'NB1000002851',
    leadingBanners: [
      { id: 'lb-1', type: '2-COL', title: '2단 배너 예시', eventId: 'NA2000016722', img: 'https://placehold.co/480x280/e65100/FFF?text=Banner', landingType: 'ID', landingValue: 'EVT_001', isTarget: true, targetSeg: 'NewUser_2025', jiraLink: 'http://jira.sk/456' }
    ],
    items: [{ id: '0-1', title: '콘텐츠 1', img: 'https://placehold.co/600x340/1a1a2e/FFF?text=Content+1' }]
  },
  {
    id: 'block-1',
    type: 'VERTICAL',
    title: '오늘의 인기 순위 #TV방송',
    showPreview: false,
    showTitle: true,
    contentIdType: 'RACE',
    contentId: 'Hyper_Personal_Base_Y551.RACE',
    items: [1, 2, 3, 4, 5, 6].map(i => ({ id: `1-${i}`, title: `콘텐츠 ${i}`, img: 'https://placehold.co/150x220/222/888?text=V' }))
  },
  {
    id: 'block-long-1',
    type: 'LONG_BANNER',
    title: '스페셜 롱배너',
    showPreview: true,
    showTitle: true,
    banners: [{ id: 'lbn-1', title: '롱배너 예시', eventId: 'NA2000016722', img: 'https://placehold.co/1032x1452/f57c00/FFF?text=Long+Banner', landingType: 'ID', landingValue: 'SPECIAL_01', jiraLink: '' }]
  },
  {
    id: 'block-tab-1',
    type: 'TAB',
    title: '장르별 모아보기 (탭 편성)',
    showPreview: true,
    showTitle: true,
    tabs: [
      { 
          id: 'tab-1', name: '드라마', contentIdType: 'LIBRARY', contentId: 'NM2000001', 
          leadingBanners: [{ id: 'tlb-1', type: '1-COL', title: '탭 배너 1', img: 'https://placehold.co/240x360/e65100/FFF?text=TabBanner', jiraLink: '' }],
          items: [1,2,3,4].map(i => ({id: `t1-${i}`, title: `콘텐츠 ${i}`, img: 'https://placehold.co/150x220/333/fff?text=Content+${i}'})) 
      },
      { 
          id: 'tab-2', name: '예능', contentIdType: 'RACE', contentId: 'RACE_ENT_01', 
          items: [1,2,3,4].map(i => ({id: `t2-${i}`, title: `콘텐츠 ${i}`, img: 'https://placehold.co/150x220/444/fff?text=Content+${i}'})) 
      },
    ]
  }
];

const MASTER_REQUESTS = [
  {
    id: 'req-1',
    requester: '마케팅팀 김SK',
    gnb: '홈', // Added GNB info
    team: 'Marketing',
    type: 'BAND_BANNER',
    title: '주말 한정 50% 할인 띠배너',
    date: '2023-11-20',
    desc: '홈 > TV방송 중간 띠배너 배치 희망',
    location: 'TV 방송 홈 중간',
    remarks: 'URL 랜딩 필요',
    jiraLink: 'http://jira.sk/req/111',
    status: 'PENDING',
    contentId: 'NA500123123'
  }
];

// --- Components ---

const BlockRenderer = ({ block, isDragging, isOriginal, onUpdate, onEditId, onEditBannerId, onEditContentId, onEditTabName, onAddTab }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentBigBannerIndex, setCurrentBigBannerIndex] = useState(0);
  const [isBannerMenuOpen, setIsBannerMenuOpen] = useState(false);
  
  // Banner Drag State
  const bannerDragItem = useRef(null);
  const bannerDragOverItem = useRef(null);

  const isMulti = block.type === 'MULTI';
  const isBannerBlock = ['BIG_BANNER', 'BAND_BANNER', 'LONG_BANNER', 'BANNER_1', 'BANNER_2', 'BANNER_3', 'MENU_BLOCK'].includes(block.type);
  const isToday = block.type === 'TODAY_BTV';
  
  const containerStyle = isOriginal ? 'opacity-60 grayscale border-dashed' : '';
  const dragStyle = isDragging ? 'border-[#7387ff] shadow-lg scale-[1.02] z-50' : 'border-transparent';
  
  // Style Logic
  let blockStyle = BLOCK_STYLES.CONTENT;
  if (isMulti) blockStyle = BLOCK_STYLES.MULTI;
  else if (isBannerBlock) blockStyle = BLOCK_STYLES.BANNER;
  else if (isToday) blockStyle = BLOCK_STYLES.TODAY;

  const togglePreview = (e) => {
    e.stopPropagation();
    if (!onUpdate) return;
    onUpdate({ showPreview: !block.showPreview });
  };

  const addBanner = (e, type) => {
    e.stopPropagation();
    if (!onUpdate) return;
    
    const newBanner = {
        id: `new-bn-${Date.now()}`,
        type: type, 
        title: '배너',
        landingType: '',
        landingValue: '',
        img: '',
        eventId: '',
        isTarget: false,
        targetSeg: '',
        remarks: '',
        jiraLink: ''
    };

    if (block.type === 'BIG_BANNER') {
        const currentBanners = block.banners || [];
        onUpdate({ banners: [newBanner, ...currentBanners] });
    } else if (block.type === 'TAB') {
        const newTabs = [...block.tabs];
        const currentTab = newTabs[activeTab];
        const currentBanners = currentTab.leadingBanners || [];
        newTabs[activeTab] = { ...currentTab, leadingBanners: [...currentBanners, newBanner] };
        onUpdate({ tabs: newTabs });
    } else if (['VERTICAL', 'HORIZONTAL', 'HORIZONTAL_MINI'].includes(block.type)) {
        const currentBanners = block.leadingBanners || [];
        onUpdate({ leadingBanners: [...currentBanners, newBanner] });
    } else if (block.type === 'TODAY_BTV') {
        const currentItems = block.items || [];
        onUpdate({ items: [...currentItems, { ...newBanner, type: 'BANNER' }] });
    } else {
        const currentBanners = block.banners || (block.banner ? [block.banner] : []);
        onUpdate({ banners: [...currentBanners, newBanner] });
    }
    
    setIsBannerMenuOpen(false);
  };

  const addContentToToday = (e) => {
      e.stopPropagation();
      if (!onUpdate) return;
      const newContent = {
          id: `new-ct-${Date.now()}`,
          type: 'CONTENT',
          title: '콘텐츠',
          img: '',
          seriesId: ''
      };
      const currentItems = block.items || [];
      onUpdate({ items: [...currentItems, newContent] });
      setIsBannerMenuOpen(false);
  };

  const onBannerDragStart = (e, idx, listType) => {
      e.stopPropagation();
      bannerDragItem.current = { index: idx, type: listType };
      e.dataTransfer.effectAllowed = 'move';
  };

  const onBannerDragEnter = (e, idx) => {
      e.stopPropagation();
      e.preventDefault();
      bannerDragOverItem.current = idx;
  };

  const onBannerDrop = (e, listType) => {
      e.stopPropagation();
      e.preventDefault();
      const dragIndex = bannerDragItem.current?.index;
      const hoverIndex = bannerDragOverItem.current;
      
      if (dragIndex === undefined || hoverIndex === null || dragIndex === hoverIndex) return;
      if (bannerDragItem.current?.type !== listType) return;

      if (block.type === 'TAB') {
         const newTabs = [...block.tabs];
         const currentTab = newTabs[activeTab];
         const currentList = [...(currentTab.leadingBanners || [])];
         const draggedItem = currentList[dragIndex];
         currentList.splice(dragIndex, 1);
         currentList.splice(hoverIndex, 0, draggedItem);
         newTabs[activeTab] = { ...currentTab, leadingBanners: currentList };
         onUpdate({ tabs: newTabs });
      } else if (block.type === 'TODAY_BTV') {
         const currentList = [...(block.items || [])];
         const draggedItem = currentList[dragIndex];
         currentList.splice(dragIndex, 1);
         currentList.splice(hoverIndex, 0, draggedItem);
         onUpdate({ items: currentList });
      } else {
         const listKey = listType === 'LEADING' ? 'leadingBanners' : 'banners';
         const currentList = [...(block[listKey] || [])];
         const draggedItem = currentList[dragIndex];
         currentList.splice(dragIndex, 1);
         currentList.splice(hoverIndex, 0, draggedItem);
         onUpdate({ [listKey]: currentList });
      }
      bannerDragItem.current = null;
      bannerDragOverItem.current = null;
  };

  const toggleIdType = (e) => {
    e.stopPropagation();
    if (!onUpdate) return;
    if (block.type === 'TAB' && block.tabs && block.tabs[activeTab]) {
      const newTabs = [...block.tabs];
      newTabs[activeTab] = { ...newTabs[activeTab], contentIdType: newTabs[activeTab].contentIdType === 'LIBRARY' ? 'RACE' : 'LIBRARY' };
      onUpdate({ tabs: newTabs });
    } else {
      onUpdate({ contentIdType: block.contentIdType === 'LIBRARY' ? 'RACE' : 'LIBRARY' });
    }
  };

  const handleEditIdClick = (e) => {
    e.stopPropagation();
    if (!onEditId) return;
    const tabIndex = block.type === 'TAB' ? activeTab : null;
    onEditId(tabIndex);
  };

  const handleBannerClick = (e, item, index = null, isLeading = false) => {
    e.stopPropagation();
    if(item.type === 'CONTENT') {
        if(onEditContentId) onEditContentId(item, index);
    } else {
        if (onEditBannerId) {
            const tabIdx = block.type === 'TAB' ? activeTab : null;
            onEditBannerId(item, index, isLeading, tabIdx);
        }
    }
  };

  const handlePrevBanner = (e) => {
    e.stopPropagation();
    if (block.banners?.length) {
      setCurrentBigBannerIndex(prev => (prev === 0 ? block.banners.length - 1 : prev - 1));
    }
  };

  const handleNextBanner = (e) => {
    e.stopPropagation();
    if (block.banners?.length) {
      setCurrentBigBannerIndex(prev => (prev === block.banners.length - 1 ? 0 : prev + 1));
    }
  };

  const getDisplayCount = (type) => {
    switch(type) {
      case 'HORIZONTAL': return 2;
      case 'HORIZONTAL_MINI': return 4;
      case 'VERTICAL': return 4;
      default: return 4;
    }
  };
  const displayCount = getDisplayCount(block.type);

  // --- Sub-renderers ---
  const PosterItem = ({ type, text, isBanner, bannerType, img, onClick, onDragStart, onDragEnter, onDrop, draggable, isTarget, jiraLink }) => {
    let sizeClass = "w-24 h-36"; 
    let bgClass = "bg-slate-800";
    let textClass = "text-slate-600";
    
    if (type === 'HORIZONTAL') sizeClass = "w-[200px] h-36";
    if (type === 'HORIZONTAL_MINI') sizeClass = "w-24 h-16";
    
    if (isBanner) {
      bgClass = `${BANNER_STYLE.bg} ${BANNER_STYLE.border} ${BANNER_STYLE.hover} cursor-pointer`; 
      textClass = BANNER_STYLE.text;
      if (isTarget) { 
          bgClass = "bg-pink-900/20 border-pink-500/50 hover:border-pink-400 cursor-pointer";
      }
      
      if (bannerType === '1-COL') sizeClass = "w-24 h-36";
      if (bannerType === '2-COL') sizeClass = "w-[200px] h-36"; 
      if (bannerType === '3-COL') sizeClass = "w-[304px] h-36";
      if (bannerType === 'MENU') sizeClass = "w-[200px] h-[88px]"; 
    }

    // Today B tv Content Style (Distinct from Banner)
    if (block.type === 'TODAY_BTV' && !isBanner) {
        bgClass = `${CONTENT_STYLE.bg} ${CONTENT_STYLE.border} ${CONTENT_STYLE.hover} cursor-pointer`;
        textClass = CONTENT_STYLE.text;
    }

    const hasImage = img && img.startsWith('http');
    const displayText = typeof text === 'string' ? text : 'Content';

    return (
      <div 
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnter={onDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={onClick}
        className={`flex-shrink-0 relative group/poster ${hasImage ? '' : ''} ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
        title={isBanner ? "배너 수정" : "콘텐츠 수정"}
      >
        <div className={`${sizeClass} ${bgClass} ${isTarget ? 'ring-2 ring-pink-500' : ''} rounded border ${isBanner ? '' : 'border-slate-700'} overflow-hidden flex items-center justify-center ${textClass} text-[10px] font-medium relative bg-cover bg-center transition-colors`}
             style={hasImage ? { backgroundImage: `url(${img})` } : {}}
        >
          {/* Today B tv Content Title Overlay (Left Center) */}
          {block.type === 'TODAY_BTV' && (
             <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10 text-white font-bold text-lg drop-shadow-md pointer-events-none">
                 {displayText}
             </div>
          )}

          {!hasImage && block.type !== 'TODAY_BTV' && displayText}
          
          <div className="absolute top-1 left-1 flex flex-col gap-1 z-10">
            {isBanner && <span className={`text-[8px] ${isTarget ? 'bg-pink-600' : 'bg-orange-600/80'} text-white px-1 rounded font-bold`}>{isTarget ? 'TARGET' : 'BANNER'}</span>}
            {!isBanner && block.type === 'TODAY_BTV' && <span className="text-[8px] bg-slate-600 text-white px-1 rounded">CONTENT</span>}
          </div>
          {isBanner && jiraLink && <div className="absolute top-1 right-1 z-10 text-white bg-[#0052cc] rounded-full p-0.5" title="Jira 링크 있음"><Link2 size={8}/></div>}
          {isBanner && !hasImage && <MousePointerClick className="absolute bottom-1 right-1 opacity-50" size={12}/>}
          {isBanner && draggable && <div className="absolute bottom-1 left-1 opacity-0 group-hover/poster:opacity-50 hover:!opacity-100 cursor-grab"><GripHorizontal size={12} className="text-white"/></div>}
          {hasImage && <div className="absolute inset-0 bg-black/20 group-hover/poster:bg-black/0 transition-colors"></div>}
        </div>
      </div>
    );
  };

  const currentIdType = block.type === 'TAB' && block.tabs && block.tabs[activeTab] ? block.tabs[activeTab]?.contentIdType : block.contentIdType;
  const currentIdValue = block.type === 'TAB' && block.tabs && block.tabs[activeTab] ? block.tabs[activeTab]?.contentId : block.contentId;
  const itemsToRender = Array.isArray(block.items) ? block.items : [];
  const tabsToRender = Array.isArray(block.tabs) ? block.tabs : [];

  const canAddBanner = ['VERTICAL', 'HORIZONTAL', 'HORIZONTAL_MINI', 'TAB', 'BIG_BANNER', 'BANNER_1', 'BANNER_2', 'BANNER_3', 'MENU_BLOCK', 'TODAY_BTV', 'LONG_BANNER'].includes(block.type);
  const canPreview = ['VERTICAL', 'HORIZONTAL', 'HORIZONTAL_MINI', 'TAB', 'MULTI'].includes(block.type);
  const canEditId = true;

  // Tab Handlers
  const handleTabClick = (idx, tabName) => {
    if (activeTab === idx && onEditTabName) {
        onEditTabName(idx, tabName); 
    } else {
        setActiveTab(idx);
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${blockStyle.border} ${blockStyle.bg} ${containerStyle} ${dragStyle} relative transition-colors`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1">
          <div className={`flex items-center gap-2 ${block.showTitle === false ? 'opacity-50' : ''}`}>
            <h3 className={`text-sm font-bold truncate ${isMulti ? 'text-purple-300' : 'text-slate-200'}`}>{block.title || 'Untitled Block'}</h3>
            {block.blockId && <span className="text-[10px] bg-slate-700 text-slate-300 px-1 rounded font-mono">{block.blockId}</span>}
            {block.isNew && <span className="text-[10px] bg-red-500 text-white px-1 rounded">NEW</span>}
            {block.isTarget && <span className="text-[10px] bg-pink-600 text-white px-1 rounded flex items-center gap-0.5 font-bold"><Target size={8}/> TARGET</span>}
          </div>
          {block.remarks && <p className="text-[10px] text-slate-500 flex items-center gap-1"><StickyNote size={10}/> {block.remarks}</p>}
          
          {!isOriginal && (
            <div className="flex items-center gap-2 text-[10px]">
              {canAddBanner && (
                <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); setIsBannerMenuOpen(!isBannerMenuOpen); }} className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-orange-500/30 text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 transition-colors cursor-pointer" title="추가"><PlusCircle size={10} /> 추가</button>
                  {isBannerMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-[#1e2029] border border-[#2e3038] rounded shadow-xl z-20 overflow-hidden flex flex-col w-28">
                      {!isToday && !['MENU_BLOCK'].includes(block.type) && <><button onClick={(e) => addBanner(e, '1-COL')} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300 border-b border-[#2e3038]/50">1단 배너</button><button onClick={(e) => addBanner(e, '2-COL')} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300 border-b border-[#2e3038]/50">2단 배너</button><button onClick={(e) => addBanner(e, '3-COL')} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300">3단 배너</button></>}
                      {block.type === 'MENU_BLOCK' && <button onClick={(e) => addBanner(e, 'MENU')} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300">메뉴 배너</button>}
                      {isToday && <><button onClick={(e) => addBanner(e, '1-COL')} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300 border-b border-[#2e3038]/50">배너 추가</button><button onClick={addContentToToday} className="px-2 py-2 text-[10px] text-left hover:bg-[#2e3038] text-slate-300">콘텐츠 추가</button></>}
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
                  <button onClick={handleEditIdClick} className="px-2 py-0.5 text-slate-300 font-mono hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1" title="블록 설정">
                    <Settings size={10} className="text-slate-400"/> 
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <span className={`text-[10px] border px-1.5 py-0.5 rounded flex items-center gap-1 ${blockStyle.badge}`}>
          {isMulti ? 'MULTI' : isToday ? 'TODAY' : block.type.includes('BANNER') || block.type === 'MENU_BLOCK' ? <ImageIcon size={10}/> : block.type === 'TAB' ? <Layers size={10}/> : <Grid size={10}/>}
          {!isMulti && block.type}
        </span>
      </div>

      {block.type === 'BIG_BANNER' && (
        <div className={`relative w-full h-[200px] rounded-lg overflow-hidden border ${BANNER_STYLE.border} ${BANNER_STYLE.bg} group/banner flex`}>
           <div className="w-[200px] flex-shrink-0 p-4 flex flex-col justify-center border-r border-orange-500/30 bg-slate-900/50">
              <span className="text-orange-300 text-sm font-bold mb-2 leading-tight">{block.banners?.[currentBigBannerIndex]?.title || '배너'}</span>
              <span className="text-slate-400 text-xs line-clamp-3 mb-2">{block.banners?.[currentBigBannerIndex]?.desc || '설명 텍스트'}</span>
              <div className="flex gap-1 flex-wrap">
                 {block.banners?.[currentBigBannerIndex]?.isTarget && <span className="text-[8px] bg-pink-600 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold"><Target size={6}/> TARGET</span>}
                 {block.banners?.[currentBigBannerIndex]?.landingType && <span className="text-[8px] bg-black/50 text-white px-1.5 py-0.5 rounded">{block.banners[currentBigBannerIndex].landingType}</span>}
                 {block.banners?.[currentBigBannerIndex]?.jiraLink && <span className="text-[8px] bg-[#0052cc] text-white px-1.5 py-0.5 rounded flex items-center gap-0.5" title={block.banners[currentBigBannerIndex].jiraLink}><Link2 size={6}/> Jira</span>}
              </div>
           </div>
           <div onClick={(e) => handleBannerClick(e, block.banners?.[currentBigBannerIndex], currentBigBannerIndex)} className="flex-1 relative bg-cover cursor-pointer hover:opacity-90 transition-opacity bg-slate-800" style={{backgroundImage: block.banners?.[currentBigBannerIndex]?.img ? `url(${block.banners[currentBigBannerIndex].img})` : 'none', backgroundPosition: 'right top'}}>
             {!block.banners?.[currentBigBannerIndex]?.img && <div className={`flex w-full h-full items-center justify-center ${BANNER_STYLE.text} text-[10px] font-bold`}>이미지 (우상단 정렬)</div>}
           </div>
           {block.banners?.length > 1 && (<><button onClick={handlePrevBanner} className="absolute left-[200px] ml-1 top-1/2 -translate-y-1/2 p-1 bg-black/30 hover:bg-black/60 rounded-full text-white/70 hover:text-white transition-colors z-10"><ChevronLeft size={16}/></button><button onClick={handleNextBanner} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-black/30 hover:bg-black/60 rounded-full text-white/70 hover:text-white transition-colors z-10"><ChevronRight size={16}/></button></>)}
           <div className="absolute bottom-2 right-4 flex justify-center gap-1 z-10 pointer-events-none">{block.banners?.map((_, idx) => (<div key={idx} className={`w-1 h-1 rounded-full transition-colors ${idx === currentBigBannerIndex ? 'bg-white' : 'bg-white/30'}`}></div>))}</div>
        </div>
      )}

      {/* TODAY B TV */}
      {block.type === 'TODAY_BTV' && (
        <div className="relative w-full h-[400px] bg-slate-900 rounded-lg overflow-hidden border border-blue-500/30 flex flex-col">
            <div className="flex-1 bg-cover bg-center relative group" style={{backgroundImage: block.items?.[0]?.img ? `url(${block.items[0].img})` : 'none', backgroundPosition: 'right top'}}>
               {!block.items?.[0]?.img && <div className="absolute inset-0 flex items-center justify-center text-blue-300 font-bold">Today B tv 메인 영역 (이미지)</div>}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
            <div className="h-40 bg-[#161820] flex items-center px-4 gap-4 overflow-x-auto">
               {block.items?.map((item, idx) => (
                  <div key={idx} 
                       onClick={(e) => handleBannerClick(e, item, idx)}
                       draggable={!isOriginal}
                       onDragStart={(e) => onBannerDragStart(e, idx, 'BANNER')}
                       onDragEnter={(e) => onBannerDragEnter(e, idx)}
                       onDrop={(e) => onBannerDrop(e, 'BANNER')}
                       onDragOver={(e) => e.preventDefault()}
                       className={`flex-shrink-0 w-48 h-28 rounded relative cursor-pointer transition-all ${idx === 0 ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'} bg-cover bg-center ${item.type === 'CONTENT' ? 'border border-slate-600' : 'border border-orange-500/30'}`}
                       style={item.img ? {backgroundImage: `url(${item.img})`} : {backgroundColor: item.type === 'CONTENT' ? '#1e293b' : 'rgba(249, 115, 22, 0.1)'}}
                  >
                     {!item.img && <div className={`flex items-center justify-center h-full text-xs ${item.type === 'CONTENT' ? 'text-slate-400' : 'text-orange-300'}`}>{item.title}</div>}
                     <div className={`absolute top-1 right-1 text-[9px] text-white px-1 rounded ${item.type === 'CONTENT' ? 'bg-slate-600' : 'bg-orange-600'}`}>{item.type === 'CONTENT' ? 'CONTENT' : 'BANNER'}</div>
                  </div>
               ))}
            </div>
        </div>
      )}

      {/* Renders for other block types */}
      {['BAND_BANNER', 'LONG_BANNER', 'BANNER_1', 'BANNER_2', 'BANNER_3', 'TAB', 'VERTICAL', 'HORIZONTAL', 'HORIZONTAL_MINI', 'MULTI', 'MENU_BLOCK'].includes(block.type) && (
        <div className={`flex gap-2 ${['BAND_BANNER'].includes(block.type) ? 'flex-col' : block.type === 'LONG_BANNER' || block.type === 'MULTI' ? '' : block.type === 'TAB' ? 'flex-col' : 'items-center'} overflow-x-auto flex-nowrap min-h-[50px] pb-2`}>
           {block.type === 'TAB' ? (
               <div className="w-full bg-[#100d1d] rounded-lg p-3 border border-slate-700/50">
                  <div className="flex gap-1 mb-3 border-b border-slate-700 overflow-x-auto items-center">
                    {tabsToRender.map((tab, idx) => (
                      <button 
                        key={tab.id || idx} 
                        onClick={(e) => { e.stopPropagation(); handleTabClick(idx, tab.name); }} 
                        className={`px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors whitespace-nowrap flex items-center gap-1 group ${activeTab === idx ? 'bg-[#7387ff] text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {tab.name || `Tab ${idx + 1}`}
                        {activeTab === idx && !isOriginal && <Edit3 size={8} className="opacity-50 group-hover:opacity-100" />}
                      </button>
                    ))}
                    {!isOriginal && (
                        <button onClick={(e) => { e.stopPropagation(); onAddTab(); }} className="px-2 py-1 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors"><Plus size={12}/></button>
                    )}
                  </div>
                  <div className="flex gap-2 overflow-x-auto flex-nowrap min-h-[100px] items-center pb-2">
                    {tabsToRender[activeTab]?.leadingBanners?.map((banner, idx) => (
                      <PosterItem key={`tab-bn-${idx}`} type="VERTICAL" isBanner={true} isTarget={banner.isTarget} jiraLink={banner.jiraLink} bannerType={banner.type} text={banner.title || '배너'} img={banner.img} onClick={(e) => handleBannerClick(e, banner, idx, true)} draggable={!isOriginal} onDragStart={(e) => onBannerDragStart(e, idx, 'LEADING')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'LEADING')} />
                    ))}
                    {tabsToRender[activeTab]?.items?.slice(0,4).map((item, i) => <PosterItem key={i} type="VERTICAL" text={item.title} />)}
                  </div>
               </div>
           ) : (
             <>
               {block.banners?.map((banner, idx) => (
                 <div key={`bn-${idx}`} className={block.type === 'BAND_BANNER' ? 'w-full shrink-0' : 'shrink-0'}>
                   {block.type === 'BAND_BANNER' ? (
                      <div draggable={!isOriginal} onDragStart={(e) => onBannerDragStart(e, idx, 'BANNER')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'BANNER')} onDragOver={(e) => e.preventDefault()} onClick={(e) => handleBannerClick(e, banner, idx)} className={`w-full h-24 ${BANNER_STYLE.bg} border ${banner.isTarget ? 'border-pink-500/50' : BANNER_STYLE.border} ${BANNER_STYLE.hover} cursor-pointer rounded flex items-center justify-center ${BANNER_STYLE.text} text-[10px] font-bold relative bg-cover bg-center transition-colors group/band`} style={banner.img ? { backgroundImage: `url(${banner.img})` } : {}}>
                        {!banner.img && (banner.title || '배너')}
                        <div className="absolute right-2 top-2 flex flex-col gap-1 items-end">{banner.isTarget && <span className="text-[8px] bg-pink-600 text-white px-1 rounded font-bold flex items-center gap-0.5"><Target size={6}/> TARGET</span>}{banner.landingType && <span className="text-[9px] bg-black/50 text-white px-1 rounded">{banner.landingType}</span>}{banner.jiraLink && <span className="text-[8px] bg-[#0052cc] text-white px-1 rounded flex items-center gap-0.5"><Link2 size={6}/> Jira</span>}</div>
                        {!isOriginal && <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/band:opacity-50 text-white cursor-grab"><GripVertical size={16}/></div>}
                      </div>
                   ) : block.type === 'LONG_BANNER' ? (
                      <div draggable={!isOriginal} onDragStart={(e) => onBannerDragStart(e, idx, 'BANNER')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'BANNER')} onDragOver={(e) => e.preventDefault()} onClick={(e) => handleBannerClick(e, banner, idx)} className={`flex-shrink-0 w-48 h-[270px] ${BANNER_STYLE.bg} border ${banner.isTarget ? 'border-pink-500/50' : BANNER_STYLE.border} ${BANNER_STYLE.hover} cursor-pointer rounded flex flex-col items-center justify-center ${BANNER_STYLE.text} text-[10px] font-bold relative p-4 text-center bg-cover bg-center transition-colors group/long`} style={banner.img ? { backgroundImage: `url(${banner.img})` } : {}}>
                        {!banner.img && <><span className="mb-2">{banner.title || '배너'}</span><span className="text-[9px] opacity-70 font-normal">1032 x 1452 비율</span></>}
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">{banner.isTarget && <span className="text-[8px] bg-pink-600 text-white px-1 rounded font-bold">TARGET</span>}{banner.landingType && <span className="text-[9px] bg-black/50 text-white px-1 rounded">{banner.landingType}</span>}{banner.jiraLink && <span className="text-[8px] bg-[#0052cc] text-white px-1 rounded flex items-center gap-0.5"><Link2 size={6}/></span>}</div>
                        {!isOriginal && <div className="absolute top-2 right-2 opacity-0 group-hover/long:opacity-50 text-white cursor-grab"><GripVertical size={14}/></div>}
                      </div>
                   ) : block.type === 'MENU_BLOCK' ? (
                       <PosterItem type="VERTICAL" isBanner={true} isTarget={banner.isTarget} jiraLink={banner.jiraLink} bannerType="MENU" text={banner.title} img={banner.img} onClick={(e) => handleBannerClick(e, banner, idx)} draggable={!isOriginal} onDragStart={(e) => onBannerDragStart(e, idx, 'BANNER')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'BANNER')} />
                   ) : (
                      <PosterItem type="VERTICAL" isBanner={true} isTarget={banner.isTarget} jiraLink={banner.jiraLink} bannerType={banner.type || (block.type === 'BANNER_1' ? '1-COL' : block.type === 'BANNER_2' ? '2-COL' : '3-COL')} text={banner.title} img={banner.img} onClick={(e) => handleBannerClick(e, banner, idx)} draggable={!isOriginal} onDragStart={(e) => onBannerDragStart(e, idx, 'BANNER')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'BANNER')} />
                   )}
                 </div>
               ))}
               {block.leadingBanners && block.leadingBanners.map((banner, idx) => (
                 <PosterItem key={`lb-${idx}`} type={block.type} isBanner={true} isTarget={banner.isTarget} jiraLink={banner.jiraLink} bannerType={banner.type} text={banner.title || '배너'} img={banner.img} onClick={(e) => handleBannerClick(e, banner, idx, true)} draggable={!isOriginal} onDragStart={(e) => onBannerDragStart(e, idx, 'LEADING')} onDragEnter={(e) => onBannerDragEnter(e, idx)} onDrop={(e) => onBannerDrop(e, 'LEADING')} />
               ))}
               {itemsToRender.slice(0, displayCount).map((item, idx) => (
                 <PosterItem key={idx} type={block.type} text={item.title} />
               ))}
               {itemsToRender.length > displayCount && <div className="flex items-center text-slate-600 text-xs pl-1">...</div>}
             </>
           )}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [viewMode, setViewMode] = useState('EDITOR');
  const [compareMode, setCompareMode] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [currentMenuPath, setCurrentMenuPath] = useState('홈');
  
  // Filter States
  const [inboxFilter, setInboxFilter] = useState('ALL');
  const [unaFilter, setUnaFilter] = useState('ALL');

  // Data
  const [blocks, setBlocks] = useState(() => JSON.parse(JSON.stringify(MASTER_BLOCKS)));
  const [originalBlocks, setOriginalBlocks] = useState(() => JSON.parse(JSON.stringify(MASTER_BLOCKS))); 
  const [requests, setRequests] = useState(() => JSON.parse(JSON.stringify(MASTER_REQUESTS)));
  const [savedRequests, setSavedRequests] = useState([]); 
  const [viewRequest, setViewRequest] = useState(null);
  
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });
  const [blockCategory, setBlockCategory] = useState('CONTENT'); 
  const [newBlockData, setNewBlockData] = useState({ 
    title: '', type: 'VERTICAL', showPreview: false, contentIdType: 'LIBRARY', contentId: '', remarks: '',
    isTarget: false, targetSeg: '',
    useLeadingBanner: false, leadingBannerType: '1-COL', leadingBannerLanding: '', leadingBannerValue: '', leadingBannerImg: '', leadingBannerEventId: '', leadingBannerJira: '',
    leadingBannerTitle: '배너',
    bannerLanding: '', bannerValue: '', bannerImg: '', bannerEventId: '', bannerTitle: '배너', bannerJira: '',
    showTitle: true
  });
  
  const [editIdData, setEditIdData] = useState({ blockId: null, tabIndex: null, idType: 'LIBRARY', idValue: '', isTarget: false, targetSeg: '', remarks: '', title: '', showTitle: true });
  const [editBannerData, setEditBannerData] = useState({ 
      blockId: null, isLeading: false, bannerIndex: null, tabIndex: null,
      landingType: '', landingValue: '', img: '', eventId: '', jiraLink: '',
      isTarget: false, targetSeg: '', remarks: '', title: '', desc: ''
  });
  const [editContentData, setEditContentData] = useState({
      blockId: null, itemIndex: null, title: '', seriesId: ''
  });
  const [editTabNameData, setEditTabNameData] = useState({ blockId: null, tabIndex: null, name: '' });
  const [scheduleDate, setScheduleDate] = useState('');
  const [requestTitle, setRequestTitle] = useState('');
  const [diffSummary, setDiffSummary] = useState([]);
  const [newRequestData, setNewRequestData] = useState({ requester: '', headline: '', location: '', desc: '', remarks: '', type: 'VERTICAL', jiraLink: '', gnb: '홈' }); // Added gnb

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const dragType = useRef(null);
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState(null);

  const generateDiffs = () => {
    const changes = [];
    // Detailed Diff Logic
    blocks.forEach(block => {
      const original = originalBlocks.find(b => b.id === block.id);
      if (!original) {
        changes.push({ type: '신규', block, desc: `[${block.type}] ${block.title} 블록이 신규 추가되었습니다.` });
      } else {
        if (block.title !== original.title) changes.push({ type: '수정', block, desc: `타이틀 변경: ${original.title} → ${block.title}` });
        if (block.showPreview !== original.showPreview) changes.push({ type: '수정', block, desc: `프리뷰: ${original.showPreview?'ON':'OFF'} → ${block.showPreview?'ON':'OFF'}` });
        if (block.contentId !== original.contentId) changes.push({ type: '수정', block, desc: `ID: ${original.contentId} → ${block.contentId}` });
        
        // Banner Diffs
        const orgLB = original.leadingBanners || [];
        const newLB = block.leadingBanners || [];
        if (orgLB.length !== newLB.length) changes.push({ type: '수정', block, desc: `앞단 배너 수 변경 (${orgLB.length}개 → ${newLB.length}개)` });
        
        const orgBanners = original.banners || (original.banner ? [original.banner] : []);
        const newBanners = block.banners || (block.banner ? [block.banner] : []);
        if (orgBanners.length !== newBanners.length) changes.push({ type: '수정', block, desc: `배너 수 변경 (${orgBanners.length}개 → ${newBanners.length}개)` });
      }
    });
    originalBlocks.forEach(orgBlock => {
      if (!blocks.find(b => b.id === orgBlock.id)) changes.push({ type: '삭제', block: orgBlock, desc: `[${orgBlock.type}] ${orgBlock.title} 블록이 삭제되었습니다.` });
    });
    return changes;
  };

  const openAddBlockModal = () => {
    setBlockCategory('CONTENT');
    setNewBlockData({ 
      title: '', type: 'VERTICAL', showPreview: false, contentIdType: 'LIBRARY', contentId: '', remarks: '',
      isTarget: false, targetSeg: '',
      useLeadingBanner: false, leadingBannerType: '1-COL', leadingBannerLanding: '', leadingBannerValue: '', leadingBannerImg: '', leadingBannerEventId: '', leadingBannerJira: '',
      leadingBannerTitle: '배너',
      bannerLanding: '', bannerValue: '', bannerImg: '', bannerEventId: '', bannerTitle: '배너', bannerJira: '',
      showTitle: true
    });
    setModalState({ isOpen: true, type: 'ADD_BLOCK', data: null });
  };

  const confirmAddBlock = () => {
    if (!newBlockData.title) return alert('블록 타이틀을 입력해주세요.');
    let newBlock = { id: `new-${Date.now()}`, title: newBlockData.title, isNew: true, remarks: newBlockData.remarks, isTarget: newBlockData.isTarget, targetSeg: newBlockData.targetSeg, type: newBlockData.type, showTitle: newBlockData.showTitle };
     if (blockCategory === 'BANNER') {
       newBlock.type = newBlockData.type;
       newBlock.banners = [{ id: `bn-${Date.now()}`, title: newBlockData.bannerTitle || '배너', landingType: newBlockData.bannerLanding, landingValue: newBlockData.bannerValue, eventId: newBlockData.bannerEventId, img: newBlockData.bannerImg, type: newBlockData.type === 'BANNER_1' ? '1-COL' : newBlockData.type === 'BANNER_2' ? '2-COL' : newBlockData.type === 'BANNER_3' ? '3-COL' : newBlockData.type === 'MENU_BLOCK' ? 'MENU' : undefined, jiraLink: newBlockData.bannerJira }];
       if(newBlockData.type === 'BIG_BANNER') newBlock.banners[0].desc = ""; 
       if(newBlockData.type === 'MENU_BLOCK') newBlock.showTitle = false;
     } else if (blockCategory === 'MULTI') {
       newBlock.type = 'MULTI'; newBlock.showPreview = newBlockData.showPreview; newBlock.contentIdType = newBlockData.contentIdType; newBlock.contentId = newBlockData.contentId || 'NB_...'; newBlock.items = [1,2,3,4].map(i => ({ id: `m-${i}`, title: `콘텐츠 ${i}` }));
     } else {
       newBlock.type = newBlockData.type; newBlock.showPreview = newBlockData.showPreview; newBlock.contentIdType = newBlockData.contentIdType; newBlock.contentId = newBlockData.contentId || 'NM...'; newBlock.items = [1,2,3,4,5].map(i => ({ id: `t-${i}`, title: `콘텐츠 ${i}` }));
       if (newBlockData.type === 'TAB') newBlock.tabs = [{ id: 't1', name: '탭 1', contentId: 'N1', items: [{title:'콘텐츠 1'}, {title:'콘텐츠 2'}, {title:'콘텐츠 3'}, {title:'콘텐츠 4'}] }, { id: 't2', name: '탭 2', contentId: 'N2', items: [{title:'콘텐츠 1'}, {title:'콘텐츠 2'}, {title:'콘텐츠 3'}, {title:'콘텐츠 4'}] }];
       if (newBlockData.useLeadingBanner) newBlock.leadingBanners = [{ type: newBlockData.leadingBannerType, title: newBlockData.leadingBannerTitle || '배너', landingType: newBlockData.leadingBannerLanding, landingValue: newBlockData.leadingBannerValue, eventId: newBlockData.leadingBannerEventId, img: newBlockData.leadingBannerImg, jiraLink: newBlockData.leadingBannerJira }];
     }
     const _blocks = [...blocks]; _blocks.splice(1, 0, newBlock); setBlocks(_blocks); setModalState({ isOpen: false, type: null, data: null });
  };
  
  const handleDelete = (id, e) => { e.preventDefault(); e.stopPropagation(); setModalState({ isOpen: true, type: 'DELETE_BLOCK', data: id }); };
  const handleReset = () => setModalState({ isOpen: true, type: 'RESET', data: null });
  const reqDeleteRequest = (id, e) => { e.stopPropagation(); setModalState({ isOpen: true, type: 'DELETE_REQUEST', data: id }); };
  const reqApprove = (req) => setModalState({ isOpen: true, type: 'APPROVE', data: req });
  const handleRejectRequest = (id, e) => { e.stopPropagation(); if(window.confirm('거절하시겠습니까?')) setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r)); };
  const handleUpdateBlock = (blockId, updates) => setBlocks(prev => prev.map(block => block.id === blockId ? { ...block, ...updates } : block));
  const openEditIdModal = (block, tabIndex) => { let cType, cVal, cTarget, cSeg, cRemark; if (block.type === 'TAB' && tabIndex !== null && block.tabs[tabIndex]) { cType = block.tabs[tabIndex].contentIdType; cVal = block.tabs[tabIndex].contentId; } else { cType = block.contentIdType; cVal = block.contentId; cTarget = block.isTarget; cSeg = block.targetSeg; cRemark = block.remarks; } setEditIdData({ blockId: block.id, tabIndex, idType: cType, idValue: cVal, isTarget: cTarget || false, targetSeg: cSeg || '', remarks: cRemark || '', title: block.title || '', showTitle: block.showTitle !== false }); setModalState({ isOpen: true, type: 'EDIT_ID', data: null }); };
  const saveEditedId = () => { const { blockId, tabIndex, idType, idValue, isTarget, targetSeg, remarks, title, showTitle } = editIdData; const block = blocks.find(b => b.id === blockId); if (!block) return; let updates = { title, showTitle }; if (block.type === 'TAB' && tabIndex !== null) { const newTabs = [...block.tabs]; newTabs[tabIndex] = { ...newTabs[tabIndex], contentIdType: idType, contentId: idValue }; updates.tabs = newTabs; } else { updates = { ...updates, contentIdType: idType, contentId: idValue, isTarget, targetSeg, remarks }; } handleUpdateBlock(blockId, updates); setModalState({ ...modalState, isOpen: false }); };
  const handleBannerEdit = (block, bannerData, bannerIndex, isLeading, tabIndex = null) => {
    setEditBannerData({ blockId: block.id, isLeading, bannerIndex, tabIndex, landingType: bannerData.landingType || '', landingValue: bannerData.landingValue || '', img: bannerData.img || '', eventId: bannerData.eventId || '', jiraLink: bannerData.jiraLink || '', isTarget: bannerData.isTarget || false, targetSeg: bannerData.targetSeg || '', remarks: bannerData.remarks || '', title: bannerData.title || '', desc: bannerData.desc || '' }); setModalState({ isOpen: true, type: 'EDIT_BANNER', data: null });
  };
  const saveEditedBanner = () => {
      const { blockId, isLeading, bannerIndex, tabIndex, landingType, landingValue, img, eventId, jiraLink, isTarget, targetSeg, remarks, title, desc } = editBannerData;
      setBlocks(prev => prev.map(b => {
          if (b.id !== blockId) return b;
          const newBlock = { ...b }; const newBannerData = { landingType, landingValue, img, eventId, jiraLink, isTarget, targetSeg, remarks, title, desc };
          if (b.type === 'TAB' && tabIndex !== null) { const newTabs = [...b.tabs]; if (isLeading) { const currentTab = newTabs[tabIndex]; const newLeadingBanners = [...(currentTab.leadingBanners || [])]; if (newLeadingBanners[bannerIndex]) { newLeadingBanners[bannerIndex] = { ...newLeadingBanners[bannerIndex], ...newBannerData }; } newTabs[tabIndex] = { ...currentTab, leadingBanners: newLeadingBanners }; } newBlock.tabs = newTabs; } 
          else if (isLeading) { const newLeadingBanners = [...(newBlock.leadingBanners || [])]; if (newLeadingBanners[bannerIndex]) { newLeadingBanners[bannerIndex] = { ...newLeadingBanners[bannerIndex], ...newBannerData }; } newBlock.leadingBanners = newLeadingBanners; } 
          else if (newBlock.type === 'TODAY_BTV') { const newItems = [...(newBlock.items || [])]; if(newItems[bannerIndex]) { newItems[bannerIndex] = { ...newItems[bannerIndex], ...newBannerData }; } newBlock.items = newItems; }
          else if (newBlock.banners) { const newBanners = [...newBlock.banners]; if (newBanners[bannerIndex]) { newBanners[bannerIndex] = { ...newBanners[bannerIndex], ...newBannerData }; } newBlock.banners = newBanners; } 
          else if (newBlock.banner) { newBlock.banner = { ...newBlock.banner, ...newBannerData }; } return newBlock;
      })); setModalState({ ...modalState, isOpen: false });
  };
  const handleEditContent = (blockId, itemIndex, currentData) => {
      setEditContentData({ blockId, itemIndex, title: currentData.title || '', seriesId: currentData.seriesId || '' });
      setModalState({ isOpen: true, type: 'EDIT_CONTENT', data: null });
  };
  const saveEditedContent = () => {
      const { blockId, itemIndex, title, seriesId } = editContentData;
      setBlocks(prev => prev.map(b => {
          if (b.id !== blockId) return b;
          const newItems = [...(b.items || [])];
          if (newItems[itemIndex]) {
              newItems[itemIndex] = { ...newItems[itemIndex], title, seriesId };
          }
          return { ...b, items: newItems };
      }));
      setModalState({ ...modalState, isOpen: false });
  };
  const confirmDeleteBanner = () => { setModalState({ ...modalState, type: 'DELETE_BANNER_CONFIRM' }); };
  const handleDeleteBanner = () => {
      const { blockId, isLeading, bannerIndex, tabIndex } = editBannerData;
      setBlocks(prev => prev.map(b => {
          if (b.id !== blockId) return b;
          if (b.type === 'TAB' && tabIndex !== null) { const newTabs = [...b.tabs]; if (isLeading) { const currentTab = newTabs[tabIndex]; const newLeadingBanners = (currentTab.leadingBanners || []).filter((_, idx) => idx !== bannerIndex); newTabs[tabIndex] = { ...currentTab, leadingBanners: newLeadingBanners }; } return { ...b, tabs: newTabs }; }
          if (isLeading) { const newLeadingBanners = (b.leadingBanners || []).filter((_, idx) => idx !== bannerIndex); return { ...b, leadingBanners: newLeadingBanners }; } 
          else if (b.type === 'TODAY_BTV') { const newItems = (b.items || []).filter((_, idx) => idx !== bannerIndex); return { ...b, items: newItems }; }
          else if (b.banners) { const newBanners = b.banners.filter((_, idx) => idx !== bannerIndex); if (newBanners.length === 0 && ['BAND_BANNER', 'LONG_BANNER', 'BANNER_1', 'BANNER_2', 'BANNER_3', 'MENU_BLOCK'].includes(b.type)) return null; return { ...b, banners: newBanners }; } return b;
      }).filter(Boolean)); setModalState({ ...modalState, isOpen: false });
  };
  const handleAddTab = (blockId) => { setBlocks(prev => prev.map(b => { if (b.id !== blockId) return b; const newTabs = [...(b.tabs || [])]; newTabs.push({ id: `tab-new-${Date.now()}`, name: `새 탭 ${newTabs.length + 1}`, contentId: '', items: [1,2,3,4].map(i => ({title: `콘텐츠 ${i}`})) }); return { ...b, tabs: newTabs }; })); };
  const handleEditTabName = (blockId, tabIndex, currentName) => { setEditTabNameData({ blockId, tabIndex, name: currentName }); setModalState({ isOpen: true, type: 'EDIT_TAB_NAME', data: null }); };
  const saveTabName = () => { const { blockId, tabIndex, name } = editTabNameData; setBlocks(prev => prev.map(b => { if (b.id !== blockId) return b; const newTabs = [...b.tabs]; newTabs[tabIndex] = { ...newTabs[tabIndex], name }; return { ...b, tabs: newTabs }; })); setModalState({ ...modalState, isOpen: false }); };
  const handleOpenSaveModal = () => { const today = new Date(); today.setDate(today.getDate() + 3); setScheduleDate(today.toISOString().split('T')[0]); setRequestTitle(`[편성요청] ${currentMenuPath} 정기 개편`); const diffs = generateDiffs(); setDiffSummary(diffs.length > 0 ? diffs : [{ type: '알림', block: { title: '-' }, desc: '변경 사항이 없습니다.' }]); setModalState({ isOpen: true, type: 'SAVE', data: null }); };
  const handleCreateRequest = () => { 
    if (!newRequestData.headline || !newRequestData.requester) return alert('요청자 및 제목을 입력해주세요.'); 
    setRequests(prev => [{id: `req-${Date.now()}`, requester: newRequestData.requester, team: 'Contents', gnb: newRequestData.gnb, type: newRequestData.type || 'VERTICAL', title: newRequestData.headline, date: new Date().toISOString().split('T')[0], desc: newRequestData.desc, location: newRequestData.location, remarks: newRequestData.remarks, jiraLink: newRequestData.jiraLink, status: 'PENDING'}, ...prev]); 
    setModalState({ ...modalState, isOpen: false }); 
  };
  const handleConfirmAction = () => {
    const { type, data } = modalState;
    if (type === 'DELETE_BLOCK') setBlocks(prev => prev.filter(b => b.id !== data));
    else if (type === 'DELETE_REQUEST') { setSavedRequests(prev => prev.filter(r => r.id !== data)); if (viewRequest?.id === data) setViewRequest(null); }
    else if (type === 'RESET') { setBlocks(JSON.parse(JSON.stringify(MASTER_BLOCKS))); setRequests(JSON.parse(JSON.stringify(MASTER_REQUESTS))); }
    else if (type === 'APPROVE') { setSavedRequests(prev => prev.map(r => r.id === data.id ? {...r, status: 'APPROVED'} : r)); setBlocks(JSON.parse(JSON.stringify(data.snapshot))); setOriginalBlocks(JSON.parse(JSON.stringify(data.snapshot))); setViewRequest(null); setViewMode('EDITOR'); }
    else if (type === 'SAVE') { setSavedRequests(prev => [{id: `REQ-${Date.now()}`, title: requestTitle, date: scheduleDate, status: 'WAITING', menuPath: currentMenuPath, requester: '편성팀', createdAt: new Date().toLocaleDateString(), changes: diffSummary, snapshot: JSON.parse(JSON.stringify(blocks)), originalSnapshot: JSON.parse(JSON.stringify(originalBlocks))}, ...prev]); setViewRequest(null); setViewMode('REQUEST'); }
    else if (type === 'DELETE_BANNER_CONFIRM') { handleDeleteBanner(); return; }
    setModalState({ isOpen: false, type: null, data: null });
  };
  
  const onDragStart = (e, index, type = 'BLOCK', data = null) => { dragItem.current = index; dragType.current = type; e.currentTarget.style.opacity = '0.5'; e.dataTransfer.effectAllowed = 'move'; if (type === 'REQUEST' && data) e.dataTransfer.setData('requestData', JSON.stringify(data)); };
  const onDragEnd = (e) => { e.currentTarget.style.opacity = '1'; if (dragType.current === 'BLOCK' && dragItem.current !== null && dragOverItem.current !== null) { const _blocks = [...blocks]; const dragBlock = _blocks[dragItem.current]; _blocks.splice(dragItem.current, 1); _blocks.splice(dragOverItem.current, 0, dragBlock); setBlocks(_blocks); } dragItem.current = null; dragOverItem.current = null; dragType.current = null; setIsDragEnabled(false); };
  const onDropFromInbox = (e, dropIndex) => { e.preventDefault(); const str = e.dataTransfer.getData('requestData'); if (str) { const req = JSON.parse(str); const newBlock = { id: `req-${Date.now()}`, title: req.title, isNew: true, contentId: 'REQ_ID', remarks: req.remarks }; if (req.type === 'BIG_BANNER') { newBlock.type = 'BIG_BANNER'; newBlock.banners = [{ title: req.title, desc: req.desc, landingType: 'NONE' }]; } else if (['BAND_BANNER', 'LONG_BANNER', 'BANNER_1', 'BANNER_2', 'BANNER_3', 'MENU_BLOCK'].includes(req.type)) { newBlock.type = req.type; const bannerType = req.type === 'BANNER_1' ? '1-COL' : req.type === 'BANNER_2' ? '2-COL' : req.type === 'BANNER_3' ? '3-COL' : req.type === 'MENU_BLOCK' ? 'MENU' : undefined; newBlock.banners = [{ title: req.title, type: bannerType, landingType: 'NONE' }]; } else if (req.type === 'MULTI') { newBlock.type = 'MULTI'; newBlock.items = [1,2,3,4].map(i => ({ id: `req-m-${i}`, title: '추천' })); } else { newBlock.type = req.type || 'VERTICAL'; newBlock.contentIdType = 'RACE'; newBlock.items = [{id:'i1',title:'Content'}]; } const _blocks = [...blocks]; _blocks.splice(dropIndex !== undefined ? dropIndex : _blocks.length, 0, newBlock); setBlocks(_blocks); setRequests(requests.filter(r => r.id !== req.id)); } };

  // Filter Logic
  const filteredRequests = requests.filter(req => inboxFilter === 'ALL' || req.gnb === inboxFilter).filter(r => r.status === 'PENDING');
  const filteredSavedRequests = savedRequests.filter(req => unaFilter === 'ALL' || (req.menuPath && req.menuPath.includes(unaFilter)));

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-200 font-sans" style={{ backgroundColor: COLORS.bg }}>
      <aside className="w-64 flex flex-col border-r border-[#2e3038] bg-[#161820] flex-shrink-0 z-20">
        <div className="p-4 border-b border-[#2e3038] flex items-center gap-2"><div className="w-1.5 h-5 bg-[#7387ff] rounded-sm"></div><h1 className="text-lg font-bold text-white">B tv Admin</h1></div>
        <div className="flex-1 overflow-y-auto py-2">{GNB_MENU.map(menu => (<div key={menu.id} className="mb-1"><div className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-white/5 ${currentMenuPath === menu.name ? 'text-white font-bold bg-white/10' : 'text-slate-400'}`} onClick={() => setCurrentMenuPath(menu.name)}>{menu.icon && <menu.icon size={16} />}<span className="flex-1 text-sm">{menu.name}</span>{menu.children && <ChevronRight size={14} className="rotate-90 text-slate-600" />}</div>{menu.children && <div className="ml-4 border-l border-[#2e3038]">{menu.children.map(sub => (<div key={sub.id} onClick={() => setCurrentMenuPath(`${sub.name}`)} className={`pl-4 pr-4 py-2 text-xs cursor-pointer flex items-center justify-between ${currentMenuPath === sub.name ? 'text-[#7387ff] bg-[#7387ff]/10 border-r-2 border-[#7387ff]' : 'text-slate-400 hover:text-white'}`}>{sub.name}</div>))}</div>}</div>))}</div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-14 border-b border-[#2e3038] bg-[#100d1d]/95 backdrop-blur flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-4">
            <div className="flex bg-[#191b23] p-1 rounded border border-[#2e3038]"><button onClick={() => setViewMode('EDITOR')} className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-2 ${viewMode === 'EDITOR' ? 'bg-[#7387ff] text-white' : 'text-slate-400 hover:text-white'}`}><Layout size={14} /> 편성 에디터</button><button onClick={() => setViewMode('REQUEST')} className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-2 ${viewMode === 'REQUEST' ? 'bg-[#7387ff] text-white' : 'text-slate-400 hover:text-white'}`}><FileText size={14} /> UNA 요청 <span className="bg-slate-700 px-1.5 rounded-full text-[10px]">{savedRequests.length}</span></button></div>
            <div className="h-4 w-[1px] bg-[#2e3038] mx-1"></div>
            <div className="text-sm text-[#7387ff] font-bold truncate">{currentMenuPath}</div>
          </div>
          <div className="flex items-center gap-2">{viewMode === 'EDITOR' && (<><button onClick={() => setCompareMode(!compareMode)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${compareMode ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-[#191b23] text-slate-400 border border-[#2e3038]'}`}><ArrowRightLeft size={14} /> {compareMode ? '비교 종료' : '비교 모드'}</button><button onClick={() => setShowInbox(!showInbox)} className={`relative px-3 py-1.5 rounded text-xs flex items-center gap-2 transition-colors ${showInbox ? 'bg-slate-700 text-white' : 'bg-[#191b23] text-slate-400 hover:text-white'}`}><Inbox size={16} /> 프로모션 요청</button><button onClick={handleReset} className="px-3 py-1.5 bg-[#2e3038] hover:bg-[#3e404b] rounded text-xs text-slate-300 flex items-center gap-1 hover:text-white"><RotateCcw size={14} /> 원복</button><button onClick={openAddBlockModal} className="px-3 py-1.5 bg-[#2e3038] hover:bg-[#3e404b] rounded text-xs text-white flex items-center gap-1"><Plus size={14} /> 추가</button><button onClick={handleOpenSaveModal} className="px-3 py-1.5 bg-[#7387ff] hover:bg-[#5b6dbf] rounded text-xs font-bold text-white flex items-center gap-1 shadow-lg shadow-indigo-500/20"><Save size={14} /> 저장</button></>)}</div>
        </header>

        {/* EDITOR VIEW */}
        {viewMode === 'EDITOR' && (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 relative bg-gradient-to-b from-[#100d1d] to-[#0a0812]">
              <div className={`max-w-[1400px] mx-auto transition-all ${compareMode ? 'grid grid-cols-2 gap-8' : ''}`}>
                {compareMode && (<div className="relative"><div className="sticky top-0 z-10 mb-4 flex justify-between items-center bg-[#100d1d]/80 backdrop-blur py-2 border-b border-orange-500/30"><span className="text-orange-400 text-sm font-bold flex items-center gap-2">변경 전 (As-Is)</span></div><div className="space-y-3 opacity-70 pointer-events-none grayscale-[0.5]">{originalBlocks.map((block, index) => (<div key={`orig-${block.id}`} className="relative"><div className="absolute -left-2 top-2 z-10 w-5 h-5 bg-slate-700 text-slate-400 rounded-full flex items-center justify-center text-xs font-mono">{index + 1}</div><BlockRenderer block={block} isOriginal={true} /></div>))}</div></div>)}
                <div className={!compareMode ? 'max-w-[800px] mx-auto' : 'relative'}>
                  {compareMode && (<div className="sticky top-0 z-10 mb-4 flex justify-between items-center bg-[#100d1d]/80 backdrop-blur py-2 border-b border-[#7387ff]/30"><span className="text-[#7387ff] text-sm font-bold flex items-center gap-2"><CheckCircle size={14}/> 변경 후 (To-Be)</span></div>)}
                  <div className="space-y-3 pb-20">
                    {blocks.map((block, index) => {
                      const draggable = isDragEnabled && hoveredBlockIndex === index && !compareMode;
                      return (
                        <div key={block.id} draggable={draggable} onDragStart={(e) => onDragStart(e, index)} onDragEnter={(e) => { e.preventDefault(); dragOverItem.current = index; }} onDragEnd={onDragEnd} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropFromInbox(e, index)} onMouseEnter={() => setHoveredBlockIndex(index)} onMouseLeave={() => { setHoveredBlockIndex(null); setIsDragEnabled(false); }} className={`relative group transition-all duration-200 ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}>
                          {!compareMode && (<><div onMouseEnter={() => setIsDragEnabled(true)} onMouseLeave={() => setIsDragEnabled(false)} className="absolute -left-10 top-0 bottom-0 w-10 flex items-center justify-center cursor-grab text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"><GripVertical size={20} /></div><button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => handleDelete(block.id, e)} className="absolute -right-2 -top-2 z-20 p-1.5 bg-[#2e3038] text-slate-400 hover:text-red-400 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all border border-[#44464f] hover:scale-110 cursor-pointer" title="블록 삭제"><Trash2 size={12} /></button></>)}
                          <div className={`absolute -left-2 top-2 z-10 w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow-lg ${compareMode ? 'bg-[#7387ff] text-white' : 'bg-[#191b23] border border-[#7387ff] text-[#7387ff]'}`}>{index + 1}</div>
                          <BlockRenderer block={block} isOriginal={false} onUpdate={(updates) => handleUpdateBlock(block.id, updates)} onEditId={(tabIndex) => openEditIdModal(block, tabIndex)} onEditBannerId={(data, idx, isLead, tabIdx) => handleBannerEdit(block, data, idx, isLead, tabIdx)} onEditContentId={(item, idx) => handleEditContent(block.id, idx, item)} onEditTabName={(idx, name) => handleEditTabName(block.id, idx, name)} onAddTab={() => handleAddTab(block.id)} />
                        </div>
                      );
                    })}
                    {!compareMode && (<div onClick={openAddBlockModal} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropFromInbox(e)} className="h-20 border-2 border-dashed border-[#2e3038] rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-[#7387ff] hover:text-[#7387ff] hover:bg-[#7387ff]/5 cursor-pointer transition-all gap-1 mt-4"><Plus size={20} /><span className="text-xs font-bold">블록 추가 또는 요청 드래그</span></div>)}
                  </div>
                </div>
              </div>
            </div>
            {/* Inbox */}
            <div className={`fixed right-0 top-14 bottom-0 w-80 bg-[#161820] border-l border-[#2e3038] shadow-2xl transition-transform duration-300 z-30 flex flex-col ${showInbox ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-4 border-b border-[#2e3038] bg-[#191b23]">
                <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-bold text-white flex items-center gap-2"><Inbox size={16} className="text-[#7387ff]" /> 프로모션 요청 <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{filteredRequests.length}</span></h3><button onClick={() => setShowInbox(false)}><X size={16} className="text-slate-500 hover:text-white"/></button></div>
                {/* GNB Filter */}
                <div className="flex items-center gap-2">
                   <Filter size={12} className="text-slate-500"/>
                   <select className="bg-[#100d1d] border border-[#2e3038] rounded px-2 py-1 text-xs text-slate-300 outline-none flex-1" value={inboxFilter} onChange={(e) => setInboxFilter(e.target.value)}>
                      <option value="ALL">전체 메뉴</option>
                      {GNB_MENU.map(m => (
                         <React.Fragment key={m.id}>
                           <option value={m.name}>{m.name}</option>
                           {m.children?.map(c => <option key={c.id} value={c.name}>- {c.name}</option>)}
                         </React.Fragment>
                      ))}
                   </select>
                </div>
              </div>
              <div className="p-4 border-b border-[#2e3038]"><button onClick={() => setModalState({ isOpen: true, type: 'NEW_REQUEST', data: null })} className="w-full py-2 bg-[#2e3038] hover:bg-[#3e404b] text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"><Plus size={14}/> 신규 요청 등록</button></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">{filteredRequests.length === 0 ? <div className="text-center text-slate-500 text-xs py-10">요청이 없습니다.</div> : filteredRequests.map(req => (<div key={req.id} draggable={req.status === 'PENDING'} onDragStart={(e) => onDragStart(e, null, 'REQUEST', req)} className={`border p-3 rounded-lg transition-colors group relative ${req.status === 'PENDING' ? 'bg-[#100d1d] border-[#2e3038] cursor-grab hover:border-[#7387ff] active:cursor-grabbing' : 'bg-[#191b23] border-[#2e3038] opacity-50 cursor-default'}`}><div className="flex justify-between items-start mb-2"><span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded flex items-center gap-1"><User size={8} /> {req.requester}</span>{req.status === 'REJECTED' && <span className="text-[10px] text-red-500 font-bold border border-red-500/50 px-1 rounded">거절됨</span>}</div><h4 className="text-sm font-bold text-slate-200 mb-1">{req.title}</h4><div className="text-[10px] text-slate-500 mb-2 space-y-0.5"><p>{req.desc}</p><p className="text-slate-400">위치: {req.location || '-'}</p>{req.remarks && <p className="text-yellow-500/70">비고: {req.remarks}</p>}</div><div className="mt-2 flex justify-between items-center"><span className="text-[9px] text-[#7387ff] border border-[#7387ff]/30 px-1.5 py-0.5 rounded">{req.type}</span><span className="text-[9px] text-slate-500">{req.gnb}</span></div></div>))}</div>
            </div>
          </div>
        )}

        {/* REQUEST VIEW (UNA 요청) */}
        {viewMode === 'REQUEST' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0812]">
            {viewRequest ? (
                // DETAIL VIEW
                <div className="flex flex-col h-full">
                    <div className="h-14 border-b border-[#2e3038] flex items-center px-6 gap-3 bg-[#191b23] shrink-0">
                        <button onClick={() => setViewRequest(null)} className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white"><ChevronLeft size={20} /></button>
                        <h2 className="text-base font-bold text-white">{viewRequest.title}</h2>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${viewRequest.status === 'APPROVED' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>{viewRequest.status}</span>
                    </div>
                    <div className="flex-1 flex overflow-hidden">
                        <div className="w-[300px] border-r border-[#2e3038] bg-[#161820] flex flex-col p-5 overflow-y-auto">
                            <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center justify-between">변경 요약 <span className="bg-slate-700 text-white px-1.5 rounded-full text-[10px]">{viewRequest.changes.length}</span></h3>
                            <div className="space-y-2">{viewRequest.changes.map((diff, idx) => ( <div key={idx} className="flex flex-col p-3 rounded bg-[#100d1d] border border-[#2e3038] gap-1"><div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${diff.type === '신규' ? 'bg-green-400' : diff.type === '삭제' ? 'bg-red-400' : 'bg-blue-400'}`}></div><span className="text-xs text-slate-300 font-bold truncate">{diff.block?.title || '알림'}</span><span className={`text-[9px] px-1 rounded ml-auto ${diff.type === '신규' ? 'bg-green-900/50 text-green-400' : diff.type === '삭제' ? 'bg-red-900/50 text-red-400' : 'bg-blue-900/50 text-blue-400'}`}>{diff.type}</span></div><p className="text-[11px] text-slate-500 pl-3.5 leading-tight">{diff.desc}</p></div> ))}</div>
                            <button onClick={() => reqApprove(viewRequest)} disabled={viewRequest.status === 'APPROVED'} className="mt-4 w-full py-3 bg-[#7387ff] hover:bg-[#5b6dbf] disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-bold transition-colors">{viewRequest.status === 'APPROVED' ? '이미 반영됨' : '반영 완료'}</button>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto bg-[#100d1d]">
                           <div className="grid grid-cols-2 gap-8 max-w-[1200px] mx-auto">
                               <div className="relative opacity-60 grayscale-[0.5] pointer-events-none"><div className="sticky top-0 z-10 mb-6 flex justify-center"><span className="bg-orange-500/20 text-orange-400 border border-orange-500/50 px-3 py-1 rounded-full text-xs font-bold">변경 전 (As-Is)</span></div><div className="space-y-4">{viewRequest.originalSnapshot.map((block, i) => <BlockRenderer key={i} block={block} isDragging={false} isOriginal={true} />)}</div></div>
                               <div className="relative"><div className="sticky top-0 z-10 mb-6 flex justify-center"><span className="bg-[#7387ff]/20 text-[#7387ff] border border-[#7387ff]/50 px-3 py-1 rounded-full text-xs font-bold">변경 후 (To-Be)</span></div><div className="space-y-4">{viewRequest.snapshot.map((block, i) => <BlockRenderer key={i} block={block} isDragging={false} isOriginal={false} />)}</div></div>
                           </div>
                        </div>
                    </div>
                </div>
            ) : (
                // LIST VIEW
                <div className="flex-1 p-10 overflow-y-auto">
                   <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2"><FileText size={24} className="text-[#7387ff]" /> UNA 요청 목록</h2>
                      <div className="flex items-center gap-2">
                        <Filter size={14} className="text-slate-500"/>
                        <select className="bg-[#191b23] border border-[#2e3038] rounded px-3 py-1.5 text-xs text-slate-300 outline-none" value={unaFilter} onChange={(e) => setUnaFilter(e.target.value)}>
                            <option value="ALL">전체 메뉴</option>
                            {GNB_MENU.map(m => (
                                <React.Fragment key={m.id}>
                                <option value={m.name}>{m.name}</option>
                                {m.children?.map(c => <option key={c.id} value={c.name}>- {c.name}</option>)}
                                </React.Fragment>
                            ))}
                        </select>
                      </div>
                   </div>
                   {filteredSavedRequests.length === 0 ? (<div className="text-center text-slate-500 mt-20">생성된 요청서가 없습니다.</div>) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredSavedRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(req => (
                              <div key={req.id} onClick={() => setViewRequest(req)} className="bg-[#191b23] border border-[#2e3038] hover:border-[#7387ff] rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg group relative">
                                  <button onClick={(e) => reqDeleteRequest(req.id, e)} className="absolute top-4 right-4 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1 hover:bg-[#2e3038] rounded" title="요청서 삭제"><Trash2 size={16} /></button>
                                  <div className="flex justify-between items-start mb-4"><span className={`text-[10px] px-2 py-1 rounded font-bold ${req.status === 'APPROVED' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>{req.status}</span><span className="text-slate-500 text-xs">{req.createdAt}</span></div>
                                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#7387ff] transition-colors">{req.title}</h3>
                                  <div className="space-y-1 text-sm text-slate-400 mb-4"><div className="flex items-center gap-2"><Calendar size={14}/> {req.date} 반영</div><div className="flex items-center gap-2"><User size={14}/> {req.requester}</div></div>
                                  <div className="pt-4 border-t border-[#2e3038] flex justify-between items-center text-xs text-slate-500"><span>변경사항 {req.changes.length}건</span><span className="flex items-center gap-1 group-hover:text-white transition-colors">상세보기 <ArrowRight size={12}/></span></div>
                                  {req.menuPath && <div className="mt-2 text-[9px] text-slate-600 bg-slate-800 px-2 py-0.5 rounded w-fit">{req.menuPath}</div>}
                              </div>
                          ))}
                       </div>
                   )}
                </div>
            )}
          </div>
        )}

        {/* Modal */}
        {modalState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className={`bg-[#191b23] rounded-xl border border-[#2e3038] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${modalState.type === 'NEW_REQUEST' || modalState.type === 'ADD_BLOCK' ? 'w-[500px]' : 'w-[450px]'}`}>
              <div className="p-5 border-b border-[#2e3038] flex justify-between items-center bg-[#1e2029] shrink-0">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {modalState.type === 'NEW_REQUEST' ? '신규 프로모션 요청 등록' : modalState.type === 'ADD_BLOCK' ? '신규 블록 생성' : modalState.type === 'SAVE' ? '편성 요청 정보 입력' : modalState.type === 'APPROVE' ? '편성 반영 확인' : modalState.type === 'EDIT_ID' ? '블록 설정 수정' : modalState.type === 'EDIT_BANNER' ? '배너 수정' : modalState.type === 'EDIT_CONTENT' ? '콘텐츠 수정' : modalState.type === 'EDIT_TAB_NAME' ? '탭 이름 수정' : modalState.type === 'DELETE_BANNER_CONFIRM' ? '삭제 확인' : '확인'}
                </h3>
                <button onClick={() => setModalState({ ...modalState, isOpen: false })}><X size={18} className="text-slate-500 hover:text-white"/></button>
              </div>
              <div className="p-6 overflow-y-auto">
                 {/* NEW REQUEST FORM - Extended Fields */}
                 {modalState.type === 'NEW_REQUEST' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">GNB 메뉴 (대상)</label>
                        <select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.gnb} onChange={e => setNewRequestData({...newRequestData, gnb: e.target.value})}>
                            {GNB_MENU.map(m => (<React.Fragment key={m.id}><option value={m.name}>{m.name}</option>{m.children?.map(c => <option key={c.id} value={c.name}>- {c.name}</option>)}</React.Fragment>))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">요청자</label>
                        <input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.requester} onChange={e => setNewRequestData({...newRequestData, requester: e.target.value})} placeholder="요청자 이름" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">제목</label>
                        <input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.headline} onChange={e => setNewRequestData({...newRequestData, headline: e.target.value})} placeholder="요청 제목 입력"/>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">편성 유형</label>
                         <select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.type} onChange={e => setNewRequestData({...newRequestData, type: e.target.value})}>
                            <optgroup label="콘텐츠 블록"><option value="VERTICAL">세로 포스터</option><option value="HORIZONTAL">가로 포스터</option><option value="HORIZONTAL_MINI">미니 가로</option><option value="TAB">탭 블록</option><option value="MULTI">멀티 블록</option></optgroup>
                            <optgroup label="배너"><option value="BIG_BANNER">빅배너</option><option value="BAND_BANNER">띠배너</option><option value="LONG_BANNER">롱배너</option><option value="BANNER_1">1단 배너</option><option value="BANNER_2">2단 배너</option><option value="BANNER_3">3단 배너</option></optgroup>
                         </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">편성 요청 위치</label>
                        <input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.location} onChange={e => setNewRequestData({...newRequestData, location: e.target.value})} placeholder="예: TV 방송 홈 상단"/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">상세 내용</label>
                        <textarea className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none h-20" value={newRequestData.desc} onChange={e => setNewRequestData({...newRequestData, desc: e.target.value})} placeholder="요청 상세 내용 입력"/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">비고</label>
                        <input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.remarks} onChange={e => setNewRequestData({...newRequestData, remarks: e.target.value})} placeholder="특이사항 입력"/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Jira 티켓 링크</label>
                        <input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newRequestData.jiraLink} onChange={e => setNewRequestData({...newRequestData, jiraLink: e.target.value})} placeholder="http://jira..." />
                      </div>
                    </div>
                 )}

                 {/* ADD BLOCK FORM */}
                 {modalState.type === 'ADD_BLOCK' && (
                   <div className="space-y-4">
                      <div><label className="block text-xs font-bold text-slate-500 mb-1">블록 타이틀</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newBlockData.title} onChange={e => setNewBlockData({...newBlockData, title: e.target.value})} /></div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">블록 종류</label>
                        <select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={blockCategory} onChange={(e) => setBlockCategory(e.target.value)}>
                            <option value="CONTENT">콘텐츠 블록</option>
                            <option value="BANNER">배너 블록</option>
                            <option value="MULTI">멀티 블록</option>
                        </select>
                      </div>

                      {/* Content Fields (Standard) */}
                      {blockCategory === 'CONTENT' && (
                        <div className="space-y-4 pt-2 border-t border-[#2e3038]">
                           <div className="grid grid-cols-2 gap-4">
                              <div><label className="block text-xs font-bold text-slate-500 mb-1">상세 유형</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newBlockData.type} onChange={e => setNewBlockData({...newBlockData, type: e.target.value})}><option value="VERTICAL">세로 포스터</option><option value="HORIZONTAL">가로 포스터</option><option value="HORIZONTAL_MINI">미니 가로</option><option value="TAB">탭 블록</option></select></div>
                              <div className="flex items-center pt-6"><label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300"><input type="checkbox" checked={newBlockData.showPreview} onChange={e => setNewBlockData({...newBlockData, showPreview: e.target.checked})} className="accent-[#7387ff]" />프리뷰 영역 노출</label></div>
                           </div>
                           <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-1"><label className="block text-xs font-bold text-slate-500 mb-1">ID 유형</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none" value={newBlockData.contentIdType} onChange={e => setNewBlockData({...newBlockData, contentIdType: e.target.value})}><option value="LIBRARY">라이브러리</option><option value="RACE">RACE</option></select></div>
                              <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 mb-1">ID값</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none font-mono" value={newBlockData.contentId} onChange={e => setNewBlockData({...newBlockData, contentId: e.target.value})} placeholder={newBlockData.contentIdType === 'LIBRARY' ? 'NB...' : '...RACE'}/></div>
                           </div>
                           {/* Add Banner Option */}
                           <div className="bg-[#100d1d] p-3 rounded border border-[#2e3038] space-y-2">
                              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                                 <input type="checkbox" checked={newBlockData.useLeadingBanner} onChange={e => setNewBlockData({...newBlockData, useLeadingBanner: e.target.checked})} className="accent-[#7387ff]" />
                                 앞단 배너 추가
                              </label>
                              {newBlockData.useLeadingBanner && (
                                <div className="pl-5 space-y-2 border-l-2 border-[#2e3038] ml-1">
                                   <div><label className="block text-[10px] text-slate-500 mb-1">배너명</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.leadingBannerTitle} onChange={e => setNewBlockData({...newBlockData, leadingBannerTitle: e.target.value})} placeholder="배너 이름 입력" /></div>
                                   <div><label className="block text-[10px] text-slate-500 mb-1">배너 크기</label><select className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.leadingBannerType} onChange={e => setNewBlockData({...newBlockData, leadingBannerType: e.target.value})}><option value="1-COL">1단</option><option value="2-COL">2단</option><option value="3-COL">3단</option></select></div>
                                   <div><label className="block text-[10px] text-slate-500 mb-1">이미지 URL</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.leadingBannerImg} onChange={e => setNewBlockData({...newBlockData, leadingBannerImg: e.target.value})} placeholder="https://..." /></div>
                                   <div><label className="block text-[10px] text-slate-500 mb-1">이벤트 ID</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.leadingBannerEventId} onChange={e => setNewBlockData({...newBlockData, leadingBannerEventId: e.target.value})} placeholder="NA..." /></div>
                                   <div className="grid grid-cols-2 gap-2">
                                     <div><label className="block text-[10px] text-slate-500 mb-1">랜딩 유형</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.leadingBannerLanding} onChange={e => setNewBlockData({...newBlockData, leadingBannerLanding: e.target.value})} placeholder="직접 입력" /></div>
                                     <div><label className="block text-[10px] text-slate-500 mb-1">랜딩 값</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.leadingBannerValue} onChange={e => setNewBlockData({...newBlockData, leadingBannerValue: e.target.value})} /></div>
                                   </div>
                                   <div><label className="block text-[10px] text-slate-500 mb-1">Jira 링크</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.leadingBannerJira} onChange={e => setNewBlockData({...newBlockData, leadingBannerJira: e.target.value})} placeholder="http://jira..." /></div>
                                </div>
                              )}
                           </div>
                        </div>
                      )}

                      {/* Banner Fields */}
                      {blockCategory === 'BANNER' && (
                        <div className="space-y-4 pt-2 border-t border-[#2e3038]">
                          <div><label className="block text-xs font-bold text-slate-500 mb-1">배너 유형</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-orange-500 outline-none" value={newBlockData.type} onChange={e => setNewBlockData({...newBlockData, type: e.target.value})}><option value="BANNER_1">1단 배너</option><option value="BANNER_2">2단 배너</option><option value="BANNER_3">3단 배너</option><option value="BAND_BANNER">띠배너</option><option value="BIG_BANNER">빅배너</option><option value="LONG_BANNER">롱배너</option><option value="MENU_BLOCK">메뉴 블록</option></select></div>
                          <div className="bg-[#100d1d] p-3 rounded border border-[#2e3038] space-y-3">
                             <div className="text-xs font-bold text-orange-500 mb-1">초기 배너 속성</div>
                             <div><label className="block text-[10px] text-slate-500 mb-1">배너명</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.bannerTitle} onChange={e => setNewBlockData({...newBlockData, bannerTitle: e.target.value})} placeholder="배너 이름 입력" /></div>
                             <div className="flex gap-2 items-end">
                                <div className="flex-1"><label className="block text-[10px] text-slate-500 mb-1">이미지 URL</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.bannerImg} onChange={e => setNewBlockData({...newBlockData, bannerImg: e.target.value})} placeholder="https://..." /></div>
                                <label className="cursor-pointer p-1.5 bg-[#2e3038] hover:bg-[#3e404b] rounded mb-0.5"><Upload size={14} className="text-slate-400"/><input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if(file) setNewBlockData({...newBlockData, bannerImg: URL.createObjectURL(file)}); }} /></label>
                             </div>
                             <div><label className="block text-[10px] text-slate-500 mb-1">이벤트 ID</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.bannerEventId} onChange={e => setNewBlockData({...newBlockData, bannerEventId: e.target.value})} placeholder="NA..." /></div>
                             <div className="grid grid-cols-2 gap-2">
                               <div><label className="block text-[10px] text-slate-500 mb-1">랜딩 유형</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.bannerLanding} onChange={e => setNewBlockData({...newBlockData, bannerLanding: e.target.value})} placeholder="직접 입력" /></div>
                               <div><label className="block text-[10px] text-slate-500 mb-1">랜딩 값</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.bannerValue} onChange={e => setNewBlockData({...newBlockData, bannerValue: e.target.value})} /></div>
                             </div>
                             <div><label className="block text-[10px] text-slate-500 mb-1">Jira 링크</label><input type="text" className="w-full bg-[#191b23] border border-[#2e3038] rounded px-2 py-1 text-xs text-white" value={newBlockData.bannerJira} onChange={e => setNewBlockData({...newBlockData, bannerJira: e.target.value})} placeholder="http://jira..." /></div>
                          </div>
                        </div>
                      )}

                      {/* Multi Fields */}
                      {blockCategory === 'MULTI' && (
                        <div className="space-y-4 pt-2 border-t border-[#2e3038]">
                           <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-1"><label className="block text-xs font-bold text-slate-500 mb-1">ID 유형</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none" value={newBlockData.contentIdType} onChange={e => setNewBlockData({...newBlockData, contentIdType: e.target.value})}><option value="LIBRARY">라이브러리</option></select></div>
                              <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 mb-1">ID값</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none font-mono" value={newBlockData.contentId} onChange={e => setNewBlockData({...newBlockData, contentId: e.target.value})} placeholder="NB..." /></div>
                           </div>
                           <div className="flex items-center pt-2"><label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300"><input type="checkbox" checked={newBlockData.showPreview} onChange={e => setNewBlockData({...newBlockData, showPreview: e.target.checked})} className="accent-[#7387ff]" />프리뷰 영역 노출</label></div>
                        </div>
                      )}

                      {/* Common Fields */}
                      <div className="border-t border-[#2e3038] pt-4 space-y-4">
                         <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300"><input type="checkbox" checked={newBlockData.isTarget} onChange={e => setNewBlockData({...newBlockData, isTarget: e.target.checked})} className="accent-pink-500" /> 타겟 설정 (전체 노출 제외)</label>
                         </div>
                         {newBlockData.isTarget && (
                            <div><label className="block text-xs font-bold text-slate-500 mb-1">Filter Seg 값</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-pink-500 outline-none" value={newBlockData.targetSeg} onChange={e => setNewBlockData({...newBlockData, targetSeg: e.target.value})} placeholder="예: Promotion_1234" /></div>
                         )}
                         <div><label className="block text-xs font-bold text-slate-500 mb-1">비고 (Remarks)</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={newBlockData.remarks} onChange={e => setNewBlockData({...newBlockData, remarks: e.target.value})} placeholder="추가 요청사항 입력" /></div>
                      </div>
                   </div>
                 )}

                 {/* ID EDIT MODAL (UPDATED with TARGET) */}
                 {modalState.type === 'EDIT_ID' && (
                  <div className="space-y-4">
                     <div><label className="block text-xs font-bold text-slate-500 mb-1">블록명</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#7387ff]" value={editIdData.title} onChange={e => setEditIdData({...editIdData, title: e.target.value})} /></div>
                     <div><label className="block text-xs font-bold text-slate-500 mb-1">ID 유형</label><select className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#7387ff]" value={editIdData.idType} onChange={e => setEditIdData({...editIdData, idType: e.target.value})}><option value="LIBRARY">라이브러리 (NB...)</option><option value="RACE">RACE (...RACE)</option></select></div>
                     <div><label className="block text-xs font-bold text-slate-500 mb-1">ID 값</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#7387ff]" value={editIdData.idValue} onChange={e => setEditIdData({...editIdData, idValue: e.target.value})} autoFocus/></div>
                     <div className="flex items-center pt-2"><label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300"><input type="checkbox" checked={editIdData.showTitle} onChange={e => setEditIdData({...editIdData, showTitle: e.target.checked})} className="accent-[#7387ff]" /> 블록명 노출</label></div>
                     <div className="border-t border-[#2e3038] pt-3">
                       <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300 mb-2"><input type="checkbox" checked={editIdData.isTarget} onChange={e => setEditIdData({...editIdData, isTarget: e.target.checked})} className="accent-pink-500" /> 타겟 설정</label>
                       {editIdData.isTarget && <div><label className="block text-xs font-bold text-slate-500 mb-1">Filter Seg 값</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-pink-500 outline-none" value={editIdData.targetSeg} onChange={e => setEditIdData({...editIdData, targetSeg: e.target.value})} placeholder="예: Promotion_1234" /></div>}
                     </div>
                     <div><label className="block text-xs font-bold text-slate-500 mb-1">비고</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#7387ff]" value={editIdData.remarks} onChange={e => setEditIdData({...editIdData, remarks: e.target.value})} /></div>
                  </div>
                 )}

                 {/* TAB NAME EDIT MODAL */}
                 {modalState.type === 'EDIT_TAB_NAME' && (
                    <div className="space-y-4">
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">탭 이름</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-[#7387ff] outline-none" value={editTabNameData.name} onChange={e => setEditTabNameData({...editTabNameData, name: e.target.value})} autoFocus/></div>
                        <div className="flex justify-end pt-2"><button onClick={saveTabName} className="px-4 py-2 bg-[#7387ff] hover:bg-[#5b6dbf] rounded text-white text-xs font-bold">저장</button></div>
                    </div>
                 )}

                 {/* BANNER EDIT MODAL */}
                 {modalState.type === 'EDIT_BANNER' && (
                   <div className="space-y-4">
                     {editBannerData.blockId && blocks.find(b => b.id === editBannerData.blockId)?.type === 'BIG_BANNER' && (
                       <>
                         <div><label className="block text-xs font-bold text-slate-500 mb-1">타이틀 (좌측)</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.title} onChange={e => setEditBannerData({...editBannerData, title: e.target.value})} /></div>
                         <div><label className="block text-xs font-bold text-slate-500 mb-1">설명 (좌측)</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.desc} onChange={e => setEditBannerData({...editBannerData, desc: e.target.value})} /></div>
                       </>
                     )}
                     <div><label className="block text-xs font-bold text-slate-500 mb-1">배너명</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.title} onChange={e => setEditBannerData({...editBannerData, title: e.target.value})} placeholder="배너 이름 입력" /></div>
                     
                     <div className="flex gap-2 items-end">
                       <div className="flex-1"><label className="block text-xs font-bold text-slate-500 mb-1">이미지 URL</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.img} onChange={e => setEditBannerData({...editBannerData, img: e.target.value})} placeholder="https://..." /></div>
                       <label className="cursor-pointer p-2 bg-[#2e3038] hover:bg-[#3e404b] rounded mb-0.5 border border-slate-600"><Upload size={16} className="text-slate-400"/><input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if(file) setEditBannerData({...editBannerData, img: URL.createObjectURL(file)}); }} /></label>
                     </div>
                     
                     <div><label className="block text-xs font-bold text-slate-500 mb-1">이벤트 ID</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.eventId} onChange={e => setEditBannerData({...editBannerData, eventId: e.target.value})} placeholder="NA..." /></div>
                     <div className="grid grid-cols-2 gap-4">
                       <div><label className="block text-xs font-bold text-slate-500 mb-1">랜딩 유형</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.landingType} onChange={e => setEditBannerData({...editBannerData, landingType: e.target.value})} placeholder="직접 입력" /></div>
                       <div><label className="block text-xs font-bold text-slate-500 mb-1">랜딩 값 (URL/ID)</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-orange-500" value={editBannerData.landingValue} onChange={e => setEditBannerData({...editBannerData, landingValue: e.target.value})} /></div>
                     </div>
                     <div><label className="block text-xs font-bold text-slate-500 mb-1">Jira 링크</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.jiraLink} onChange={e => setEditBannerData({...editBannerData, jiraLink: e.target.value})} placeholder="http://jira..." /></div>
                     <div className="border-t border-[#2e3038] pt-3">
                       <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300 mb-2"><input type="checkbox" checked={editBannerData.isTarget} onChange={e => setEditBannerData({...editBannerData, isTarget: e.target.checked})} className="accent-pink-500" /> 타겟 설정</label>
                       {editBannerData.isTarget && <div><label className="block text-xs font-bold text-slate-500 mb-1">Filter Seg 값</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white focus:border-pink-500 outline-none" value={editBannerData.targetSeg} onChange={e => setEditBannerData({...editBannerData, targetSeg: e.target.value})} placeholder="예: Promotion_1234" /></div>}
                     </div>
                     <div><label className="block text-xs font-bold text-slate-500 mb-1">비고</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-orange-500" value={editBannerData.remarks} onChange={e => setEditBannerData({...editBannerData, remarks: e.target.value})} /></div>
                   </div>
                 )}

                 {/* CONTENT EDIT MODAL */}
                 {modalState.type === 'EDIT_CONTENT' && (
                    <div className="space-y-4">
                       <div><label className="block text-xs font-bold text-slate-500 mb-1">콘텐츠명</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-slate-500" value={editContentData.title} onChange={e => setEditContentData({...editContentData, title: e.target.value})} /></div>
                       <div><label className="block text-xs font-bold text-slate-500 mb-1">시리즈 ID</label><input type="text" className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white outline-none focus:border-slate-500 font-mono" value={editContentData.seriesId} onChange={e => setEditContentData({...editContentData, seriesId: e.target.value})} placeholder="CS..." /></div>
                       <div className="flex justify-end pt-2"><button onClick={saveEditedContent} className="px-4 py-2 bg-[#7387ff] hover:bg-[#5b6dbf] rounded text-white text-xs font-bold">저장</button></div>
                    </div>
                 )}

                 {/* DELETE BANNER CONFIRM MODAL */}
                 {modalState.type === 'DELETE_BANNER_CONFIRM' && (
                    <div className="text-center p-4">
                       <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
                       <p className="text-white font-bold mb-1">배너를 삭제하시겠습니까?</p>
                       <p className="text-xs text-slate-400">삭제 후에는 복구할 수 없습니다.</p>
                    </div>
                 )}

                 {/* Other simple modals */}
                 {modalState.type === 'SAVE' && (
                    <div className="space-y-4">
                      <div><label className="block text-xs font-bold text-slate-500 mb-1">요청 제목</label><input type="text" value={requestTitle} onChange={e => setRequestTitle(e.target.value)} className="w-full bg-[#100d1d] border border-[#2e3038] rounded px-3 py-2 text-sm text-white"/></div>{diffSummary.length > 0 && <div className="bg-[#100d1d] p-2 rounded max-h-32 overflow-y-auto">{diffSummary.map((d,i)=><div key={i} className="text-xs text-slate-400">• {d.desc}</div>)}</div>}
                    </div>
                 )}
                 {['APPROVE', 'DELETE_BLOCK', 'DELETE_REQUEST', 'RESET'].includes(modalState.type) && <p className="text-slate-300 text-sm">작업을 계속 진행하시겠습니까?</p>}
              </div>
              <div className="p-4 bg-[#161820] flex justify-end gap-2 border-t border-[#2e3038] shrink-0">
                {modalState.type === 'EDIT_BANNER' && <button onClick={confirmDeleteBanner} className="mr-auto px-4 py-2 rounded text-red-400 text-xs font-bold hover:bg-red-900/20 border border-red-900/50">삭제</button>}
                {modalState.type !== 'EDIT_TAB_NAME' && modalState.type !== 'EDIT_CONTENT' && <button onClick={() => setModalState({ ...modalState, isOpen: false })} className="px-4 py-2 rounded text-slate-400 text-xs font-bold hover:bg-[#2e3038]">취소</button>}
                {modalState.type !== 'EDIT_TAB_NAME' && modalState.type !== 'EDIT_CONTENT' && <button 
                  onClick={modalState.type === 'NEW_REQUEST' ? handleCreateRequest : modalState.type === 'ADD_BLOCK' ? confirmAddBlock : modalState.type === 'EDIT_ID' ? saveEditedId : modalState.type === 'EDIT_BANNER' ? saveEditedBanner : handleConfirmAction} 
                  className={`px-6 py-2 rounded text-white text-xs font-bold shadow-lg ${modalState.type === 'DELETE_BANNER_CONFIRM' ? 'bg-red-600 hover:bg-red-500' : modalState.type === 'EDIT_BANNER' || (modalState.type === 'ADD_BLOCK' && blockCategory === 'BANNER') ? 'bg-orange-600 hover:bg-orange-500' : 'bg-[#7387ff] hover:bg-[#5b6dbf]'}`}
                >
                  {modalState.type === 'DELETE_BANNER_CONFIRM' ? '삭제 확인' : '확인'}
                </button>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
