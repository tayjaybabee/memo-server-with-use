import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/RichTextEditor'
import type { Memo, MemoFormData } from '@/types/memo'

interface MemoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: MemoFormData) => void
  editingMemo?: Memo | null
}

export function MemoDialog({ open, onOpenChange, onSave, editingMemo }: MemoDialogProps) {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<MemoFormData>({
    defaultValues: {
      title: '',
      content: ''
    }
  })
  
  const [content, setContent] = useState('')

  useEffect(() => {
    if (editingMemo) {
      reset({
        title: editingMemo.title,
        content: editingMemo.content
      })
      setContent(editingMemo.content)
    } else {
      reset({
        title: '',
        content: ''
      })
      setContent('')
    }
  }, [editingMemo, reset])

  const handleContentChange = (value: string) => {
    setContent(value)
    setValue('content', value)
  }

  const onSubmit = (data: MemoFormData) => {
    onSave({ ...data, content })
    reset()
    setContent('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {editingMemo ? 'Edit Memo' : 'Create New Memo'}
          </DialogTitle>
          <DialogDescription>
            {editingMemo ? 'Update your memo details below.' : 'Add a new memo to your collection.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter memo title..."
              {...register('title', { required: 'Title is required' })}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Write your memo content with rich formatting..."
            />
          </div>
          
          <DialogFooter className="gap-2">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90">
              {editingMemo ? 'Update Memo' : 'Create Memo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
