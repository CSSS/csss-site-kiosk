import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SfuCourseOutlinesService } from '../../api/sfu-course-outlines/sfu-course-outlines.service';

@Component({
  selector: 'ksk-class-lookup-screen',
  imports: [FormsModule, UpperCasePipe],
  templateUrl: './class-lookup.screen.html',
  styleUrl: './class-lookup.screen.scss'
})
export class ClassLookupComponent {
  sfuCoursesService = inject(SfuCourseOutlinesService);

  courses = this.sfuCoursesService.courses;
}
