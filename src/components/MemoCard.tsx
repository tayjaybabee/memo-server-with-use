import { PencilSimple, Trash, ShareNetwork } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Memo } from '@/types/memo'
import { motion } from 'framer-motion'
import { marked } from 'marked'
import { memo as withMemo, useMemo } from 'react'

interface MemoCardProps {
  memo: Memo
  onEdit: (memo: Memo) => void
  onDelete: (id: string) => void
  onShare: (memo: Memo) => void
  isOwner: boolean
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  } else if (diffInHours < 168) {
    return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

export const MemoCard = withMemo(function MemoCard({ memo, onEdit, onDelete, onShare, isOwner }: MemoCardProps) {
  const renderPreview = useMemo(() => {
    if (!memo.content) return 'No content'
    
    try {
      const html = marked(memo.content, { breaks: true, gfm: true }) as string
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      const text = tempDiv.textContent || tempDiv.innerText || ''
      return text.slice(0, 200)
    } catch (e) {
      return memo.content.slice(0, 200)
    }
  }, [memo.content])

  const formattedDate = useMemo(() => formatDate(memo.updatedAt), [memo.updatedAt])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group relative p-6 h-full flex flex-col gap-3 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-card border-border/50">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
            {memo.title}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-accent"
                onClick={() => onShare(memo)}
                title="Share memo"
              >
                <ShareNetwork />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onEdit(memo)}
            >
              <PencilSimple />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(memo.id)}
            >
              <Trash />
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-4 flex-1">
          {renderPreview}
        </p>
        
        <div className="flex items-center justify-between pt-2 border-t border-border/50 gap-2">
          <span className="text-xs text-muted-foreground font-medium">
            {formattedDate}
          </span>
          <div className="flex items-center gap-2">
            {memo.sharedWith && memo.sharedWith.length > 0 && (
              <Badge variant="secondary" className="text-xs gap-1">
                <ShareNetwork size={12} />
                {memo.sharedWith.length}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {memo.content.length} chars
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
})
