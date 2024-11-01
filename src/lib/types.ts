export type Activity = {
  id: string
  title: string
  type: "document" | "image" | "video" | "note" | "email"
  group: string
  content:
    | string
    | {
        to: string
        subject: string
        body: string
      }
  position: { x: number; y: number }
  zIndex: number
  config?: {
    minWidth?: string
    favicon?: string
    gridSize?: [number, number]
  }
}