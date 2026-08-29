import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { SlidingTabDirective } from '@core/sliding-tabs/sliding-tab.directive';
import { SlidingTabsComponent } from '@core/sliding-tabs/sliding-tabs.component';
import { NgpToggleGroup, NgpToggleGroupItem } from 'ng-primitives/toggle-group';
import {
  type Department,
  DEPARTMENTS
} from '../../api/sfu-course-outlines/sfu-course-outline.models';
import {
  SfuCourseOutlinesService,
  TermYear
} from '../../api/sfu-course-outlines/sfu-course-outlines.service';
import { CourseCardsComponent } from './course-cards/course-cards.component';

@Component({
  selector: 'ksk-class-lookup-screen',
  imports: [
    UpperCasePipe,
    TitleCasePipe,
    NgpToggleGroup,
    NgpToggleGroupItem,
    CourseCardsComponent,
    SlidingTabsComponent,
    SlidingTabDirective
  ],
  templateUrl: './class-lookup.screen.html',
  styleUrl: './class-lookup.screen.scss'
})
export class ClassLookupComponent {
  private readonly sfuCoursesService = inject(SfuCourseOutlinesService);

  readonly courseLevels = [100, 200, 300, 400];

  readonly departments = DEPARTMENTS;

  readonly misc = ['required', 'online', 'surrey', 'burnaby'];

  readonly terms = this.sfuCoursesService.terms;

  selectedCourseLevels = model<number[]>(this.courseLevels);

  selectedDepartments = model<Department[]>([...this.departments]);

  protected termCompare(a: TermYear, b: TermYear): boolean {
    return a.year === b.year && a.term === b.term;
  }

  protected termKey(term: TermYear): string {
    return `${term.year}-${term.term}`;
  }

  protected termLabel(term: TermYear): string {
    return `${term.term} ${term.year}`;
  }
}
