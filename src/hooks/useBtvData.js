// src/hooks/useBtvData.js
import { useState, useEffect } from 'react';
import { api, supabase } from '../services/api'; // 위에서 만든 파일 import

export const useBtvData = () => {
  const [gnbList, setGnbList] = useState([]);
  const [currentMenuId, setCurrentMenuId] = useState(null);
  const [currentMenuPath, setCurrentMenuPath] = useState('');
  
  const [blocks, setBlocks] = useState([]);
  const [originalBlocks, setOriginalBlocks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. GNB 로드
  useEffect(() => {
    const loadGnb = async () => {
      const data = await api.fetchGnb();
      setGnbList(data);
      if (data.length > 0) {
        // 기본값 설정
        const home = data.find(m => m.slug === 'home') || data[0];
        setCurrentMenuPath(home.name);
        setCurrentMenuId(home.id);
      }
    };
    loadGnb();
  }, []);

  // 2. 블록 데이터 로드 (메뉴 변경 시)
  useEffect(() => {
    if (!currentMenuId) return;
    
    const loadBlocks = async () => {
      setIsLoading(true);
      const data = await api.fetchBlocks(currentMenuId);
      setBlocks(data);
      setOriginalBlocks(JSON.parse(JSON.stringify(data))); // 비교용 원본 저장
      setIsLoading(false);
    };
    
    loadBlocks();
  }, [currentMenuId]);

  // 3. 요청 데이터 로드
  useEffect(() => {
     const loadRequests = async () => {
         const data = await api.fetchRequests();
         // 포맷팅 로직 (필요시 service로 이동 가능하지만 일단 유지)
         const formattedRequests = data.map(r => ({
            id: r.id,
            title: r.title,
            requester: r.requester,
            gnb: r.gnb_target,
            type: 'VERTICAL',
            desc: r.description,
            location: r.location,
            status: r.status,
            date: new Date(r.created_at).toLocaleDateString(),
            createdAt: new Date(r.created_at).toLocaleString(),
            changes: [], 
            snapshot: r.snapshot_new,
            originalSnapshot: r.snapshot_original,
            menuPath: r.gnb_target
        }));
        setRequests(formattedRequests);
     };
     loadRequests();
  }, []);

  // GNB 변경 핸들러
  const handleMenuChange = (menu) => {
      setCurrentMenuPath(menu.name);
      setCurrentMenuId(menu.id);
  };

  return {
    gnbList,
    currentMenuId,
    currentMenuPath,
    blocks,
    setBlocks, // UI에서 수정할 수 있게 set 함수 노출
    originalBlocks,
    requests,
    setRequests,
    isLoading,
    handleMenuChange,
    supabase // 직접 호출 필요한 경우를 위해 노출 (저장 로직 등)
  };
};
