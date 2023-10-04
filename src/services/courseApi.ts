import { Course, CourseRequest, CourseResponse } from '@/models'
import { Api } from '@/services/api'
import { mapper } from '@/services/mapper'

export class CourseApi extends Api {
  public getById(id: string): Promise<void> {
    return this.get(`/courses-get-by-id/${id}`)
  }

  public getList(): Promise<Course[]> {
    return this.get<CourseResponse[]>('/courses-get-list')
      .then(({ data }) => mapper.map('CourseResponse', data, 'Course'))
  }

  public create(request: CourseRequest): Promise<string> {
    return this.post<string>('courses-create', request)
      .then(({ data }) => data)
  }

  public update(id: string, request: CourseRequest): Promise<string> {
    return this.put<string>('courses-update', { id, ...request })
      .then(({ data }) => data)
  }

  public remove(id: string): Promise<string> {
    return this.delete<string>(`courses-remove/${id}`)
      .then(({ data }) => data)
  }
}
