
//enums - студент, курс, семестр, оцінки і факультути
export enum StudentStatus {
    Active = "Active",
    AcademicLeave = "Academic Leave",
    Graduated = "Graduated",
    Expelled = "Expelled",
}

export enum CourseType {
    Mandatory = "Mandatory",
    Opt = "Optional",
    Speci = "Special",
}

export enum Semester {
    FirstSemester = "First",
    SecondSemester = "Second",
}

export enum Grades {
    Excellent = 5,
    Good = 4,
    Satisf= 3,
    Unsatisf = 2,
}

export enum Faculty {
    CS = "Computer_Science",
    Eco = "Economics",
    Law = "Law",
    Engine = "Engineering",
}


//інтерфейси - студент, курс, запис оцінок
export interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number; 
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

export interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

export interface Grade {
    studentId: number;
    courseId: number;
    grade: Grades;
    date: Date;
    semester: Semester;
}

export class UniversityManager {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: Grade[] = [];
    private registrations: Map<number, Set<number>> = new Map(); // studentId -> set(courseId)

    private nextStudentId = 1;
    private nextCourseId = 1;

    //методи для курсів - знаходження і додавання
    public addCourse(course: Omit<Course, "id">): Course {
        const newCourse: Course = { id: this.nextCourseId++, ...course };
        this.courses.push(newCourse);
        return newCourse;
    }

    private findCourse(courseId: number): Course | undefined {
        return this.courses.find((c) => c.id === courseId);
    }
    //метод для знаходження студента
    private findStudent(studentId: number): Student | undefined {
        return this.students.find((s) => s.id === studentId);
    }

    //додавання нового студента з новим id
    public enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = { id: this.nextStudentId++, ...student };
        this.students.push(newStudent);
        //ініціалізуємо порожній набір реєстрацій
        this.registrations.set(newStudent.id, new Set());
        return newStudent;
    }

    //метод реєстрації на курс
    public registerForCourse(studentId: number, courseId: number): void {
        const student = this.findStudent(studentId);
        if (!student) throw new Error(`Student with id ${studentId} not found.`);

        const course = this.findCourse(courseId);
        if (!course) throw new Error(`Course with id ${courseId} not found.`);

        //статус
        if (student.status !== StudentStatus.Active) {
            throw new Error(
                `Student ${studentId} has status ${student.status} and cannot register for courses unless Active.`
            );
        }

        //факультет
        if (student.faculty !== course.faculty) {
            throw new Error(
                `Student faculty (${student.faculty}) does not match course faculty (${course.faculty}).`
            );
        }

        //перевірка кількості зареєстрованих на курс
        const currentCount = this.countRegisteredToCourse(courseId);
        if (currentCount >= course.maxStudents) {
            throw new Error(`Course ${courseId} is full (max ${course.maxStudents}).`);
        }

        //додати реєстрацію
        const regSet = this.registrations.get(studentId) ?? new Set<number>();
        if (regSet.has(courseId)) {
            throw new Error(`Student ${studentId} is already registered to course ${courseId}.`);
        }
        regSet.add(courseId);
        this.registrations.set(studentId, regSet);
    }

    //метод підрахунку студентів зареєстравних на курс
    private countRegisteredToCourse(courseId: number): number {
        let count = 0;
        for (const [_, set] of this.registrations.entries()) {
            if (set.has(courseId)) count++;
        }
        return count;
    }

    //метод встановлення оцінки
    public setGrade(studentId: number, courseId: number, grade: Grades, date: Date = new Date(), semester?: Semester): void {
        const student = this.findStudent(studentId);
        if (!student) throw new Error(`Student with id ${studentId} not found.`);
        const course = this.findCourse(courseId);
        if (!course) throw new Error(`Course with id ${courseId} not found.`);

        if (student.status === StudentStatus.Expelled) {
            throw new Error(`Cannot set grade for expelled student ${studentId}.`);
        }

        const regSet = this.registrations.get(studentId);
        if (!regSet || !regSet.has(courseId)) {
            throw new Error(`Student ${studentId} is not registered to course ${courseId}.`);
        }

        const sem = semester ?? course.semester;

        const gradeRecord: Grade = {
            studentId,
            courseId,
            grade,
            date,
            semester: sem,
        };

        this.grades.push(gradeRecord);
    }   

  //метод оновлення статусу студента
  public updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.findStudent(studentId);
        if (!student) throw new Error(`Student with id ${studentId} not found.`);

        const current = student.status;

        //якщо та сама — нічого не робимо
        if (current === newStatus) return;

        //правила переходів
        const allowedTransitions: Record<StudentStatus, StudentStatus[]> = {
        [StudentStatus.Active]: [StudentStatus.AcademicLeave, StudentStatus.Graduated, StudentStatus.Expelled],
        [StudentStatus.AcademicLeave]: [StudentStatus.Active, StudentStatus.Expelled],
        [StudentStatus.Graduated]: [], //за замовчуванням не дозволяємо повернення
        [StudentStatus.Expelled]: [], //не дозволяємо повернення
        };

        const allowed = allowedTransitions[current] ?? [];
        if (!allowed.includes(newStatus)) {
            throw new Error(`Transition from ${current} to ${newStatus} is not allowed.`);
        }

        student.status = newStatus;
    }

    //повернення списку студентів за факультетами
    public getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter((s) => s.faculty === faculty);
    }

    //повернення списку студентів за оцінками
    public getStudentGrades(studentId: number): Grade[] {
        return this.grades.filter((g) => g.studentId === studentId);
    }

    //повернення доступних курсів за факультетом і семестром
    public getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter((c) => {
            if (c.faculty !== faculty) return false;
            if (c.semester !== semester) return false;
            const count = this.countRegisteredToCourse(c.id);
            return count < c.maxStudents;
        });
    }

    //підрахунок середньої оцінки
    public calculateAverageGrade(studentId: number): number {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) return NaN;
        const sum = studentGrades.reduce((acc, r) => acc + r.grade, 0);
        return sum / studentGrades.length;
    }


    //поверенння всіх студентів
    public getAllStudents(): Student[] {
        return [...this.students];
    }

    //повернення всіх курсів
    public getAllCourses(): Course[] {
        return [...this.courses];
    }

    //повернення всіх оцінок
    public getAllGrades(): Grade[] {
        return [...this.grades];
    }
}



const ums = new UniversityManager();

// Додаємо курси
const cs101 = ums.addCourse({
  name: 'Algorithms',
  type: CourseType.Mandatory,
  credits: 4,
  semester: Semester.FirstSemester,
  faculty: Faculty.CS,
  maxStudents: 30
});

// Реєструємо студента
const student = ums.enrollStudent({
  fullName: 'Ivan Petrenko',
  faculty: Faculty.CS,
  year: 2,
  status: StudentStatus.Active,
  enrollmentDate: new Date('2023-09-01'),
  groupNumber: 'CS-21'
});

// Реєструємо на курс
ums.registerForCourse(student.id, cs101.id);

// Ставимо оцінку
ums.setGrade(student.id, cs101.id, Grades.Excellent);

// Отримуємо середній бал
console.log(ums.calculateAverageGrade(student.id));



