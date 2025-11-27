
//визначення базових типів

type DayofWeek = "Monday"| "Tuesday"| "Wednesday"|"Thursday"|"Friday"
type TimeSlot = "8:00-:930"|"9:45-11:15"|"11:45-13:20"|"13:30-15:05"
type CourseType = "Lecture"|"Seminar"|"Lab"|"Practice"

//створення основних структур

type Professor = {
    id: number;
    name: string;
    department: string;
}

type Classroom = {
    room_number: string;
    capacity: number;
    hasProjector: boolean;
}

type Course = {
    id: number;
    name: string;
    type: CourseType;
}

type Lesson = {
    courseid: number;
    professorid: number;
    classroomNumber: string;
    dayOfWeek: DayofWeek;
    timeSlot: TimeSlot;
}

//массиви даних

let professors: Professor[]
let classrooms: Classroom[]
let courses: Course[]
let schedule: Lesson[]

function addProfessor(professor: Professor): void {
    professors.push(professor);
}
function addLesson(lesson: Lesson, schedule: Lesson[]): boolean {
    //перевірка на конфліктність доданого уроку
    const conflict = schedule.some(existing =>
        existing.dayOfWeek === lesson.dayOfWeek &&
        existing.timeSlot === lesson.timeSlot &&
        (
            existing.classroomNumber === lesson.classroomNumber || 
            existing.professorid === lesson.professorid
        )
    );

    if (conflict) {
        return false;  // перевірка не пройдена
    }

    schedule.push(lesson);
    return true;       // преврка пройдена і урок додано
}

//Функції пошуку та фільтрації:

function findAvailiableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayofWeek): string[] {
    let result: Lesson[] = schedule//копіюємо масив з розкладом
    return result.filter(lesson => 
            lesson.dayOfWeek === dayOfWeek && //фільтрація за днем та часом
            lesson.timeSlot === timeSlot).map(lesson => lesson.classroomNumber) //виводимо назви
}

function getProfessorSchedule(professorId: number): Lesson[] {
    let result: Lesson[] = schedule//копіюємо масив з розкладом
    return result.filter(lesson => 
            lesson.professorid === professorId)
}

//Обробка конфліктів та валідація:

type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

function validateLesson(lesson: Lesson): ScheduleConflict | null {
    // Перевірка: викладач вже має заняття в цей час
    const professorConflict = schedule.find(existing =>
        existing.professorid === lesson.professorid &&
        existing.dayOfWeek === lesson.dayOfWeek &&
        existing.timeSlot === lesson.timeSlot
    );

    if (professorConflict) {
        return {
            type: "ProfessorConflict",
            lessonDetails: professorConflict
        };
    }

    // Перевірка: аудиторія вже зайнята в цей час
    const classroomConflict = schedule.find(existing =>
        existing.classroomNumber === lesson.classroomNumber &&
        existing.dayOfWeek === lesson.dayOfWeek &&
        existing.timeSlot === lesson.timeSlot
    );

    if (classroomConflict) {
        return {
            type: "ClassroomConflict",
            lessonDetails: classroomConflict
        };
    }

    // Конфліктів немає
    return null;
}

//Аналіз та звіти

function getClassroomUtilization(classroomNumber: string): number {
    // Кількість зайнятих слотів у цій аудиторії
    const occupiedSlots = schedule.filter(
        lesson => lesson.classroomNumber === classroomNumber
    ).length;

    // Загальна кількість можливих таймслотів: 5 днів × 4 слота
    const total_slots = 5 * 4;

    // Відсоток використання
    return (occupiedSlots / total_slots) * 100;
}

function getMostPopularCourseType(): CourseType {
    //рахуємо наявні уроки
    const typeCount: Record<CourseType, number> = {
        Lecture: 0,
        Practice: 0,
        Seminar: 0,
        Lab: 0
    };

    for (const lesson of schedule) {
        const course = courses.find(c => c.id === lesson.courseid);
        if (course) {
            typeCount[course.type]++;
        }
    }

    // Знаходимо тип з найбільшим значенням
    let mostPopular: CourseType = "Lecture"; // за замовченням
    let maxCount = 0;

    for (const type in typeCount) {
        const t = type as CourseType;
        if (typeCount[t] > maxCount) {
            maxCount = typeCount[t];
            mostPopular = t;
        }
    }

    return mostPopular;
}

//Модифікація даних:

function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lesson = schedule.find(l => l.courseid === lessonId);
    if (!lesson) return false;

    //перевірити чи аудиторія вільна в цей час
    const conflict = schedule.some(existing =>
        existing.classroomNumber === newClassroomNumber &&
        existing.dayOfWeek === lesson.dayOfWeek &&
        existing.timeSlot === lesson.timeSlot &&
        existing !== lesson  // не порівнюємо з самим собою
    );

    if (conflict) {
        return false; // аудиторія зайнята
    }

    //немає конфліктів —> змінюємо аудиторію
    lesson.classroomNumber = newClassroomNumber;
    return true;
}

function cancelLesson(lessonId: number): void {
    if (lessonId !== -1) {
        schedule.splice(lessonId, 1);
    }
}
