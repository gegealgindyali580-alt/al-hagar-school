(function (HJ) {
  'use strict';
  const { ValidationError } = HJ.errors;
  function username(value) { return /^[a-zA-Z0-9_]{3,30}$/.test(String(value || '')); }
  function password(value) { return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(value || '')); }
  function phone(value) { return /^01[0125][0-9]{8}$/.test(String(value || '').replace(/[\s-]/g, '')); }
  function nationalId(value) {
    const id = String(value || '').trim();
    if (!/^[23]\d{13}$/.test(id)) return false;
    const century = id[0] === '2' ? 1900 : 2000;
    const year = century + Number(id.slice(1, 3));
    const month = Number(id.slice(3, 5));
    const day = Number(id.slice(5, 7));
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && Number(id.slice(7, 9)) >= 1 && Number(id.slice(7, 9)) <= 35;
  }
  function nationalIdData(value) {
    if (!nationalId(value)) throw new ValidationError({ nationalId: 'common.invalidNationalId' });
    const id = String(value);
    const year = (id[0] === '2' ? 1900 : 2000) + Number(id.slice(1, 3));
    const month = id.slice(3, 5), day = id.slice(5, 7);
    return { birthDate: year + '-' + month + '-' + day, gender: Number(id[12]) % 2 ? 'M' : 'F', governorateCode: id.slice(7, 9) };
  }
  function fullName(value) { return String(value || '').trim().split(/\s+/).filter(Boolean).length >= 4; }
  function required(value) { return String(value == null ? '' : value).trim().length > 0; }
  function assert(fields) {
    const errors = {};
    Object.keys(fields || {}).forEach((key) => { if (!fields[key]) errors[key] = 'common.validation'; });
    if (Object.keys(errors).length) throw new ValidationError(errors);
    return true;
  }
  HJ.validators = { username, password, phone, nationalId, nationalIdData, fullName, required, assert };
})(window.HJ);
