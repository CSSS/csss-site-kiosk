import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, effect, inject, signal, untracked } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { combineLatest, map, of, switchMap, withLatestFrom } from 'rxjs';
import {
  type Department,
  DEPARTMENTS,
  getCurrentTerm,
  isDepartment,
  type Term
} from '../../api/sfu-course-outlines/sfu-course-outline.models';
import { SfuCourseOutlinesService } from '../../api/sfu-course-outlines/sfu-course-outlines.service';

@Component({
  selector: 'ksk-class-lookup',
  imports: [UpperCasePipe, TitleCasePipe, FormsModule],
  templateUrl: './class-lookup.screen.html',
  styleUrl: './class-lookup.screen.scss'
})
export class ClassLookupComponent {
  private _courseApi = inject(SfuCourseOutlinesService);

  protected currentDate = new Date();
  protected departments = DEPARTMENTS;

  protected readonly selectedYear = signal<number>(this.currentDate.getFullYear());
  protected readonly selectedTerm = signal<Term | null>(getCurrentTerm(this.currentDate));
  protected readonly selectedDepartment = signal<Department | ''>('');
  protected readonly selectedCourse = signal<string>('');
  protected readonly selectedSection = signal<string>('');

  protected year$ = toObservable(this.selectedYear);
  protected term$ = toObservable(this.selectedTerm);
  protected department$ = toObservable(this.selectedDepartment);
  protected course$ = toObservable(this.selectedCourse);
  protected section$ = toObservable(this.selectedSection);

  yearsResult = toSignal(this._courseApi.getYears().pipe(map(years => years.reverse())), {
    initialValue: []
  });
  termsResult = toSignal(this.year$.pipe(switchMap(year => this._courseApi.getTerms(year))), {
    initialValue: []
  });

  coursesResult = toSignal(
    combineLatest(this.department$, this.year$, this.term$).pipe(
      switchMap(([department, year, term]) => {
        if (!isDepartment(department) || !term) {
          return of([]);
        }
        return this._courseApi.getDepartmentCourses(year, term, department);
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
        if (!isDepartment(department) || !term || !course) {
          return of([]);
        }
        return this._courseApi.getCourseSections(year, term, department, course);
      }),
      map(sections => {
        return sections.filter(section => section.classType === 'e');
      })
    ),
    {
      initialValue: []
    }
  );

  protected readonly outlineResult = toSignal(
    this.section$.pipe(
      withLatestFrom(this.year$, this.term$, this.department$, this.course$),
      switchMap(([section, year, term, department, course]) => {
        if (!isDepartment(department) || !term || !course || !section) {
          return of(null);
        }
        return this._courseApi.getCourseOutline(year, term, department, course, section);
      })
    )
  );

  constructor() {
    // These reset the radio buttons when certain options are clicked
    effect(() => {
      this.selectedYear();
      this.selectedTerm();
      this.selectedDepartment();
      untracked(() => {
        this.selectedCourse.set('');
        this.selectedSection.set('');
      });
    });

    effect(() => {
      this.selectedCourse();
      untracked(() => {
        this.selectedSection.set('');
      });
    });
  }
}
