import React, { useMemo, useState, useCallback } from 'react';
import ReactFlow, { Background } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeWidth = 220;
const nodeHeight = 40;
const hGap = 24;
const vRowsY = [0, 180, 360]; // root, areas, drugtypes

const labelWithCaret = (label, isOpen) => `${isOpen ? '▾' : '▸'}  ${label}`;

const SuspendedNodes = ({ rows, isDark }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [rootOpen, setRootOpen] = useState(false); // start closed by default
  const [openAreas, setOpenAreas] = useState(new Set()); // none open initially

  const areaGroups = useMemo(() => rows.reduce((acc, r) => {
    const area = r.distribute_area || 'Unknown';
    const dt = r.drugtype || 'Unknown';
    if (!acc[area]) acc[area] = {};
    if (!acc[area][dt]) acc[area][dt] = 0;
    acc[area][dt] += 1;
    return acc;
  }, {}), [rows]);

  const { nodes, edges } = useMemo(() => {
    const nodes = [];
    const edges = [];

    // Root
    nodes.push({ id: 'root', data: { label: labelWithCaret(`Suspended_Medicines (${rows.length})`, rootOpen) }, position: { x: 20, y: vRowsY[0] }, style: { width: nodeWidth, height: nodeHeight, borderRadius: 8, cursor: 'pointer' } });

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
        if (isOpen) {
          const dts = Object.entries(drugMap);
          dts.forEach(([dt, c], j) => {
            const dx = x;
            const dy = vRowsY[2] + j * (nodeHeight + 12);
            const dtId = `${areaId}-dt-${j}`;
            nodes.push({ id: dtId, data: { label: `${dt} (${c})` }, position: { x: dx, y: dy }, style: { width: nodeWidth, height: nodeHeight, borderRadius: 8, cursor: 'default' } });
            edges.push({ id: `e-${areaId}-${dtId}`, source: areaId, target: dtId, animated: true });
          });
        }
      });
    }

    return { nodes, edges };
  }, [rows.length, areaGroups, rootOpen, openAreas]);

  const onNodeClick = useCallback((_, node) => {
    setSelectedId(node.id);
    if (node.id === 'root') {
      setRootOpen((o) => !o);
      return;
    }
    if (node.id.startsWith('area-')) {
      setOpenAreas((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) next.delete(node.id); else next.add(node.id);
        return next;
      });
    }
  }, []);

  const decoratedNodes = useMemo(() => nodes.map(n => ({
    ...n,
    selectable: true,
    draggable: false,
    style: {
      ...n.style,
      border: n.id === selectedId ? `2px solid ${isDark ? '#22d3ee' : '#0ea5e9'}` : `1px solid ${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.2)'}`,
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#ffffff' : '#111827',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 8,
      fontSize: 12,
      fontWeight: 600
    }
  })), [nodes, selectedId, isDark]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
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
        defaultEdgeOptions={{ style: { stroke: isDark ? '#475569' : '#94a3b8' } }}
      >
        <Background color={isDark ? '#334155' : '#e5e7eb'} gap={16} />
      </ReactFlow>
    </div>
  );
};

export default SuspendedNodes;
