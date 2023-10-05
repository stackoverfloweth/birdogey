export type Season = {
  id: string,
  courseId?: string,
  name: string,
  ctpInPennies?: number,
  aceInPennies?: number,
  start: Date,
  end?: Date,
}