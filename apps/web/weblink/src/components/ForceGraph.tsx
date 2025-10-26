"use client";

import * as d3 from "d3";
import { useRef, useEffect } from "react";

type Node = d3.SimulationNodeDatum & {
  id: string | number;
  name: string;
  tag?: string;
};

type Link = d3.SimulationLinkDatum<Node> & {
  source: string | number | Node;
  target: string | number | Node;
};

interface Props {
  allNodes: Node[];
  allLinks: Link[];
  filteredNodes: Node[];
  filteredLinks: Link[];
  selectedTags: string[];
}

export default function ForceGraph({
  allNodes,
  allLinks,
  filteredNodes,
  filteredLinks,
  selectedTags,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  // store D3 selections
  const selections = useRef<{
    nodeSel?: d3.Selection<SVGCircleElement, Node, any, any>;
    linkSel?: d3.Selection<SVGLineElement, Link, any, any>;
    labelSel?: d3.Selection<SVGTextElement, Node, any, any>;
    sim?: d3.Simulation<Node, Link>;
  }>({});

  // 1️⃣ Draw full graph layout once (based on all data)
  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = window.innerWidth * 0.84;
    const height = window.innerHeight * 0.9;

    const gLinks = svg.append("g").attr("stroke", "#aaa");
    const gNodes = svg.append("g");
    const gLabels = svg.append("g");

    const linkSel = gLinks
      .selectAll("line")
      .data(allLinks)
      .join("line")
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", 1.5);

    const nodeSel = gNodes
      .selectAll("circle")
      .data(allNodes)
      .join("circle")
      .attr("r", 8)
      .attr("fill", (d) => color(d.tag ?? "default") as string)
      .attr("cursor", "pointer")
      .call(
        d3
          .drag<SVGCircleElement, Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    const labelSel = gLabels
      .selectAll("text")
      .data(allNodes)
      .join("text")
      .text((d) => d.name)
      .attr("font-size", 12)
      .attr("fill", "#333")
      .attr("dy", -12)
      .attr("text-anchor", "middle");

    const sim = d3
      .forceSimulation(allNodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(allLinks)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2));
    function dragstarted(event: any, d: Node) {
      if (!event.active) sim.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: Node) {
      if (!event.active) sim.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    nodeSel.call(
      d3
        .drag<SVGCircleElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    sim.on("tick", () => {
      linkSel
        .attr("x1", (d: any) => (d.source as Node).x!)
        .attr("y1", (d: any) => (d.source as Node).y!)
        .attr("x2", (d: any) => (d.target as Node).x!)
        .attr("y2", (d: any) => (d.target as Node).y!);
      nodeSel.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
      labelSel.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
    });

    selections.current = { nodeSel, linkSel, labelSel, sim };

    return () => {
      sim.stop();
      svg.selectAll("*").remove();
      selections.current = {};
    };
  }, [allNodes, allLinks]);

  // 2️⃣ Highlight nodes that are part of the active filtered subset
  useEffect(() => {
    const { nodeSel, linkSel, labelSel } = selections.current;
    if (!nodeSel || !linkSel || !labelSel) return;

    const hasActive = selectedTags.length > 0;

    const activeNodeIds = new Set(filteredNodes.map((n) => n.id));
    const activeLinkIds = new Set(
      filteredLinks.map((l) => `${l.source}-${l.target}`)
    );

    nodeSel
      .transition()
      .duration(300)
      .attr("r", (d) => (activeNodeIds.has(d.id) ? 12 : 8))
      .attr("fill", (d) => {
        const base = color(d.tag ?? "other") as string;
        return hasActive && !activeNodeIds.has(d.id)
          ? "rgba(200,200,200,0.4)"
          : base;
      })
      .attr("opacity", (d) => (hasActive && !activeNodeIds.has(d.id) ? 0.2 : 1))
      .attr("stroke", (d) => (activeNodeIds.has(d.id) ? "#000" : "none"))
      .attr("stroke-width", (d) => (activeNodeIds.has(d.id) ? 2 : 0));

    linkSel
      .transition()
      .duration(300)
      .attr("opacity", (d) => {
        const idKey = `${(d.source as Node).id}-${(d.target as Node).id}`;
        if (!hasActive) return 0.7;
        return activeLinkIds.has(idKey) ? 1 : 0.1;
      });

    labelSel
      .transition()
      .duration(300)
      .attr("opacity", (d) =>
        hasActive && !activeNodeIds.has(d.id) ? 0.2 : 1
      );
  }, [filteredNodes, filteredLinks, selectedTags]);

  return (
    <svg
      ref={ref}
      className="w-full h-full block bg-white rounded-[1rem] shadow"
    />
  );
}
