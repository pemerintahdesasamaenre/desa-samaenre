'use client'

import React, { useMemo } from 'react'
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
      <div className="relative flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-slate-200 min-w-[200px] hover:shadow-md transition-shadow">
        <div className="w-20 h-20 relative rounded-full overflow-hidden bg-slate-100 mb-3 border-2 border-primary/10">
          {node.photo_url ? (
            <Image
              src={node.photo_url}
              alt={node.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          )}
        </div>
        <h3 className="font-bold text-slate-900 text-center text-sm">{node.name}</h3>
        <p className="text-primary text-xs font-medium text-center uppercase tracking-wider mt-1">{node.position}</p>
      </div>

      {node.children.length > 0 && (
        <div className="relative pt-8">
          {/* Vertical line from parent to horizontal line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-300"></div>
          
          <div className="flex gap-8">
            {node.children.map((child, index) => (
              <div key={child.id} className="relative">
                {/* Horizontal line connections */}
                {node.children.length > 1 && (
                  <div 
                    className={`absolute top-0 h-px bg-slate-300 ${
                      index === 0 ? 'left-1/2 right-0' : 
                      index === node.children.length - 1 ? 'left-0 right-1/2' : 
                      'left-0 right-0'
                    }`}
                  ></div>
                )}
                
                {/* Vertical line to child */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-300"></div>
                
                <div className="pt-8">
                  <StaffNode node={child} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrgChartTree({ staff }: OrgChartTreeProps) {
  const treeData = useMemo(() => {
    const staffMap = new Map<string, TreeNode>()
    
    // Initialize map with all nodes
    staff.forEach(member => {
      staffMap.set(member.id, { ...member, children: [] })
    })

    const roots: TreeNode[] = []

    // Build hierarchy
    staffMap.forEach(node => {
      if (node.parent_id && staffMap.has(node.parent_id)) {
        staffMap.get(node.parent_id)!.children.push(node)
      } else {
        roots.push(node)
      }
    })

    // Sort children by order_index
    staffMap.forEach(node => {
      node.children.sort((a, b) => a.order_index - b.order_index)
    })

    return roots.sort((a, b) => a.order_index - b.order_index)
  }, [staff])

  if (!staff || staff.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        <p className="text-slate-500">Data struktur organisasi belum tersedia.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto pb-8">
      <div className="min-w-max flex justify-center p-4">
        <div className="flex gap-12">
          {treeData.map(root => (
            <StaffNode key={root.id} node={root} />
          ))}
        </div>
      </div>
    </div>
  )
}
