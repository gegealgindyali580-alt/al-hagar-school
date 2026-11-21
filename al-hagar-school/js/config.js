(function () {
  'use strict';
  const HJ = (window.HJ = window.HJ || {});
  HJ.version = '2.0.0';
  HJ.strings = {};
  HJ.pages = {};
  HJ.components = {};
  HJ.services = {};
  HJ.config = Object.freeze({
    STORAGE_PREFIX: 'hagar_v2_', SCHEMA_VERSION: 2,
    ROLES: { ADMIN: 'admin', TEACHER: 'teacher', STUDENT: 'student', PARENT: 'parent' },
    STUDENT_STATUS: ['active', 'transferred', 'withdrawn', 'graduated', 'suspended', 'deleted'],
    STAFF_STATUS: ['active', 'leave', 'seconded', 'ended'],
    ATTENDANCE: { PRESENT: 'P', ABSENT: 'A', EXCUSED: 'E', LATE: 'L' },
    GRADE_STATUS: ['draft', 'approved', 'published'],
    GRADE_FLAGS: { ABSENT: 'abs', EXEMPT: 'exm' },
    TRACKS: { GENERAL: 'general', SCIENCE: 'sci', LITERARY: 'lit' },
    LEVELS: [1, 2, 3], GENDER: { MALE: 'M', FEMALE: 'F' },
    TERMS: { FIRST: 1, SECOND: 2 },
    ANN_TYPE: ['exam', 'registration', 'holiday', 'finance', 'general', 'urgent'],
    NOTIFY_LEVEL: ['normal', 'important', 'urgent'],
    PAYMENT_METHOD: ['cash', 'bank', 'fawry', 'cheque'],
    EXPENSE_CATEGORY: ['maintenance', 'utilities', 'stationery', 'activities', 'purchases', 'other'],
    ID_PREFIX: 'usr_ stu_ tch_ par_ cls_ sub_ sch_ att_ grd_ fee_ inv_ pay_ exp_ bk_ ln_ ntf_ ann_ act_ note_',
    DEFAULTS: { idleMinutes: 30, lockMinutes: 5, maxFailed: 5, classCapacity: 45, teacherWorkload: 24, loanDays: 14, loanMax: 3, absenceWarnPct: 10, absenceCriticalPct: 15, photoMaxKB: 120, activityMax: 500, aiTimeoutMs: 60000 },
    CHART_COLORS: ['#4C1D95', '#10B981', '#F59E0B', '#EF4444', '#A78BFA', '#9CA3AF'],
    GENDER_COLORS: { M: '#4C1D95', F: '#A78BFA' },
    EVENTS: { AUTH_LOGIN: 'auth:login', AUTH_LOGOUT: 'auth:logout', ROUTE_CHANGED: 'route:changed', DATA_CHANGED: 'data:changed', ACTIVITY_NEW: 'activity:new', NOTIFICATION_NEW: 'notification:new', SETTINGS_CHANGED: 'settings:changed', CHILD_CHANGED: 'child:changed', STORAGE_WARNING: 'storage:warning' },
    SCHOOL_DAYS: [0, 1, 2, 3, 4]
  });
})();
