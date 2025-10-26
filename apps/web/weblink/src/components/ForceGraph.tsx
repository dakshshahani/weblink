// components/ForceGraph.tsx
'use client'
import * as d3 from 'd3'
import { useRef, useEffect } from 'react'
type Node = d3.SimulationNodeDatum & {
  id: string | number
  name: string
}

type Link = d3.SimulationLinkDatum<Node> & {
  source: string | number | Node
  target: string | number | Node
}

interface Props {
  nodes: Node[]
  links: Link[]
}


export default function ForceGraph({ nodes, links }: Props) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const width = 600
    const height = 400

    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))

    const link = svg
      .append('g')
      .attr('stroke', '#aaa')
      .selectAll('line')
      .data(links)
      .join('line')

    const node = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 10)
      .attr('fill', 'steelblue')
      .call(
        d3
          .drag<SVGCircleElement, Node>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended) as unknown as any
      )

    const label = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d) => d.name)
      .attr('font-size', 12)
      .attr('dy', -15)
      .attr('text-anchor', 'middle')

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => (d.source as Node).x!)
        .attr('y1', (d: any) => (d.source as Node).y!)
        .attr('x2', (d: any) => (d.target as Node).x!)
        .attr('y2', (d: any) => (d.target as Node).y!)

      node.attr('cx', (d) => d.x!).attr('cy', (d) => d.y!)
      label.attr('x', (d) => d.x!).attr('y', (d) => d.y!)
    })

    function dragstarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return () => {
      simulation.stop()
    }
  }, [nodes, links])

  return <svg ref={ref} width={600} height={400}></svg>
}