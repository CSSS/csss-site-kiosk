import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, computed, inject, model } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgpToggleGroup, NgpToggleGroupItem } from 'ng-primitives/toggle-group';
import {
  type Department,
  DEPARTMENTS
} from '../../api/sfu-course-outlines/sfu-course-outline.models';
import {
  SfuCourseOutlinesService,
  TermYear
} from '../../api/sfu-course-outlines/sfu-course-outlines.service';
import { TimeService } from '../../core/time.service';

@Component({
  selector: 'ksk-class-lookup-screen',
  imports: [UpperCasePipe, TitleCasePipe, NgpToggleGroup, NgpToggleGroupItem],
  templateUrl: './class-lookup.screen.html',
  styleUrl: './class-lookup.screen.scss'
})
export class ClassLookupComponent {
  private readonly time = inject(TimeService);

  private readonly sfuCoursesService = inject(SfuCourseOutlinesService);

  readonly courseLevels = [100, 200, 300, 400];

  readonly departments = DEPARTMENTS;

  readonly misc = ['required', 'online', 'surrey', 'burnaby'];

  readonly terms = this.sfuCoursesService.terms;

  selectedCourseLevel = model<number[]>(this.courseLevels);

  selectedDepartments = model<Department[]>([...this.departments]);

  selectedTerm = model<TermYear[]>([
    { year: this.time.currentYear(), term: this.time.currentTerm() }
  ]);

  selectedMisc = model<string[]>(this.misc);

  readonly courses = rxResource({
    params: () => this.selectedTerm()[0],
    stream: ({ params }) => this.sfuCoursesService.getCourses(params.year, params.term),
    defaultValue: []
  });

  readonly filteredCourses = computed(() => {
    return this.courses.value().filter(course => {
      if (
        course.courseNumber > 500 ||
        course.title.includes('Practicum') ||
        course.title.includes('Capstone')
      ) {
        return false;
      }

      return (
        this.selectedCourseLevel().includes(Math.floor(course.courseNumber / 100) * 100) &&
        this.selectedDepartments().includes(course.department)
      );
    });
  });
}
