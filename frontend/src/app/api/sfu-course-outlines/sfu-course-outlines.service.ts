import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { sfuCourseOutlineApi } from '../../config';
import { ObservableCache } from '../observable-cache';
import type {
  Course,
  CourseOutline,
  CourseSection,
  Department,
  Term,
  TermResponse,
  Year
} from './sfu-course-outline.models';

export type CoursesKey = {
  year: number;
  term: Term;
  department: Department;
};

export type SectionsKey = CoursesKey & {
  courseNumber: string;
};

export type OutlineKey = SectionsKey & {
  courseSection: string;
};

export type UrlKey = CoursesKey | SectionsKey | OutlineKey;

function makeKey(input: UrlKey): string {
  const base = `${input.year}/${input.term}/${input.department}`;

  if ('courseSection' in input) {
    return `${base}/${input.courseNumber}/${input.courseSection}`;
  }

  if ('courseNumber' in input) {
    return `${base}/${input.courseNumber}`;
  }

  return base;
}

function makeUrl(input: UrlKey): string {
  return sfuCourseOutlineApi + makeKey(input);
}

/**
 * Documentation for the SFU Course Outlines API can be found at:
 * https://www.sfu.ca/outlines/help/api.html
 *
 * The structure of the request is:
 * BASE_URL?{year}/{term}/{department}/{courseNumber}/{courseSection}/{courseSection}
 */
@Service()
export class SfuCourseOutlinesService {
  private http = inject(HttpClient);

  /**
   * The key to each cache entry is the URL after `BASE_URL?`
   */
  private cache = new ObservableCache();

  getYears(): Observable<number[]> {
    return this.cache.get<number[]>('years', () =>
      this.http
        .get<Year[]>(sfuCourseOutlineApi)
        .pipe(map(res => res.map(({ text }) => parseInt(text))))
    );
  }

  getTerms(year: number): Observable<Term[]> {
    return this.cache.get<Term[]>(year.toString(), () =>
      this.http
        .get<TermResponse[]>(`${sfuCourseOutlineApi}${year}`)
        .pipe(map(res => res.map(term => term.value as Term)))
    );
  }

  getDepartmentCourses(year: number, term: Term, department: Department): Observable<Course[]> {
    return this.cache.get<Course[]>(makeKey({ year, term, department }), () =>
      this.fetcher({ year, term, department })
    );
  }

  getCourseSections(
    year: number,
    term: Term,
    department: Department,
    courseNumber: string
  ): Observable<CourseSection[]> {
    return this.cache.get<CourseSection[]>(makeKey({ year, term, department, courseNumber }), () =>
      this.fetcher({ year, term, department, courseNumber })
    );
  }

  getCourseOutline(
    year: number,
    term: Term,
    department: Department,
    courseNumber: string,
    courseSection: string
  ): Observable<CourseOutline> {
    return this.cache.get<CourseOutline>(
      makeKey({ year, term, department, courseNumber, courseSection }),
      () => this.fetcher({ year, term, department, courseNumber, courseSection })
    );
  }

  clearCache(key?: UrlKey): void {
    this.cache.clear(key ? makeKey(key) : undefined);
  }

  /**
   * @param params - parameters to fetch the data
   * @returns an observable of the fetched data
   */
  private fetcher(params: CoursesKey): Observable<Course[]>;
  private fetcher(params: SectionsKey): Observable<CourseSection[]>;
  private fetcher(params: OutlineKey): Observable<CourseOutline>;
  private fetcher(params: UrlKey): Observable<Course[] | CourseSection[] | CourseOutline> {
    return this.http.get<Course[] | CourseSection[] | CourseOutline>(makeUrl(params)).pipe(
      tap(res => {
        if ('errorMessage' in res) {
          throw new Error(`Error fetching data from SFU Course Outlines API: ${res.errorMessage}`);
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
