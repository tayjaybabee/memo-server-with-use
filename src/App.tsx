import { useState, useMemo, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Header } from '@/components/Header'
import { MemoCard } from '@/components/MemoCard'
import { MemoDialog } from '@/components/MemoDialog'
import { EmptyState } from '@/components/EmptyState'
import { AccessDenied } from '@/components/AccessDenied'
import { WhitelistSettings } from '@/components/WhitelistSettings'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Note, Gear } from '@phosphor-icons/react'
import { toast, Toaster } from 'sonner'
import type { Memo, MemoFormData } from '@/types/memo'

function App() {
  const [memos, setMemos] = useKV<Memo[]>('memos', [])
  const [whitelist, setWhitelist] = useKV<string[]>('whitelist', [])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memoToDelete, setMemoToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [userId, setUserId] = useState<string>('')
  const [userLogin, setUserLogin] = useState<string>('')
  const [isOwner, setIsOwner] = useState(false)
  const [activeTab, setActiveTab] = useState('memos')

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await spark.user()
      setUserId(user.id)
      setUserLogin(user.login)
      setIsOwner(user.isOwner)
    }
    fetchUserId()
  }, [])

  const hasAccess = useMemo(() => {
    if (!userLogin) return false
    if (isOwner) return true
    if (!whitelist || whitelist.length === 0) return true
    return whitelist.includes(userLogin)
  }, [isOwner, whitelist, userLogin])

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

  if (!userLogin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!hasAccess) {
    return <AccessDenied username={userLogin} />
  }

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

  const handleUpdateWhitelist = (newWhitelist: string[]) => {
    setWhitelist(newWhitelist)
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="bottom-right" richColors />
      
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {isOwner ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="memos" className="gap-2">
                <Note size={18} />
                Memos
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Gear size={18} />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="memos" className="mt-0">
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
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <div className="max-w-2xl">
                <WhitelistSettings 
                  whitelist={whitelist || []} 
                  onUpdateWhitelist={handleUpdateWhitelist}
                />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <>
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