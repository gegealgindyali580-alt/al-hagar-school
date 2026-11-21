# speckit.md — المعايير البرمجية الصارمة لمنصة مدرسة الحجر الثانوية المشتركة

> **هذا الملف عقد ملزم.** أي مطوّر أو نموذج ذكاء اصطناعي يعمل على المشروع يقرأه كاملًا قبل كتابة أي سطر ويلتزم به حرفيًا. الهدف: أن يُنفَّذ المشروع بأيدٍ متعددة وكأنه كُتب بيد واحدة، دون تعارض في الكود، وبحيث يعمل على GitHub Pages من أول رفع.

| البند | القيمة |
|---|---|
| المشروع | منصة مدرسة الحجر الثانوية المشتركة |
| الإصدار | speckit 2.0 |
| يكمل | `requirements.md` الإصدار 2.0 |
| يحل محل | `speckit.v1-archived.md` (كُتب لمواصفات مختلفة ولا يُستخدم) |
| تاريخ الوثيقة | 21 نوفمبر 2026 |

---

## 0. كيفية استخدام هذا الملف

### 0.1 كلمات الإلزام
| الكلمة | المعنى |
|---|---|
| **يجب** | إلزامي، ومخالفته خطأ يُرفض به العمل |
| **يُمنع** | محظور تمامًا |
| **يُفضَّل** | الأصل ما لم يوجد سبب موثّق في `docs/DECISIONS.md` |

### 0.2 أولوية المراجع عند التعارض
1. **ماذا يفعل النظام** (الشاشات، الحقول، الصلاحيات، قواعد العمل): المرجع `requirements.md` v2.0.
2. **كيف يُكتب** (الهيكل، التسمية، الأسلوب، الواجهات البرمجية الداخلية): المرجع `speckit.md`.
3. ما أضافه هذا الملف إلى هيكل `requirements.md` §3.1 مذكور حصرًا في **§2.2 (الإضافات المعتمدة)**، وما عداه يطابق `requirements.md` حرفيًا.
4. عند غموض لا يحسمه أي منهما: اختر **أبسط حل** متوافق، ودوّنه في `docs/DECISIONS.md` ولا تتوقف.

### 0.3 تعديل هذا الملف
لا يُعدَّل إلا في مهمة عنوانها `[SPEC]` مع تسجيل في `docs/CHANGELOG.md`. التعديل **إضافي** (قاعدة جديدة أو توضيح)، ولا يُلغى ما تعتمد عليه شيفرة قائمة إلا بمهمة ترحيل.

---

## 1. القرارات المعمارية الثابتة (ADR)

| # | القرار | السبب |
|---|---|---|
| A1 | المكدس: **HTML5 + Tailwind CSS (Play CDN) + Vanilla JS + Chart.js (CDN) + LocalStorage**. **يُمنع** أي إطار أو مكتبة أخرى (React/Vue/jQuery/Alpine/Bootstrap...) أو أداة بناء | مطابقة `requirements.md` §2 |
| A2 | **صفحة HTML واحدة `index.html` في الجذر** (شاشة الدخول + هيكل التطبيق بداخلها) | §3.1 |
| A3 | **كل** الروابط والملفات بمسارات **نسبية تبدأ بـ `./`**. **يُمنع** المسار المطلق (`/css/...`) و`<base>` | الموقع يُنشر تحت `https://user.github.io/repo/` |
| A4 | **التوجيه بـ `location.hash` (`#/path?query`)** حصرًا. **يُمنع** History API (`pushState`) وروابط لصفحات HTML أخرى | الاستضافة الثابتة بلا إعادة توجيه |
| A5 | **سكربتات كلاسيكية** (بدون `type="module"`) بـ `defer` وبترتيب ثابت (§3.2)، وفضاء أسماء عام واحد **`window.HJ`** | تعمل بالنقر المزدوج ولا يوجد نظام وحدات |
| A6 | **كل** الوصول إلى `localStorage`/`sessionStorage` عبر `HJ.storage` فقط | نقطة تحكم واحدة بالحجم والأخطاء والترحيل |
| A7 | **أربع طبقات** باتجاه اعتماد ثابت: `pages/components` ← `services` ← `core` ← `config` | منع الاعتماد الدائري |
| A8 | **كل نص عربي ظاهر للمستخدم** في ملفات `js/strings/*.js` عبر `HJ.t()` | §11.6 (موضع موحد HJ.strings) |
| A9 | **`fetch` مسموح فقط في `js/ai.js` للاتصال بمزودي الذكاء الاصطناعي.** يُمنع `fetch`/XHR لأي ملف محلي (لا يعمل على `file://`) | الأمان والتوافق |
| A10 | الأيقونات SVG **مضمّنة في `js/icons.js`** (لا مكتبة ولا ملف sprite) | §2.1 |
| A11 | **الرسوم عبر `HJ.charts` فقط** (غلاف Chart.js) مع تدمير تلقائي عند مغادرة الصفحة | منع تسرب الذاكرة |
| A12 | **لا سياسة CSP صارمة** (Tailwind Play CDN يحقن الأنماط ديناميكيًا). بدلًا منها: تعقيم صارم للمخرجات (§11.3) | واقعية التقنية |
| A13 | **أسماء أصناف Tailwind كاملة دائمًا** (حرفيات نصية أو جداول بحث). **يُمنع بناء الصنف بالتجميع** (مثل `` `bg-${c}-100` ``) | يحفظ مسار الانتقال لاحقًا إلى Tailwind CLI |
| A14 | **كل شيء يُنفَّذ عند `boot()` في `app.js`**؛ الملفات الأخرى تعرّف وتسجّل فقط ولا تنفذ عملًا وقت التحميل | ترتيب التحميل آمن |

---

## 2. هيكل المستودع

### 2.1 الهيكل الأساسي (مطابق لـ `requirements.md` §3.1)
```
al-hagar-school/
├── index.html
├── README.md                     # بالعربية (requirements §15)
├── requirements.md
├── speckit.md
├── .gitignore                    # المحتوى في requirements §3.3
├── .nojekyll                     # ملف فارغ
├── css/
│   ├── styles.css                # أنماط مخصصة لا يغطيها Tailwind (§9)
│   └── print.css                 # media="print"
├── js/
│   ├── config.js  utils.js  icons.js  storage.js  seed.js
│   ├── permissions.js  auth.js  router.js  ui.js  charts.js  ai.js
│   ├── components/
│   │   └── sidebar.js  header.js  notifications.js  assistant.js
│   ├── pages/
│   │   └── login.js  dashboard.js  classes.js  students.js  teachers.js
│   │       attendance.js  grades.js  finance.js  library.js  settings.js
│   └── app.js
└── assets/
    ├── img/                      # logo.svg, favicon.svg, hero-pattern.svg
    └── fonts/                    # (اختياري)
```

### 2.2 الإضافات المعتمدة على هيكل `requirements.md` (وحدها المسموحة)
تُضاف **دون تغيير أي مسار أو قاعدة في `requirements.md`**، وسببها قاعدة الحد الأقصى 400 سطر للملف وفصل المسؤوليات ومنع تعارض الأيدي المتعددة:

| الإضافة | المحتوى | السبب |
|---|---|---|
| `js/validators.js` | مدققات نقية (رقم قومي، هاتف، اسم، كلمة مرور، كيانات) | عدم تضخيم `utils.js` |
| `js/seed-names.js` | قوائم الأسماء والبيانات الخام للتوليد التجريبي | `seed.js` يتجاوز 400 سطر |
| `js/strings/*.js` | `common.js`, `shell.js`, `activity.js`, `assistant.js` + ملف لكل صفحة (`login`, `dashboard`, `classes`, `students`, `teachers`, `attendance`, `grades`, `finance`, `library`, `settings`) | موضع موحد `HJ.strings` بملف لكل وحدة لمنع التصادم |
| `js/services/*.js` | `activity`, `aicontext`, `announcements`, `attendance`, `classes`, `finance`, `grades`, `library`, `notifications`, `parents`, `settings`, `stats`, `students`, `subjects`, `teachers`, `users` | منطق الأعمال والصلاحيات والتحقق في موضع واحد؛ و`aicontext` هو بناء السياق مفصولًا عن `ai.js` |
| `tests/` | `index.html`, `runner.js`, `*.test.js` | اختبار الدوال النقية |
| `docs/` | `PROGRESS.md`, `CHANGELOG.md`, `DECISIONS.md` | التنسيق بين المنفّذين |

### 2.3 قواعد الملفات
1. **يُمنع** إنشاء ملف أو مجلد خارج §2.1 و§2.2. لإضافة ملف: عدّل هذا القسم أولًا (مهمة `[SPEC]`).
2. **ملف واحد = مسؤولية واحدة.** حد أقصى **400 سطر** للـ JS و**300 سطر** لـ `styles.css`. عند التجاوز يُقسَّم إلى `<name>-<part>.js` في المجلد نفسه، ويُسجَّل في §3.2 مباشرة بعد الملف الأم.
3. الأسماء: حروف إنجليزية صغيرة، كلمة واحدة، وشرطة `-` فقط للملفات المقسَّمة.
4. **وحدة جديدة = ملفات مجتمعة معًا:** `pages/x.js` + `services/x.js` (إن لزم) + `strings/x.js` + (اختبارات إن وُجد منطق نقي) + سطور في `index.html` داخل الـ SLOTs.
5. **الملكية:** كل ملف تملكه وحدته؛ **يُمنع** تعديل ملف وحدة أخرى أو ملف أساسي ضمن مهمة وحدة (الاستثناءات في §17.3).
6. ملفات ثنائية (صور/خطوط) لا تتجاوز 200KB للواحد، والشعارات SVG.

---

## 3. `index.html` وترتيب التحميل

### 3.1 الهيكل الإلزامي للصفحة
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>مدرسة الحجر الثانوية المشتركة</title>
  <link rel="icon" href="./assets/img/favicon.svg" type="image/svg+xml">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700&family=Tajawal:wght@400;500;700&display=swap">

  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <script>
    tailwind.config = {
      theme: { extend: { fontFamily: {
        sans: ['Tajawal', 'Cairo', 'Segoe UI', 'Tahoma', 'sans-serif'],
        heading: ['Cairo', 'Tajawal', 'Segoe UI', 'Tahoma', 'sans-serif']
      } } }
    };
  </script>

  <link rel="stylesheet" href="./css/styles.css">
  <link rel="stylesheet" href="./css/print.css" media="print">
</head>
<body class="bg-gray-100 font-sans text-gray-900 antialiased">
  <noscript><p class="p-6 text-center">يتطلب هذا التطبيق تفعيل JavaScript.</p></noscript>

  <div id="boot-screen"></div>                       <!-- شاشة التحميل / فشل CDN -->
  <div id="login-root" hidden></div>                 <!-- شاشة الدخول -->

  <div id="app-shell" class="min-h-screen" hidden>
    <aside id="app-sidebar"></aside>                 <!-- يمين الشاشة -->
    <div id="app-body">
      <header id="app-header"></header>              <!-- الهيدر البنفسجي -->
      <main id="app-main" tabindex="-1"></main>      <!-- يرسم الراوتر هنا فقط -->
    </div>
  </div>

  <div id="toast-root"></div>
  <div id="modal-root"></div>
  <div id="assistant-root"></div>
  <div id="print-root"></div>

  <script defer src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.js"></script>

  <!-- محلية: كلها defer وبالترتيب الموضح في §3.2 -->
  <script defer src="./js/config.js"></script>
  ...
  <script defer src="./js/app.js"></script>
</body>
</html>
```
- السكربت المضمّن **الوحيد** المسموح هو إعداد `tailwind.config`. **يُمنع** أي سكربت مضمّن آخر، و`onclick`/`onload` وما شابهها، ووسم `style=` في HTML الثابت.
- الـ `id`ـات الثمانية أعلاه (`boot-screen`, `login-root`, `app-shell`, `app-sidebar`, `app-header`, `app-main`, `toast-root`, `modal-root`, `assistant-root`, `print-root`) **ثابتة** ولا تُغيَّر.
- يُفضَّل إضافة `integrity` و`crossorigin="anonymous"` لسكربت Chart.js. **يُمنع** `@latest` وأي إصدار غير مثبَّت.

### 3.2 ترتيب تحميل السكربتات المحلية (ثابت)

| # | الملف | يعرّف | يعتمد وقت التحميل على |
|---|---|---|---|
| 1 | `js/config.js` | `window.HJ`, `HJ.config`, `HJ.strings={}`, `HJ.pages={}`, `HJ.components={}`, `HJ.services={}` | — |
| 2 | `js/strings/common.js` ثم باقي `js/strings/*.js` (أبجديًا) | `HJ.strings.<module>` | config |
| 3 | `js/utils.js` | `HJ.utils`, `HJ.t`, `HJ.events`, `HJ.errors` | config |
| 4 | `js/validators.js` | `HJ.validators` | utils |
| 5 | `js/icons.js` | `HJ.icons` | config |
| 6 | `js/storage.js` | `HJ.storage` | config, utils |
| 7 | `js/seed-names.js` | `HJ.seedData` | config |
| 8 | `js/seed.js` | `HJ.seed` | config |
| 9 | `js/permissions.js` | `HJ.permissions` | config |
| 10 | `js/auth.js` | `HJ.auth` | config, utils, storage |
| 11 | `js/router.js` | `HJ.router` | config, utils |
| 12 | `js/ui.js` | `HJ.ui` | utils, icons |
| 13 | `js/charts.js` | `HJ.charts` | config |
| 14 | `js/services/*.js` (أبجديًا) | `HJ.services.<name>` | config |
| 15 | `js/ai.js` | `HJ.ai` | config, utils |
| 16 | `js/components/sidebar.js`, `header.js`, `notifications.js`, `assistant.js` | `HJ.components.<name>` | router, ui |
| 17 | `js/pages/*.js` (أبجديًا) | `HJ.pages.<name>` + `HJ.router.register(...)` | router |
| 18 | `js/app.js` | `boot()` وتشغيل كل شيء | الكل |

هذا يطابق الترتيب في `requirements.md` §3.2 (`config → utils → icons → storage → seed → permissions → auth → router → ui → charts → ai → components → pages → app`) مع إدراج الإضافات المعتمدة في مواضعها.

**قواعد:**
- الإضافة تكون **داخل الـ SLOT المناسب** وسطرًا لكل ملف، بترتيب أبجدي:
  ```html
  <!-- SLOT:strings -->    <!-- SLOT:services -->    <!-- SLOT:components -->    <!-- SLOT:pages -->
  ```
- **يُمنع** تغيير ترتيب الملفات الثابتة أو إدراج ملف بين اثنين دون تحديث هذا الجدول.
- ملف يستخدم `HJ.x` وقت التحميل (خارج الدوال) لا يُحمَّل قبل الملف المعرِّف له. وكل استخدام داخل الدوال آمن لأن التنفيذ يبدأ من `boot()`.

---

## 4. فضاء الأسماء والطبقات والعقود

### 4.1 `config.js` — الجذر الوحيد لـ `window.HJ`
```js
(function () {
  'use strict';
  const HJ = (window.HJ = window.HJ || {});
  HJ.version = '2.0.0';
  HJ.strings = {};      // HJ.strings.<module> = { key: 'نص' }
  HJ.pages = {};        // HJ.pages.<name>
  HJ.components = {};   // HJ.components.<name>
  HJ.services = {};     // HJ.services.<name>
  HJ.config = Object.freeze({ /* القسم 4.2 */ });
})();
```
**يُمنع** أي متغير عام آخر على `window`، ويُمنع أي ملف غير `config.js` من إنشاء `window.HJ`.

### 4.2 محتوى `HJ.config` (الثوابت الوحيدة في المشروع)
| الثابت | القيمة |
|---|---|
| `STORAGE_PREFIX` | `'hagar_v2_'` |
| `SCHEMA_VERSION` | `2` |
| `ROLES` | `{ ADMIN:'admin', TEACHER:'teacher', STUDENT:'student', PARENT:'parent' }` |
| `STUDENT_STATUS` | `active, transferred, withdrawn, graduated, suspended, deleted` |
| `STAFF_STATUS` | `active, leave, seconded, ended` |
| `ATTENDANCE` | `{ PRESENT:'P', ABSENT:'A', EXCUSED:'E', LATE:'L' }` (A = غياب بدون عذر) |
| `GRADE_STATUS` | `draft, approved, published` |
| `GRADE_FLAGS` | `{ ABSENT:'abs', EXEMPT:'exm' }` (تُعرض «غ» و«ع») |
| `TRACKS` | `{ GENERAL:'general', SCIENCE:'sci', LITERARY:'lit' }` |
| `LEVELS` | `[1, 2, 3]` (الأول/الثاني/الثالث الثانوي) |
| `GENDER` | `{ MALE:'M', FEMALE:'F' }` |
| `TERMS` | `{ FIRST:1, SECOND:2 }` |
| `ANN_TYPE` | `exam, registration, holiday, finance, general, urgent` |
| `NOTIFY_LEVEL` | `normal, important, urgent` |
| `PAYMENT_METHOD` | `cash, bank, fawry, cheque` |
| `EXPENSE_CATEGORY` | `maintenance, utilities, stationery, activities, purchases, other` |
| `ID_PREFIX` | `usr_ stu_ tch_ par_ cls_ sub_ sch_ att_ grd_ fee_ inv_ pay_ exp_ bk_ ln_ ntf_ ann_ act_ note_` |
| `DEFAULTS` | `idleMinutes:30, lockMinutes:5, maxFailed:5, classCapacity:45, teacherWorkload:24, loanDays:14, loanMax:3, absenceWarnPct:10, absenceCriticalPct:15, photoMaxKB:120, activityMax:500, aiTimeoutMs:60000` |
| `CHART_COLORS` | `['#4C1D95','#10B981','#F59E0B','#EF4444','#A78BFA','#9CA3AF']` |
| `GENDER_COLORS` | `{ M:'#4C1D95', F:'#A78BFA' }` |
| `EVENTS` | `AUTH_LOGIN:'auth:login'`, `AUTH_LOGOUT:'auth:logout'`, `ROUTE_CHANGED:'route:changed'`, `DATA_CHANGED:'data:changed'`, `ACTIVITY_NEW:'activity:new'`, `NOTIFICATION_NEW:'notification:new'`, `SETTINGS_CHANGED:'settings:changed'`, `CHILD_CHANGED:'child:changed'`, `STORAGE_WARNING:'storage:warning'` |
| `SCHOOL_DAYS` | `[0,1,2,3,4]` (أحد–خميس، يطابق `Date.getDay()`) |

- الإضافة إلى `config.js` **إضافية فقط**، ولا تُعدَّل قيمة قائمة إلا بمهمة `[SPEC]`.
- الأحداث الجديدة تُضاف للجدول هنا أولًا.
- **القيم المخزّنة رموز إنجليزية دائمًا**، والنص العربي للعرض من `HJ.t`.

### 4.3 قالب أي ملف JS (إلزامي)
```js
(function (HJ) {
  'use strict';

  const { ROLES } = HJ.config;           // ثوابت الملف

  function helper() { /* خاصة */ }

  function publicFn() { /* عامة */ }

  HJ.services.example = { publicFn };    // التصدير الوحيد

})(window.HJ);
```

### 4.4 اتجاه الاعتماد
```
pages / components  →  services  →  core (utils, validators, storage, permissions, auth, ui*, charts, icons)  →  config
```
| من \ إلى | config/core | services | pages/components |
|---|:--:|:--:|:--:|
| core | ✓ (وفق الترتيب) | ✗ | ✗ |
| services | ✓ | ✓ (داخل الدوال فقط) | ✗ |
| pages/components | ✓ | ✓ | ✗ (تتواصل بالأحداث والراوتر) |

(* `ui.js` ضمن core لكنه لا يستدعي الخدمات.)
- **يُمنع** على `pages` و`components` استدعاء `HJ.storage` مباشرة؛ تمر عبر `services`.
- **يُمنع** على أي خدمة قراءة `HJ.services.y` في أعلى الملف؛ تُقرأ داخل الدوال.
- **استثناء:** `components/sidebar.js` و`header.js` يقرآن `HJ.router`/`HJ.auth` مباشرة.

### 4.5 الأخطاء (`HJ.errors` في `utils.js`)
| الصنف | الاستخدام | حقول |
|---|---|---|
| `ValidationError` | مدخلات غير صالحة | `fields: { name: messageKey }` |
| `PermissionError` | لا صلاحية | `permission` |
| `NotFoundError` | سجل غير موجود | `entity, id` |
| `ConflictError` | تكرار/تعارض/تجاوز حد | `messageKey, details` |
| `StorageError` | امتلاء/تلف | `cause` |
| `AiError` | أخطاء المساعد | `code` (§13.3) |

- كل خطأ يحمل `messageKey` من `HJ.strings.common`.
- **يُمنع** `throw 'نص'` أو `throw new Error('نص عربي')`.
- الواجهة تلتقط بـ `try/catch` وتستدعي `HJ.ui.handleError(err, { form })`.
- **يُمنع** `catch {}` فارغ؛ كل خطأ إما يُعالَج أو يُعاد رميه.

### 4.6 الأحداث (`HJ.events` في `utils.js`)
```js
const off = HJ.events.on(HJ.config.EVENTS.DATA_CHANGED, (e) => { /* ... */ });
HJ.events.emit(HJ.config.EVENTS.DATA_CHANGED, { entity: 'students', action: 'create', id });
```
- حمولة `DATA_CHANGED`: `{ entity, action: 'create'/'update'/'remove', id }`.
- الصفحات والمكوّنات تتواصل بالأحداث، ويجب إلغاء كل اشتراك في `dispose`.

### 4.7 عقد الخدمة
كل دالة **عامة** في خدمة يجب أن:
1. تتحقق من الصلاحية: `HJ.permissions.assert('students.update', record)`.
2. تتحقق من المدخلات (`HJ.validators`) وترمي `ValidationError`.
3. تتحقق من قواعد العمل (تكرار، تعارض، سعة، حدود).
4. تكتب عبر `HJ.storage` فقط.
5. تسجل في `HJ.services.activity.log(...)` للعمليات المذكورة في §6.7.
6. تبث `DATA_CHANGED`.
7. تُرجع **نسخًا** (لا مراجع داخلية).
8. تُطبّق **نطاق الدور** (فصول المدرس، نفس الطالب، أبناء ولي الأمر) داخلها عبر `HJ.permissions.scope(user)`، وليس في الواجهة.
- الخدمات **متزامنة** ما لم تحتج Web Crypto أو الشبكة أو `canvas` (تُرجع Promise عندها).

---

## 5. التوجيه والربط بين الشاشات (`#/`)

### 5.1 جدول المسارات الرسمي (مطابق لـ `requirements.md` §8)
| المسار | الصفحة | الأدوار (اتحاد) | ملاحظات |
|---|---|---|---|
| `/login` | login | زائر | بعد النجاح `/dashboard` |
| `/dashboard` | dashboard | الأربعة | الهيدر بالوضع `full` |
| `/classes` | classes | الأربعة (بنطاق) | القائمة بطاقات مجمّعة |
| `/classes/:id` | classes | الأربعة (بنطاق) | تبويبات: `students`, `subjects`, `attendance`, `schedule` |
| `/students` | students | admin, teacher | الطالب/ولي الأمر يُحوَّلان لملفه عبر `replace` |
| `/students/:id` | students | الأربعة (بنطاق) | تبويبات: `info`, `attendance`, `grades`, `finance`, `library`, `notes` |
| `/teachers` | teachers | الأربعة | قائمة كاملة للمدير ومختصرة لغيره |
| `/teachers/:id` | teachers | admin, teacher | المدرس: نفسه فقط |
| `/attendance` | attendance | الأربعة | تسجيل (admin/teacher) أو عرض (student/parent) |
| `/grades` | grades | الأربعة | تبويبات: `entry`, `results`, `certificates`, `setup` |
| `/finance` | finance | admin, student, parent | تبويبات المدير: `overview`, `fees`, `collection`, `arrears`, `expenses`, `reports`؛ الطالب/ولي الأمر: كشف حسابه فقط |
| `/library` | library | الأربعة | تبويبات: `catalog`, `loans`, `members`, `reports` |
| `/settings` | settings | الأربعة | تبويبات: `account`, `school`, `year`, `users`, `announcements`, `ai`, `backup`, `activity` (غير المدير: `account` فقط) |
| `/forbidden` | router | الأربعة | «غير مصرح لك» |
| `/not-found` | router | الأربعة | مسار غير معروف |

- **النماذج (إضافة/تعديل) تُفتح في نوافذ منبثقة وليست مسارات** (`requirements.md` §8.4.1 ST-07). **يُمنع** مسار مثل `/students/new`.
- الإشعارات (السجل الكامل) ومعاينة الطباعة والمساعد: نوافذ/لوحات وليست مسارات.
- إضافة مسار جديد = تعديل هذا الجدول أولًا.

### 5.2 قواعد الروابط
```html
<a href="#/students">…</a>                                       <!-- صحيح -->
<a href="${HJ.router.href('/students/:id', { id: s.id })}">…</a>  <!-- صحيح من JS -->
```
```js
HJ.router.go('/students', { query: { grade: 2, track: 'sci' } });  // يضيف سجلًا
HJ.router.go('/students/stu_ab12cd34', { replace: true });         // دون سجل
HJ.router.replaceQuery({ page: 2 });                                // تحديث المعاملات
HJ.router.back();
```
- الشكل: `#/students?grade=2&track=sci&page=2`.
- **مفردات الاستعلام الثابتة:** `tab`, `page`, `q`, `grade`, `track`, `class`, `status`, `sort`, `dir`, `from`, `to`, `term`. مفتاح جديد = تعديل هذا السطر أولًا.
- **حالة المرشحات والصفحة والتبويب تُحفظ في الاستعلام** لتعمل أزرار الرجوع/التحديث (Refresh) على أي مسار.
- جميع قيم الاستعلام نصوص؛ التحويل مسؤولية الصفحة.
- **يُمنع:** بناء الروابط بالتجميع اليدوي، `window.location.href =` أو `location.assign` خارج `router.js` و`app.js` (الخروج من الجلسة)، `<a href="x.html">`، أي رابط يبدأ بـ `/`.

### 5.3 واجهة `HJ.router`
```js
HJ.router.register(pageDef)           // يتحقق من تكرار id أو النمط
HJ.router.start()                     // يربط hashchange ويعالج المسار الحالي (من app.js فقط)
HJ.router.go(path, { query, replace })
HJ.router.href(pattern, params, query)   // → '#/students/stu_1?tab=grades'
HJ.router.replaceQuery(patch)
HJ.router.current()                   // → { path, params, query, page }
HJ.router.back()
```

### 5.4 دورة معالجة المسار (ثابتة)
1. قراءة `location.hash` ← إن كان فارغًا: `replace` إلى `/dashboard` (أو `/login` بلا جلسة).
2. مطابقة النمط (أول تطابق)، وإلا ← `/not-found`.
3. **حارس الجلسة:** بلا جلسة صالحة ← `/login`؛ وبجلسة على `/login` ← `/dashboard`.
4. **حارس الدور:** الدور خارج `page.roles` ← `/forbidden`.
5. `HJ.charts.destroyAll()` ثم استدعاء `dispose` للصفحة السابقة.
6. ضبط وضع الهيدر (`page.hero`) وعنوان المستند `«<عنوان الصفحة> — مدرسة الحجر الثانوية المشتركة»`.
7. `page.mount(ctx)` داخل `#app-main` مع حركة دخول (§8.6)، وحفظ دالة التنظيف المُرجَعة.
8. تمرير الصفحة لأعلى، ونقل التركيز إلى `#app-main`، وبثّ `ROUTE_CHANGED`.
- حارس الراوتر **لا يغني** عن التحقق في الخدمات.

### 5.5 عقد الصفحة
```js
HJ.pages.students = {
  id: 'students',
  routes: ['/students', '/students/:id'],
  roles: [R.ADMIN, R.TEACHER, R.STUDENT, R.PARENT],
  titleKey: 'students.pageTitle',
  hero: 'compact',                          // 'full' للوحة التحكم فقط
  nav: { labelKey: 'students.nav', icon: 'users', order: 30 },   // اختياري
  mount(ctx) {                              // ctx = { root, path, params, query, user }
    // ارسم داخل ctx.root فقط
    return function dispose() {};           // إلغاء المستمعات والمؤقتات والاشتراكات
  }
};
HJ.router.register(HJ.pages.students);
```
- ترتيب القائمة الجانبية (مطابق لـ SB-03): dashboard=10، classes=20، students=30، teachers=40، attendance=50، grades=60، finance=70، library=80، settings=90، ثم «تسجيل الخروج» عنصر خاص ثابت بالأسفل ليس صفحة.
- **ظهور عناصر القائمة بحسب الدور** (SB-07):

| العنصر | admin | teacher | student | parent |
|---|:--:|:--:|:--:|:--:|
| لوحة التحكم | ✓ | ✓ | ✓ | ✓ |
| الصفوف الدراسية | ✓ | ✓ | ✓ | ✓ |
| الطلاب | ✓ | ✓ | «ملفي» → `/students/<id>` | «ملف الابن» → ابن الحالي |
| المدرسين | ✓ | ✓ | ✓ | ✓ |
| الحضور والغياب | ✓ | ✓ | ✓ | ✓ |
| الدرجات والشهادات | ✓ | ✓ | ✓ | ✓ |
| الإدارة المالية | ✓ | ✗ | ✓ | ✓ |
| المكتبة | ✓ | ✓ | ✓ | ✓ |
| الإعدادات | ✓ | «حسابي» | «حسابي» | «حسابي» |

- ولي الأمر ذو الأبناء المتعددين: مبدّل الابن في الهيدر، `HJ.auth.activeChildId()` و`HJ.auth.setActiveChild(id)` ويبثان `CHILD_CHANGED` فتعيد الصفحات رسم نفسها.

---

## 6. التخزين وبنية البيانات

### 6.1 المفاتيح (مطابقة لـ `requirements.md` §9.1)
البادئة `hagar_v2_` من `HJ.config.STORAGE_PREFIX`. **يُمنع** أي مفتاح خارج هذه القائمة:

| الكيان | المفتاح الفعلي | الشكل |
|---|---|---|
| `meta`, `settings`, `ui`, `ai` | `hagar_v2_<name>` | كائن |
| `users` `students` `parents` `teachers` `classes` `subjects` `schedule` `feePlans` `invoices` `payments` `expenses` `books` `loans` `notifications` `announcements` `notes` | `hagar_v2_<name>` | مصفوفة |
| `activity` | `hagar_v2_activity` | مصفوفة (آخر 500) |
| `attendance` | `hagar_v2_attendance__<year>` | **مستند مدمج** (§6.4) |
| `grades` | `hagar_v2_grades__<year>` | **مستند مدمج** (§6.4) |
| الجلسة | `hagar_v2_session` | `localStorage` (تذكرني) أو `sessionStorage` |
| مفتاح الذكاء الاصطناعي | `hagar_v2_ai_key` | `sessionStorage` افتراضيًا أو `localStorage` باختيار المدير |

`<year>` بصيغة `2026-2027`.

### 6.2 واجهة `HJ.storage` (ثابتة)
```js
// مجموعات
HJ.storage.list(entity, predicate?, { includeDeleted })   // → نسخ
HJ.storage.get(entity, id)
HJ.storage.create(entity, data)        // يضيف id و createdAt و updatedAt
HJ.storage.update(entity, id, patch)   // دمج سطحي + updatedAt
HJ.storage.remove(entity, id)          // حذف فعلي
HJ.storage.softRemove(entity, id)      // deletedAt
HJ.storage.restore(entity, id)
HJ.storage.query(entity, { where, orderBy, limit, offset })
// مستندات (كائنات ومستندات مدمجة)
HJ.storage.getDoc(name, fallback)      // name مثل 'settings' أو 'attendance__2026-2027'
HJ.storage.setDoc(name, value)
// الجلسة والمفتاح (الوحيدة التي تلمس Web Storage للأسرار)
HJ.storage.sessionGet(key) / sessionSet(key, value, { persist }) / sessionRemove(key)
// صيانة
HJ.storage.exportAll({ includeSecrets })   // لا يتضمن مفتاح API أبدًا
HJ.storage.importAll(obj)                  // يتحقق من schemaVersion والبنية قبل الاستبدال
HJ.storage.usage()                         // → { usedBytes, limitBytes, ratio }
HJ.storage.migrate()                       // ترحيل المخطط عند الإقلاع
```
- `list` يستبعد `deletedAt` افتراضيًا.
- ذاكرة مؤقتة للقراءة تُبطل عند الكتابة أو حدث `storage` (تبويب آخر).
- كل كتابة داخل `try/catch` تحوّل `QuotaExceededError` إلى `StorageError`، وتبثّ `STORAGE_WARNING` عند تجاوز 80%.
- قراءة JSON تالف: التقاط الخطأ، ومنح خيار الاستعادة من نسخة احتياطية، **لا انهيار صامت**.
- **يُمنع** `localStorage`/`sessionStorage` خارج `storage.js` (تحقق آلي في §16.2).

### 6.3 اتفاقيات السجلات
| العنصر | القاعدة |
|---|---|
| المعرّف | `HJ.utils.uid(prefix)` → `prefix_xxxxxxxx` (8 خانات سداسية من `crypto.getRandomValues`) |
| التاريخ فقط | نص `YYYY-MM-DD` بالتوقيت المحلي |
| الطابع الزمني | ISO 8601 UTC |
| الحقول | `camelCase` |
| الحالات والأنواع | رموز إنجليزية من `HJ.config` (لا عربي مخزَّن) |
| العلاقات | بالمعرّف فقط (`classId`, `studentId`)؛ **يُمنع** تضمين سجل داخل سجل (استثناء: `guardian` في الطالب، و`items`/`installments` في الفاتورة) |
| الحذف | ناعم بـ `deletedAt` للطلاب والمدرسين والكتب |
| الصور | Base64 JPEG مضغوطة ≤ `photoMaxKB`، في حقل `photo` فقط، وتُعاد ترميزها بـ `canvas` قبل الحفظ |
| الأرقام | `number` لا نصوص |
| **النقود** | بالجنيه بخانتين عشريتين كحد أقصى، والعمليات الحسابية عبر `HJ.utils.money` (أعداد صحيحة بالقروش) |
| **الدرجات** | بخانتين كحد أقصى، والحسابات عبر `HJ.utils.num.hundredths` (أعداد صحيحة بأجزاء المئة) |

### 6.4 ميزانية التخزين والتمثيل المدمج (إلزامي)
حجم البيانات التجريبية في `requirements.md` §10.2 (≈380 طالبًا × 60 يومًا حضورًا، ودرجات لكل مادة ومكوّن) يتجاوز سعة LocalStorage إن خُزّن سجلًا مستقلًا لكل عنصر. **لذلك** يُحفظ الحضور والدرجات فيزيائيًا بصيغة **مدمجة**، بينما تُرجع الخدمات للمستهلكين **الشكل المسطّح الوارد في `requirements.md` §9.3** (نفس الحقول والأسماء).

**الحضور** (`hagar_v2_attendance__<year>`):
```json
{ "2026-11-19": { "cls_ab12cd34": {
    "_by": "usr_a1b2c3d4", "_at": "2026-11-19T07:41:00Z",
    "stu_00000001": "P",
    "stu_00000002": ["E", "مريض"]
} } }
```
- القيمة رمز الحالة، أو مصفوفة `[رمز, ملاحظة]` عند وجود ملاحظة. المفاتيح التي تبدأ بـ `_` بيانات وصفية محجوزة.

**الدرجات** (`hagar_v2_grades__<year>`):
```json
{ "1": { "sub_ab12cd34": { "final": {
    "_st": { "cls_ab12cd34": "approved" },
    "stu_00000001": 52.5,
    "stu_00000002": "abs"
} } } }
```
- المستوى الأول رقم الفصل الدراسي، ثم المادة، ثم المكوّن؛ `_st` حالة (مسودة/معتمدة/منشورة) لكل فصل دراسي؛ القيمة رقم أو علم (`abs`/`exm`).

**القواعد:**
- الوصول لهذين المستندين **حصرًا** عبر `services/attendance.js` و`services/grades.js` بواسطة `getDoc/setDoc`.
- واجهة الخدمات تُرجع/تقبل الشكل المسطّح: `{ date, classId, studentId, status, note }` و`{ studentId, subjectId, year, term, componentId, value, status }`.
- **هدف الحجم:** إجمالي البيانات التجريبية ≤ **2.5MB** بعد التوليد (`HJ.storage.usage().usedBytes`)، ويُفحص في §16.
- أي كيان يُتوقع أن يتجاوز **5,000 سجل** يجب أن يعتمد التمثيل المدمج ويُسجَّل القرار في `docs/DECISIONS.md`.

### 6.5 الجلسات والأسرار
- الجلسة: `{ userId, role, expiresAt, remember }` — **لا** كلمة مرور ولا hash داخلها.
- مفتاح الذكاء الاصطناعي: مفتاح مستقل `hagar_v2_ai_key`، **يُستثنى من `exportAll` دائمًا**، ويُمسح مع «حذف المفتاح» ومع «مسح كل البيانات».
- **يُمنع** تسجيل أو طباعة أو تضمين أي سر في رسالة خطأ أو سجل عمليات.

### 6.6 الترحيل
`meta.schemaVersion` يُقارن بـ `HJ.config.SCHEMA_VERSION` عند `boot()`؛ أي فرق يشغّل `HJ.storage.migrate()` المكوَّنة من خطوات مرقّمة قابلة لإعادة التشغيل دون ضرر (idempotent).

### 6.7 العمليات التي **يجب** تسجيلها في `activity`
إضافة/تعديل/حذف (طالب، مدرس، ولي أمر، فصل، كتاب)؛ رصد حضور؛ رصد/اعتماد/نشر درجات؛ تحصيل/إلغاء دفعة؛ تسجيل/تعديل مصروف؛ إعارة/إرجاع؛ إرسال إشعار؛ إصدار شهادة؛ دخول ناجح/فاشل وخروج؛ إعادة تعيين كلمة مرور؛ تصدير/استيراد/مسح البيانات؛ تغيير الإعدادات؛ تغيير إعدادات المساعد (دون تسجيل المفتاح).

السجل **منظَّم لا نصي**:
```js
HJ.services.activity.log({
  type: 'student.create',           // يطابق مفتاح في strings/activity.js
  entity: 'students', entityId: s.id,
  params: { name: s.fullName }      // تُستخدم لتوليد النص عند العرض
});
// يُخزَّن: { id, type, actorId, entity, entityId, params, at }
```
- العرض: `HJ.t('activity.student.create', { actor, name })` + `HJ.utils.relativeTime(at)` (منذ 12 دقيقة).
- يُبثّ `ACTIVITY_NEW`، ويُقتصر السجل على آخر `activityMax`.

---

## 7. الصلاحيات والمصادقة

### 7.1 الصلاحيات (`permissions.js`)
- صيغة الصلاحية: `<resource>.<action>` مثل `students.read`, `students.update`, `attendance.record`, `grades.approve`, `grades.publish`, `certificates.print`, `finance.manage`, `finance.read`, `library.manage`, `notifications.send`, `settings.manage`, `ai.use`, `ai.configure`.
- **المصفوفة في `requirements.md` §6.2 هي المرجع الوحيد**، و`permissions.js` ترجمة حرفية لها. أي تعديل يبدأ بتعديل المتطلبات.
```js
HJ.permissions.can(user, 'students.update', record?)     // → boolean
HJ.permissions.assert('students.update', record?)         // يرمي PermissionError (المستخدم الحالي)
HJ.permissions.scope(user)                                // → { all:true } أو { classIds:Set, studentIds:Set, teacherId, ... }
HJ.permissions.canSeeRoute(user, page)                    // للقائمة والراوتر
```
- **التطبيق في موضعين:** إخفاء العناصر في الواجهة، **والتحقق** داخل الخدمات (القسم 4.7). الإخفاء وحده ليس حماية.
- نطاق ولي الأمر: أبناؤه فقط (`childrenIds`)، والطالب: نفسه فقط، والمدرس: فصوله ومواده (من التكليف في الجدول/الفصول).

### 7.2 المصادقة (`auth.js`)
| البند | القاعدة |
|---|---|
| التجزئة | `SHA-256` + ملح 16 بايت عشوائي عبر `crypto.subtle`، ويُخزَّن `salt` و`passwordHash` فقط |
| بيئة التشغيل | إن لم تتوفر `crypto.subtle` تُعرض شاشة صريحة «افتح الموقع عبر https أو خادم محلي (localhost)»، **ولا يُستخدم أي بديل تجزئة ضعيف** |
| القفل | `maxFailed` محاولات فاشلة ← قفل `lockMinutes` بعدّاد تنازلي (`failedAttempts`, `lockedUntil`) |
| الخمول | `idleMinutes` مع تحذير قبل دقيقة، وتجديد عند أي نشاط |
| كلمة المرور | 8 أحرف على الأقل (حرف + رقم)، لا تساوي اسم المستخدم، ومؤشر قوة |
| المؤقتة | تُعرض مرة واحدة (نافذة نسخ/طباعة) مع `mustChangePassword` |
| رسائل الفشل | عامة «بيانات الدخول غير صحيحة» دون كشف أيهما الخطأ |
| تسجيل الخروج | يمسح الجلسة ويحول إلى `#/login` ويبثّ `AUTH_LOGOUT` |
| الدخول السريع | يظهر فقط عند `settings.demoMode === true` |
```js
HJ.auth.login(username, password, { remember }) → Promise<user>
HJ.auth.logout()
HJ.auth.current()                 // → { id, username, role, refId, childrenIds } أو null
HJ.auth.changePassword(old, next) → Promise
HJ.auth.hashPassword(plain, salt) → Promise<string>     // تستخدمها users/seed فقط
HJ.auth.activeChildId() / setActiveChild(id)
```

---

## 8. Tailwind CSS والتصميم

### 8.1 الألوان المسموحة (القائمة البيضاء)
**لا يُستخدم في الأصناف إلا:** `white`، و`gray`، و`violet`، و`emerald`، و`amber`، و`red`. **يُمنع** أي لوحة أخرى (blue, pink, indigo, purple, teal, yellow...).

| الدور | القيمة | الصنف (كامل) |
|---|---|---|
| القائمة الجانبية | `#111827` | `bg-gray-900` + نص `text-white` |
| الهيدر والزر الرئيسي والعناوين البارزة | `#4C1D95` | `bg-violet-900` / `text-violet-900` |
| تمرير الأساسي | `#5B21B6` | `hover:bg-violet-800` |
| خلفية ناعمة (معلوماتي/تحديد) | `#EDE9FE` | `bg-violet-100` / `hover:bg-violet-50` |
| **النجاح والحالة النشطة ونسب الحضور** | `#10B981` | `bg-emerald-500` (أيقونات، نقاط، أشرطة تقدم) |
| خلفية الصفحة | `#F3F4F6` | `bg-gray-100` |
| البطاقات | `#FFFFFF` | `bg-white` |
| الحدود | `#E5E7EB` | `border-gray-200` |
| بعذر/تحذير | `#F59E0B` | `bg-amber-100 text-amber-800` / `bg-amber-500` |
| بدون عذر/خطر | `#EF4444` | `bg-red-100 text-red-700` / `bg-red-500` / `bg-red-600` للأزرار |

**قواعد:**
1. هوية المشروع: **فحمي `#111827` + بنفسجي `#4C1D95` + زمردي `#10B981`** على `#F3F4F6` و`#FFFFFF`.
2. **الزمردي للنجاح والنشاط فقط**، ويُمنع كزينة عامة.
3. **التباين:** النص الأبيض على `emerald-500` ممنوع. **الشارات** تكون `bg-emerald-100 text-emerald-800`، والزمردي الصافي للأيقونات والنقاط وأشرطة التقدم والأرقام الكبيرة.
4. **يُمنع** `bg-[#...]` وأي قيمة لون اعتباطية. اللون الحرفي (`#hex`) مسموح في موضعين فقط: `HJ.config` (ألوان الرسوم) و`:root` في `styles.css`.
5. **يُمنع الاعتماد على اللون وحده** لنقل المعنى؛ تُرفق أيقونة أو نص (حاضر ✓ / غائب ✗ / بعذر ◐ / متأخر ⏱).
6. الأربع حالات الحضور: **حاضر** زمردي، **غائب بدون عذر** أحمر، **غائب بعذر** كهرماني، **متأخر** بنفسجي.

### 8.2 قاموس الأصناف الموحد (`HJ.ui.cls`)
**كل** أصناف المكوّنات المتكررة تُؤخذ من هذا الكائن في `ui.js`، **ويُمنع** إعادة كتابة تركيباتها يدويًا في الصفحات:
```js
HJ.ui.cls = {
  card:        'bg-white rounded-2xl shadow-sm border border-gray-200 p-5',
  cardLink:    'transition hover:shadow-md',
  btn:         'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  btnPrimary:  'bg-violet-900 hover:bg-violet-800 text-white',
  btnSecondary:'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
  btnDanger:   'bg-red-600 hover:bg-red-700 text-white',
  btnGhost:    'text-gray-600 hover:bg-gray-100',
  input:       'w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-violet-700 focus:outline-none focus:ring-1 focus:ring-violet-700',
  label:       'mb-1 block text-sm font-medium text-gray-700',
  fieldError:  'mt-1 text-sm text-red-600',
  badge:       'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
  tableWrap:   'overflow-x-auto rounded-2xl border border-gray-200 bg-white',
  th:          'bg-gray-50 px-4 py-3 text-start text-sm font-medium text-gray-600',
  td:          'border-t border-gray-100 px-4 py-3 text-sm text-gray-900',
  rowHover:    'hover:bg-violet-50',
  modalBack:   'fixed inset-0 z-40 flex items-center justify-center bg-gray-900/50 p-4',
  modalBox:    'w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg',
  pageTitle:   'font-heading text-2xl font-bold text-gray-900',
  empty:       'flex flex-col items-center justify-center gap-3 py-12 text-center text-gray-500'
};
// نغمات الحالة: جدول بحث (لا تجميع نصوص)
HJ.ui.tone = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-violet-100 text-violet-800',
  neutral: 'bg-gray-100 text-gray-700'
};
```
- إضافة صنف للقاموس = **إضافة في آخره** فقط. تعديل صنف قائم = مهمة `[CORE]` لأنه يغيّر كل الشاشات.
- مكوّنات أخرى (بطاقة إحصاء، شارة حضور...) تُبنى بدوال `HJ.ui.statCard(...)`, `HJ.ui.badge(text, tone)` ولا تُنسخ.

### 8.3 قواعد الاستخدام
1. **منطقي لا فيزيائي (RTL):** `ms-* me-* ps-* pe-* start-* end-* border-s border-e rounded-s rounded-e text-start text-end`. **يُمنع** `ml-* mr-* pl-* pr-* left-* right-* text-left text-right border-l border-r float-left float-right` و`space-x-*` (استخدم `gap-*`).
2. اتجاه الصفحة ثابت `rtl`؛ **تجنّب** `rtl:`/`ltr:` إلا لقلب الأيقونات الاتجاهية: `rtl:-scale-x-100`.
3. **التجاوب:** mobile-first، وبنقطتي كسر فقط: **`md:` (768px)** و**`lg:` (1024px)** بما يطابق `requirements.md` §4.4. **يُمنع** `sm:` و`xl:` و`2xl:`.
4. **القيم الاعتباطية** (`h-[320px]`) مسموحة للأبعاد النادرة فقط، **ويُمنع** فيها اللون.
5. **الأصناف الديناميكية:** تُختار من حرفيات أو جداول بحث (A13)، مثل:
   ```js
   const tone = { P: HJ.ui.tone.success, A: HJ.ui.tone.danger, E: HJ.ui.tone.warning, L: HJ.ui.tone.info }[status];
   ```
6. **القيم العددية الديناميكية** (عرض شريط تقدم، ارتفاع عمود): تُضبط عبر CSSOM لا عبر `style=` في النص:
   ```js
   bar.style.setProperty('--hj-value', pct + '%');   // والصنف hj-progress__bar في styles.css
   ```
7. الخطوط: `font-sans` للنص (افتراضي على `<body>`)، و`font-heading` للعناوين فقط. الحد الأدنى للنص الأساسي `text-base` (16px)، و`leading-relaxed` للفقرات.
8. الأرقام/الأكواد/الهواتف داخل نص عربي: `<bdi dir="ltr">` (دالة `HJ.ui.ltr(value)`).

### 8.4 هيكل الواجهة (مطابق لـ `requirements.md` §5)
| العنصر | الأصناف الأساسية |
|---|---|
| **القائمة الجانبية `#app-sidebar`** | `fixed inset-y-0 start-0 z-30 flex w-64 flex-col bg-gray-900 text-white transition-all duration-300` (مطوية: `w-20`). **`start` = اليمين في RTL.** |
| إخفاء القائمة على الجوال | الحالة المخفية `translate-x-full` (تدفعها لليمين خارج الشاشة)، والظاهرة `translate-x-0`، مع طبقة `bg-gray-900/50` للإغلاق، ولا تظهر ثابتة إلا من `lg:` |
| **عنصر نشط** | `bg-violet-900 border-s-4 border-violet-400`، والتمرير `hover:bg-white/10` |
| **منطقة الجسم `#app-body`** | `lg:ps-64` (موسّعة) أو `lg:ps-20` (مطوية) — هامش من جهة القائمة اليمنى، مع `transition-all duration-300` |
| **الهيدر `#app-header`** | `bg-violet-900 text-white`؛ وضع `full`: `pb-24`؛ وضع `compact`: `pb-6` |
| **بطاقات الإحصاء المتداخلة** | صف شبكي (`grid grid-cols-2 gap-4 lg:grid-cols-4`) يتصدّر `#app-main` بـ `-mt-16 relative z-10`، وكل بطاقة `shadow-lg rounded-2xl bg-white` |
| **حاوية المحتوى** | `mx-auto w-full max-w-7xl p-4 md:p-6` |
| **الزر العائم للمساعد** | `fixed bottom-6 start-auto end-6` (أسفل **اليسار**، بعيدًا عن القائمة) `bg-violet-900 text-white rounded-full` |
- حالة طي القائمة تُحفظ في `ui.sidebarCollapsed` عبر `HJ.storage`.
- `Esc` يغلق القائمة المنزلقة والنوافذ.

### 8.5 الأيقونات
- `HJ.icons` كائن `{ name: '<path …/>' }` بإطار `viewBox="0 0 24 24"` و`stroke="currentColor"` و`fill="none"` وسمك 1.75.
- الاستخدام الوحيد: `HJ.ui.icon('users', { size: 20, cls: '' })`. **يُمنع** SVG يدوي في الصفحات.
- الإضافة في **آخر** `icons.js`، والاسم `kebab-case`، والأسماء من قائمة المتطلبات (dashboard, school, users, user-check, calendar-check, award, wallet, book-open, settings, log-out, bell, search, plus, edit, trash, print, download, upload, x, check, alert, chat, menu, chevron ... إلخ).

### 8.6 الحركة
- الانتقالات 150–300ms: `transition duration-200`/`duration-300`، الخصائص `opacity` و`transform` و`colors` فقط.
- حركة دخول الصفحة: صنف `hj-page-enter` (في `styles.css`).
- **احترام `prefers-reduced-motion`:** تُعطَّل حركة الشريط المتحرك والعدّادات والتحريك (`motion-reduce:transition-none`، وقاعدة CSS في `styles.css`).

---

## 9. CSS المخصص

### 9.1 `css/styles.css` (≤ 300 سطر، CSS عادي)
- **لا `@apply`** (لا يعمل في ملف خارجي مع Play CDN). **يُمنع** إعادة إنشاء ما تغطيه أصناف Tailwind.
- يحتوي فقط:
  1. `:root` بمتغيرات تعكس الألوان (`--hj-violet-900:#4C1D95; --hj-gray-900:#111827; --hj-emerald-500:#10B981; --hj-gray-100:#F3F4F6;` …) — **الموضع الوحيد للألوان الحرفية خارج `config.js`**.
  2. شريط الإعلانات: `.hj-ticker`, `.hj-ticker__track`, `@keyframes hj-marquee` (يتحرك باتجاه القراءة RTL، ويتوقف عند `:hover` و`:focus-within`).
  3. شريط التقدم: `.hj-progress__bar { width: var(--hj-value, 0%); }`.
  4. تلميحات القائمة المطوية `.hj-tip`، وشريط تمرير رفيع للقائمة.
  5. حركة دخول الصفحة `.hj-page-enter`.
  6. حاويات الرسوم `.hj-chart { position: relative; height: 288px; }`.
  7. `[hidden] { display: none !important; }` وقاعدة `prefers-reduced-motion`.
  8. `.hj-ltr { direction: ltr; unicode-bidi: isolate; }`.
- أسماء الأصناف: **`hj-`** + BEM مبسّط (`hj-block__element--modifier`). **يُمنع** المحددات بـ `#id` وتداخل أعمق من مستويين، و`!important` (إلا ما ذُكر في البند 7).

### 9.2 `css/print.css`
- `@media print`: إخفاء `#app-shell, #login-root, #toast-root, #modal-root, #assistant-root, #boot-screen`، وإظهار `#print-root` فقط.
- `@page { size: A4; margin: 15mm }` افتراضيًا، والصنفان `body.paper-a5` و`body.paper-card` (85×54mm) لتغيير الورق.
- `print-color-adjust: exact` لعناوين البنفسجي، و`break-inside: avoid` للصفوف والبطاقات، و`break-after: page` بين الوثائق في الطباعة الجماعية.
- يستخدم `var(--hj-*)` من `styles.css`؛ **يسمح فيه `!important`** لإخفاء عناصر الطباعة فقط.

---

## 10. الرسوم البيانية (Chart.js)

### 10.1 القواعد
1. **كل** الرسوم عبر `HJ.charts` فقط. **يُمنع** `new Chart(...)` خارج `charts.js`.
2. واجهة الغلاف:
   ```js
   HJ.charts.line(canvas, { labels, datasets }, opts)
   HJ.charts.bar(canvas, { labels, datasets, stacked }, opts)
   HJ.charts.doughnut(canvas, { labels, data, centerText }, opts)
   HJ.charts.radar(canvas, { labels, datasets }, opts)
   HJ.charts.destroyAll()          // يستدعيها الراوتر قبل كل تغيير صفحة
   ```
3. كل رسم يُسجَّل تلقائيًا في سجل داخلي ليُدمَّر؛ و**يُمنع** إنشاء رسم جديد على `canvas` دون تدمير السابق.
4. الإعدادات الموحدة تُطبَّق مرة واحدة في `HJ.charts.init()` (من `boot()`): خط `Tajawal`، لون النص `gray-600` (#4B5563)، `responsive:true`، `maintainAspectRatio:false`، `rtl:true` في `plugins.legend` و`plugins.tooltip`، `textDirection:'rtl'`، وحركة قصيرة (تُعطَّل عند `prefers-reduced-motion`).
5. **الألوان من `HJ.config.CHART_COLORS` بالترتيب**، وللنوع `HJ.config.GENDER_COLORS` (بنين `#4C1D95`، بنات `#A78BFA`).
6. الحاوية: `<div class="hj-chart"><canvas aria-label="…" role="img"></canvas></div>` مع نص ملخص `sr-only` (بدائل نصية).
7. أرقام المحاور والتلميحات تمر بـ `HJ.utils.formatNumber` (تحترم تفضيل الأرقام).
8. **التدهور اللطيف:** إن لم تُحمَّل `Chart` (`typeof window.Chart === 'undefined'`) يعرض الغلاف **جدولًا بالبيانات** مع رسالة، ولا ينهار التطبيق.
9. الحالة الفارغة: نص «لا توجد بيانات» بدل رسم فارغ.
10. تحميل الرسوم عند ظهور الصفحة فقط؛ ولا تُنشأ في الخلفية.

### 10.2 الرسوم المعتمدة في اللوحة
| الرسم | النوع | الدالة |
|---|---|---|
| تقرير الحضور الكلي | `line` (مساحة مظللة؛ مبدّل 7/30/فصل) | `HJ.services.stats.attendanceTrend(range)` |
| توزيع الطلاب حسب الفصول | `bar` (مكدّس بنين/بنات اختياري) | `stats.studentsByClass()` |
| نسبة بنين/بنات | `doughnut` + نص مركزي | `stats.genderSplit()` |
- الصفحة تجلب البيانات من `stats` (مجمّعة)، **وليس** بحساب مباشر من `storage`.

---

## 11. معايير JavaScript

### 11.1 الأسلوب (ثابت)
| البند | القاعدة |
|---|---|
| الإصدار | ES2020، سكربتات كلاسيكية داخل IIFE، **بدون** `import/export` |
| الوضع | `'use strict'` في كل IIFE |
| التنسيق | مسافتان، فاصلة منقوطة، علامات اقتباس مفردة، فاصلة أخيرة للكائنات متعددة الأسطر، سطر ≤ 100 حرف |
| التصريح | `const` افتراضيًا، `let` عند الحاجة، **يُمنع `var`** |
| المقارنة | `===`/`!==` فقط |
| الدوال | الحد الأقصى 40 سطرًا للدالة، والمستدعيات سهمية |
| الأسماء | `camelCase` للمتغيرات والدوال، `PascalCase` للأصناف (الأخطاء)، `UPPER_SNAKE` للثوابت، `is/has/can` للمنطقية |
| التعليقات | بالإنجليزية، تشرح **لماذا** لا **ماذا**، وJSDoc موجز لكل دالة عامة |
| اللغة | **يُمنع** نص عربي في ملفات JS خارج `strings/*.js` و`seed-names.js` و`seed.js` (بيانات تجريبية) و`ai.js`/`aicontext.js` (تعليمات النظام الافتراضية والكلمات المفتاحية) |

### 11.2 المحظورات
`eval`، `new Function`، `document.write`، `innerHTML` بنص غير مُعقَّم، `onclick="…"` وأخواتها، `alert/confirm/prompt` الأصلية، `console.log` في الشيفرة المسلَّمة (استخدم `HJ.utils.log` المعطَّل في الإنتاج)، المتغيرات العامة، تعديل `Object.prototype`/`Array.prototype`، `setTimeout` بنص، `localStorage`/`sessionStorage` المباشر، `fetch` لملفات محلية، مكتبات خارجية إضافية.

### 11.3 بناء الـ DOM وأمنه (XSS)
1. أي نص مصدره مستخدم أو تخزين يُدرج بإحدى طريقتين **فقط**:
   - `el.textContent = value`
   - القالب الآمن `HJ.ui.html` (يُعقِّم كل ما يُدرج تلقائيًا):
   ```js
   const { html, raw } = HJ.ui;
   root.innerHTML = html`
     <h2 class="${HJ.ui.cls.pageTitle}">${student.fullName}</h2>
     <span>${raw(HJ.ui.icon('users', { size: 20 }))}</span>
   `;
   ```
2. **`raw()` لا يُستعمل أبدًا** مع بيانات من المستخدم أو التخزين، فقط مع مخرجات النظام الموثوقة (`HJ.ui.icon`, `HJ.ui.badge`...).
3. نصوص الإعلانات وردود المساعد تمر بـ `HJ.ui.markdown(text)` الذي يدعم فقرات وقوائم وغامق وجداول بسيطة فقط، دون أي HTML خام.
4. التحقق من نوع ملف الصورة وحجمه وإعادة ترميزها عبر `canvas` قبل التخزين.

### 11.4 الأحداث والتنظيف
- **التفويض عبر `data-action`**، لا مستمع لكل زر:
  ```html
  <button class="${cls.btn} ${cls.btnPrimary}" data-action="save">${HJ.t('common.save')}</button>
  ```
  ```js
  const off = HJ.ui.delegate(ctx.root, 'click', {
    save: (el, ev) => onSave(),
    remove: (el) => onRemove(el.dataset.id)
  });
  return function dispose() { off(); };
  ```
- كل مستمع على `window/document` أو مؤقت أو اشتراك في `HJ.events` **يجب** إلغاؤه في `dispose`.
- `data-action` بصيغة `kebab-case` فعلًا: `save`, `open-form`, `next-page`.
- **النماذج بلا `<form action>`:** تُدار بـ `HJ.ui.form` ومعالج `submit` مُفوَّض مع `preventDefault`.

### 11.5 تحديث الواجهة والأداء
- **يُمنع** إعادة رسم الصفحة كلها عند تغيير حقل واحد؛ حدِّث الجزء المتأثر.
- البحث بـ `HJ.utils.debounce` 250ms.
- الجداول > 100 صف: ترقيم صفحات (10/25/50) ودفعات رسم ≤ 50 صفًا.
- قراءات التخزين تمر بالذاكرة المؤقتة (§6.2)؛ **يُمنع** استدعاء `list` داخل حلقة رسم.
- تحميل بطيء للرسوم (§10.1-10).

### 11.6 النصوص العربية (`HJ.strings` و`HJ.t`)
```js
// js/strings/students.js
HJ.strings.students = {
  nav: 'الطلاب',
  pageTitle: 'إدارة الطلاب',
  listCount: '{n} طالب',
  'error.duplicateNationalId': 'الرقم القومي مسجل لطالب آخر'
};
// الاستخدام
HJ.t('students.pageTitle');
HJ.t('students.listCount', { n: 12 });
```
- المفتاح `<module>.<key>`، والموديول = اسم ملف `strings/<module>.js`، وكل ملف يسجّل بادئته فقط (المشترك في `common`).
- مفتاح مفقود يعيد المفتاح نفسه ويسجّل تحذيرًا؛ **يُمنع** ترك مفتاح مفقود في التسليم (فحص في §16).
- كل رسائل الأخطاء/النجاح والعناوين والعناصر النائبة (`placeholder`) و`aria-label` من `HJ.t`.

### 11.7 التواريخ والأرقام والنقود
- **يُمنع** `new Date('YYYY-MM-DD')` لتحليل تاريخ محلي (يعطي UTC)؛ استخدم `HJ.utils.parseDate`.
- `HJ.utils.today()` نص `YYYY-MM-DD` محلي، و`addDays`, `isSchoolDay(date)` (يطابق `SCHOOL_DAYS` والعطلات من الإعدادات).
- العرض: `HJ.utils.formatDate(d, { hijri })` (يستخدم `Intl.DateTimeFormat` بـ `ar-EG` و`ar-SA-u-ca-islamic-umalqura`)، `formatNumber(n)` (**أرقام غربية افتراضيًا** مع احترام تفضيل المستخدم)، `formatCurrency(n)` («1,250.00 ج.م»)، `relativeTime(iso)`.
- `HJ.utils.normalizeDigits(str)` يحول الأرقام الهندية المُدخلة إلى غربية **قبل** التحقق (الرقم القومي، الهاتف، الدرجات، المبالغ).
- `HJ.utils.normalizeArabic(str)` لتطبيع البحث (إزالة التشكيل، توحيد الألف/الياء/التاء المربوطة).
- `HJ.utils.money.*` و`HJ.utils.num.*` للحساب بأعداد صحيحة (§6.3)، و`HJ.utils.amountInWords(n)` لإيصالات السداد (مبلغ بالحروف).
- التوزيع العشوائي في البيانات التجريبية بـ `HJ.utils.rng(seed)` (مولّد ببذرة، مثل mulberry32).

### 11.8 التحقق (`validators.js`)
```js
HJ.validators.nationalId(v)   // → { ok, birthDate?, gender?, governorate?, errorKey? }
HJ.validators.phoneEG(v)      // ^01[0125][0-9]{8}$
HJ.validators.fullNameAr(v)   // 4 كلمات عربية على الأقل
HJ.validators.password(v, { username })
HJ.validators.student(data)   // → { ok, errors: { field: messageKey } }
HJ.validators.teacher(data)   HJ.validators.payment(data, remaining)   HJ.validators.grade(value, max)
HJ.validators.assert(result)  // يرمي ValidationError
```
- دوال **نقية** (بلا DOM ولا تخزين) وكلها مغطّاة بالاختبارات.
- **التحقق يُكرَّر في الخدمة دائمًا** حتى لو تحققت الواجهة.

---

## 12. المكوّنات المشتركة (`ui.js`) — الواجهات الثابتة

| الدالة | الاستخدام |
|---|---|
| `HJ.ui.html` / `raw` / `escapeHtml` | القوالب الآمنة |
| `HJ.ui.icon(name, opts)` | الأيقونات |
| `HJ.ui.toast(type, key, params?)` | إشعار عابر (`success/error/warning/info`)، أعلى **اليسار**، يختفي بعد 4 ثوانٍ |
| `await HJ.ui.confirm({ titleKey, messageKey, danger })` | **كل** حذف أو إجراء لا رجعة فيه |
| `HJ.ui.modal({ titleKey, body, size, onClose })` | نافذة بـ `role="dialog" aria-modal="true"`، تحبس التركيز، وتُغلق بـ `Esc`، وتعيد التركيز لما فتحها |
| `HJ.ui.form(config)` | بناء النماذج: حقول، قواعد، قيم أولية، أخطاء بجانب الحقل + ملخص، تعطيل زر الحفظ أثناء المعالجة، تطبيع الأرقام |
| `HJ.ui.table(config)` | أعمدة، ترتيب، ترقيم، تحديد متعدد، تصدير CSV (UTF-8 BOM)، حالة فارغة وتحميل (`animate-pulse`) |
| `HJ.ui.tabs(config)` | تبويبات مرتبطة بمعامل `?tab=` |
| `HJ.ui.statCard(config)` | بطاقة الإحصاء مع عدّاد متحرك (يُعطَّل عند تقليل الحركة) |
| `HJ.ui.badge(text, tone)` / `HJ.ui.progress(pct)` / `HJ.ui.emptyState(...)` / `HJ.ui.skeleton(...)` | |
| `HJ.ui.ticker(items)` | شريط الإعلانات المتحرك |
| `HJ.ui.print({ html, paper, title })` | يرسم داخل `#print-root` ويضيف `body.paper-*` ثم `window.print()` وينظف عند `afterprint` |
| `HJ.ui.markdown(text)` | عرض آمن |
| `HJ.ui.handleError(err, ctx)` | يترجم الأخطاء إلى رسائل ويربط `ValidationError` بالحقول |
| `HJ.ui.delegate(root, type, handlers)` | تفويض الأحداث |
| `HJ.ui.ltr(value)` | `<bdi dir="ltr">` |

- **يُمنع** بناء جدول بيانات أو نموذج أو نافذة يدويًا في الصفحات الجديدة إلا للتخطيطات الخاصة (مصفوفة الحضور الشهرية، شبكة الجدول الدراسي، شاشة الدرجات التفاعلية، بطاقات الفصول).
- كل قائمة لها **حالة فارغة** و**حالة تحميل**، وكل نموذج له **حالة خطأ** و**نجاح**.

---

## 13. المساعد الذكي (`ai.js`, `aicontext.js`, `components/assistant.js`)

### 13.1 الفصل بين المسؤوليات
| الملف | المسؤولية |
|---|---|
| `ai.js` | المحوّلات (OpenAI/Anthropic/Gemini/مخصص)، الاتصال بـ `fetch`، المهلة والأخطاء، إدارة الإعدادات والمفتاح |
| `services/aicontext.js` | بناء السياق (لقطة مجمّعة + استرجاع موجّه محليًا) وإخفاء الأسماء |
| `components/assistant.js` | واجهة المحادثة (لا اتصال شبكي ولا منطق بيانات) |
| `pages/settings.js` (تبويب `ai`) | واجهة إعدادات المساعد |

### 13.2 الواجهة
```js
HJ.ai.isEnabledFor(user)                       // يراعي تفعيل الدور والموافقة
HJ.ai.send({ messages, user }) → Promise<{ text, usage? }>
HJ.ai.testConnection() → Promise<{ ok, errorCode? }>
HJ.ai.saveKey(key, { persist }) / clearKey() / hasKey() / maskedKey()
HJ.ai.localAnswer(question, user)              // الوضع المحلي بدون مفتاح
```
- المحوّلات تطابق `requirements.md` §8.13.4. **يُتحقق من التوثيق الرسمي الحالي لكل مزوّد عند التنفيذ**، ولا يُنسخ شكل الطلب من الذاكرة.
- ترويسة Anthropic للمتصفح `anthropic-dangerous-direct-browser-access: true` إلزامية لذلك المحوّل.

### 13.3 رموز الأخطاء (`AiError.code`)
`NO_KEY` · `CONSENT_REQUIRED` · `DISABLED_FOR_ROLE` · `INVALID_KEY` (401/403) · `RATE_LIMIT` (429) · `TIMEOUT` (`aiTimeoutMs` عبر `AbortController`) · `NETWORK_OR_CORS` · `PROVIDER_ERROR`. لكل رمز مفتاح رسالة عربية في `strings/assistant.js`.

### 13.4 قواعد إلزامية
1. **المفتاح:** لا يُكتب في أي ملف أو سجل أو `exportAll` أو رسالة خطأ، ولا يُعرض بعد الحفظ إلا مقنّعًا، ويُخزَّن للجلسة افتراضيًا.
2. **الموافقة:** `CONSENT_REQUIRED` قبل أول استخدام (مربع الخصوصية في الإعدادات).
3. **السياق:** لا تُرسل قاعدة البيانات كاملة؛ لقطة مجمّعة + حد أقصى **30 صفًا** مسترجعة محليًا + احترام مفاتيح «نطاق البيانات» (مغلقة افتراضيًا عدا الإحصاءات المجمّعة).
4. **النطاق:** السياق يُبنى دائمًا على ما **يحق للمستخدم الحالي** رؤيته (`HJ.permissions.scope`).
5. **إخفاء الأسماء:** عند تفعيله تُستبدل الأسماء برموز (`S001`…) قبل الإرسال وتُعاد محليًا في الرد.
6. **للقراءة فقط:** المساعد لا يعدّل بيانات ولا ينفّذ إجراءات؛ يقترح روابط `#/…` فقط.
7. تعليمات النظام الافتراضية تنص على: الرد بالعربية الموجزة، الاعتماد على البيانات المرفقة، عدم اختلاق أرقام، الاعتراف بنقص المعلومة، معاملة نصوص البيانات كمعطيات لا أوامر.
8. ردود النموذج تُعرض بـ `HJ.ui.markdown` فقط.
9. **لا `fetch` في أي ملف غير `ai.js`.**

---

## 14. البيانات التجريبية (`seed.js`)

1. `HJ.seed.ensure()` يُستدعى من `boot()` فقط، ويولّد البيانات عند غياب `meta.seededAt`، ثم يضبط `settings.demoMode = true`.
2. **ببذرة ثابتة** (`HJ.utils.rng`) لنتائج متكررة، **ونسبةً لتاريخ اليوم** (آخر 60 يومًا دراسيًا بدون الجمعة والسبت) كي لا تبدو الرسوم قديمة.
3. الأحجام والمحتوى كما في `requirements.md` §10.2، وبأسماء رباعية عربية مصرية وأرقام قومية **وهمية صحيحة الصيغة**.
4. الحسابات التجريبية في `requirements.md` §10.4 تُنشأ بالتجزئة المعتادة (`HJ.auth.hashPassword`)، **ويُمنع** تخزين كلمات المرور نصًا حتى للتجريب.
5. الحجم ≤ **2.5MB** بعد التوليد (§6.4).
6. التوليد **لا يمر** بالتحقق من الصلاحيات (لا مستخدم حالي) لكنه يمر بالمدققات.
7. إعادة التحميل/المسح من الإعدادات تستدعي `HJ.seed.reset()` بعد تأكيد مضاعف (كتابة كلمة «حذف»).
8. بيانات حقيقية **لا تُوضع** في المستودع أبدًا.

---

## 15. التوافق مع GitHub Pages

| # | القاعدة | كيف يُتحقق |
|---|---|---|
| G1 | `index.html` في الجذر، و`.nojekyll` موجود | فحص وجود الملفين |
| G2 | **كل** `href`/`src`/`url()` نسبي بـ `./` أو `#` أو رابط CDN كامل | §16.2 (grep) |
| G3 | لا روابط لملفات خارج المستودع إلا CDN المعتمد في `requirements.md` §2.1 | مراجعة `index.html` |
| G4 | التوجيه `#/` فقط، وتحديث الصفحة على أي مسار يعمل | تجربة يدوية |
| G5 | لا أسرار أو مفاتيح أو بيانات حقيقية في المستودع، و`.gitignore` يغطي `.env` والنسخ الاحتياطية | مراجعة |
| G6 | `README.md` بالعربية يطابق `requirements.md` §15 | مراجعة |
| G7 | النشر: **Settings → Pages → Deploy from a branch → `main` → `/ (root)`** | `requirements.md` §3.4 |
| G8 | شاشة بديلة واضحة عند فشل Tailwind/Chart.js (`app.js` يفحص `window.tailwind` و`window.Chart`) | حظر الشبكة يدويًا |

---

## 16. الاختبارات وتعريف الإنجاز (Definition of Done)

### 16.1 الاختبارات الآلية (`tests/index.html`)
- تُحمِّل ملفات `config` ← `strings` ← `utils` ← `validators` ← `storage` ← … بالترتيب نفسه من `index.html`، وتضبط **قبل** `storage.js`:
  `window.HJ_TEST_PREFIX = 'hagar_test_'` ليستخدمه `config.js` بدل البادئة الحقيقية، فلا تُلمس بيانات حقيقية.
- مشغّل بسيط: `HJ.test.describe / it / expect(...).toBe / toEqual / toThrow`.
- **إلزامي تغطية:**
  - `validators.nationalId` و`phoneEG` و`fullNameAr` وتطبيع الأرقام الهندية.
  - حساب الدرجات: المجموع/النسبة/التقدير/الترتيب في الحالات الحدية **49.99 / 50 / 84.99 / 85 / التعادل**.
  - نسبة الحضور وتجميع الحالات الأربع، وتنبيهات الغياب (3 أيام متتالية، 10%، 15%).
  - كشف تعارض الجدول (مدرس/قاعة/فصل).
  - الأقساط: منع الدفع الزائد، المتبقي، المتأخر؛ والحساب بالقروش.
  - حدود الإعارة (الحد الأقصى، النسخ المتاحة، المتأخر، التجديد).
  - `HJ.utils.money` و`rng` (نفس البذرة = نفس الناتج) و`amountInWords`.
  - مطابقة أنماط الراوتر (`/students/:id`) والاستعلام.
  - جدول الصلاحيات: فحوص عيّنية على كل دور (خصوصًا نطاق ولي الأمر والطالب والمدرس).
  - التمثيل المدمج للحضور والدرجات: ذهابًا وإيابًا (round-trip) إلى الشكل المسطّح.
  - غياب مفاتيح `HJ.t` (يمسح الشيفرة المصدرية ويتحقق أن كل مفتاح مستخدم معرَّف).
  - عدم تضمين مفتاح API في `exportAll`.

### 16.2 أوامر الفحص الآلي (تُشغَّل من جذر المستودع، **ويجب أن تُرجع فراغًا**)
```bash
# 1) Web Storage خارج storage.js
grep -rnE "localStorage|sessionStorage" js --include=*.js | grep -v "js/storage.js"

# 2) مسارات مطلقة أو روابط HTML أخرى
grep -nE '(href|src)="/[^/]' index.html
grep -rnE "url\(/" css
grep -rnE 'href="[^#h"][^"]*\.html' index.html js

# 3) ألوان حرفية خارج المواضع المسموحة
grep -rnE "#[0-9A-Fa-f]{6}\b" js css --include=*.js --include=*.css \
  | grep -vE "js/config.js|css/styles.css"

# 4) أصناف فيزيائية ممنوعة وأحجام غير معتمدة
grep -rnE "\b(ml|mr|pl|pr|left|right)-[0-9\[]|text-(left|right)|space-x-|\b(sm|xl|2xl):" js index.html

# 5) محظورات JS
grep -rnE "\bvar\b|eval\(|new Function|document\.write|onclick=|style=\"" js index.html
grep -rnE "console\.(log|debug)" js | grep -v "js/utils.js"

# 6) fetch خارج ai.js
grep -rnE "\bfetch\(|XMLHttpRequest" js | grep -v "js/ai.js"

# 7) new Chart خارج charts.js، و type=module
grep -rn "new Chart(" js | grep -v "js/charts.js"
grep -n 'type="module"' index.html

# 8) حجم الملفات (حد 400 سطر JS، 300 سطر styles.css)
find js -name "*.js" -exec wc -l {} + | awk '$1>400 && $2!="total"'
wc -l css/styles.css | awk '$1>300'
```
- أي مخرجات تُعدّ مخالفة تُصلح قبل التسليم (الاستثناءات الموثقة فقط في `docs/DECISIONS.md`).

### 16.3 قائمة الإنجاز (كل مهمة)
- [ ] الملفات في مواضعها وبأسمائها (§2)، وأسطر `index.html` في الـ SLOT بالترتيب الأبجدي (§3.2).
- [ ] لا ألوان حرفية ولا ألوان خارج القائمة البيضاء، ولا أصناف فيزيائية أو `sm:/xl:`.
- [ ] الأصناف من `HJ.ui.cls`/`HJ.ui.tone`، ولا تجميع نصي لأسماء الأصناف.
- [ ] لا نص عربي خارج `strings/*`، ولا مفتاح `HJ.t` مفقود.
- [ ] لا `localStorage` مباشر، ولا `innerHTML` بنص غير مُعقَّم، ولا `onclick`، ولا `style=`.
- [ ] الصلاحيات مطبقة في **الخدمة والواجهة** وفق `requirements.md` §6.2.
- [ ] الروابط بـ `HJ.router.href`، والتبويبات والمرشحات في الاستعلام، والنماذج في نوافذ.
- [ ] `dispose` يلغي المستمعات/المؤقتات/الاشتراكات، والرسوم تُدمَّر (تنقّل 10 مرات بين الصفحات دون تراكم).
- [ ] RTL سليم عند 360px و768px و1280px، بلا تمرير أفقي للصفحة.
- [ ] حالات: فارغة، تحميل، خطأ، نجاح؛ وتأكيد قبل كل حذف.
- [ ] تحقق المدخلات في الواجهة **والخدمة**، والأرقام الهندية تُطبَّع.
- [ ] الاختبارات المعنية خضراء وما قبلها ما زال أخضر، وأوامر §16.2 فارغة.
- [ ] تسجيل العمليات في `activity` وفق §6.7.
- [ ] تحديث `docs/PROGRESS.md` و`docs/CHANGELOG.md`.
- [ ] لا كود معلَّق ولا `TODO` بلا رقم في `PROGRESS.md`.

---

## 17. بروتوكول التعاون بين النماذج (منع التعارض)

### 17.1 قبل البدء (بالترتيب)
1. اقرأ `requirements.md` ثم `speckit.md` كاملين.
2. اقرأ `docs/PROGRESS.md` و`docs/DECISIONS.md`.
3. افتح أقرب ملفات مشابهة لعملك (صفحة/خدمة مشابهة) **وقلّد أسلوبها بالضبط**. الاتساق أهم من تفضيلك.
4. تحقق من وجود أي دالة قبل استخدامها، **ولا تخترع توقيعات**.

### 17.2 نطاق المهمة
- المهمة = **شريحة رأسية واحدة**: خدمة + صفحة + نصوص + اختبارات لوظيفة محددة.
- **يُمنع** تعديل ملفات خارج نطاقها، أو «تحسين» أو إعادة تنسيق كود لم يُطلب، أو إعادة تسمية دالة/ملف/مفتاح/حقل بيانات موجود.
- التعديل على الموجود **إضافي** (دالة جديدة، حقل اختياري). كسر التوافق يتطلب مهمة `[REFACTOR]` وسجلًا في `CHANGELOG.md`.

### 17.3 نقاط الاحتكاك
| الملف | القاعدة |
|---|---|
| `index.html` | سطر واحد داخل `SLOT` الخاص بك |
| `js/config.js` | إضافة داخل القسم المعني فقط، ولا تعديل لقيمة قائمة |
| `js/icons.js` | إضافة في آخر الكائن |
| `js/permissions.js` | **لا يُعدَّل** إلا مهمة `[SPEC]`/`[CORE]` تبدأ بتحديث `requirements.md` §6.2 |
| `js/ui.js`, `router.js`, `auth.js`, `storage.js`, `charts.js`, `utils.js`, `validators.js` | `[CORE]` معنونة صراحة، بأقل تغيير، مع اختبار |
| `js/strings/common.js` | إضافة في آخر الكائن |
| `css/styles.css` | إضافة في نهاية القسم المعني، وتعديل القائم `[CORE]` |
| `docs/PROGRESS.md` | تعديل **سطر وحدتك فقط** |
| `docs/CHANGELOG.md` | إضافة أعلى القائمة فقط |

### 17.4 صيغ التوثيق
```md
<!-- docs/PROGRESS.md -->
| الوحدة | الخدمة | الصفحة | النصوص | الاختبارات | الحالة | ملاحظات |
|---|---|---|---|---|---|---|
| students | ✓ | ✓ | ✓ | ✓ | مكتملة | — |
| attendance | ✓ | ◐ | ✓ | ✗ | قيد العمل | ينقص: مصفوفة الشهر |
```
رموز: ✓ مكتمل · ◐ جزئي · ✗ لم يبدأ. الحالة: `لم تبدأ / قيد العمل / مكتملة / محجوبة`.
```md
<!-- docs/CHANGELOG.md : الأحدث أولًا -->
## 2026-11-21 — [FEATURE] students: قائمة الطلاب ونموذج الإضافة
- الملفات: services/students.js, pages/students.js, strings/students.js
- يعتمد على: validators.nationalId, ui.table, ui.form
```
```md
<!-- docs/DECISIONS.md -->
### D-007 — سعة الفصل
- السياق: requirements CL-06 لم يحدد المنع أو التحذير
- القرار: تحذير بلا منع، والحد في settings.classCapacity (افتراضي 45)
- التاريخ: 2026-11-21
```
وسوم المهام: `[FEATURE]` `[FIX]` `[CORE]` `[REFACTOR]` `[SPEC]` `[TEST]` `[DOCS]`.

### 17.5 السلوك عند المشاكل
- **تعارض متطلبات:** طبّق §0.2 ودوّن في `DECISIONS.md`.
- **عيب في ملف خارج مهمتك:** لا تُصلحه بصمت؛ سجّله في `PROGRESS.md` (الملاحظات) كمهمة `[FIX]` مقترحة.
- **نقص في ملف أساسي تحتاجه:** لا تكرر وظيفته؛ سجّل طلب `[CORE]` وطبّق حلًا محليًا غير مصدَّر معلَّمًا بـ `// TEMP(core-request-N)`.
- **ترتيب التنفيذ المقترح:** يتبع `requirements.md` §14؛ **لا تبدأ مرحلة قبل اكتمال اعتمادياتها** (مثل: لا صفحة قبل خدمتها).
- رسائل الالتزام (إن استُخدم git): `[TAG] module: وصف موجز بصيغة الأمر`.

---

## 18. المحظورات المطلقة (ملخص)

1. أي إطار/مكتبة غير Tailwind وChart.js، أو أداة بناء، أو `type="module"`.
2. المسارات المطلقة، و`<base>`، وروابط لصفحات HTML أخرى، و`pushState`.
3. متغيرات عامة غير `HJ`، أو ملفات خارج §2.
4. `localStorage`/`sessionStorage` المباشر، أو مفاتيح خارج §6.1، أو سر داخل `exportAll`.
5. ألوان حرفية خارج `config.js` و`:root`، أو لوحات ألوان غير القائمة البيضاء، أو `sm:/xl:/2xl:`.
6. أصناف فيزيائية (`ml-* mr-* left-* right-*...`) أو `space-x-*` أو تجميع نصي لأسماء الأصناف.
7. نص عربي ظاهر خارج `strings/*`.
8. `innerHTML` بنص غير معقّم، `eval`، `onclick` المضمّن، `style=` المضمّن.
9. `new Chart(` خارج `charts.js`، أو رسم بلا تدمير.
10. `fetch` لملف محلي، أو `fetch` خارج `ai.js`.
11. اعتماد الصفحات على التخزين مباشرة، أو استدعاء الصفحات لبعضها، أو خدمة تقرأ خدمة وقت التحميل.
12. تعديل ملف وحدة أخرى أو ملف أساسي خارج المهمة المخصصة، أو إعادة تسمية/تغيير توقيع موجود دون `[REFACTOR]`.
13. تخطي التحقق من الصلاحية أو المدخلات في الخدمة، أو الاكتفاء بإخفاء العناصر.
14. تخزين كلمة مرور أو hash داخل الجلسة، أو كلمة مرور نصًا صريحًا في أي مكان (حتى التجريبية).
15. تضمين مفتاح API أو أي سر في الشيفرة أو المستودع أو سجل العمليات.
16. `catch {}` فارغ، أو `console.log` في الشيفرة المسلَّمة.
17. سجل منفصل لكل خانة حضور/درجة (يجب التمثيل المدمج §6.4).

---

## الملحق أ — قالب صفحة (`js/pages/example.js`)

```js
(function (HJ) {
  'use strict';

  const { ROLES } = HJ.config;
  const { html, raw, cls } = HJ.ui;
  const t = HJ.t;

  function render(root, state) {
    root.innerHTML = html`
      <section class="space-y-4">
        <header class="flex items-center justify-between gap-3">
          <h1 class="${cls.pageTitle}">${t('example.pageTitle')}</h1>
          <button class="${cls.btn} ${cls.btnPrimary}" data-action="add">
            ${raw(HJ.ui.icon('plus', { size: 18 }))} ${t('common.add')}
          </button>
        </header>
        ${state.items.length === 0
          ? raw(HJ.ui.emptyState({ titleKey: 'example.empty' }))
          : state.items.map((i) => html`<div class="${cls.card}">${i.name}</div>`)}
      </section>`;
  }

  function mount(ctx) {
    const state = { items: [] };

    function load() {
      try {
        state.items = HJ.services.example.list(ctx.query);
        render(ctx.root, state);
      } catch (err) {
        HJ.ui.handleError(err);
      }
    }

    const offClick = HJ.ui.delegate(ctx.root, 'click', {
      add: () => openForm()
    });
    const offData = HJ.events.on(HJ.config.EVENTS.DATA_CHANGED, (e) => {
      if (e.entity === 'example') load();
    });

    function openForm() { /* HJ.ui.modal + HJ.ui.form */ }

    load();
    return function dispose() { offClick(); offData(); };
  }

  HJ.pages.example = {
    id: 'example',
    routes: ['/example'],
    roles: [ROLES.ADMIN],
    titleKey: 'example.pageTitle',
    hero: 'compact',
    nav: { labelKey: 'example.nav', icon: 'school', order: 100 },
    mount
  };
  HJ.router.register(HJ.pages.example);

})(window.HJ);
```

## الملحق ب — قالب خدمة (`js/services/example.js`)

```js
(function (HJ) {
  'use strict';

  const ENTITY = 'example';
  const { EVENTS } = HJ.config;

  /** @returns {Array<object>} */
  function list(query = {}) {
    HJ.permissions.assert('example.read');
    const q = HJ.utils.normalizeArabic(query.q || '');
    return HJ.storage.list(ENTITY, (r) => !q || HJ.utils.normalizeArabic(r.name).includes(q));
  }

  /** @throws {HJ.errors.ValidationError|HJ.errors.PermissionError|HJ.errors.ConflictError} */
  function create(data) {
    HJ.permissions.assert('example.create');
    HJ.validators.assert(HJ.validators.example(data));
    if (HJ.storage.list(ENTITY, (r) => r.name === data.name).length) {
      throw new HJ.errors.ConflictError('example.error.duplicate');
    }
    const record = HJ.storage.create(ENTITY, data);
    HJ.services.activity.log({
      type: 'example.create', entity: ENTITY, entityId: record.id, params: { name: record.name }
    });
    HJ.events.emit(EVENTS.DATA_CHANGED, { entity: ENTITY, action: 'create', id: record.id });
    return record;
  }

  HJ.services.example = { list, create };

})(window.HJ);
```

## الملحق ج — خريطة التطابق مع `requirements.md` v2.0

| البند في المتطلبات | أين يُطبَّق في هذا الملف |
|---|---|
| §2 المكدس والإعداد | A1، §3.1، §8 |
| §3.1 الهيكل | §2.1 (مطابق) و§2.2 (إضافات معتمدة) |
| §3.2 مسارات `./`، hash، سكربتات كلاسيكية، `window.HJ`، ترتيب التحميل | A3–A5، §3.2، §5 |
| §3.3 `.gitignore` و§3.4 النشر | §15 |
| §4 الهوية البصرية (ألوان، خطوط، مكونات، RTL، حركة) | §8، §9 |
| §5 هيكل الواجهة (قائمة، هيدر، بطاقات متداخلة، زر المساعد) | §8.4 |
| §6 الصلاحيات | §7.1، §5.5 (ظهور القائمة)، §4.7 |
| §7 المصادقة | §7.2 |
| §8.2.2 الرسوم | §10 |
| §8.13 المساعد الذكي | §13 |
| §9 نموذج البيانات | §6 (مع التمثيل المدمج §6.4 مع بقاء الشكل المسطّح عند الاستهلاك) |
| §10 البيانات التجريبية | §14 |
| §11 غير الوظيفية | §10، §11، §16 |
| §11.6 `HJ.strings` | §11.6 |
| §13 معايير القبول | §16 |
| §14 خطة التنفيذ | §17.5 |

> **قرار تقني موثَّق (D-001):** التمثيل الفيزيائي المدمج للحضور والدرجات (§6.4) يغيّر **طريقة الحفظ فقط**، أما **الشكل الذي تُرجعه الخدمات وتقبله** فيطابق `requirements.md` §9.3 حرفيًا. السبب: السعة المحدودة لـ LocalStorage أمام حجم البيانات التجريبية المطلوب في §10.2.

---

*نهاية الوثيقة — speckit 2.0. أي سطر في المشروع لا يتوافق مع ما سبق يُعدّ خطأً حتى يُعدَّل هذا الملف رسميًا.*
