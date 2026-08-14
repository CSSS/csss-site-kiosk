export const DEPARTMENTS = ['cmpt', 'macm', 'math'] as const;
export type Department = (typeof DEPARTMENTS)[number];

export type Term = 'fall' | 'spring' | 'summer';
export type ClassType = 'e' | 'n';
export type SectionCode = 'LEC' | 'TUT' | 'LAB' | 'SEM';
export type InstructorRoleCode = 'PI' | 'SI';
export type DeliveryMethod = 'In Person' | 'Distance Education';

/**
 * text: year
 * value: year
 */
export interface Year {
  text: string;
  value: string;
}

/**
 * text: all caps term
 * value: lowercase term
 */
export interface TermResponse {
  text: string;
  value: string;
}

/**
 * text: course code
 * value: course code
 * title: full name of the course
 */
export interface Course {
  text: string;
  value: string;
  title: string;
}

/**
 * text: section code
 * value: section code
 * title: full name of the course
 * classType: `e` for enrollment section, `n` for non-enrollment section
 * associatedClass: the associated class for the section (e.g. lecture for tutorial)
 */
export interface CourseSection {
  text: string;
  value: string;
  title: string;
  classType: ClassType;
  associatedClass: string;
}

/**
 * outlinePath: used to retrieve the details of the course outline
 * deliveryMethod: format of delivery, such as in person or distance education
 * departmentalUgradNotes: notes provided by the department for all undergraduate course outlines
 * designation: the course's WQB designation, if applicable
 * type: `e` for an enrollment section, `n` for a non-enrollment section
 * courseDetails: detailed course information, which may include a weekly syllabus
 * title: course title
 * prerequisites: courses or coursework required to register in the course
 * description: official course description from the Academic Calendar
 * name: full course name, including department, course number, and section
 * dept: department or departments offering the course
 * educationalGoals: term-agnostic learning objectives met by every course offering
 * classNumber: unique identifier for the course section
 * shortNote: note displayed when a third-party application displays the outline in a table
 * number: course number
 * section: course section
 * units: credit units applied to the course
 * corequisites: courses that must be taken concurrently
 * registrarNotes: notes provided by the Registrar for all course outlines
 * gradingNotes: notes related to the grading scheme
 * term: term in which the section is offered
 * notes: general notes about the section
 * degreeLevel: whether the course is undergraduate or graduate level
 */
export interface CourseOutlineInfo {
  outlinePath: string;
  deliveryMethod: DeliveryMethod;
  departmentalUgradNotes: string;
  designation: string;
  type: ClassType;
  courseDetails: string;
  title: string;
  prerequisites: string;
  description: string;
  name: string;
  dept: string;
  educationalGoals: string;
  classNumber: string;
  shortNote: string;
  number: string;
  section: string;
  units: string;
  corequisites: string;
  registrarNotes: string;
  gradingNotes: string;
  term: string;
  notes: string;
  degreeLevel: string;
}

/**
 * description: grading item
 * weight: percentage weight allotted to the grading item
 */
export interface CourseOutlineGrade {
  description: string;
  weight: string;
}

/**
 * name: display name of the instructor
 * lastName: instructor's last name
 * firstName: instructor's first name
 * commonName: instructor's optional common name
 * office: office location
 * officeHours: office hours
 * email: email address
 * phone: phone number
 * roleCode: `PI` for primary instructor, `SI` for secondary instructor
 * profileUrl: link to the instructor's profile
 */
export interface CourseOutlineInstructor {
  name: string;
  lastName: string;
  firstName: string;
  commonName: string;
  office: string;
  officeHours: string;
  email: string;
  phone: string;
  roleCode: InstructorRoleCode;
  profileUrl: string;
}

/**
 * startTime: start time for the course or exam
 * startDate: start date for the course or exam
 * endTime: end time for the course or exam
 * endDate: end date for the course or exam
 * sectionCode: code indicating whether the section is a lecture, tutorial, lab, or seminar
 * isExam: whether the schedule is for an exam
 * days: days on which the course or exam is held
 * campus: campus at which the course or exam is held
 */
export interface CourseOutlineSchedule {
  startTime: string;
  startDate: string;
  endTime: string;
  endDate: string;
  sectionCode: SectionCode;
  isExam: boolean;
  days: string;
  campus: string;
}

/**
 * details: required or recommended text for the course
 */
export interface CourseOutlineText {
  isbn: string;
  details: string;
}

/**
 * info: general information about the course section
 * instructor: instructors teaching the course section
 * courseSchedule: course meeting schedule
 * examSchedule: exam schedule
 * grades: grading items and their weights
 * requiredText: required course texts
 * recommendedText: recommended course texts
 */
export interface CourseOutline {
  info: CourseOutlineInfo;
  instructor: CourseOutlineInstructor[];
  courseSchedule: CourseOutlineSchedule[];
  examSchedule: CourseOutlineSchedule[];
  grades: CourseOutlineGrade[];
  requiredText: CourseOutlineText[];
  recommendedText: CourseOutlineText[];
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
