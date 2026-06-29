'use client';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export type NodeType = 'company' | 'model' | 'technology' | 'person' | 'concept' | 'funding';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  description: string;
  meta?: string; // e.g. "$40B", "2024", "GPT-4 class"
  url?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  strength?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface Props {
  data: GraphData;
  height?: number;
}

const NODE_COLORS: Record<NodeType, string> = {
  company:    '#2563eb',
  model:      '#7c3aed',
  technology: '#0891b2',
  person:     '#16a34a',
  concept:    '#d97706',
  funding:    '#dc2626',
};

const NODE_RADIUS: Record<NodeType, number> = {
  company:    28,
  model:      22,
  technology: 18,
  person:     20,
  concept:    16,
  funding:    18,
};

const NODE_ICONS: Record<NodeType, string> = {
  company:    '🏢',
  model:      '🤖',
  technology: '⚙️',
  person:     '👤',
  concept:    '💡',
  funding:    '💰',
};

interface D3Node extends GraphNode, d3.SimulationNodeDatum {}

interface D3Link {
  source: D3Node;
  target: D3Node;
  label: string;
  strength?: number;
}

export default function KnowledgeGraph({ data, height = 680 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<NodeType>>(
    new Set(['company', 'model', 'technology', 'person', 'concept', 'funding'])
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleType = (t: NodeType) => {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(t)) { if (next.size > 1) next.delete(t); }
      else next.add(t);
      return next;
    });
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const filteredNodes = data.nodes.filter(n => activeTypes.has(n.type)) as D3Node[];
    const filteredIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = data.edges.filter(
      e => filteredIds.has(e.source as string) && filteredIds.has(e.target as string)
    );

    const el = svgRef.current;
    const W = el.clientWidth || 900;
    const H = height;

    d3.select(el).selectAll('*').remove();

    const svg = d3.select(el)
      .attr('width', W)
      .attr('height', H);

    // Defs: arrowhead marker
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', '#94a3b8');

    // Zoom container
    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    // Initial transform, center
    svg.call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(0.8));

    // Force simulation
    const simulation = d3.forceSimulation<D3Node>(filteredNodes)
      .force('link', d3.forceLink<D3Node, { source: D3Node; target: D3Node }>(
        filteredEdges as unknown as { source: D3Node; target: D3Node }[]
      )
        .id(d => d.id)
        .distance(d => {
          const s = (d as unknown as D3Link).source;
          const t = (d as unknown as D3Link).target;
          if (s.type === 'company' || t.type === 'company') return 120;
          return 80;
        })
        .strength(d => (d as unknown as GraphEdge).strength ?? 0.4)
      )
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(0, 0))
      .force('collision', d3.forceCollide<D3Node>().radius(d => NODE_RADIUS[d.type] + 14));

    // Links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup.selectAll<SVGLineElement, GraphEdge>('line')
      .data(filteredEdges)
      .join('line')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.7)
      .attr('marker-end', 'url(#arrow)');

    // Edge labels
    const edgeLabelGroup = g.append('g').attr('class', 'edge-labels');
    const edgeLabel = edgeLabelGroup.selectAll<SVGTextElement, GraphEdge>('text')
      .data(filteredEdges)
      .join('text')
      .text(d => d.label)
      .attr('font-size', 9)
      .attr('fill', '#94a3b8')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .attr('dy', -4);

    // Node groups
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup.selectAll<SVGGElement, D3Node>('g')
      .data(filteredNodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, D3Node>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
      )
      .on('click', (_, d) => {
        setSelected(prev => prev?.id === d.id ? null : d);
      })
      .on('mouseenter', (_, d) => setHoveredId(d.id))
      .on('mouseleave', () => setHoveredId(null));

    // Node circle
    node.append('circle')
      .attr('r', d => NODE_RADIUS[d.type])
      .attr('fill', d => NODE_COLORS[d.type] + '20')
      .attr('stroke', d => NODE_COLORS[d.type])
      .attr('stroke-width', 2.5);

    // Node icon text
    node.append('text')
      .text(d => NODE_ICONS[d.type])
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', d => NODE_RADIUS[d.type] * 0.85)
      .attr('pointer-events', 'none');

    // Node label
    node.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('y', d => NODE_RADIUS[d.type] + 14)
      .attr('font-size', d => d.type === 'company' ? 12 : 10)
      .attr('font-weight', d => d.type === 'company' ? '700' : '500')
      .attr('fill', '#1e293b')
      .attr('pointer-events', 'none');

    // Meta badge (e.g. "$40B")
    node.filter(d => !!d.meta)
      .append('text')
      .text(d => d.meta!)
      .attr('text-anchor', 'middle')
      .attr('y', d => NODE_RADIUS[d.type] + 26)
      .attr('font-size', 9)
      .attr('fill', '#64748b')
      .attr('pointer-events', 'none');

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as unknown as D3Node).x!)
        .attr('y1', d => (d.source as unknown as D3Node).y!)
        .attr('x2', d => {
          const s = d.source as unknown as D3Node;
          const t = d.target as unknown as D3Node;
          const dx = t.x! - s.x!;
          const dy = t.y! - s.y!;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          return t.x! - (dx / dist) * (NODE_RADIUS[t.type] + 8);
        })
        .attr('y2', d => {
          const s = d.source as unknown as D3Node;
          const t = d.target as unknown as D3Node;
          const dx = t.x! - s.x!;
          const dy = t.y! - s.y!;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          return t.y! - (dy / dist) * (NODE_RADIUS[t.type] + 8);
        });

      edgeLabel
        .attr('x', d => ((d.source as unknown as D3Node).x! + (d.target as unknown as D3Node).x!) / 2)
        .attr('y', d => ((d.source as unknown as D3Node).y! + (d.target as unknown as D3Node).y!) / 2);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [data, activeTypes, height]);

  // Highlight hovered connections in DOM
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    if (!hoveredId) {
      svg.selectAll('g.nodes g').attr('opacity', 1);
      svg.selectAll('g.links line').attr('stroke-opacity', 0.7);
      svg.selectAll('g.edge-labels text').attr('opacity', 1);
      return;
    }
    const connected = new Set<string>([hoveredId]);
    data.edges.forEach(e => {
      if (e.source === hoveredId) connected.add(e.target as string);
      if (e.target === hoveredId) connected.add(e.source as string);
    });
    svg.selectAll<SVGGElement, D3Node>('g.nodes g')
      .attr('opacity', d => connected.has(d.id) ? 1 : 0.15);
    svg.selectAll<SVGLineElement, GraphEdge>('g.links line')
      .attr('stroke-opacity', d => d.source === hoveredId || d.target === hoveredId ? 1 : 0.08)
      .attr('stroke', d => d.source === hoveredId || d.target === hoveredId ? '#2563eb' : '#cbd5e1')
      .attr('stroke-width', d => d.source === hoveredId || d.target === hoveredId ? 2.5 : 1.5);
    svg.selectAll<SVGTextElement, GraphEdge>('g.edge-labels text')
      .attr('opacity', d => d.source === hoveredId || d.target === hoveredId ? 1 : 0);
  }, [hoveredId, data.edges]);

  const ALL_TYPES: NodeType[] = ['company', 'model', 'technology', 'person', 'concept', 'funding'];

  return (
    <div className="kg-wrapper">
      {/* Filter bar */}
      <div className="kg-filters">
        {ALL_TYPES.map(t => (
          <button
            key={t}
            className={`kg-filter-btn ${activeTypes.has(t) ? 'active' : ''}`}
            style={{ '--dot-color': NODE_COLORS[t] } as React.CSSProperties}
            onClick={() => toggleType(t)}
          >
            <span className="kg-filter-dot" />
            {NODE_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
            <span className="kg-filter-count">
              {data.nodes.filter(n => n.type === t).length}
            </span>
          </button>
        ))}
        <div className="kg-filter-hint">Drag • Scroll to zoom • Click node</div>
      </div>

      <div className="kg-canvas-wrap">
        {/* SVG Graph */}
        <svg ref={svgRef} className="kg-svg" style={{ height }} />

        {/* Selected node detail panel */}
        {selected && (
          <div className="kg-detail-panel">
            <button className="kg-detail-close" onClick={() => setSelected(null)}>✕</button>
            <div className="kg-detail-icon" style={{ background: NODE_COLORS[selected.type] + '18', color: NODE_COLORS[selected.type] }}>
              {NODE_ICONS[selected.type]}
            </div>
            <div className="kg-detail-type" style={{ color: NODE_COLORS[selected.type] }}>
              {selected.type.toUpperCase()}
            </div>
            <h3 className="kg-detail-name">{selected.label}</h3>
            {selected.meta && <div className="kg-detail-meta">{selected.meta}</div>}
            <p className="kg-detail-desc">{selected.description}</p>
            <div className="kg-detail-connections">
              <div className="kg-detail-conn-label">Connected to:</div>
              {data.edges
                .filter(e => e.source === selected.id || e.target === selected.id)
                .slice(0, 6)
                .map((e, i) => {
                  const otherId = e.source === selected.id ? e.target : e.source;
                  const other = data.nodes.find(n => n.id === otherId);
                  if (!other) return null;
                  return (
                    <div key={i} className="kg-detail-conn-row">
                      <span style={{ color: NODE_COLORS[other.type] }}>{NODE_ICONS[other.type]}</span>
                      <span className="kg-detail-conn-name">{other.label}</span>
                      <span className="kg-detail-conn-rel">{e.label}</span>
                    </div>
                  );
                })}
            </div>
            {selected.url && (
              <a href={selected.url} target="_blank" rel="noopener noreferrer" className="kg-detail-link">
                View News →
              </a>
            )}
          </div>
        )}
      </div>

      <div className="kg-stats">
        <span>{data.nodes.filter(n => activeTypes.has(n.type)).length} nodes</span>
        <span>·</span>
        <span>{data.edges.filter(e => activeTypes.has(data.nodes.find(n => n.id === e.source)?.type ?? 'concept') && activeTypes.has(data.nodes.find(n => n.id === e.target)?.type ?? 'concept')).length} connections</span>
      </div>
    </div>
  );
}
