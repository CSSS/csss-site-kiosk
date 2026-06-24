import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ObservableCache } from '../observable-cache.service';
import { Course, CourseOutline, CourseSection, Term } from './sfu-course-outline.models';

type Department = 'cmpt' | 'macm' | 'math';

type CoursesKey = {
  year: number;
  term: string;
  department: Department;
};

type SectionsKey = CoursesKey & {
  courseNumber: string;
};

type OutlineKey = SectionsKey & {
  courseSection: string;
};

type UrlKey = CoursesKey | SectionsKey | OutlineKey;

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
  return environment.sfuCourseOutlineApi + makeKey(input);
}

/**
 * Documentation for the SFU Course Outlines API can be found at:
 * https://www.sfu.ca/outlines/help/api.html
 *
 * The structure of the request is:
 * BASE_URL?{year}/{term}/{department}/{courseNumber}/{courseSection}/{courseSection}
 */
@Service()
export class SfuCourseOutlines {
  private http = inject(HttpClient);

  /**
   * The key to each cache entry is the URL after `BASE_URL?`
   */
  private cache = new ObservableCache();

  getDepartmentCourses(year: number, term: Term, department: Department) {
    return this.cache.get<Course[]>(makeKey({ year, term, department }), () =>
      this.http.get<Course[]>(makeUrl({ year, term, department }))
    );
  }

  getCourseSections(year: number, term: Term, department: Department, courseNumber: string) {
    return this.cache.get<CourseSection[]>(makeKey({ year, term, department, courseNumber }), () =>
      this.http.get<CourseSection[]>(makeUrl({ year, term, department, courseNumber }))
    );
  }

  getCourseOutline(
    year: number,
    term: Term,
    department: Department,
    courseNumber: string,
    courseSection: string
  ) {
    return this.cache.get<CourseOutline>(
      makeKey({ year, term, department, courseNumber, courseSection }),
      () =>
        this.http.get<CourseOutline>(
          makeUrl({ year, term, department, courseNumber, courseSection })
        )
    );
  }

  clearCache(key?: UrlKey): void {
    this.cache.clear(key ? makeKey(key) : undefined);
  }
}
