import { NotePencil } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onCreateMemo: () => void
  isSearching?: boolean
}

export function EmptyState({ onCreateMemo, isSearching = false }: EmptyStateProps) {
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <NotePencil size={48} className="text-muted-foreground" weight="duotone" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No memos found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Try adjusting your search terms or create a new memo.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
        <NotePencil size={48} className="text-primary" weight="duotone" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">No memos yet</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Start capturing your thoughts and ideas by creating your first memo.
      </p>
      <Button 
        onClick={onCreateMemo}
        className="bg-accent hover:bg-accent/90"
        size="lg"
      >
        <NotePencil className="mr-2" />
        Create Your First Memo
      </Button>
    </div>
  )
}
