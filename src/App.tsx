import { useState, useMemo, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Header } from '@/components/Header'
import { MemoCard } from '@/components/MemoCard'
import { MemoDialog } from '@/components/MemoDialog'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus } from '@phosphor-icons/react'
import { toast, Toaster } from 'sonner'
import type { Memo, MemoFormData } from '@/types/memo'

function App() {
  const [memos, setMemos] = useKV<Memo[]>('memos', [])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memoToDelete, setMemoToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await spark.user()
      setUserId(user.id)
    }
    fetchUserId()
  }, [])

  const filteredMemos = useMemo(() => {
    if (!memos) return []
    if (!searchQuery.trim()) return memos

    const query = searchQuery.toLowerCase()
    return memos.filter(
      memo =>
        memo.title.toLowerCase().includes(query) ||
        memo.content.toLowerCase().includes(query)
    )
  }, [memos, searchQuery])

  const handleCreateMemo = () => {
    setEditingMemo(null)
    setDialogOpen(true)
  }

  const handleEditMemo = (memo: Memo) => {
    setEditingMemo(memo)
    setDialogOpen(true)
  }

  const handleSaveMemo = (data: MemoFormData) => {
    if (editingMemo) {
      setMemos((currentMemos) =>
        (currentMemos || []).map(memo =>
          memo.id === editingMemo.id
            ? { ...memo, ...data, updatedAt: Date.now() }
            : memo
        )
      )
      toast.success('Memo updated successfully')
    } else {
      const newMemo: Memo = {
        id: `memo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId
      }
      setMemos((currentMemos) => [newMemo, ...(currentMemos || [])])
      toast.success('Memo created successfully')
    }
    setDialogOpen(false)
    setEditingMemo(null)
  }

  const handleDeleteClick = (id: string) => {
    setMemoToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (memoToDelete) {
      setMemos((currentMemos) => (currentMemos || []).filter(memo => memo.id !== memoToDelete))
      toast.success('Memo deleted successfully')
      setMemoToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="bottom-right" richColors />
      
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filteredMemos.length === 0 ? (
          <EmptyState 
            onCreateMemo={handleCreateMemo} 
            isSearching={searchQuery.length > 0}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Your Memos
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredMemos.length} {filteredMemos.length === 1 ? 'memo' : 'memos'}
                  {searchQuery && ' found'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemos.map(memo => (
                <MemoCard
                  key={memo.id}
                  memo={memo}
                  onEdit={handleEditMemo}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90 hover:scale-110 transition-transform"
        size="icon"
        onClick={handleCreateMemo}
      >
        <Plus size={24} weight="bold" />
      </Button>

      <MemoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveMemo}
        editingMemo={editingMemo}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Memo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this memo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default App