import React, { useMemo, useState, useCallback, useEffect } from 'react';
import ReactFlow, { Background } from 'reactflow';
import 'reactflow/dist/style.css';
import Loader from './Loader';

const nodeWidth = 220;
const nodeHeight = 40;
const hGap = 24;
const vRowsY = [0, 180, 360]; // root, areas, drugtypes

// ✅ IMPLEMENTED: Animation constants for smooth transitions
const ANIMATION_DURATION = 300; // milliseconds
const EXPANDED_TOP_Y = 50; // Y position when expanded to top

const labelWithCaret = (label, isOpen) => `${isOpen ? '▾' : '▸'}  ${label}`;

// ✅ IMPLEMENTED: Enhanced label for expanded nodes
const getNodeLabel = (node, isExpanded) => {
  const baseLabel = node.data.label;
  if (isExpanded && (node.id.startsWith('area-') || node.id.includes('-dt-'))) {
    return `🔝 ${baseLabel} (Expanded)`;
  }
  return baseLabel;
};

// ✅ IMPLEMENTED: SuspendedNodes with Real API Integration
// Backend API: /decomposition/suspended endpoint provides real suspended medicines data
// Features: Loading states, Interactive node visualization

const SuspendedNodes = ({ rows, isDark }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [rootOpen, setRootOpen] = useState(false); // start closed by default
  const [openAreas, setOpenAreas] = useState(new Set()); // none open initially
  const [openDrugtypes, setOpenDrugtypes] = useState(new Set()); // ✅ IMPLEMENTED: Track expanded drugtype nodes
  
  // ✅ IMPLEMENTED: Animation state for expanded nodes
  const [expandedNodeId, setExpandedNodeId] = useState(null);
  const [animatingNodes, setAnimatingNodes] = useState(new Set());
  
  // ✅ IMPLEMENTED: API data state management
  const [suspendedTableData, setSuspendedTableData] = useState([]);
  const [decompositionTree, setDecompositionTree] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ IMPLEMENTED: Fetch suspended medicines data from /decomposition/suspended API
  const fetchSuspendedData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('top_n_distribute', '20');
      params.append('top_n_drugtype', '10');

      const res = await fetch(`http://localhost:8000/decomposition/suspended?${params.toString()}`);
      if (!res.ok) return;
      const payload = await res.json();
      
      if (payload.data) {
        setSuspendedTableData(payload.data.table_rows || []);
        setDecompositionTree(payload.data.decomposition_tree || null);
      }
    } catch (e) {
      console.error('Error fetching suspended medicines data:', e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMPLEMENTED: Fetch data on component mount
  useEffect(() => {
    fetchSuspendedData();
  }, []);

  // ✅ IMPLEMENTED: Use API data with fallback to props
  const apiRows = suspendedTableData.length > 0 ? suspendedTableData : (rows || []);

  const areaGroups = useMemo(() => apiRows.reduce((acc, r) => {
    const area = r.distribute_area || 'Unknown';
    const dt = r.drugtype || 'Unknown';
    if (!acc[area]) acc[area] = {};
    if (!acc[area][dt]) acc[area][dt] = 0;
    acc[area][dt] += 1;
    return acc;
  }, {}), [apiRows]);

  const { nodes, edges } = useMemo(() => {
    const nodes = [];
    const edges = [];

    // Root
    nodes.push({ id: 'root', data: { label: labelWithCaret(`Suspended_Medicines (${apiRows.length})`, rootOpen) }, position: { x: 20, y: vRowsY[0] }, style: { width: nodeWidth, height: nodeHeight, borderRadius: 8, cursor: 'pointer' } });

    if (rootOpen) {
      const areas = Object.entries(areaGroups);
      areas.forEach(([area, drugMap], idx) => {
        const x = idx * (nodeWidth + hGap);
        const y = vRowsY[1];
        const areaId = `area-${idx}`;
        const count = Object.values(drugMap).reduce((s, v) => s + v, 0);
        const isOpen = openAreas.has(areaId);
        nodes.push({ id: areaId, data: { label: labelWithCaret(`${area} (${count})`, isOpen) }, position: { x, y }, style: { width: nodeWidth, height: nodeHeight, borderRadius: 8, cursor: 'pointer' } });
        edges.push({ id: `e-root-${areaId}`, source: 'root', target: areaId, animated: true });
        
        // ✅ IMPLEMENTED: Always create drugtype nodes, but only show them when area is open
        const dts = Object.entries(drugMap);
        dts.forEach(([dt, c], j) => {
          const dx = x;
          const dy = vRowsY[2] + j * (nodeHeight + 12);
          const dtId = `${areaId}-dt-${j}`;
          const isDrugtypeOpen = openDrugtypes.has(dtId);
          
          // Only add drugtype nodes if area is open
          if (isOpen) {
            nodes.push({ 
              id: dtId, 
              data: { label: labelWithCaret(`${dt} (${c})`, isDrugtypeOpen) }, 
              position: { x: dx, y: dy }, 
              style: { width: nodeWidth, height: nodeHeight, borderRadius: 8, cursor: 'pointer' } 
            });
            edges.push({ id: `e-${areaId}-${dtId}`, source: areaId, target: dtId, animated: true });
            
            // ✅ IMPLEMENTED: Add sub-nodes for drugtype expansion
            if (isDrugtypeOpen) {
              // Get medicines for this specific drugtype in this area
              const medicinesForDrugtype = apiRows.filter(r => 
                r.distribute_area === area && r.drugtype === dt
              );
              
              // Show top medicines for this drugtype
              medicinesForDrugtype.slice(0, 5).forEach((medicine, k) => {
                const medId = `${dtId}-med-${k}`;
                const medX = dx + (k % 2) * (nodeWidth + hGap);
                const medY = dy + 60 + Math.floor(k / 2) * (nodeHeight + 12);
                nodes.push({ 
                  id: medId, 
                  data: { 
                    label: `💊 ${medicine.trade_name.substring(0, 18)}...`,
                    // ✅ IMPLEMENTED: Add tooltip data for medicine nodes
                    tooltip: `Medicine: ${medicine.trade_name}\nArea: ${medicine.distribute_area}\nType: ${medicine.drugtype}`
                  }, 
                  position: { x: medX, y: medY }, 
                  style: { 
                    width: nodeWidth, 
                    height: nodeHeight, 
                    borderRadius: 8, 
                    cursor: 'default',
                    // ✅ IMPLEMENTED: Different styling for medicine nodes
                    background: isDark ? '#1e293b' : '#f8fafc',
                    border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`
                  } 
                });
                edges.push({ id: `e-${dtId}-${medId}`, source: dtId, target: medId, animated: true });
              });
            }
          }
        });
      });
    }

    return { nodes, edges };
  }, [apiRows.length, areaGroups, rootOpen, openAreas, openDrugtypes, apiRows]);

  // ✅ IMPLEMENTED: Animation function for expanding nodes to top
  const animateNodeToTop = useCallback((nodeId) => {
    setAnimatingNodes(prev => new Set([...prev, nodeId]));
    setExpandedNodeId(nodeId);
    
    // Reset animation state after duration
    setTimeout(() => {
      setAnimatingNodes(prev => {
        const next = new Set(prev);
        next.delete(nodeId);
        return next;
      });
    }, ANIMATION_DURATION);
  }, []);

  const onNodeClick = useCallback((_, node) => {
    setSelectedId(node.id);
    if (node.id === 'root') {
      setRootOpen((o) => !o);
      return;
    }
    if (node.id.startsWith('area-')) {
      setOpenAreas((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
          setExpandedNodeId(null); // Reset expanded state when closing
        } else {
          next.add(node.id);
          // ✅ IMPLEMENTED: Animate to top when expanding
          animateNodeToTop(node.id);
        }
        return next;
      });
    }
    // ✅ IMPLEMENTED: Handle drugtype node clicks
    if (node.id.includes('-dt-')) {
      setOpenDrugtypes((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
          setExpandedNodeId(null); // Reset expanded state when closing
        } else {
          next.add(node.id);
          // ✅ IMPLEMENTED: Animate drugtype to top when expanding
          animateNodeToTop(node.id);
        }
        return next;
      });
    }
  }, [animateNodeToTop]);

  const decoratedNodes = useMemo(() => nodes.map(n => {
    // ✅ IMPLEMENTED: Calculate animated position for expanded nodes
    const isExpanded = expandedNodeId === n.id;
    const isAnimating = animatingNodes.has(n.id);
    
    // Calculate Y position with animation
    let animatedY = n.position.y;
    if (isExpanded && (n.id.startsWith('area-') || n.id.includes('-dt-'))) {
      animatedY = EXPANDED_TOP_Y;
    }
    
    return {
      ...n,
      selectable: true,
      draggable: false,
      position: {
        ...n.position,
        y: animatedY
      },
      data: {
        ...n.data,
        label: getNodeLabel(n, isExpanded)
      },
      style: {
        ...n.style,
        border: n.id === selectedId ? `2px solid ${isDark ? '#22d3ee' : '#0ea5e9'}` : `1px solid ${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.2)'}`,
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#ffffff' : '#111827',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 8,
        fontSize: 12,
        fontWeight: 600,
        // ✅ IMPLEMENTED: Animation styles
        transition: isAnimating ? `all ${ANIMATION_DURATION}ms ease-in-out` : 'none',
        transform: isExpanded ? 'scale(1.05)' : 'scale(1)',
        zIndex: isExpanded ? 1000 : 1,
        boxShadow: isExpanded ? `0 8px 25px ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)'}` : 'none',
        // ✅ IMPLEMENTED: Visual indicators for expanded state
        borderColor: isExpanded ? (isDark ? '#22d3ee' : '#0ea5e9') : undefined,
        borderWidth: isExpanded ? '2px' : undefined
      }
    };
  }), [nodes, selectedId, isDark, expandedNodeId, animatingNodes]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* ✅ IMPLEMENTED: Loading State with Loader Component */}
      {loading && (
        <div className="flex items-center justify-center h-full">
          <Loader size={80} color={isDark ? "#20c997" : "#0891b2"} speed={1.5} />
        </div>
      )}
      
      {!loading && (
        <ReactFlow
          nodes={decoratedNodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          panOnDrag
          zoomOnScroll
          elementsSelectable
          proOptions={{ hideAttribution: true }}
          fitViewOptions={{ padding: 0.05 }}
          defaultEdgeOptions={{ 
            style: { 
              stroke: isDark ? '#475569' : '#94a3b8',
              // ✅ IMPLEMENTED: Smooth edge transitions
              transition: `all ${ANIMATION_DURATION}ms ease-in-out`
            } 
          }}
        >
          <Background color={isDark ? '#334155' : '#e5e7eb'} gap={16} />
        </ReactFlow>
      )}
    </div>
  );
};

export default SuspendedNodes;
