export interface Profile {
  id: string
  email: string
  name: string | null
  username: string | null
  avatar_url: string | null
  created_at: string
}

export interface AuthUser {
  id: string
  email: string | undefined
  user_metadata: {
    full_name?: string
    avatar_url?: string
    name?: string
  }
}
