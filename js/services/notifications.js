(function (HJ) {
  'use strict';
  function all(user){const data=HJ.storage.read('database',{}),u=user||HJ.auth.current();return (data.notifications||[]).filter((n)=>{if(n.userId&&n.userId===u.id)return true;if(n.userRole&&n.userRole!==u.role)return false;if(u.role==='student'&&n.studentId&&n.studentId!==u.studentId)return false;if(u.role==='parent'&&n.studentId&&!(u.childrenIds||[]).includes(n.studentId))return false;return !n.userRole||n.userRole===u.role;}).map((n)=>Object.assign({},n));}
  function unread(user){return all(user).filter((n)=>!n.read).length;}
  function markRead(id){const data=HJ.storage.read('database',{}),u=HJ.auth.current(),item=(data.notifications||[]).find((n)=>n.id===id&&(!n.userId||n.userId===u.id||n.userRole===u.role));if(!item)throw new HJ.errors.NotFoundError('notifications',id);item.read=true;HJ.storage.write('database',data);HJ.events.emit(HJ.config.EVENTS.NOTIFICATION_NEW,{id,read:true});}
  function markAll(){const data=HJ.storage.read('database',{}),u=HJ.auth.current();(data.notifications||[]).forEach((n)=>{if(!n.userRole||n.userRole===u.role||n.userId===u.id)n.read=true;});HJ.storage.write('database',data);}
  function create(input){const data=HJ.storage.read('database',{});const item=Object.assign({id:HJ.utils.uid('ntf_'),read:false,date:new Date().toISOString().slice(0,10),level:'normal'},input);data.notifications=data.notifications||[];data.notifications.unshift(item);HJ.storage.write('database',data);HJ.events.emit(HJ.config.EVENTS.NOTIFICATION_NEW,item);return Object.assign({},item);}
  HJ.services.notifications={all,unread,markRead,markAll,create};
})(window.HJ);
