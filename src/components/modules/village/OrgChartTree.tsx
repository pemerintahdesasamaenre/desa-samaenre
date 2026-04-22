'use client'

import { useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { StaffMember } from '@/types'

interface TreeNode extends StaffMember {
  children: TreeNode[]
}

interface OrgChartTreeProps {
  staff: StaffMember[]
}

const StaffNode = ({ node }: { node: TreeNode }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div className="relative flex flex-col items-center p-6 bg-card rounded-3xl shadow-xl border border-border min-w-[220px] group transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/10 z-10">
        <div className="w-24 h-24 relative rounded-full overflow-hidden bg-muted mb-4 border-4 border-background shadow-inner">
          {node.photo_url ? (
            <Image
              src={node.photo_url}
              alt={node.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          )}
        </div>
        <h3 className="font-black text-foreground text-center text-base tracking-tight uppercase leading-tight">{node.name}</h3>
        <p className="text-primary text-[10px] font-black text-center uppercase tracking-[0.2em] mt-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
          {node.position}
        </p>
      </div>

      {/* Children & Lines */}
      {node.children.length > 0 && (
        <div className="relative pt-12 flex flex-col items-center">
          {/* Vertical line from parent to horizontal rail */}
          <div className="absolute top-0 w-px h-12 bg-primary/30"></div>
          
          <div className="flex gap-12 relative">
            {node.children.map((child, index) => (
              <div key={child.id} className="relative pt-12">
                {/* Horizontal line rail */}
                {node.children.length > 1 && (
                  <div 
                    className={`absolute top-0 h-px bg-primary/30 ${
                      index === 0 ? 'left-1/2 right-0' : 
                      index === node.children.length - 1 ? 'left-0 right-1/2' : 
                      'left-0 right-0'
                    }`}
                  ></div>
                )}
                
                {/* Vertical line to child node */}
                <div className="absolute top-0 left-1/2 w-px h-12 bg-primary/30 -translate-x-1/2"></div>
                
                <StaffNode node={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrgChartTree({ staff }: OrgChartTreeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const treeData = useMemo(() => {
    const staffMap = new Map<string, TreeNode>()
    staff.forEach(member => staffMap.set(member.id, { ...member, children: [] }))
    const roots: TreeNode[] = []
    staffMap.forEach(node => {
      if (node.parent_id && staffMap.has(node.parent_id)) {
        staffMap.get(node.parent_id)!.children.push(node)
      } else roots.push(node)
    })
    const sortNodes = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => a.order_index - b.order_index)
      nodes.forEach(node => { if (node.children.length > 0) sortNodes(node.children) })
    }
    sortNodes(roots)
    return roots
  }, [staff]);

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
    }
  }, [treeData]);

  if (!staff || staff.length === 0) return null;

  return (
    <div 
      ref={scrollRef}
      className="w-full overflow-x-auto pb-10 scrollbar-hide cursor-grab active:cursor-grabbing"
    >
      <div className="inline-flex min-w-full justify-center px-24">
        <div className="flex flex-col items-center gap-16 py-10">
          {treeData.map(root => (
            <StaffNode key={root.id} node={root} />
          ))}
        </div>
      </div>
    </div>
  )
}
