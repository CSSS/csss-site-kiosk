import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  TemplateRef,
  viewChild
} from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '@core/modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { Department } from '../../../api/sfu-course-outlines/sfu-course-outline.models';
import {
  CourseSummary,
  DepartmentCourse,
  SfuCourseOutlinesService,
  TermYear
} from '../../../api/sfu-course-outlines/sfu-course-outlines.service';

@Component({
  imports: [],
  selector: 'ksk-course-cards',
  styleUrl: './course-cards.component.scss',
  templateUrl: './course-cards.component.html'
})
export class CourseCardsComponent {
  readonly courses = rxResource({
    params: () => this.term(),
    stream: ({ params }) => this.sfuCoursesService.getCourses(params.year, params.term),
    defaultValue: []
  });

  readonly loading = computed(() => !this.courses.value());

  readonly term = input.required<TermYear>();

  readonly selectedCourseLevels = input.required<number[]>();

  readonly selectedDepartments = input.required<Department[]>();

  readonly openingModal$ = new Subject<void>();

  protected readonly filteredCourses = computed(() => {
    return this.courses.value().filter(course => {
      if (
        course.courseNumber > 500 ||
        course.title.includes('Practicum') ||
        course.title.includes('Capstone')
      ) {
        return false;
      }

      return (
        this.selectedCourseLevels().includes(Math.floor(course.courseNumber / 100) * 100) &&
        this.selectedDepartments().includes(course.department)
      );
    });
  });

  private readonly modalTemplate = viewChild.required<TemplateRef<CourseSummary>>('modal');

  private readonly sfuCoursesService = inject(SfuCourseOutlinesService);

  private readonly modal = inject(ModalService);

  private readonly destroyRef = inject(DestroyRef);

  protected openDetailsModal(course: DepartmentCourse): void {
    // Cancels a modal that's trying to open.
    this.openingModal$.next();

    this.sfuCoursesService
      .getCourseSummary(this.term().year, this.term().term, course)
      .pipe(takeUntil(this.openingModal$), takeUntilDestroyed(this.destroyRef))
      .subscribe(summary => {
        this.modal.open({
          type: 'template',
          title: `${summary.dept} ${summary.courseNumber} \u2014 ${summary.title}`,
          content: this.modalTemplate(),
          context: { summary }
        });
      });
  }
}
