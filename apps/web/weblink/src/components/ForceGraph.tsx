"use client";

import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Node = d3.SimulationNodeDatum & {
  id: string | number;
  name: string;
  tag?: string;
};

type Link = d3.SimulationLinkDatum<Node> & {
  id?: string | number;
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
  // --- states for delete modal
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "node" | "link";
    data: Node | Link;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const ref = useRef<SVGSVGElement>(null);
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const selections = useRef<{
    nodeSel?: d3.Selection<SVGCircleElement, Node, any, any>;
    linkSel?: d3.Selection<SVGLineElement, Link, any, any>;
    labelSel?: d3.Selection<SVGTextElement, Node, any, any>;
    sim?: d3.Simulation<Node, Link>;
  }>({});

  /* ------------------------------------------------------------------ */
  /* 🧩 Step 1 – Draw full graph                                        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = window.innerWidth * 0.84;
    const height = window.innerHeight * 0.9;

    const gLinks = svg.append("g").attr("stroke", "#aaa");
    const gNodes = svg.append("g");
    const gLabels = svg.append("g");

    // 🧠 Right-click handler abstracted to set modal state
    const handleRightClickLink = (event: PointerEvent, link: Link) => {
      event.preventDefault();
      setDeleteTarget({ type: "link", data: link });
    };
    const handleRightClickNode = (event: PointerEvent, node: Node) => {
      event.preventDefault();
      setDeleteTarget({ type: "node", data: node });
    };

    const linkSel = gLinks
      .selectAll("line")
      .data(allLinks)
      .join("line")
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", 1.5)
      .on("contextmenu", handleRightClickLink as any);

    const nodeSel = gNodes
      .selectAll("circle")
      .data(allNodes)
      .join("circle")
      .attr("r", 8)
      .attr("fill", (d) => color(d.tag ?? "default") as string)
      .attr("cursor", "pointer")
      .on("contextmenu", handleRightClickNode as any);

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

    sim.on("tick", () => {
      linkSel
        .attr("x1", (d: any) => (d.source as Node).x!)
        .attr("y1", (d: any) => (d.source as Node).y!)
        .attr("x2", (d: any) => (d.target as Node).x!)
        .attr("y2", (d: any) => (d.target as Node).y!);
      nodeSel.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
      labelSel.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
    });

    // dragging
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

    selections.current = { nodeSel, linkSel, labelSel, sim };

    return () => {
      sim.stop();
      svg.selectAll("*").remove();
      selections.current = {};
    };
  }, [allNodes, allLinks]);

  /* ------------------------------------------------------------------ */
  /* ✨  Step 2 – highlight logic remains identical                      */
  /* ------------------------------------------------------------------ */
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
        const base = color(d.tag ?? "default") as string;
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

  /* ------------------------------------------------------------------ */
  /* 🧩 Step 3 – shadcn dialog logic to confirm deletion                 */
  /* ------------------------------------------------------------------ */
  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      if (deleteTarget.type === "node") {
        const node = deleteTarget.data as Node;
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("id", node.id);
        if (error) throw error;
        // remove node visually
        selections.current.nodeSel?.filter((d) => d.id === node.id).remove();
      } else {
        const link = deleteTarget.data as Link;
        const { error } = await supabase
          .from("links")
          .delete()
          .eq("source_bookmark_id", (link.source as Node).id)
          .eq("target_bookmark_id", (link.target as Node).id);
        if (error) throw error;
        // remove visually
        selections.current.linkSel
          ?.filter(
            (d) =>
              (d.source as Node).id === (link.source as Node).id &&
              (d.target as Node).id === (link.target as Node).id
          )
          .remove();
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting element");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <>
      <svg
        ref={ref}
        className="w-full h-full block bg-white rounded-[1rem] shadow"
      />

      {/* 🧭 Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteTarget?.type === "node" ? "Delete Node" : "Delete Link"}
            </DialogTitle>
            <DialogDescription>
              {deleteTarget?.type === "node" && deleteTarget.data ? (
                <>
                  Are you sure you want to delete{" "}
                  <b>{(deleteTarget.data as Node).name}</b>? This will remove
                  related links but <b>not other nodes</b>.
                </>
              ) : deleteTarget?.type === "link" && deleteTarget.data ? (
                <>
                  Remove connection between nodes{" "}
                  <b>{String((deleteTarget.data as Link).source)}</b> and{" "}
                  <b>{String((deleteTarget.data as Link).target)}</b>?
                </>
              ) : (
                <>Loading...</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isDeleting}
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              disabled={isDeleting}
              variant="destructive"
              onClick={confirmDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
