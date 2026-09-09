import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export type RamData = {
  id: string;
  label: string;
  value: number; // RAM usage in MB
  color: string;
};

export function RamSaverChart({ data }: { data: RamData[] }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const width = 240;
    const height = 240;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Compute the position of each group on the pie
    const pie = d3.pie<RamData>()
      .sort(null)
      .value((d) => d.value);

    const data_ready = pie(data);

    // The arc generator
    const arc = d3.arc<d3.PieArcDatum<RamData>>()
      .innerRadius(radius * 0.6)         // This is the size of the donut hole
      .outerRadius(radius)
      .cornerRadius(4);

    // Build the pie chart
    svg.selectAll('allSlices')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#14161D')
      .style('stroke-width', '2px')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1)
      .attrTween('d', function(d) {
        const i = d3.interpolate({startAngle: 0, endAngle: 0}, d);
        return function(t) { return arc(i(t)) as string; }
      });

    // Add total inside the donut
    const totalRam = data.reduce((acc, curr) => acc + curr.value, 0);
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -5)
      .style('fill', '#F4F4F9')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .text(`${totalRam}`);
    
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 15)
      .style('fill', '#8D99AE')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text(`MB IN USE`);

  }, [data]);

  return (
    <div className="flex justify-center items-center">
      <svg ref={svgRef}></svg>
    </div>
  );
}
