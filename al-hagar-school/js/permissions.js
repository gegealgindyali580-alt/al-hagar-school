(function (HJ) {
  'use strict';
  const R = HJ.config.ROLES;
  const rules = {
    dashboard: [R.ADMIN, R.TEACHER, R.STUDENT, R.PARENT],
    classes: [R.ADMIN, R.TEACHER, R.STUDENT, R.PARENT],
    students: [R.ADMIN, R.TEACHER],
    teachers: [R.ADMIN, R.TEACHER, R.STUDENT, R.PARENT],
    attendance: [R.ADMIN, R.TEACHER, R.STUDENT, R.PARENT],
    grades: [R.ADMIN, R.TEACHER, R.STUDENT, R.PARENT],
    finance: [R.ADMIN, R.STUDENT, R.PARENT],
    library: [R.ADMIN, R.TEACHER, R.STUDENT, R.PARENT],
    settings: [R.ADMIN, R.TEACHER, R.STUDENT, R.PARENT]
  };
  function can(action, resource, record) {
    const user = HJ.auth && HJ.auth.current();
    if (!user) return false;
    if (user.role === R.ADMIN) return true;
    if (action === 'read' && rules[resource] && rules[resource].includes(user.role)) return true;
    if (action === 'read' && resource === 'finance') return [R.STUDENT, R.PARENT].includes(user.role);
    return false;
  }
  function assert(permission, record) {
    const parts = String(permission || '').split('.');
    if (!can(parts[1] || 'read', parts[0], record)) throw new HJ.errors.PermissionError(permission);
    return true;
  }
  function scope(user) {
    if (!user) return [];
    if (user.role === R.ADMIN) return null;
    if (user.role === R.PARENT) return user.childrenIds || [];
    if (user.role === R.STUDENT) return [user.studentId || user.id];
    return user.classIds || [];
  }
  HJ.permissions = { can, assert, scope, rules };
})(window.HJ);
