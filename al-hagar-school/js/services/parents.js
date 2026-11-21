(function (HJ) {
  'use strict';
  function db(){return HJ.storage.read('database',{});} function admin(){if(!HJ.auth.current()||HJ.auth.current().role!=='admin')throw new HJ.errors.PermissionError('parents.update');}
  function list(){return (db().parents||[]).map((p)=>Object.assign({},p,{childrenIds:(p.childrenIds||[]).slice()}));}
  function link(parentId,studentId){admin();const data=db(),parent=data.parents.find((p)=>p.id===parentId),student=data.students.find((s)=>s.id===studentId);if(!parent||!student)throw new HJ.errors.NotFoundError('parents',parentId);if(student.parentId&&student.parentId!==parentId){const old=data.parents.find((p)=>p.id===student.parentId);if(old)old.childrenIds=(old.childrenIds||[]).filter((id)=>id!==studentId);}parent.childrenIds=parent.childrenIds||[];if(!parent.childrenIds.includes(studentId))parent.childrenIds.push(studentId);student.parentId=parentId;HJ.storage.write('database',data);HJ.services.activity.log('link','parent',parentId+' → '+studentId);return Object.assign({},parent);}
  function unlink(parentId,studentId){admin();const data=db(),parent=data.parents.find((p)=>p.id===parentId);if(!parent)throw new HJ.errors.NotFoundError('parents',parentId);parent.childrenIds=(parent.childrenIds||[]).filter((id)=>id!==studentId);const student=data.students.find((s)=>s.id===studentId);if(student&&student.parentId===parentId)student.parentId=null;HJ.storage.write('database',data);HJ.services.activity.log('unlink','parent',parentId+' → '+studentId);}
  HJ.services.parents={list,link,unlink};
})(window.HJ);
