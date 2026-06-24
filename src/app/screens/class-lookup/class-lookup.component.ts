import { UpperCasePipe } from '@angular/common';
import { Component, effect, inject, signal, untracked } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { map, of, switchMap, withLatestFrom } from 'rxjs';
import {
  type Department,
  DEPARTMENTS,
  getCurrentTerm,
  isDepartment,
  type Term
} from '../../api/sfu-course-outlines/sfu-course-outline.models';
import { SfuCourseOutlines } from '../../api/sfu-course-outlines/sfu-course-outlines.service';

@Component({
  selector: 'ksk-class-lookup',
  imports: [UpperCasePipe, FormsModule],
  templateUrl: './class-lookup.component.html',
  styleUrl: './class-lookup.component.scss'
})
export class ClassLookup {
  private courseApi = inject(SfuCourseOutlines);

  protected currentDate = new Date();
  protected departments = DEPARTMENTS;

  protected readonly searchYear = signal<number>(this.currentDate.getFullYear());
  protected readonly searchTerm = signal<Term | null>(getCurrentTerm(this.currentDate));
  protected readonly searchDepartment = signal<Department | ''>('');
  protected readonly searchCourse = signal<string>('');
  protected readonly searchSection = signal<string>('');

  protected year$ = toObservable(this.searchYear);
  protected term$ = toObservable(this.searchTerm);
  protected department$ = toObservable(this.searchDepartment);
  protected course$ = toObservable(this.searchCourse);
  protected section$ = toObservable(this.searchSection);

  yearsResult = toSignal(this.courseApi.getYears().pipe(map(years => years.reverse())));
  termsResult = toSignal(this.year$.pipe(switchMap(year => this.courseApi.getTerms(year))));

  coursesResult = toSignal(
    this.department$.pipe(
      withLatestFrom(this.year$, this.term$),
      switchMap(([department, year, term]) => {
        if (!isDepartment(department) || !term) {
          return of([]);
        }
        return this.courseApi.getDepartmentCourses(year, term, department);
      })
    ),
    {
      initialValue: []
    }
  );

  sectionsResult = toSignal(
    this.course$.pipe(
      withLatestFrom(this.year$, this.term$, this.department$),
      switchMap(([course, year, term, department]) => {
        if (!isDepartment(department) || !term) {
          return of([]);
        }
        return this.courseApi.getCourseSections(year, term, department, course);
      })
    ),
    {
      initialValue: []
    }
  );

  constructor() {
    effect(() => {
      this.searchYear();
      untracked(() => {
        this.searchTerm.set(null);
        this.searchDepartment.set('');
        this.searchCourse.set('');
        this.searchSection.set('');
      });
    });

    effect(() => {
      this.searchTerm();
      untracked(() => {
        this.searchDepartment.set('');
        this.searchCourse.set('');
        this.searchSection.set('');
      });
    });

    effect(() => {
      this.searchDepartment();
      untracked(() => {
        this.searchCourse.set('');
        this.searchSection.set('');
      });
    });

    effect(() => {
      this.searchCourse();
      untracked(() => {
        this.searchSection.set('');
      });
    });
  }
}
