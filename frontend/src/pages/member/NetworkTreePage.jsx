import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as memberService from '../../services/memberService';
import { Network, UserCheck, ChevronDown, ChevronRight } from 'lucide-react';

function TreeNode({ node, depth = 1 }) {
  const [expanded, setExpanded] = useState(true);
  if (!node) return null;

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-brand-300 transition shadow-sm max-w-lg">
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-slate-100 rounded text-slate-500"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs">
          L{depth}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 text-xs">{node.fullName}</h4>
            <span className="font-mono font-bold text-brand-600 text-[10px] bg-brand-50 px-2 py-0.5 rounded">
              {node.userCode}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Joined: {new Date(node.createdAt).toLocaleDateString('en-IN')}
          </p>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
          {node.status}
        </span>
      </div>

      {hasChildren && expanded && (
        <div className="pl-6 border-l-2 border-slate-200 ml-4 space-y-2 pt-2">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function NetworkTreePage() {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTree() {
      try {
        const res = await memberService.getNetworkTree();
        setTreeData(res.data);
      } catch (err) {
        console.error('Failed to load network tree:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTree();
  }, []);

  return (
    <PageContainer title="Downline Network Tree" subtitle="Hierarchical tree structure of your associate network">
      {loading ? (
        <LoadingSpinner />
      ) : treeData ? (
        <Card className="p-8 bg-slate-50 border-slate-200">
          <TreeNode node={treeData} depth={1} />
        </Card>
      ) : (
        <p className="text-xs text-slate-400 text-center py-8">No downline network tree available.</p>
      )}
    </PageContainer>
  );
}

export default NetworkTreePage;
