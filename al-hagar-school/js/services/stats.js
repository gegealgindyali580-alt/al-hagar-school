(function (HJ) {
  'use strict';
  function db() { return HJ.storage.read('database', {}); }
  function dateKey(date) { return [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-'); }
  function attendanceTrend(range, classIds) {
    const data = db(), days = range === 'term' ? 60 : (range || 7);
    const end = new Date(); end.setHours(12,0,0,0);
    const labels = [], present = [], absent = [], excused = [], late = [];
    for (let i=days-1;i>=0;i--) {
      const d = new Date(end); d.setDate(d.getDate()-i); const key = dateKey(d);
      const rows = (data.attendance || []).filter((r) => r.date === key && (!classIds || classIds.includes(r.classId)));
      labels.push(key.slice(5));
      present.push(rows.filter((r) => r.status === 'P').length);
      absent.push(rows.filter((r) => r.status === 'A').length);
      excused.push(rows.filter((r) => r.status === 'E').length);
      late.push(rows.filter((r) => r.status === 'L').length);
    }
    const totals=present.map((v,i)=>v+absent[i]+excused[i]+late[i]);const pct=(arr)=>arr.map((v,i)=>totals[i]?Math.round(v/totals[i]*100):0);return { labels, present, absent, excused, late, presentPct:pct(present.map((v,i)=>v+late[i])), absentPct:pct(absent), excusedPct:pct(excused), latePct:pct(late) };
  }
  function studentsByClass(classIds) {
    const data = db();
    return (data.classes || []).filter((cls)=>!classIds || classIds.includes(cls.id)).map((cls) => {
      const students = (data.students || []).filter((s) => s.classId === cls.id && s.status === 'active');
      return { id:cls.id, label: 'الصف ' + cls.grade + ' · ' + (cls.track === 'general' ? 'عام' : cls.track === 'sci' ? 'علمي' : 'أدبي') + ' · ' + cls.section, male: students.filter((s) => s.gender === 'M').length, female: students.filter((s) => s.gender === 'F').length, total: students.length };
    });
  }
  function genderSplit(classIds) { const students = (db().students || []).filter((s) => s.status === 'active' && (!classIds || classIds.includes(s.classId))); return { male: students.filter((s) => s.gender === 'M').length, female: students.filter((s) => s.gender === 'F').length, total: students.length }; }
  function gradeStats() { const students = db().students || []; return [1,2,3].map((grade) => ({ grade, general: students.filter((s)=>s.grade===grade && s.track==='general' && s.status==='active').length, science: students.filter((s)=>s.grade===grade && s.track==='sci' && s.status==='active').length, literary: students.filter((s)=>s.grade===grade && s.track==='lit' && s.status==='active').length })); }
  function overview() { const data=db(), today=dateKey(new Date()), rows=(data.attendance||[]).filter((r)=>r.date===today); return { students:(data.students||[]).filter((s)=>s.status==='active').length, teachers:(data.teachers||[]).filter((t)=>t.status==='active').length, classes:(data.classes||[]).length, present:rows.filter((r)=>r.status==='P').length, late:rows.filter((r)=>r.status==='L').length, absent:rows.filter((r)=>r.status==='A').length, excused:rows.filter((r)=>r.status==='E').length, recorded:rows.length>0 }; }
  function personal(user,childId){const data=db(),id=user.role==='student'?user.studentId:(childId&&(user.childrenIds||[]).includes(childId)?childId:(user.childrenIds||[])[0]),student=(data.students||[]).find((s)=>s.id===id),today=dateKey(new Date());if(student){const records=(data.attendance||[]).filter((r)=>r.studentId===id),grades=(data.grades||[]).filter((g)=>g.studentId===id),invoice=(data.finance&&data.finance.invoices||[]).find((x)=>x.studentId===id);const attended=records.filter((r)=>r.status==='P'||r.status==='L').length;const recent=records.slice().sort((a,b)=>a.date.localeCompare(b.date)).slice(-30),bySubject={};grades.forEach((g)=>{bySubject[g.subject]=bySubject[g.subject]||[];bySubject[g.subject].push(Number(g.score||0));});return {student,attendanceRate:records.length?Math.round(attended/records.length*100):0,absent:records.filter((r)=>r.status==='A').length,excused:records.filter((r)=>r.status==='E').length,average:grades.length?Math.round(grades.reduce((a,g)=>a+Number(g.score||0),0)/grades.length):0,dues:invoice?Math.max(0,invoice.amount-invoice.paid):0,records,grades,attendanceLabels:recent.map((r)=>r.date.slice(5)),attendanceValues:recent.map((r)=>(r.status==='P'||r.status==='L')?100:0),gradeLabels:Object.keys(bySubject),gradeValues:Object.keys(bySubject).map((key)=>Math.round(bySubject[key].reduce((a,b)=>a+b,0)/bySubject[key].length))};}const classes=user.classIds||[],students=(data.students||[]).filter((s)=>classes.includes(s.classId)&&s.status==='active'),rows=(data.attendance||[]).filter((r)=>r.date===today&&classes.includes(r.classId)),teacher=(data.teachers||[]).find((t)=>t.name===user.name);return {students:students.length,classes:classes.length,attendanceRate:rows.length?Math.round(rows.filter((r)=>r.status==='P'||r.status==='L').length/rows.length*100):0,workload:teacher&&teacher.weeklyLoad||0,rows};}
  HJ.services.stats = { attendanceTrend, studentsByClass, genderSplit, gradeStats, overview, personal };
})(window.HJ);
