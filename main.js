class Student {
  #grades;
  #attendance;

  constructor(id, name, grades, attendance) {
    if (!name || name.trim() === "") {
      throw new Error("يرجى إدخال اسم الطالب.");
    }

    this.id = id;
    this.name = name.trim();
    this.grades = grades;
    this.attendance = attendance;
  }

  set grades(values) {
    if (!Array.isArray(values) || values.length !== 3) {
      throw new Error("يجب إدخال درجات ثلاث مواد.");
    }

    const validatedGrades = values.map((grade, index) => {
      if (grade === "" || grade === null || grade === undefined || Number.isNaN(Number(grade))) {
        throw new Error(`درجة المادة (${index + 1}) لا يمكن أن تكون فارغة.`);
      }

      const num = Number(grade);
      if (num < 0 || num > 100) {
        throw new Error(`درجة المادة (${index + 1}) يجب أن تكون بين 0 و 100.`);
      }

      return num;
    });

    this.#grades = validatedGrades;
  }

  get grades() {
    return this.#grades;
  }

  set attendance(value) {
    if (value === "" || value === null || value === undefined || Number.isNaN(Number(value))) {
      throw new Error("نسبة الحضور لا يمكن أن تكون فارغة.");
    }

    const num = Number(value);
    if (num < 0 || num > 100) {
      throw new Error("نسبة الحضور يجب أن تكون بين 0 و 100.");
    }

    this.#attendance = num;
  }

  get attendance() {
    return this.#attendance;
  }

  calculateAverage() {
    const totalSum = this.#grades.reduce((accumulator, currentGrade) => accumulator + currentGrade, 0);
    return totalSum / this.#grades.length;
  }

  getGradeLetter(average) {
    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    if (average >= 50) return "E";
    return "F";
  }

  getStatus(average) {
    if (average >= 50 && this.#attendance >= 75) {
      return "ناجح";
    } else {
      return "يحتاج مراجعة";
    }
  }
}

const studentsList = [];
let nextStudentId = 101;

const studentNameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");

const addStudentBtn = document.getElementById("addStudentBtn");
const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");
const studentsListBox = document.getElementById("studentsListBox");
const reportBox = document.getElementById("reportBox");

addStudentBtn.onclick = function () {
  errorBox.classList.add("d-none");
  errorBox.textContent = "";

  try {
    const student = new Student(
      nextStudentId,
      studentNameInput.value,
      [grade1Input.value, grade2Input.value, grade3Input.value],
      attendanceInput.value
    );

    nextStudentId++;
    studentsList.push(student);

    const avg = student.calculateAverage();
    const letter = student.getGradeLetter(avg);
    const status = student.getStatus(avg);

    studentsListBox.innerHTML += `
      <div class="border rounded p-2 mb-2">
        <strong>الاسم:</strong> ${student.name} |
        <strong>المتوسط:</strong> ${avg.toFixed(2)} |
        <strong>التقدير:</strong> ${letter} |
        <strong>الحالة:</strong> ${status} |
        <strong>الحضور:</strong> ${student.attendance}%
      </div>
    `;

    studentNameInput.value = "";
    grade1Input.value = "";
    grade2Input.value = "";
    grade3Input.value = "";
    attendanceInput.value = "";
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.classList.remove("d-none");
  }
};

mercyBtn.onclick = function () {
  const strugglingStudents = studentsList.filter((student) => {
    const avg = student.calculateAverage();
    return avg >= 40 && avg <= 49;
  });

  if (strugglingStudents.length === 0) {
    reportBox.innerHTML = `<p class="mb-0">لا يوجد طلاب متعثرون (متوسطهم بين 40 و 49) لتطبيق الرأفة.</p>`;
    return;
  }

  const boostedAverages = strugglingStudents.map((student) => {
    return {
      name: student.name,
      newAverage: student.calculateAverage() + 5
    };
  });

  const totalBoostedAverage = boostedAverages.reduce((sum, item) => sum + item.newAverage, 0);
  const averageAfterMercy = totalBoostedAverage / boostedAverages.length;

  const namesText = boostedAverages
    .map((item) => `${item.name} (${item.newAverage.toFixed(2)})`)
    .join(" - ");

  reportBox.innerHTML = `
    <p><strong>عدد الطلاب المتعثرين:</strong> ${boostedAverages.length}</p>
    <p><strong>أسماء الطلاب بعد إضافة 5 درجات للمتوسط:</strong> ${namesText}</p>
    <p class="mb-0"><strong>المتوسط العام لدرجاتهم بعد التعديل:</strong> ${averageAfterMercy.toFixed(2)}</p>
  `;
};
