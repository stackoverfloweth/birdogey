export type Season = {
  id: string,
  name: string,
  ctpInPennies?: number,
  aceInPennies?: number,
  start: Date,
  end?: Date,
  courseId?: string,
}