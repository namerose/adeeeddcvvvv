import { useEffect, useRef } from 'react';
import { NetworkUser } from '@/types/connection';
import * as d3 from 'd3';

interface NetworkGraphProps {
  userId: string;
  followers: NetworkUser[];
  following: NetworkUser[];
  mutual: NetworkUser[];
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  avatar: string;
  type: 'user' | 'follower' | 'following' | 'mutual';
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
  type: 'following' | 'follower' | 'mutual';
}

export function NetworkGraph({ userId, followers, following, mutual }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    // Prepare data
    const nodes: Node[] = [
      { id: userId, name: 'You', avatar: '', type: 'user' },
      ...followers.map(f => ({ 
        id: f.id, 
        name: f.name, 
        avatar: f.avatar,
        type: 'follower' 
      })),
      ...following.map(f => ({ 
        id: f.id, 
        name: f.name, 
        avatar: f.avatar,
        type: 'following' 
      })),
      ...mutual.map(m => ({ 
        id: m.id, 
        name: m.name, 
        avatar: m.avatar,
        type: 'mutual' 
      }))
    ];

    const links: Link[] = [
      ...followers.map(f => ({ 
        source: f.id, 
        target: userId,
        type: 'follower' 
      })),
      ...following.map(f => ({ 
        source: userId, 
        target: f.id,
        type: 'following' 
      })),
      ...mutual.map(m => ({ 
        source: userId, 
        target: m.id,
        type: 'mutual' 
      }))
    ];

    // Set up SVG
    const width = 600;
    const height = 400;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => {
        switch (d.type) {
          case 'following': return '#22c55e';
          case 'follower': return '#3b82f6';
          case 'mutual': return '#8b5cf6';
          default: return '#e5e7eb';
        }
      })
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6);

    // Draw nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.type === 'user' ? 8 : 6)
      .attr('fill', d => {
        switch (d.type) {
          case 'user': return '#ef4444';
          case 'following': return '#22c55e';
          case 'follower': return '#3b82f6';
          case 'mutual': return '#8b5cf6';
          default: return '#e5e7eb';
        }
      })
      .call(drag(simulation));

    // Add tooltips
    node.append('title')
      .text(d => d.name);

    // Update positions
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);
    });

    // Drag behavior
    function drag(simulation: d3.Simulation<Node, undefined>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag<SVGCircleElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [userId, followers, following, mutual]);

  return (
    <div className="w-full aspect-[3/2] bg-background/50 rounded-lg overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}