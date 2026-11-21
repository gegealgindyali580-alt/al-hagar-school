(function (HJ) {
  'use strict';
  const N = HJ.seedData;
  const DEMO_SALT = {
    admin: 'hagar-demo-salt-admin-v2',
    teacher1: 'hagar-demo-salt-teacher1-v2',
    student1: 'hagar-demo-salt-student1-v2',
    parent1: 'hagar-demo-salt-parent1-v2'
  };
  const DEMO_HASH = {
    admin: '7990ac6d89d51bb13635c8ee7dda97d8e0f8d8c7c183e77baa1eaa6d919ea518',
    teacher1: '068163b2fc3818980240d85c34155d163590e711d882ccd8a43b75d59a995883',
    student1: 'e2c12e70a1fcdbe66a32e4d5a4320ba5fa51f74c2424242ea226c8d2aeeabdd2',
    parent1: 'd3d4e772868b58656b6a2b5beb7daada87957e49ab337bc9d2441e367b1b352d'
  };
  function random(seed) {
    let value = seed >>> 0;
    return function () {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }
  function pick(list, rand) { return list[Math.floor(rand() * list.length)]; }
  function id(prefix, number) { return prefix + String(number).padStart(5, '0'); }
  function dateKey(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }
  function schoolDates(count) {
    const dates = [];
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);
    while (dates.length < count) {
      if (HJ.config.SCHOOL_DAYS.includes(cursor.getDay())) dates.unshift(new Date(cursor));
      cursor.setDate(cursor.getDate() - 1);
    }
    return dates;
  }
  function makeClasses() {
    const specs = [
      [1, 'general', 4], [2, 'sci', 3], [2, 'lit', 2], [3, 'sci', 3], [3, 'lit', 2]
    ];
    const result = [];
    specs.forEach(([grade, track, count]) => {
      for (let index = 0; index < count; index += 1) {
        const letter = String.fromCharCode(65 + index);
        result.push({ id: 'cls_' + grade + track + '_' + letter.toLowerCase(), grade, track, section: letter, capacity: 45, studentIds: [] });
      }
    });
    return result;
  }
  function makeStudentName(rand) {
    return [pick(N.first, rand), pick(N.middle, rand), pick(N.middle, rand), pick(N.family, rand)].join(' ');
  }
  function makeStudents(classes, rand) {
    const students = [];
    for (let index = 1; index <= 380; index += 1) {
      const classIndex = (index - 1) % classes.length;
      const cls = classes[classIndex];
      const gender = rand() < 0.51 ? 'M' : 'F';
      const student = {
        id: id('stu_', index), name: makeStudentName(rand), gender,
        nationalId: '3' + String(1000000000000 + index).slice(0, 13),
        status: 'active', classId: cls.id, grade: cls.grade, track: cls.track,
        parentId: id('par_', Math.ceil(index / 1.2)), enrollmentDate: dateKey(new Date(new Date().getFullYear(), 8, 15))
      };
      students.push(student);
      cls.studentIds.push(student.id);
    }
    return students;
  }
  function makeTeachers(rand, classes) {
    const subjects = ['اللغة العربية', 'اللغة الإنجليزية', 'الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'التاريخ', 'الجغرافيا', 'الفلسفة والمنطق', 'لغة أجنبية ثانية'];
    return Array.from({ length: 18 }, (_, index) => ({
      id: id('tch_', index + 1), name: makeStudentName(rand), subject: subjects[index % subjects.length],
      status: 'active', classIds: classes.filter((_, classIndex) => classIndex % 6 === index % 6).map((cls) => cls.id),
      phone: '010' + String(10000000 + index).slice(-8)
    }));
  }
  function makeParents(students, rand) {
    const parents = [];
    const familyMap = new Map();
    students.forEach((student, index) => {
      const familyNumber = Math.ceil((index + 1) / 1.2);
      const parentId = id('par_', familyNumber);
      student.parentId = parentId;
      if (!familyMap.has(parentId)) familyMap.set(parentId, { id: parentId, name: makeStudentName(rand), childrenIds: [], phone: '011' + String(20000000 + familyNumber).slice(-8) });
      familyMap.get(parentId).childrenIds.push(student.id);
    });
    familyMap.forEach((parent) => parents.push(parent));
    return parents;
  }
  function makeAttendance(students, dates, rand) {
    const records = [];
    dates.forEach((date) => students.forEach((student) => {
      const roll = rand();
      const status = roll < 0.925 ? 'P' : roll < 0.945 ? 'L' : roll < 0.975 ? 'E' : 'A';
      records.push({ id: 'att_' + dateKey(date).replace(/-/g, '') + '_' + student.id, date: dateKey(date), studentId: student.id, classId: student.classId, status });
    }));
    return records;
  }
  function makeGrades(students, rand) {
    const subjects = ['العربية', 'الإنجليزية', 'الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء'];
    return students.flatMap((student, index) => subjects.map((subject, subjectIndex) => ({
      id: 'grd_' + student.id + '_' + subjectIndex, studentId: student.id, subject,
      term: 1, score: Math.round(50 + rand() * 50), maxScore: 100,
      status: 'approved', grade: student.grade, track: student.track
    })));
  }
  function makeFinance(students, rand) {
    const invoices = students.map((student, index) => ({
      id: id('inv_', index + 1), studentId: student.id, amount: 1800,
      paid: Math.round(rand() * 1800 / 100) * 100, status: 'open', dueDate: dateKey(new Date(new Date().getFullYear(), 10, 30))
    }));
    const expenses = Array.from({ length: 36 }, (_, index) => ({
      id: id('exp_', index + 1), category: ['maintenance','utilities','stationery','activities','purchases','other'][index % 6],
      amount: 500 + Math.round(rand() * 9500), date: dateKey(new Date(new Date().getFullYear(), new Date().getMonth() - Math.floor(index / 6), 3 + (index % 20)))
    }));
    const payments = invoices.filter((invoice) => invoice.paid > 0).map((invoice, index) => ({
      id: id('pay_', index + 1), invoiceId: invoice.id, studentId: invoice.studentId,
      amount: invoice.paid, method: ['cash','bank','fawry','cheque'][index % 4], date: dateKey(new Date())
    }));
    return { invoices, expenses, payments, feePlans: [{ id: 'fee_default', name: 'المصروفات الدراسية', amount: 1800, year: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1) }] };
  }
  function makeLibrary(rand) {
    const books = Array.from({ length: 80 }, (_, index) => ({
      id: id('bk_', index + 1), title: ['رحلات في العلوم','الأدب العربي','مبادئ الرياضيات','تاريخ مصر','القراءة الممتعة','الفيزياء حولنا'][index % 6] + ' ' + (index + 1),
      author: makeStudentName(rand), category: ['science','literature','history','reference'][index % 4], copies: 2 + Math.floor(rand() * 5)
    }));
    const loans = Array.from({ length: 45 }, (_, index) => ({
      id: id('ln_', index + 1), bookId: books[index % books.length].id, studentId: id('stu_', index + 1),
      loanDate: dateKey(new Date(Date.now() - (index % 25) * 86400000)),
      dueDate: dateKey(new Date(Date.now() + ((index % 15) - 5) * 86400000)),
      status: index % 7 === 0 ? 'overdue' : 'active'
    }));
    return { books, loans };
  }
  function makeUsers(students, teachers, parents) {
    const student = students[0];
    const parent = parents.find((item) => item.childrenIds.includes(student.id));
    return [
      { id: 'usr_admin01', username: 'admin', name: 'مدير المدرسة', role: 'admin', salt: DEMO_SALT.admin, passwordHash: DEMO_HASH.admin, active: true },
      { id: 'usr_teacher1', username: 'teacher1', name: teachers[0].name, role: 'teacher', salt: DEMO_SALT.teacher1, passwordHash: DEMO_HASH.teacher1, active: true, classIds: teachers[0].classIds },
      { id: 'usr_student1', username: 'student1', name: student.name, role: 'student', salt: DEMO_SALT.student1, passwordHash: DEMO_HASH.student1, active: true, studentId: student.id },
      { id: 'usr_parent1', username: 'parent1', name: parent.name, role: 'parent', salt: DEMO_SALT.parent1, passwordHash: DEMO_HASH.parent1, active: true, childrenIds: parent.childrenIds }
    ];
  }
  function build() {
    const rand = random(20261121);
    const classes = makeClasses();
    const students = makeStudents(classes, rand);
    const teachers = makeTeachers(rand, classes);
    const parents = makeParents(students, rand);
    const dates = schoolDates(60);
    const attendance = makeAttendance(students, dates, rand);
    const grades = makeGrades(students, rand);
    const finance = makeFinance(students, rand);
    const library = makeLibrary(rand);
    const announcements = [
      ['exam','جدول امتحانات الشهر متاح للطلاب'],
      ['registration','متابعة تحديث بيانات الطلاب'],
      ['holiday','تنويه بشأن مواعيد الإجازة القادمة'],
      ['finance','تذكير بموعد سداد المصروفات الدراسية'],
      ['general','بدء الأنشطة المدرسية لهذا الفصل'],
      ['urgent','يرجى مراجعة الإعلانات الرسمية للمدرسة']
    ].map(([type, title], index) => ({
      id: id('ann_', index + 1), type, title,
      date: dateKey(new Date(Date.now() + index * 86400000)),
      audience: ['admin','teacher','student','parent'], published: true
    }));
    const notifications = Array.from({ length: 24 }, (_, index) => ({
      id: id('ntf_', index + 1), userRole: ['admin','teacher','student','parent'][index % 4],
      title: ['تم تحديث بيانات الفصل','إعلان مدرسي جديد','تم تسجيل الحضور','تذكير بمتابعة الدرجات'][index % 4],
      read: index % 3 === 0, date: dateKey(new Date(Date.now() - index * 3600000))
    }));
    const today = attendance.filter((item) => item.date === dateKey(new Date()));
    const count = (status) => today.filter((item) => item.status === status).length;
    return {
      users: makeUsers(students, teachers, parents), students, teachers, parents, classes,
      attendance, attendanceDates: dates.map(dateKey), grades, finance,
      books: library.books, loans: library.loans, announcements, notifications,
      attendanceToday: { date: dateKey(new Date()), present: count('P'), late: count('L'), excused: count('E'), absent: count('A'), recorded: true },
      demoMode: true, schemaVersion: HJ.config.SCHEMA_VERSION
    };
  }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function load() {
    if (HJ.storage.read('database', null)) return false;
    HJ.storage.write('database', build());
    HJ.storage.write('sidebarCollapsed', false);
    return true;
  }
  function reset() { HJ.storage.remove('database'); return load(); }
  HJ.seed = { load, reset, snapshot: build };
})(window.HJ);
