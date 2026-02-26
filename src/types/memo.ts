export interface Memo {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  userId: string
  sharedWith?: string[]
}

export interface MemoFormData {
  title: string
  content: string
}
