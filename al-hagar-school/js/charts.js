(function (HJ) {
  'use strict';
  const instances = new Set();
  const colors = HJ.config.CHART_COLORS;
  let centerPluginRegistered = false;
  function init() {
    if (!window.Chart) return false;
    window.Chart.defaults.font.family = 'Tajawal, Cairo, sans-serif';
    window.Chart.defaults.color = '#4B5563';
    window.Chart.defaults.locale = 'ar-EG';
    window.Chart.defaults.plugins.tooltip.callbacks.label = (context) => (context.dataset.label ? context.dataset.label + ': ' : '') + HJ.utils.formatNumber(context.parsed.y == null ? context.parsed : context.parsed.y);
    window.Chart.defaults.responsive = true;
    window.Chart.defaults.maintainAspectRatio = false;
    window.Chart.defaults.plugins.legend.rtl = true;
    window.Chart.defaults.plugins.tooltip.rtl = true;
    if (!centerPluginRegistered) { window.Chart.register({id:'hjCenterText',afterDraw(chart){const text=chart.options.plugins&&chart.options.plugins.centerText&&chart.options.plugins.centerText.text;if(!text)return;const area=chart.chartArea,ctx=chart.ctx;ctx.save();ctx.font='bold 22px Tajawal, sans-serif';ctx.fillStyle='#4C1D95';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,(area.left+area.right)/2,(area.top+area.bottom)/2);ctx.restore();}});centerPluginRegistered=true; }
    window.Chart.defaults.animation = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : { duration: 350 };
    return true;
  }
  function base(options) { return Object.assign({ responsive:true, maintainAspectRatio:false, plugins:{legend:{rtl:true,position:'bottom'},tooltip:{rtl:true}}, scales:{x:{ticks:{maxRotation:0}},y:{beginAtZero:true,ticks:{precision:0}}} }, options || {}); }
  function create(canvas, config) {
    if (!canvas) return null;
    if (!window.Chart) { const holder=canvas.parentElement,labels=(config.data&&config.data.labels)||[],sets=(config.data&&config.data.datasets)||[];if(holder){const head='<tr><th class="p-2 text-right">الفئة</th>'+sets.map((s)=>'<th class="p-2 text-right">'+HJ.utils.escapeHTML(s.label||'القيمة')+'</th>').join('')+'</tr>';const body=labels.map((label,i)=>'<tr class="border-t"><td class="p-2">'+HJ.utils.escapeHTML(label)+'</td>'+sets.map((s)=>'<td class="p-2">'+HJ.utils.formatNumber((s.data||[])[i]||0)+'</td>').join('')+'</tr>').join('');holder.innerHTML='<p class="mb-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">تعذر تحميل Chart.js؛ يعرض الجدول البيانات بدلًا من الرسم.</p><div class="overflow-x-auto"><table class="w-full text-sm">'+head+body+'</table></div>';}return null; }
    Array.from(instances).filter((chart)=>chart.canvas===canvas).forEach((chart)=>{chart.destroy();instances.delete(chart);});
    const chart = new window.Chart(canvas, config); instances.add(chart); return chart;
  }
  function line(canvas, data, opts) { return create(canvas,{type:'line',data:{labels:data.labels,datasets:data.datasets.map((d,i)=>Object.assign({borderColor:colors[i%colors.length],backgroundColor:colors[i%colors.length]+'22',fill:true,tension:.3,pointRadius:2},d))},options:base(opts)}); }
  function bar(canvas, data, opts) { return create(canvas,{type:'bar',data:{labels:data.labels,datasets:data.datasets.map((d,i)=>Object.assign({backgroundColor:colors[i%colors.length]},d))},options:base(Object.assign({scales:{x:{stacked:Boolean(data.stacked)},y:{stacked:Boolean(data.stacked),beginAtZero:true,ticks:{precision:0}}}},opts||{}))}); }
  function doughnut(canvas, data, opts) { const total=(data.data||[]).reduce((a,b)=>a+Number(b||0),0);return create(canvas,{type:'doughnut',data:{labels:data.labels,datasets:[{data:data.data,backgroundColor:data.colors||colors,borderWidth:2,borderColor:'#fff'}]},options:base(Object.assign({cutout:'68%',plugins:{legend:{rtl:true,position:'bottom'},tooltip:{rtl:true},centerText:{text:String(total)}}},opts||{}))}); }
  function radar(canvas,data,opts){return create(canvas,{type:'radar',data:{labels:data.labels,datasets:data.datasets},options:base(opts)});}
  function destroyAll() { instances.forEach((chart) => chart.destroy()); instances.clear(); }
  HJ.charts = { init, create, line, bar, doughnut, radar, destroyAll };
})(window.HJ);
