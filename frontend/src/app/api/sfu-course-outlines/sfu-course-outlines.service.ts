import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TimeService } from '@core/time.service';
import { catchError, forkJoin, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { sfuCourseOutlineApi } from '../../config';
import { ObservableCache } from '../observable-cache';
import {
  CourseOutlineSchedule,
  DEPARTMENTS,
  TERMS,
  type Course,
  type CourseOutline,
  type CourseSection,
  type Department,
  type Term,
  type TermResponse,
  type Year
} from './sfu-course-outline.models';

export type TermYear = {
  term: Term;
  year: number;
};

export type CoursesKey = TermYear & {
  department: Department;
};

export type SectionsKey = CoursesKey & {
  courseNumber: string;
};

export type OutlineKey = SectionsKey & {
  courseSection: string;
};

export type DepartmentCourse = Course & {
  department: Department;
  courseNumber: number;
};

export type Offering = {
  section: string;
  instructors: string[];
  schedule: CourseOutlineSchedule[];
  campus: string;
};

export type CourseSummary = TermYear & {
  dept: string;
  courseNumber: string;
  title: string;
  description: string;
  offerings: Offering[];
};

interface DepartmentLoader {
  [x: string]: Observable<Course[]>;
}

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
 * Returns the term based on the month.
 * Spring: Jan 1 - April 30
 * Summer: May 1 - August 31
 * Fall: September 1 - December 31
 * @param date - date to check
 * @returns the term based on the month
 */
export function getCurrentTerm(date: Date): Term {
  // September
  if (date.getMonth() >= 8) {
    return 'fall';
  }

  // May
  if (date.getMonth() >= 4) {
    return 'summer';
  }

  return 'spring';
}

export function isDepartment(value: string): value is Department {
  return DEPARTMENTS.includes(value as Department);
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
  private readonly http = inject(HttpClient);
  private readonly time = inject(TimeService);

  /**
   * The key to each cache entry is the URL after `BASE_URL?`
   */
  private cache = new ObservableCache();

  readonly terms = toSignal(
    this.getYears().pipe(
      switchMap(years => {
        const reqs: Record<string, Observable<Term[]>> = {};
        const currentYear = this.time.currentYear();

        for (const year of years.sort((a, b) => a - b)) {
          if (year >= currentYear) {
            reqs[year] = this.getTerms(year);
          }
        }

        return forkJoin(reqs);
      }),
      map(res => {
        const sortedYears = Object.keys(res).sort((a, b) => parseInt(a) - parseInt(b));
        const termsToShow: TermYear[] = [];
        const currentYear = this.time.currentYear();
        for (const year of sortedYears) {
          const sortedTerms = res[year].sort((a, b) => TERMS.indexOf(a) - TERMS.indexOf(b));

          // For the current year, make sure we don't fetch anything from previous years.
          const startIndex =
            currentYear === parseInt(year) ? TERMS.indexOf(this.time.currentTerm()) : 0;

          for (let i = startIndex; i < sortedTerms.length; i++) {
            termsToShow.push({
              year: parseInt(year),
              term: sortedTerms[i]
            });
          }
        }
        return termsToShow;
      })
    ),
    {
      initialValue: [
        {
          year: this.time.currentYear(),
          term: getCurrentTerm(this.time.currentDatetime())
        }
      ]
    }
  );

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

  getCourses(year: number, term: Term): Observable<DepartmentCourse[]> {
    return forkJoin(
      DEPARTMENTS.reduce((acc, dept) => {
        return {
          ...acc,
          [dept]: this.getDepartmentCourses(year, term, dept)
        };
      }, {} as DepartmentLoader)
    ).pipe(
      map(courseMap =>
        Object.entries(courseMap).flatMap(([department, courses]) => {
          return courses.map(c => {
            return {
              ...c,
              courseNumber: parseInt(c.value),
              department: department as Department
            };
          });
        })
      )
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

  getCourseSummary(year: number, term: Term, course: DepartmentCourse): Observable<CourseSummary> {
    return this.getCourseSections(year, term, course.department, course.value).pipe(
      switchMap(sections => {
        const reqs = [];

        for (const section of sections) {
          if (section.classType !== 'e') {
            continue;
          }

          reqs.push(
            this.getCourseOutline(year, term, course.department, course.value, section.value)
          );
        }

        return forkJoin(reqs);
      }),
      map(outlines => {
        const offerings: Offering[] = outlines.map(o => ({
          section: o.info.section,
          instructors: o.instructor?.map(i => i.name) ?? [],
          schedule: o.courseSchedule,
          campus: o.courseSchedule[0].campus
        }));

        return {
          year,
          term,
          dept: course.department.toUpperCase(),
          courseNumber: course.value.toUpperCase(),
          title: course.title,
          description: outlines[0].info.description,
          offerings
        };
      })
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
