export interface ApiResponse<T> {
  data: T
  pagination?: {
    total: number
    page: number
    limit: number
  }
  error?: string
}