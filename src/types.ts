export type PersonType = 'pf' | 'pj'

export type DocField = {
  key: string
  label: string
  required: boolean
  kind: 'pdf' | 'images'
  maxImages?: number
}
