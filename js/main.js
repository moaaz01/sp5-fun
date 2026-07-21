// SP5 Tools - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // Tool search on homepage
  const searchInput = document.getElementById('toolSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const q = this.value.trim().toLowerCase();
      document.querySelectorAll('.tool-card').forEach(card => {
        const text = (card.textContent + ' ' + card.dataset.cat).toLowerCase();
        card.style.display = text.includes(q) || !q ? '' : 'none';
      });
    });
  }

  // Category filter
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const cat = this.dataset.cat;
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.tool-card').forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Copy to clipboard
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const target = document.getElementById(this.dataset.target);
      if (target) {
        navigator.clipboard.writeText(target.textContent).then(() => {
          this.textContent = '✓ تم النسخ';
          setTimeout(() => { this.textContent = 'نسخ'; }, 2000);
        });
      }
    });
  });
});

// Utility: format number
function formatNum(n, decimals = 2) {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// Utility: get input value
function getVal(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

// Utility: show result
function showResult(html) {
  const box = document.getElementById('result');
  if (box) {
    box.innerHTML = html;
    box.classList.add('show');
  }
}

// Security: sanitize input
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== LOAN CALCULATOR =====
function calculateLoan() {
  var amount = getVal('loanAmount');
  var annualRate = getVal('loanRate');
  var term = getVal('loanTerm');
  var termType = document.querySelector('.term-toggle button.active');
  var months = termType && termType.dataset.term === 'months' ? term : term * 12;

  if (amount <= 0 || annualRate <= 0 || months <= 0) {
    showResult('<p style="color:var(--danger);text-align:center;">يرجى إدخال قيم صحيحة</p>');
    return;
  }

  var r = annualRate / 100 / 12;
  var n = months;
  var monthly = amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  var totalPayment = monthly * n;
  var totalInterest = totalPayment - amount;

  var html = '<h3>📊 نتائج حاسبة القروض</h3>' +
    '<div class="result-grid">' +
    '<div class="result-card"><span class="result-label">القسط الشهري</span><span class="result-value">' + formatNum(monthly) + ' ر.س</span></div>' +
    '<div class="result-card"><span class="result-label">إجمالي السداد</span><span class="result-value">' + formatNum(totalPayment) + ' ر.س</span></div>' +
    '<div class="result-card"><span class="result-label">إجمالي الفوائد</span><span class="result-value">' + formatNum(totalInterest) + ' ر.س</span></div>' +
    '</div>' +
    '<div style="margin-top:16px">' +
    '<table class="breakdown-table"><thead><tr><th>السنة</th><th>القسط السنوي</th><th>الفوائد</th><th>السداد من الأصل</th><th>الرصيد المتبقي</th></tr></thead><tbody>';

  var balance = amount;
  for (var year = 1; year <= Math.ceil(n / 12); year++) {
    var yearInterest = 0, yearPrincipal = 0;
    var monthsInYear = Math.min(12, n - (year - 1) * 12);
    for (var m = 0; m < monthsInYear; m++) {
      var intPayment = balance * r;
      var prinPayment = monthly - intPayment;
      yearInterest += intPayment;
      yearPrincipal += prinPayment;
      balance -= prinPayment;
    }
    html += '<tr><td>' + year + '</td><td>' + formatNum(monthly * monthsInYear) + '</td><td>' + formatNum(yearInterest) + '</td><td>' + formatNum(yearPrincipal) + '</td><td>' + formatNum(Math.max(0, balance)) + '</td></tr>';
  }
  html += '</tbody></table></div>';
  showResult(html);
}

// ===== SALARY CALCULATOR =====
var COUNTRIES = {
  'SA': { name: 'السعودية', flag: '🇸🇦', taxRate: 0, socialRate: 0.0979, gosiRate: 0, currency: 'ر.س' },
  'AE': { name: 'الإمارات', flag: '🇦🇪', taxRate: 0, socialRate: 0, gosiRate: 0, currency: 'د.إ' },
  'EG': { name: 'مصر', flag: '🇪🇬', taxBrackets: [
    { limit: 15000, rate: 0 },
    { limit: 30000, rate: 0.025 },
    { limit: 45000, rate: 0.10 },
    { limit: 200000, rate: 0.15 },
    { limit: Infinity, rate: 0.20 }
  ], socialRate: 0.11, currency: 'ج.م' },
  'JO': { name: 'الأردن', flag: '🇯🇴', taxBrackets: [
    { limit: 5000, rate: 0 },
    { limit: 10000, rate: 0.05 },
    { limit: 15000, rate: 0.10 },
    { limit: 20000, rate: 0.15 },
    { limit: 30000, rate: 0.20 },
    { limit: Infinity, rate: 0.25 }
  ], socialRate: 0.075, currency: 'د.أ' },
  'KW': { name: 'الكويت', flag: '🇰🇼', taxRate: 0, socialRate: 0, gosiRate: 0, currency: 'د.ك' },
  'QA': { name: 'قطر', flag: '🇶🇦', taxRate: 0, socialRate: 0, gosiRate: 0, currency: 'ر.ق' },
  'BH': { name: 'البحرين', flag: '🇧🇭', taxRate: 0, socialRate: 0.07, currency: 'د.ب' },
  'OM': { name: 'عُمان', flag: '🇴🇲', taxRate: 0, socialRate: 0.07, currency: 'ر.ع' }
};

function calculateTax(gross, brackets) {
  if (!brackets) return 0;
  var tax = 0, prev = 0;
  for (var i = 0; i < brackets.length; i++) {
    var limit = brackets[i].limit;
    var rate = brackets[i].rate;
    if (gross <= prev) break;
    var taxable = Math.min(gross, limit) - prev;
    tax += taxable * rate;
    prev = limit;
  }
  return tax;
}

function calculateSalary() {
  var gross = getVal('grossSalary');
  var selectedEl = document.querySelector('.country-option.active');
  if (!selectedEl || gross <= 0) {
    showResult('<p style="color:var(--danger);text-align:center;">يرجى إدخال الراتب واختيار الدولة</p>');
    return;
  }
  var code = selectedEl.dataset.country;
  var c = COUNTRIES[code];
  var monthly = gross;
  var deductions = [];
  var totalDeductions = 0;

  // Social insurance
  if (c.socialRate > 0) {
    var social = monthly * c.socialRate;
    deductions.push({ label: 'التأمينات الاجتماعية (' + (c.socialRate * 100) + '%)', value: social });
    totalDeductions += social;
  }

  // Tax
  var tax = 0;
  if (c.taxBrackets) {
    tax = calculateTax(monthly, c.taxBrackets);
  } else if (c.taxRate > 0) {
    tax = monthly * c.taxRate;
  }
  if (tax > 0) {
    deductions.push({ label: 'الضريبة', value: tax });
    totalDeductions += tax;
  }

  var net = monthly - totalDeductions;

  var html = '<div class="net-salary-highlight"><div class="net-label">صافي الراتب الشهري</div><div class="net-amount">' + formatNum(net) + ' ' + c.currency + '</div></div>' +
    '<div style="margin-top:16px">' +
    '<div class="result-item"><span class="label">الراتب الإجمالي</span><span class="value">' + formatNum(monthly) + ' ' + c.currency + '</span></div>';

  for (var i = 0; i < deductions.length; i++) {
    html += '<div class="result-item"><span class="label">- ' + deductions[i].label + '</span><span class="value" style="color:var(--danger)">' + formatNum(deductions[i].value) + ' ' + c.currency + '</span></div>';
  }
  html += '<div class="result-item" style="border-top:2px solid var(--primary);padding-top:12px;font-weight:800"><span class="label">صافي الراتب</span><span class="value" style="color:var(--success)">' + formatNum(net) + ' ' + c.currency + '</span></div>' +
    '</div>' +
    '<p style="margin-top:12px;font-size:0.8rem;color:var(--text-light)">* النتائج تقريبية وقد تختلف حسب ظروفك الخاصة. راجع جهة العمل للتأكد.</p>';
  showResult(html);
}

// ===== COMPOUND INTEREST =====
function calculateCompound() {
  var principal = getVal('initialAmount');
  var monthly = getVal('monthlyContribution');
  var annualRate = getVal('interestRate');
  var years = getVal('investmentPeriod');

  if (principal < 0 || monthly < 0 || annualRate <= 0 || years <= 0) {
    showResult('<p style="color:var(--danger);text-align:center;">يرجى إدخال قيم صحيحة</p>');
    return;
  }

  var r = annualRate / 100 / 12;
  var n = years * 12;
  var totalContributions = principal + (monthly * n);

  // Build year-by-year table
  var tableRows = '';
  var balance = principal;
  for (var y = 1; y <= years; y++) {
    var yearStart = balance;
    for (var m = 0; m < 12; m++) {
      balance = balance * (1 + r) + monthly;
    }
    var yearInterest = balance - yearStart - (monthly * 12);
    tableRows += '<tr><td>' + y + '</td><td>' + formatNum(yearStart) + '</td><td>' + formatNum(monthly * 12) + '</td><td>' + formatNum(Math.max(0, yearInterest)) + '</td><td>' + formatNum(balance) + '</td></tr>';
  }

  var totalInterest = balance - totalContributions;

  var html = '<h3>📊 نتائج حاسبة الفائدة المركبة</h3>' +
    '<div class="result-grid">' +
    '<div class="result-card"><span class="result-label">المبلغ النهائي</span><span class="result-value">' + formatNum(balance) + ' ر.س</span></div>' +
    '<div class="result-card"><span class="result-label">إجمالي المساهمات</span><span class="result-value">' + formatNum(totalContributions) + ' ر.س</span></div>' +
    '<div class="result-card"><span class="result-label">إجمالي الأرباح</span><span class="result-value">' + formatNum(Math.max(0, totalInterest)) + ' ر.س</span></div>' +
    '</div>' +
    '<div style="margin-top:16px"><table class="breakdown-table"><thead><tr><th>السنة</th><th>الرصيد أول السنة</th><th>الإيداعات السنوية</th><th>الفوائد</th><th>الرصيد نهاية السنة</th></tr></thead><tbody>' +
    tableRows +
    '</tbody></table></div>';
  showResult(html);
}

// ===== BMI CALCULATOR =====
function calculateBMI() {
  var weight = getVal('bmiWeight');
  var heightCm = getVal('bmiHeight');

  if (weight <= 0 || heightCm <= 0) {
    showResult('<p style="color:var(--danger);text-align:center;">يرجى إدخال قيم صحيحة</p>');
    return;
  }

  var heightM = heightCm / 100;
  var bmi = weight / (heightM * heightM);
  var category, catClass, color;

  if (bmi < 18.5) { category = 'نقص الوزن'; catClass = 'underweight'; color = '#3b82f6'; }
  else if (bmi < 25) { category = 'وزن طبيعي'; catClass = 'normal'; color = '#10b981'; }
  else if (bmi < 30) { category = 'زيادة الوزن'; catClass = 'overweight'; color = '#f59e0b'; }
  else { category = 'سمنة'; catClass = 'obese'; color = '#ef4444'; }

  var idealMin = (18.5 * heightM * heightM).toFixed(1);
  var idealMax = (24.9 * heightM * heightM).toFixed(1);
  var pct = Math.min(100, Math.max(0, ((bmi - 10) / 35) * 100));

  var html = '<div style="text-align:center;margin-bottom:16px">' +
    '<div style="font-size:2.5rem;font-weight:800;color:' + color + '">' + formatNum(bmi, 1) + '</div>' +
    '<div style="font-size:1.1rem;color:' + color + ';font-weight:600">' + category + '</div></div>' +
    '<div class="bmi-scale"><div class="bmi-indicator" style="right:' + pct + '%"></div></div>' +
    '<div class="bmi-categories">' +
    '<div class="bmi-cat underweight">نقص الوزن<br><small>&lt; 18.5</small></div>' +
    '<div class="bmi-cat normal">وزن طبيعي<br><small>18.5 - 24.9</small></div>' +
    '<div class="bmi-cat overweight">زيادة الوزن<br><small>25 - 29.9</small></div>' +
    '<div class="bmi-cat obese">سمنة<br><small>≥ 30</small></div>' +
    '</div>' +
    '<div style="margin-top:16px">' +
    '<div class="result-item"><span class="label">وزنك الحالي</span><span class="value">' + formatNum(weight, 1) + ' كغ</span></div>' +
    '<div class="result-item"><span class="label">الوزن المثالي</span><span class="value">' + idealMin + ' - ' + idealMax + ' كغ</span></div>';

  if (weight > idealMax) {
    html += '<div class="result-item"><span class="label">وزن يجب خسارته</span><span class="value" style="color:var(--danger)">' + formatNum(weight - parseFloat(idealMax), 1) + ' كغ</span></div>';
  } else if (weight < idealMin) {
    html += '<div class="result-item"><span class="label">وزن يجب اكتسابه</span><span class="value" style="color:#3b82f6">' + formatNum(parseFloat(idealMin) - weight, 1) + ' كغ</span></div>';
  }

  html += '</div>';
  showResult(html);
}

// ===== CALORIE CALCULATOR =====
var ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'قليل الحركة', desc: 'مكتب - بدون تمرين', factor: 1.2 },
  { id: 'light', label: 'نشاط خفيف', desc: 'تمرين 1-3 أيام/أسبوع', factor: 1.375 },
  { id: 'moderate', label: 'نشاط متوسط', desc: 'تمرين 3-5 أيام/أسبوع', factor: 1.55 },
  { id: 'active', label: 'نشاط عالي', desc: 'تمرين 6-7 أيام/أسبوع', factor: 1.725 },
  { id: 'very', label: 'نشاط شديد', desc: 'تمرين مرتين يومياً', factor: 1.9 }
];

function calculateCalories() {
  var genderEl = document.querySelector('.gender-btn.active');
  if (!genderEl) {
    showResult('<p style="color:var(--danger);text-align:center;">يرجى اختيار الجنس</p>');
    return;
  }
  var gender = genderEl.dataset.gender;
  var age = getVal('calAge');
  var weight = getVal('calWeight');
  var height = getVal('calHeight');
  var activityEl = document.querySelector('.activity-option.active');
  if (!activityEl || age <= 0 || weight <= 0 || height <= 0) {
    showResult('<p style="color:var(--danger);text-align:center;">يرجى إدخال جميع القيم واختيار مستوى النشاط</p>');
    return;
  }
  var activityFactor = parseFloat(activityEl.dataset.factor);

  // Mifflin-St Jeor
  var bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  var tdee = bmr * activityFactor;

  var html = '<h3>🔥 احتياجك اليومي من السعرات</h3>' +
    '<div class="result-grid">' +
    '<div class="result-card"><span class="result-label">معدل الأيض الأساسي (BMR)</span><span class="result-value">' + Math.round(bmr) + '</span></div>' +
    '<div class="result-card"><span class="result-label">السعرات اليومية (TDEE)</span><span class="result-value">' + Math.round(tdee) + '</span></div>' +
    '</div>' +
    '<div class="calorie-goals">' +
    '<div class="calorie-goal-card loss"><div class="goal-label">🔥 خسارة الوزن<br><small>-500 سعرة/يوم</small></div><div class="goal-value">' + Math.round(tdee - 500) + '</div></div>' +
    '<div class="calorie-goal-card maintain"><div class="goal-label">⚖️ ثبات الوزن</div><div class="goal-value">' + Math.round(tdee) + '</div></div>' +
    '<div class="calorie-goal-card gain"><div class="goal-label">💪 زيادة الوزن<br><small>+500 سعرة/يوم</small></div><div class="goal-value">' + Math.round(tdee + 500) + '</div></div>' +
    '</div>' +
    '<p style="margin-top:12px;font-size:0.8rem;color:var(--text-light)">* النتائق تقريبية بناءً على معادلة Mifflin-St Jeor. استشر أخصائي تغذية لخطة مخصصة.</p>';
  showResult(html);
}
/* ===== SHARE FUNCTIONALITY ===== */
function shareTool(platform) {
  var url = encodeURIComponent(window.location.href);
  var title = encodeURIComponent(document.title.split(' - ')[0] || 'SP5 Tools');
  var text = encodeURIComponent(document.querySelector('.tool-desc') ? document.querySelector('.tool-desc').textContent : title);
  var links = {
    whatsapp: 'https://wa.me/?text=' + text + '%20' + url,
    telegram: 'https://t.me/share/url?url=' + url + '&text=' + text,
    twitter: 'https://twitter.com/intent/tweet?url=' + url + '&text=' + text,
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url
  };
  if (links[platform]) {
    window.open(links[platform], '_blank', 'width=600,height=400');
  }
}

function copyToolLink(btn) {
  navigator.clipboard.writeText(window.location.href).then(function() {
    btn.classList.add('copied');
    var orig = btn.innerHTML;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> تم النسخ!';
    setTimeout(function() {
      btn.classList.remove('copied');
      btn.innerHTML = orig;
    }, 2000);
  });
}

function toggleShareMenu() {
  var menu = document.getElementById('shareMenu');
  if (menu) menu.classList.toggle('open');
}

// Close share menu when clicking outside
document.addEventListener('click', function(e) {
  var menu = document.getElementById('shareMenu');
  var toggle = e.target.closest('.share-toggle');
  if (menu && menu.classList.contains('open') && !e.target.closest('.share-bar') && !toggle) {
    menu.classList.remove('open');
  }
});
