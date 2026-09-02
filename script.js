/* =========================================================
   HOME PROVIDER 2.0
   Family Finance Manager
   ========================================================= */


/* =========================================================
   DATA
   ========================================================= */

   let transactions =
   JSON.parse(
     localStorage.getItem("hp_transactions")
   ) || [];
 
 let members =
   JSON.parse(
     localStorage.getItem("hp_members")
   ) || [
     {
       id: 1,
       name: "أنا",
       emoji: "👤"
     }
   ];
 
 let goals =
   JSON.parse(
     localStorage.getItem("hp_goals")
   ) || [];
 
 let debts =
   JSON.parse(
     localStorage.getItem("hp_debts")
   ) || [];
 
 let recurring =
   JSON.parse(
     localStorage.getItem("hp_recurring")
   ) || [];
 
 let challenges =
   JSON.parse(
     localStorage.getItem("hp_challenges")
   ) || [];
 
 let receipts =
   JSON.parse(
     localStorage.getItem("hp_receipts")
   ) || [];
 
 let budget =
   Number(
     localStorage.getItem("hp_budget")
   ) || 0;
 
 let selectedType = "expense";
 
 
 /* =========================================================
    SAVE
    ========================================================= */
 
 function saveData() {
 
   localStorage.setItem(
     "hp_transactions",
     JSON.stringify(transactions)
   );
 
   localStorage.setItem(
     "hp_members",
     JSON.stringify(members)
   );
 
   localStorage.setItem(
     "hp_goals",
     JSON.stringify(goals)
   );
 
   localStorage.setItem(
     "hp_debts",
     JSON.stringify(debts)
   );
 
   localStorage.setItem(
     "hp_recurring",
     JSON.stringify(recurring)
   );
 
   localStorage.setItem(
     "hp_challenges",
     JSON.stringify(challenges)
   );
 
   localStorage.setItem(
     "hp_receipts",
     JSON.stringify(receipts)
   );
 
   localStorage.setItem(
     "hp_budget",
     String(budget)
   );
 
 }
 
 
 /* =========================================================
    HELPERS
    ========================================================= */
 
 function money(value) {
 
   return (
     Number(value) || 0
   ).toLocaleString(
     "ar-JO",
     {
       minimumFractionDigits: 2,
       maximumFractionDigits: 2
     }
   ) + " د.أ";
 
 }
 
 
 function escapeHTML(value) {
 
   const div =
     document.createElement("div");
 
   div.textContent =
     String(value ?? "");
 
   return div.innerHTML;
 
 }
 
 
 function showToast(message) {
 
   const toast =
     document.querySelector("#toast");
 
   if (!toast) return;
 
   toast.textContent =
     message;
 
   toast.classList.add("show");
 
   clearTimeout(
     window.hpToastTimer
   );
 
   window.hpToastTimer =
     setTimeout(() => {
 
       toast.classList.remove(
         "show"
       );
 
     }, 2500);
 
 }
 
 
 function today() {
 
   return new Date()
     .toLocaleDateString(
       "ar-JO"
     );
 
 }
 
 
 /* =========================================================
    NAVIGATION
    ========================================================= */
 
 const pages =
   document.querySelectorAll(".page");
 
 const navButtons =
   document.querySelectorAll(".nav-btn");
 
 
 function showPage(pageName) {
 
   pages.forEach(page => {
 
     page.classList.remove(
       "active"
     );
 
   });
 
 
   const page =
     document.getElementById(
       pageName
     );
 
   if (page) {
 
     page.classList.add(
       "active"
     );
 
   }
 
 
   navButtons.forEach(button => {
 
     button.classList.toggle(
       "active",
       button.dataset.page ===
         pageName
     );
 
   });
 
 
   window.scrollTo({
     top: 0,
     behavior: "smooth"
   });
 
 
   renderAll();
 
 }
 
 
 navButtons.forEach(button => {
 
   button.addEventListener(
     "click",
     () => {
 
       showPage(
         button.dataset.page
       );
 
     }
   );
 
 });
 
 
 /* =========================================================
    TRANSACTION MODAL
    ========================================================= */
 
 const transactionModal =
   document.querySelector(
     "#transactionModal"
   );
 
 
 function openTransactionModal() {
 
   if (!transactionModal) return;
 
   transactionModal.classList.remove(
     "hidden"
   );
 
   updateMemberSelect();
 
   const amount =
     document.querySelector(
       "#amount"
     );
 
   if (amount) {
 
     setTimeout(
       () => amount.focus(),
       100
     );
 
   }
 
 }
 
 
 function closeTransactionModal() {
 
   if (!transactionModal) return;
 
   transactionModal.classList.add(
     "hidden"
   );
 
 }
 
 
 document
   .querySelectorAll(
     "#openTransactionModal, .open-transaction-btn"
   )
   .forEach(button => {
 
     button.addEventListener(
       "click",
       openTransactionModal
     );
 
   });
 
 
 document
   .querySelector(
     "#closeTransactionModal"
   )
   ?.addEventListener(
     "click",
     closeTransactionModal
   );
 
 
 transactionModal?.addEventListener(
   "click",
   event => {
 
     if (
       event.target ===
       transactionModal
     ) {
 
       closeTransactionModal();
 
     }
 
   }
 );
 
 
 /* =========================================================
    TRANSACTION TYPE
    ========================================================= */
 
 document
   .querySelectorAll(
     ".type-btn"
   )
   .forEach(button => {
 
     button.addEventListener(
       "click",
       () => {
 
         document
           .querySelectorAll(
             ".type-btn"
           )
           .forEach(btn =>
             btn.classList.remove(
               "selected"
             )
           );
 
         button.classList.add(
           "selected"
         );
 
         selectedType =
           button.dataset.type;
 
       }
     );
 
   });
 
 
 /* =========================================================
    ADD TRANSACTION
    ========================================================= */
 
 document
   .querySelector(
     "#saveTransaction"
   )
   ?.addEventListener(
     "click",
     () => {
 
       const amount =
         Number(
           document.querySelector(
             "#amount"
           )?.value
         );
 
       const description =
         document.querySelector(
           "#description"
         )?.value
           .trim();
 
       const category =
         document.querySelector(
           "#category"
         )?.value || "أخرى";
 
       const member =
         document.querySelector(
           "#member"
         )?.value || "1";
 
       const paymentMethod =
         document.querySelector(
           "#paymentMethod"
         )?.value || "cash";
 
       const note =
         document.querySelector(
           "#note"
         )?.value
           .trim();
 
 
       if (
         !amount ||
         amount <= 0
       ) {
 
         showToast(
           "اكتب مبلغ صحيح"
         );
 
         return;
 
       }
 
 
       if (!description) {
 
         showToast(
           "اكتب وصف العملية"
         );
 
         return;
 
       }
 
 
       transactions.push({
 
         id: Date.now(),
 
         amount,
 
         description,
 
         category,
 
         member,
 
         type: selectedType,
 
         paymentMethod,
 
         note,
 
         date: today(),
 
         timestamp:
           Date.now()
 
       });
 
 
       saveData();
 
       clearTransactionForm();
 
       closeTransactionModal();
 
       renderAll();
 
       showToast(
         selectedType === "income"
           ? "تمت إضافة الدخل 💰"
           : "تمت إضافة المصروف 💸"
       );
 
     }
   );
 
 
 function clearTransactionForm() {
 
   [
     "#amount",
     "#description",
     "#note"
   ].forEach(selector => {
 
     const input =
       document.querySelector(
         selector
       );
 
     if (input) {
 
       input.value = "";
 
     }
 
   });
 
 }
 
 
 /* =========================================================
    MEMBERS
    ========================================================= */
 
 function updateMemberSelect() {
 
   const select =
     document.querySelector(
       "#member"
     );
 
   if (!select) return;
 
 
   select.innerHTML = "";
 
 
   members.forEach(member => {
 
     const option =
       document.createElement(
         "option"
       );
 
     option.value =
       member.id;
 
     option.textContent =
       `${member.emoji} ${member.name}`;
 
     select.appendChild(
       option
     );
 
   });
 
 }
 
 
 function updateMemberFilter() {
 
   const select =
     document.querySelector(
       "#filterMember"
     );
 
   if (!select) return;
 
 
   const current =
     select.value;
 
 
   select.innerHTML = `
     <option value="all">
       كل الأفراد
     </option>
   `;
 
 
   members.forEach(member => {
 
     const option =
       document.createElement(
         "option"
       );
 
     option.value =
       member.id;
 
     option.textContent =
       `${member.emoji} ${member.name}`;
 
     select.appendChild(
       option
     );
 
   });
 
 
   if (
     [...select.options]
       .some(
         option =>
           option.value ===
           current
       )
   ) {
 
     select.value =
       current;
 
   }
 
 }
 
 
 /* ADD MEMBER */
 
 document
   .querySelector(
     "#addMemberBtn"
   )
   ?.addEventListener(
     "click",
     () => {
 
       document
         .querySelector(
           "#memberModal"
         )
         ?.classList.remove(
           "hidden"
         );
 
     }
   );
 
 
 document
   .querySelector(
     "#closeMemberModal"
   )
   ?.addEventListener(
     "click",
     () => {
 
       document
         .querySelector(
           "#memberModal"
         )
         ?.classList.add(
           "hidden"
         );
 
     }
   );
 
 
 document
   .querySelector(
     "#saveMember"
   )
   ?.addEventListener(
     "click",
     () => {
 
       const name =
         document.querySelector(
           "#memberName"
         )?.value
           .trim();
 
       const emoji =
         document.querySelector(
           "#memberEmoji"
         )?.value
           .trim() || "👤";
 
 
       if (!name) {
 
         showToast(
           "اكتب اسم الفرد"
         );
 
         return;
 
       }
 
 
       members.push({
 
         id: Date.now(),
 
         name,
 
         emoji
 
       });
 
 
       saveData();
 
       document.querySelector(
         "#memberName"
       ).value = "";
 
       document.querySelector(
         "#memberEmoji"
       ).value = "👤";
 
 
       document
         .querySelector(
           "#memberModal"
         )
         ?.classList.add(
           "hidden"
         );
 
 
       renderAll();
 
       showToast(
         "تمت إضافة الفرد 👨‍👩‍👧‍👦"
       );
 
     }
   );
 
 
 /* =========================================================
    CALCULATIONS
    ========================================================= */
 
 function calculateTotals() {
 
   let income = 0;
 
   let expenses = 0;
 
 
   transactions.forEach(
     transaction => {
 
       const amount =
         Number(
           transaction.amount
         ) || 0;
 
 
       if (
         transaction.type ===
         "income"
       ) {
 
         income += amount;
 
       } else {
 
         expenses += amount;
 
       }
 
     }
   );
 
 
   return {
 
     income,
 
     expenses,
 
     balance:
       income - expenses
 
   };
 
 }
 
 
 function monthExpenses() {
 
   const now =
     new Date();
 
 
   const month =
     now.getMonth();
 
   const year =
     now.getFullYear();
 
 
   return transactions
     .filter(transaction => {
 
       if (
         transaction.type !==
         "expense"
       ) {
 
         return false;
 
       }
 
 
       const date =
         new Date(
           transaction.timestamp
         );
 
 
       return (
         date.getMonth() ===
           month &&
         date.getFullYear() ===
           year
       );
 
     })
     .reduce(
       (sum, transaction) =>
         sum +
         Number(
           transaction.amount
         ),
       0
     );
 
 }
 
 
 /* =========================================================
    DASHBOARD
    ========================================================= */
 
 function renderDashboard() {
 
   const totals =
     calculateTotals();
 
 
   setText(
     "#balance",
     money(totals.balance)
   );
 
   setText(
     "#total-income",
     money(totals.income)
   );
 
   setText(
     "#total-expenses",
     money(totals.expenses)
   );
 
 
   const currentMonth =
     monthExpenses();
 
 
   setText(
     "#monthly-saving",
     money(
       Math.max(
         totals.income -
           currentMonth,
         0
       )
     )
   );
 
 
   setText(
     "#transaction-count",
     transactions.length
   );
 
 
   let status =
     "ابدأ بإضافة أول عملية";
 
 
   if (
     totals.balance > 0
   ) {
 
     status =
       "وضعك المالي إيجابي 👍";
 
   }
 
 
   if (
     totals.balance < 0
   ) {
 
     status =
       "انتبه، المصروف أعلى من الدخل ⚠️";
 
   }
 
 
   setText(
     "#balanceStatus",
     status
   );
 
 
   renderDashboardBudget();
 
   renderDashboardGoal();
 
   renderAlerts();
 
   renderDashboardTransactions();
 
   renderSmartAnalysis();
 
 }
 
 
 function setText(
   selector,
   value
 ) {
 
   const element =
     document.querySelector(
       selector
     );
 
   if (element) {
 
     element.textContent =
       value;
 
   }
 
 }
 
 
 /* =========================================================
    SMART ANALYSIS
    ========================================================= */
 
 function getSmartAnalysis() {
 
   const totals =
     calculateTotals();
 
   const expenses =
     transactions.filter(
       transaction =>
         transaction.type ===
         "expense"
     );
 
 
   if (
     transactions.length === 0
   ) {
 
     return {
 
       title:
         "أضف عمليات حتى نبدأ التحليل 🤖",
 
       details:
         "سأحلل مصاريفك وأعطيك نصائح تساعدك توفر أكثر."
 
     };
 
   }
 
 
   if (
     totals.expenses >
     totals.income &&
     totals.income > 0
   ) {
 
     return {
 
       title:
         "المصاريف أعلى من الدخل ⚠️",
 
       details:
         "حاول تخفف المصاريف غير الضرورية وتراجع أكبر التصنيفات."
 
     };
 
   }
 
 
   const categories = {};
 
 
   expenses.forEach(transaction => {
 
     const category =
       transaction.category ||
       "أخرى";
 
 
     categories[category] =
       (
         categories[category] ||
         0
       ) +
       Number(
         transaction.amount
       );
 
   });
 
 
   const sorted =
     Object.entries(
       categories
     ).sort(
       (a, b) =>
         b[1] - a[1]
     );
 
 
   if (
     sorted.length > 0
   ) {
 
     const biggest =
       sorted[0];
 
 
     return {
 
       title:
         `أكبر مصروف عندك هو ${biggest[0]} 🔎`,
 
       details:
         `صرفك في هذا التصنيف وصل إلى ${money(biggest[1])}. إذا خففت منه قليلًا ممكن تزيد نسبة التوفير بشكل واضح.`
 
     };
 
   }
 
 
   return {
 
     title:
       "استمر بمتابعة مصاريفك 👏",
 
     details:
       "تسجيل المصاريف باستمرار يساعدك تعرف وين بتروح فلوسك."
 
   };
 
 }
 
 
 function renderSmartAnalysis() {
 
   const analysis =
     getSmartAnalysis();
 
 
   setText(
     "#smartMessage",
     analysis.title
   );
 
   setText(
     "#smartDetails",
     analysis.details
   );
 
 }
 
 
 /* =========================================================
    BUDGET
    ========================================================= */
 
 function renderDashboardBudget() {
 
   const spent =
     monthExpenses();
 
 
   const remaining =
     Math.max(
       budget - spent,
       0
     );
 
 
   setText(
     "#dashboardBudgetText",
     budget > 0
       ? `الميزانية: ${money(budget)}`
       : "لم يتم تحديد ميزانية"
   );
 
 
   setText(
     "#dashboardBudgetSpent",
     `مصروف: ${money(spent)}`
   );
 
 
   setText(
     "#dashboardBudgetRemaining",
     `متبقي: ${money(remaining)}`
   );
 
 
   const progress =
     document.querySelector(
       "#dashboardBudgetProgress"
     );
 
 
   if (progress) {
 
     const percentage =
       budget > 0
         ? Math.min(
             (spent / budget) *
               100,
             100
           )
         : 0;
 
 
     progress.style.width =
       percentage + "%";
 
   }
 
 }
 
 
 document
   .querySelector(
     "#saveBudget"
   )
   ?.addEventListener(
     "click",
     () => {
 
       const value =
         Number(
           document.querySelector(
             "#budgetInput"
           )?.value
         );
 
 
       if (
         !value ||
         value <= 0
       ) {
 
         showToast(
           "اكتب ميزانية صحيحة"
         );
 
         return;
 
       }
 
 
       budget = value;
 
       saveData();
 
       renderAll();
 
       showToast(
         "تم حفظ الميزانية 💳"
       );
 
     }
   );
 
 
 /* =========================================================
    GOALS
    ========================================================= */
 
 function renderDashboardGoal() {
 
   const goal =
     goals.length
       ? goals[0]
       : null;
 
 
   if (!goal) {
 
     setText(
       "#dashboardGoalText",
       "لا يوجد هدف"
     );
 
     setText(
       "#dashboardGoalSaved",
       "موفر: 0.00 د.أ"
     );
 
     setText(
       "#dashboardGoalRemaining",
       "متبقي: 0.00 د.أ"
     );
 
 
     const progress =
       document.querySelector(
         "#dashboardGoalProgress"
       );
 
     if (progress) {
 
       progress.style.width =
         "0%";
 
     }
 
     return;
 
   }
 
 
   const amount =
     Number(
       goal.amount
     ) || 0;
 
   const saved =
     Number(
       goal.saved
     ) || 0;
 
 
   const percentage =
     amount > 0
       ? Math.min(
           saved / amount * 100,
           100
         )
       : 0;
 
 
   setText(
     "#dashboardGoalText",
     goal.name
   );
 
 
   setText(
     "#dashboardGoalSaved",
     `موفر: ${money(saved)}`
   );
 
 
   setText(
     "#dashboardGoalRemaining",
     `متبقي: ${money(
       Math.max(
         amount - saved,
         0
       )
     )}`
   );
 
 
   const progress =
     document.querySelector(
       "#dashboardGoalProgress"
     );
 
   if (progress) {
 
     progress.style.width =
       percentage + "%";
 
   }
 
 }
 
 
 document
   .querySelector(
     "#saveGoal"
   )
   ?.addEventListener(
     "click",
     () => {
 
       const name =
         document.querySelector(
           "#goalName"
         )?.value
           .trim();
 
       const amount =
         Number(
           document.querySelector(
             "#goalAmount"
           )?.value
         );
 
       const saved =
         Number(
           document.querySelector(
             "#goalSavedInput"
           )?.value
         ) || 0;
 
 
       if (!name) {
 
         showToast(
           "اكتب اسم الهدف"
         );
 
         return;
 
       }
 
 
       if (
         !amount ||
         amount <= 0
       ) {
 
         showToast(
           "اكتب مبلغ الهدف"
         );
 
         return;
 
       }
 
 
       goals.push({
 
         id: Date.now(),
 
         name,
 
         amount,
 
         saved
 
       });
 
 
       saveData();
 
       document.querySelector(
         "#goalName"
       ).value = "";
 
       document.querySelector(
         "#goalAmount"
       ).value = "";
 
       document.querySelector(
         "#goalSavedInput"
       ).value = "";
 
 
       renderAll();
 
       showToast(
         "تمت إضافة هدف التوفير 🎯"
       );
 
     }
   );
 
 
 function renderGoals() {
 
   const container =
     document.querySelector(
       "#goalsList"
     );
 
   if (!container) return;
 
 
   container.innerHTML = "";
 
 
   if (
     goals.length === 0
   ) {
 
     container.innerHTML = `
       <div class="empty">
         لم تضف أي أهداف بعد 🎯
       </div>
     `;
 
     return;
 
   }
 
 
   goals.forEach(goal => {
 
     const amount =
       Number(
         goal.amount
       ) || 0;
 
     const saved =
       Number(
         goal.saved
       ) || 0;
 
     const percentage =
       amount > 0
         ? Math.min(
             saved / amount * 100,
             100
           )
         : 0;
 
 
     const div =
       document.createElement(
         "div"
       );
 
 
     div.className =
       "goal-item";
 
 
     div.innerHTML = `
 
       <div class="goal-item-header">
 
         <div class="goal-item-title">
 
           <div class="goal-item-icon">
             🎯
           </div>
 
           <h4>
             ${escapeHTML(
               goal.name
             )}
           </h4>
 
         </div>
 
         <span class="goal-percent">
           ${Math.round(
             percentage
           )}%
         </span>
 
       </div>
 
 
       <div class="progress">
 
         <div
           class="progress-bar saving"
           style="width:${percentage}%"
         ></div>
 
       </div>
 
 
       <div class="goal-item-info">
 
         <span>
           ${money(saved)}
         </span>
 
         <span>
           من ${money(amount)}
         </span>
 
       </div>
 
     `;
 
 
     container.appendChild(
       div
     );
 
   });
 
 }
 
 
 /* =========================================================
    ALERTS
    ========================================================= */
 
 function renderAlerts() {
 
   const container =
     document.querySelector(
       "#alertsContainer"
     );
 
   if (!container) return;
 
 
   const alerts = [];
 
 
   if (
     budget > 0
   ) {
 
     const spent =
       monthExpenses();
 
     const percentage =
       spent /
       budget *
       100;
 
 
     if (
       percentage >= 100
     ) {
 
       alerts.push({
         icon: "🚨",
         title:
           "تجاوزت الميزانية",
         text:
           `مصروف هذا الشهر ${money(spent)}`
       });
 
     } else if (
       percentage >= 80
     ) {
 
       alerts.push({
         icon: "⚠️",
         title:
           "اقتربت من الميزانية",
         text:
           `استخدمت ${Math.round(
             percentage
           )}% من الميزانية`
       });
 
     }
 
   }
 
 
   const totals =
     calculateTotals();
 
 
   if (
     totals.expenses >
       totals.income &&
     totals.income > 0
   ) {
 
     alerts.push({
       icon: "📉",
       title:
         "المصاريف أعلى من الدخل",
       text:
         "راجع المصاريف غير الضرورية."
     });
 
   }
 
 
   if (
     alerts.length === 0
   ) {
 
     container.innerHTML = `
       <div class="empty">
         وضعك المالي مستقر حاليًا 👍
       </div>
     `;
 
     return;
 
   }
 
 
   container.innerHTML = "";
 
 
   alerts.forEach(alert => {
 
     const div =
       document.createElement(
         "div"
       );
 
 
     div.className =
       "alert-item";
 
 
     div.innerHTML = `
 
       <div class="alert-icon">
         ${alert.icon}
       </div>
 
       <div>
 
         <strong>
           ${alert.title}
         </strong>
 
         <p>
           ${alert.text}
         </p>
 
       </div>
 
     `;
 
 
     container.appendChild(
       div
     );
 
   });
 
 }
 
 
 /* =========================================================
    DASHBOARD TRANSACTIONS
    ========================================================= */
 
 function renderDashboardTransactions() {
 
   const container =
     document.querySelector(
       "#dashboardTransactions"
     );
 
   if (!container) return;
 
 
   container.innerHTML = "";
 
 
   const latest =
     [...transactions]
       .sort(
         (a, b) =>
           b.timestamp -
           a.timestamp
       )
       .slice(0, 7);
 
 
   if (
     latest.length === 0
   ) {
 
     container.innerHTML = `
       <div class="empty">
         ما في عمليات لحد الآن 💸
       </div>
     `;
 
     return;
 
   }
 
 
   latest.forEach(
     transaction => {
 
       container.appendChild(
         transactionElement(
           transaction
         )
       );
 
     }
   );
 
 }
 
 
 function transactionElement(
   transaction
 ) {
 
   const div =
     document.createElement(
       "div"
     );
 
 
   div.className =
     "transaction";
 
 
   const sign =
     transaction.type ===
     "income"
       ? "+"
       : "-";
 
 
   const color =
     transaction.type ===
     "income"
       ? "green"
       : "red";
 
 
   const icons = {
 
     "طعام": "🍔",
 
     "منزل": "🏠",
 
     "تسوق": "🛒",
 
     "مواصلات": "🚗",
 
     "فواتير": "💡",
 
     "تعليم": "📚",
 
     "صحة": "💊",
 
     "ترفيه": "🎮",
 
     "ملابس": "👕",
 
     "سفر": "✈️",
 
     "أخرى": "📦"
 
   };
 
 
   const icon =
     icons[
       transaction.category
     ] || "💳";
 
 
   const member =
     members.find(
       item =>
         String(item.id) ===
         String(
           transaction.member
         )
     );
 
 
   const memberText =
     member
       ? `${member.emoji} ${member.name}`
       : "👤";
 
 
   div.innerHTML = `
 
     <div class="transaction-info">
 
       <div class="transaction-icon">
         ${icon}
       </div>
 
       <div>
 
         <strong>
           ${escapeHTML(
             transaction.description
           )}
         </strong>
 
         <small>
           ${escapeHTML(
             transaction.category
           )}
           •
           ${escapeHTML(
             memberText
           )}
           •
           ${escapeHTML(
             transaction.date
           )}
         </small>
 
       </div>
 
     </div>
 
 
     <div class="transaction-amount ${color}">
 
       ${sign}${money(
         transaction.amount
       )}
 
     </div>
 
   `;
 
 
   div.style.cursor =
     "pointer";
 
 
   div.addEventListener(
     "click",
     () => {
 
       deleteTransaction(
         transaction.id
       );
 
     }
   );
 
 
   return div;
 
 }
 
 
 /* =========================================================
    ALL TRANSACTIONS
    ========================================================= */
 
 function renderAllTransactions() {
 
   const container =
     document.querySelector(
       "#allTransactions"
     );
 
   if (!container) return;
 
 
   const search =
     document.querySelector(
       "#searchInput"
     )?.value
       .trim()
       .toLowerCase() || "";
 
 
   const type =
     document.querySelector(
       "#filterType"
     )?.value ||
     "all";
 
 
   const category =
     document.querySelector(
       "#filterCategory"
     )?.value ||
     "all";
 
 
   const member =
     document.querySelector(
       "#filterMember"
     )?.value ||
     "all";
 
 
   let list =
     [...transactions];
 
 
   if (search) {
 
     list =
       list.filter(
         transaction =>
           transaction.description
             .toLowerCase()
             .includes(search) ||
 
           transaction.category
             .toLowerCase()
             .includes(search)
 
       );
 
   }
 
 
   if (
     type !== "all"
   ) {
 
     list =
       list.filter(
         transaction =>
           transaction.type ===
           type
       );
 
   }
 
 
   if (
     category !== "all"
   ) {
 
     list =
       list.filter(
         transaction =>
           transaction.category ===
           category
       );
 
   }
 
 
   if (
     member !== "all"
   ) {
 
     list =
       list.filter(
         transaction =>
           String(
             transaction.member
           ) ===
           String(member)
       );
 
   }
 
 
   list.sort(
     (a, b) =>
       b.timestamp -
       a.timestamp
   );
 
 
   container.innerHTML = "";
 
 
   if (
     list.length === 0
   ) {
 
     container.innerHTML = `
       <div class="empty">
         لا توجد عمليات مطابقة 🔎
       </div>
     `;
 
     return;
 
   }
 
 
   list.forEach(
     transaction => {
 
       container.appendChild(
         transactionElement(
           transaction
         )
       );
 
     }
   );
 
 }
 
 
 function updateCategoryFilter() {
 
   const select =
     document.querySelector(
       "#filterCategory"
     );
 
   if (!select) return;
 
 
   const current =
     select.value;
 
 
   const categories =
     [
       ...new Set(
         transactions.map(
           transaction =>
             transaction.category
         )
       )
     ];
 
 
   select.innerHTML = `
 
     <option value="all">
       كل التصنيفات
     </option>
 
   `;
 
 
   categories.forEach(
     category => {
 
       const option =
         document.createElement(
           "option"
         );
 
       option.value =
         category;
 
       option.textContent =
         category;
 
       select.appendChild(
         option
       );
 
     }
   );
 
 
   if (
     categories.includes(
       current
     )
   ) {
 
     select.value =
       current;
 
   }
 
 }
 
 
 [
   "#searchInput",
   "#filterType",
   "#filterCategory",
   "#filterMember"
 ].forEach(selector => {
 
   document
     .querySelector(
       selector
     )
     ?.addEventListener(
       "input",
       renderAllTransactions
     );
 
   document
     .querySelector(
       selector
     )
     ?.addEventListener(
       "change",
       renderAllTransactions
     );
 
 });
 
 
 function deleteTransaction(id) {
 
   if (
     !confirm(
       "هل تريد حذف هذه العملية؟"
     )
   ) {
 
     return;
 
   }
 
 
   transactions =
     transactions.filter(
       transaction =>
         transaction.id !== id
     );
 
 
   saveData();
 
   renderAll();
 
   showToast(
     "تم حذف العملية 🗑️"
   );
 
 }
 
 
 /* =========================================================
    STATISTICS
    ========================================================= */
 
 function renderStatistics() {
 
   const expenses =
     transactions.filter(
       transaction =>
         transaction.type ===
         "expense"
     );
 
 
   const total =
     expenses.reduce(
       (sum, transaction) =>
         sum +
         Number(
           transaction.amount
         ),
       0
     );
 
 
   const average =
     expenses.length
       ? total /
         expenses.length
       : 0;
 
 
   const biggest =
     expenses.reduce(
       (max, transaction) =>
         Math.max(
           max,
           Number(
             transaction.amount
           )
         ),
       0
     );
 
 
   setText(
     "#averageExpense",
     money(average)
   );
 
   setText(
     "#biggestTransaction",
     money(biggest)
   );
 
   setText(
     "#statisticsMonthExpense",
     money(
       monthExpenses()
     )
   );
 
 
   const categories = {};
 
 
   expenses.forEach(
     transaction => {
 
       const category =
         transaction.category ||
         "أخرى";
 
 
       categories[category] =
         (
           categories[category] ||
           0
         ) +
         Number(
           transaction.amount
         );
 
     }
   );
 
 
   const sorted =
     Object.entries(
       categories
     ).sort(
       (a, b) =>
         b[1] - a[1]
     );
 
 
   setText(
     "#biggestCategory",
     sorted.length
       ? sorted[0][0]
       : "-"
   );
 
 
   renderCategoryChart(
     sorted
   );
 
   renderMemberChart();
 
   renderMonthlyChart();
 
 }
 
 
 function renderCategoryChart(
   data
 ) {
 
   const container =
     document.querySelector(
       "#categoryChart"
     );
 
   if (!container) return;
 
 
   container.innerHTML = "";
 
 
   if (
     data.length === 0
   ) {
 
     container.innerHTML = `
       <div class="empty">
         لا توجد بيانات كافية 📊
       </div>
     `;
 
     return;
 
   }
 
 
   const max =
     data[0][1];
 
 
   data.forEach(
     ([name, value]) => {
 
       const percentage =
         value /
         max *
         100;
 
 
       const row =
         document.createElement(
           "div"
         );
 
 
       row.className =
         "chart-row";
 
 
       row.innerHTML = `
 
         <div class="chart-name">
           ${escapeHTML(name)}
         </div>
 
         <div class="chart-track">
 
           <div
             class="chart-fill"
             style="width:${percentage}%"
           ></div>
 
         </div>
 
         <div class="chart-value">
           ${money(value)}
         </div>
 
       `;
 
 
       container.appendChild(
         row
       );
 
     }
   );
 
 }
 
 
 function renderMemberChart() {
 
   const container =
     document.querySelector(
       "#memberChart"
     );
 
   if (!container) return;
 
 
   container.innerHTML = "";
 
 
   const data =
     members
       .map(member => {
 
         const value =
           transactions
             .filter(
               transaction =>
                 String(
                   transaction.member
                 ) ===
                 String(member.id) &&
                 transaction.type ===
                 "expense"
             )
             .reduce(
               (sum, transaction) =>
                 sum +
                 Number(
                   transaction.amount
                 ),
               0
             );
 
 
         return {
 
           name:
             `${member.emoji} ${member.name}`,
 
           value
 
         };
 
       })
       .filter(
         item =>
           item.value > 0
       )
       .sort(
         (a, b) =>
           b.value -
           a.value
       );
 
 
   if (
     data.length === 0
   ) {
 
     container.innerHTML = `
       <div class="empty">
         لا توجد بيانات كافية 📊
       </div>
     `;
 
     return;
 
   }
 
 
   const max =
     data[0].value;
 
 
   data.forEach(item => {
 
     const percentage =
       item.value /
       max *
       100;
 
 
     const row =
       document.createElement(
         "div"
       );
 
 
     row.className =
       "chart-row";
 
 
     row.innerHTML = `
 
       <div class="chart-name">
         ${escapeHTML(item.name)}
       </div>
 
       <div class="chart-track">
 
         <div
           class="chart-fill"
           style="width:${percentage}%"
         ></div>
 
       </div>
 
       <div class="chart-value">
         ${money(item.value)}
       </div>
 
     `;
 
 
     container.appendChild(
       row
     );
 
   });
 
 }
 
 
 /* MONTHLY */
 
 function renderMonthlyChart() {
 
   const container =
     document.querySelector(
       "#monthlyChart"
     );
 
   if (!container) return;
 
 
   container.innerHTML = "";
 
 
   const months = [];
 
   const now =
     new Date();
 
 
   for (
     let i = 5;
     i >= 0;
     i--
   ) {
 
     const date =
       new Date(
         now.getFullYear(),
         now.getMonth() -
           i,
         1
       );
 
 
     const value =
       transactions
         .filter(
           transaction => {
 
             if (
               transaction.type !==
               "expense"
             ) {
 
               return false;
 
             }
 
 
             const transactionDate =
               new Date(
                 transaction.timestamp
               );
 
 
             return (
               transactionDate.getMonth() ===
                 date.getMonth() &&
               transactionDate.getFullYear() ===
                 date.getFullYear()
             );
 
           }
         )
         .reduce(
           (sum, transaction) =>
             sum +
             Number(
               transaction.amount
             ),
           0
         );
 
 
     months.push({
 
       name:
         date.toLocaleDateString(
           "ar-JO",
           {
             month: "short"
           }
         ),
 
       value
 
     });
 
   }
 
 
   const max =
     Math.max(
       ...months.map(
         item =>
           item.value
       ),
       1
     );
 
 
   months.forEach(
     month => {
 
       const wrapper =
         document.createElement(
           "div"
         );
 
 
       wrapper.className =
         "month-bar-wrapper";
 
 
       const height =
         Math.max(
           3,
           month.value /
             max *
             180
         );
 
 
       wrapper.innerHTML = `
 
         <div class="month-value">
           ${money(month.value)}
         </div>
 
         <div
           class="month-bar"
           style="height:${height}px"
         ></div>
 
         <div class="month-name">
           ${escapeHTML(
             month.name
           )}
         </div>
 
       `;
 
 
       container.appendChild(
         wrapper
       );
 
     }
   );
 
 }
 
 
 /* =========================================================
    DEBTS
    ========================================================= */
 
 document
   .querySelector(
     "#addDebtBtn"
   )
   ?.addEventListener(
     "click",
     () => {
 
       document
         .querySelector(
           "#debtModal"
         )
         ?.classList.remove(
           "hidden"
         );
 
     }
   );
 
 
 document
   .querySelector(
     "#closeDebtModal"
   )
   ?.addEventListener(
     "click",
     () => {
 
       document
         .querySelector(
           "#debtModal"
         )
         ?.classList.add(
           "hidden"
         );
 
     }
   );
 
 
 document
   .querySelector(
     "#saveDebt"
   )
   ?.addEventListener(
     "click",
     () => {
 
       const person =
         document.querySelector(
           "#debtPerson"
         )?.value
           .trim();
 
       const amount =
         Number(
           document.querySelector(
             "#debtAmount"
           )?.value
         );
 
       const type =
         document.querySelector(
           "#debtType"
         )?.value ||
         "owedToMe";
 
       const note =
         document.querySelector(
           "#debtNote"
         )?.value
           .trim();
 
 
       if (!person) {
 
         showToast(
           "اكتب اسم الشخص"
         );
 
         return;
 
       }
 
 
       if (
         !amount ||
         amount <= 0
       ) {
 
         showToast(
           "اكتب مبلغ صحيح"
         );
 
         return;
 
       }
 
 
       debts.push({
 
         id: Date.now(),
 
         person,
 
         amount,
 
         type,
 
         note,
 
         paid: false
 
       });
 
 
       saveData();
 
       document
         .querySelector(
           "#debtModal"
         )
         ?.classList.add(
           "hidden"
         );
 
 
       renderAll();
 
       showToast(
         "تم حفظ الدين 💰"
       );
 
     }
   );
 
 
 function renderDebts() {
 
   const container =
     document.querySelector(
       "#debtsList"
     );
 
   if (!container) return;
 
 
   container.innerHTML = "";
 
 
   let owedToMe = 0;
 
   let iOwe = 0;
 
 
   debts.forEach(
     debt => {
 
       if (debt.paid) return;
 
 
       if (
         debt.type ===
         "owedToMe"
       ) {
 
         owedToMe +=
           Number(
             debt.amount
           );
 
       } else {
 
         iOwe +=
           Number(
             debt.amount
           );
 
       }
 
     }
   );
 
 
   setText(
     "#totalOwedToMe",
     money(owedToMe)
   );
 
   setText(
     "#totalIOwe",
     money(iOwe)
   );
 
 
   if (
     debts.length === 0
   ) {
 
     container.innerHTML = `
       <div class="card empty">
         لا توجد ديون مسجلة
       </div>
     `;
 
     return;
 
   }
 
 
   debts.forEach(debt => {
 
     const div =
       document.createElement(
         "div"
       );
 
 
     div.className =
       "debt-card";
 
 
     const owed =
       debt.type ===
       "owedToMe";
 
 
     div.innerHTML = `
 
       <div class="debt-person">
 
         <div class="debt-avatar">
           ${owed ? "📥" : "📤"}
         </div>
 
         <div>
 
           <h3>
             ${escapeHTML(
               debt.person
             )}
           </h3>
 
           <p>
             ${
               owed
                 ? "إلي عنده"
                 : "عليّ إله"
             }
           </p>
 
         </div>
 
       </div>
 
 
       <div>
 
         <div class="debt-amount ${
           owed
             ? "owed"
             : "iowe"
         }">
 
           ${money(
             debt.amount
           )}
 
         </div>
 
         <button
           class="text-btn"
           data-debt="${debt.id}"
         >
           تم التسديد
         </button>
 
       </div>
 
     `;
 
 
     container.appendChild(
       div
     );
 
   });
 
 
   container
     .querySelectorAll(
       "[data-debt]"
     )
     .forEach(button => {
 
       button.addEventListener(
         "click",
         () => {
 
           const id =
             Number(
               button.dataset.debt
             );
 
 
           const debt =
             debts.find(
               item =>
                 item.id === id
             );
 
 
           if (debt) {
 
             debt.paid =
               true;
 
             saveData();
 
             renderAll();
 
             showToast(
               "تم تسجيل التسديد ✅"
             );
 
           }
 
         }
       );
 
     });
 
 }
 
 
 /* =========================================================
    RECURRING
    ========================================================= */
 
 document
   .querySelector(
     "#addRecurringBtn"
   )
   ?.addEventListener(
     "click",
     () => {
 
       document
         .querySelector(
           "#recurringModal"
         )
         ?.classList.remove(
           "hidden"
         );
 
     }
   );
 
 
 document
   .querySelector(
     "#closeRecurringModal"
   )
   ?.addEventListener(
     "click",
     () => {
 
       document
         .querySelector(
           "#recurringModal"
         )
         ?.classList.add(
           "hidden"
         );
 
     }
   );
 
 
 document
   .querySelector(
     "#saveRecurring"
   )
   ?.addEventListener(
     "click",
     () => {
 
       const name =
         document.querySelector(
           "#recurringName"
         )?.value
           .trim();
 
       const amount =
         Number(
           document.querySelector(
             "#recurringAmount"
           )?.value
         );
 
       const category =
         document.querySelector(
           "#recurringCategory"
         )?.value ||
         "أخرى";
 
       const frequency =
         document.querySelector(
           "#recurringFrequency"
         )?.value ||
         "monthly";
 
 
       if (!name) {
 
         showToast(
           "اكتب اسم المصروف"
         );
 
         return;
 
       }
 
 
       if (
         !amount ||
         amount <= 0
       ) {
 
         showToast(
           "اكتب مبلغ صحيح"
         );
 
         return;
 
       }
 
 
       recurring.push({
 
         id: Date.now(),
 
         name,
 
         amount,
 
         category,
 
         frequency,
 
         active: true
 
       });
 
 
       saveData();
 
       document
         .querySelector(
           "#recurringModal"
         )
         ?.classList.add(
           "hidden"
         );
 
 
       renderAll();
 
       showToast(
         "تمت إضافة المصروف المتكرر 🔄"
       );
 
     }
   );
 
 
 function renderRecurring() {
 
   const container =
     document.querySelector(
       "#recurringList"
     );
 
   if (!container) return;
 
 
   container.innerHTML = "";
 
 
   if (
     recurring.length === 0
   ) {
 
     container.innerHTML = `
       <div class="card empty">
         لا توجد مصاريف متكررة
       </div>
     `;
 
     return;
 
   }
 
 
   recurring.forEach(item => {
 
     const div =
       document.createElement(
         "div"
       );
 
 
     div.className =
       "recurring-card";
 
 
     const frequency =
       item.frequency ===
       "weekly"
         ? "أسبوعي"
         : "شهري";
 
 
     div.innerHTML = `
 
       <div class="recurring-top">
 
         <div class="recurring-icon">
           🔄
         </div>
 
         <span class="recurring-frequency">
           ${frequency}
         </span>
 
       </div>
 
 
       <h3>
         ${escapeHTML(
           item.name
         )}
       </h3>
 
       <p>
         ${escapeHTML(
           item.category
         )}
       </p>
 
 
       <div class="recurring-bottom">
 
         <span class="recurring-price">
           ${money(
             item.amount
           )}
         </span>
 
         <button
           class="text-btn"
           data-recurring="${item.id}"
         >
           حذف
         </button>
 
       </div>
 
     `;
 
 
     container.appendChild(
       div
     );
 
   });
 
 
   container
     .querySelectorAll(
       "[data-recurring]"
     )
     .forEach(button => {
 
       button.addEventListener(
         "click",
         () => {
 
           const id =
             Number(
               button.dataset.recurring
             );
 
 
           recurring =
             recurring.filter(
               item =>
                 item.id !== id
             );
 
 
           saveData();
 
           renderAll();
 
           showToast(
             "تم حذف المصروف المتكرر"
           );
 
         }
       );
 
     });
 
 }
 
 
 /* =========================================================
    CHALLENGES
    ========================================================= */
 
 document
   .querySelector(
     "#addChallengeBtn"
   )
   ?.addEventListener(
     "click",
     () => {
 
       document
         .querySelector(
           "#challengeModal"
         )
         ?.classList.remove(
           "hidden"
         );
 
     }
   );
 
 
 document
   .querySelector(
     "#closeChallengeModal"
   )
   ?.addEventListener(
     "click",
     () => {
 
       document
         .querySelector(
           "#challengeModal"
         )
         ?.classList.add(
           "hidden"
         );
 
     }
   );
 
 
 document
   .querySelector(
     "#saveChallenge"
   )
   ?.addEventListener(
     "click",
     () => {
 
       const name =
         document.querySelector(
           "#challengeName"
         )?.value
           .trim();
 
       const target =
         Number(
           document.querySelector(
             "#challengeTarget"
           )?.value
         );
 
       const progress =
         Number(
           document.querySelector(
             "#challengeProgress"
           )?.value
         ) || 0;
 
 
       if (!name) {
 
         showToast(
           "اكتب اسم التحدي"
         );
 
         return;
 
       }
 
 
       if (
         !target ||
         target <= 0
       ) {
 
         showToast(
           "اكتب هدف التحدي"
         );
 
         return;
 
       }
 
 
       challenges.push({
 
         id: Date.now(),
 
         name,
 
         target,
 
         progress
 
       });
 
 
       saveData();
 
       document
         .querySelector(
           "#challengeModal"
         )
         ?.classList.add(
           "hidden"
         );
 
 
       renderAll();
 
       showToast(
         "تم إنشاء التحدي 🏆"
       );
 
     }
   );
 
 
 function renderChallenges() {
 
   const container =
     document.querySelector(
       "#challengesList"
     );
 
   if (!container) return;
 
 
   container.innerHTML = "";
 
 
   if (
     challenges.length === 0
   ) {
 
     container.innerHTML = `
       <div class="card empty">
         لا توجد تحديات حاليًا
       </div>
     `;
 
     return;
 
   }
 
 
   challenges.forEach(
     challenge => {
 
       const target =
         Number(
           challenge.target
         ) || 0;
 
       const progress =
         Number(
           challenge.progress
         ) || 0;
 
 
       const percentage =
         target > 0
           ? Math.min(
               progress /
                 target *
                 100,
               100
             )
           : 0;
 
 
       const div =
         document.createElement(
           "div"
         );
 
 
       div.className =
         "challenge-card";
 
 
       div.innerHTML = `
 
         <div class="challenge-card-header">
 
           <h3>
             ${escapeHTML(
               challenge.name
             )}
           </h3>
 
           <span class="challenge-trophy">
             🏆
           </span>
 
         </div>
 
 
         <p>
           تقدمك في التحدي
         </p>
 
 
         <div class="progress">
 
           <div
             class="progress-bar"
             style="width:${percentage}%"
           ></div>
 
         </div>
 
 
         <div class="challenge-stats">
 
           <span>
             ${money(progress)}
           </span>
 
           <span>
             من ${money(target)}
           </span>
 
           <button
             class="text-btn"
             data-challenge="${challenge.id}"
           >
             +10
           </button>
 
         </div>
 
       `;
 
 
       container.appendChild(
         div
       );
 
     }
   );
 
 
   container
     .querySelectorAll(
       "[data-challenge]"
     )
     .forEach(button => {
 
       button.addEventListener(
         "click",
         () => {
 
           const id =
             Number(
               button.dataset.challenge
             );
 
 
           const challenge =
             challenges.find(
               item =>
                 item.id === id
             );
 
 
           if (!challenge)
             return;
 
 
           challenge.progress =
             Math.min(
               Number(
                 challenge.progress
               ) + 10,
               Number(
                 challenge.target
               )
             );
 
 
           saveData();
 
           renderAll();
 
           showToast(
             "تقدم ممتاز! 🏆"
           );
 
         }
       );
 
     });
 
 }
 
 
 /* =========================================================
    RECEIPTS
    ========================================================= */
 
 document
   .querySelector(
     "#addReceiptBtn"
   )
   ?.addEventListener(
     "click",
     () => {
 
       const dateInput =
         document.querySelector(
           "#receiptDate"
         );
 
 
       if (
         dateInput &&
         !dateInput.value
       ) {
 
         dateInput.value =
           new Date()
             .toISOString()
             .split("T")[0];
 
       }
 
 
       document
         .querySelector(
           "#receiptModal"
         )
         ?.classList.remove(
           "hidden"
         );
 
     }
   );
 
 
 document
   .querySelector(
     "#closeReceiptModal"
   )
   ?.addEventListener(
     "click",
     () => {
 
       document
         .querySelector(
           "#receiptModal"
         )
         ?.classList.add(
           "hidden"
         );
 
     }
   );
 
 
 document
   .querySelector(
     "#saveReceipt"
   )
   ?.addEventListener(
     "click",
     () => {
 
       const store =
         document.querySelector(
           "#receiptStore"
         )?.value
           .trim();
 
       const amount =
         Number(
           document.querySelector(
             "#receiptAmount"
           )?.value
         );
 
       const date =
         document.querySelector(
           "#receiptDate"
         )?.value ||
         "";
 
       const note =
         document.querySelector(
           "#receiptNote"
         )?.value
           .trim();
 
 
       if (!store) {
 
         showToast(
           "اكتب اسم المحل"
         );
 
         return;
 
       }
 
 
       if (
         !amount ||
         amount <= 0
       ) {
 
         showToast(
           "اكتب مبلغ صحيح"
         );
 
         return;
 
       }
 
 
       receipts.push({
 
         id: Date.now(),
 
         store,
 
         amount,
 
         date,
 
         note
 
       });
 
 
       saveData();
 
 
       document
         .querySelector(
           "#receiptModal"
         )
         ?.classList.add(
           "hidden"
         );
 
 
       renderAll();
 
       showToast(
         "تم حفظ الفاتورة 🧾"
       );
 
     }
   );
 
 
 function renderReceipts() {
 
   const container =
     document.querySelector(
       "#receiptsList"
     );
 
   if (!container) return;
 
 
   container.innerHTML = "";
 
 
   if (
     receipts.length === 0
   ) {
 
     container.innerHTML = `
       <div class="card empty">
         لا توجد فواتير محفوظة
       </div>
     `;
 
     return;
 
   }
 
 
   [...receipts]
     .reverse()
     .forEach(receipt => {
 
       const div =
         document.createElement(
           "div"
         );
 
 
       div.className =
         "receipt-card";
 
 
       div.innerHTML = `
 
         <div class="receipt-card-top">
 
           <div class="receipt-icon">
             🧾
           </div>
 
           <div class="receipt-price">
             ${money(
               receipt.amount
             )}
           </div>
 
         </div>
 
 
         <h3>
           ${escapeHTML(
             receipt.store
           )}
         </h3>
 
         <p>
           ${escapeHTML(
             receipt.date
           )}
         </p>
 
         ${
           receipt.note
             ? `
               <p>
                 ${escapeHTML(
                   receipt.note
                 )}
               </p>
             `
             : ""
         }
 
       `;
 
 
       container.appendChild(
         div
       );
 
     });
 
 }
 
 
 /* =========================================================
    REPORTS
    ========================================================= */
 
 function renderReports() {
 
   const totals =
     calculateTotals();
 
 
   setText(
     "#reportIncome",
     money(totals.income)
   );
 
   setText(
     "#reportExpenses",
     money(totals.expenses)
   );
 
   setText(
     "#reportBalance",
     money(totals.balance)
   );
 
 
   setText(
     "#reportSaving",
     money(
       Math.max(
         totals.income -
           monthExpenses(),
         0
       )
     )
   );
 
 
   setText(
     "#reportDate",
     new Date()
       .toLocaleDateString(
         "ar-JO"
       )
   );
 
 
   const expenses =
     transactions.filter(
       transaction =>
         transaction.type ===
         "expense"
     );
 
 
   const categories = {};
 
 
   expenses.forEach(
     transaction => {
 
       const category =
         transaction.category ||
         "أخرى";
 
 
       categories[category] =
         (
           categories[category] ||
           0
         ) +
         Number(
           transaction.amount
         );
 
     }
   );
 
 
   const sorted =
     Object.entries(
       categories
     ).sort(
       (a, b) =>
         b[1] - a[1]
     );
 
 
   const list =
     document.querySelector(
       "#reportCategories"
     );
 
 
   if (list) {
 
     list.innerHTML = "";
 
 
     sorted
       .slice(0, 6)
       .forEach(
         ([category, value]) => {
 
           const item =
             document.createElement(
               "div"
             );
 
 
           item.className =
             "report-list-item";
 
 
           item.innerHTML = `
 
             <span>
               ${escapeHTML(
                 category
               )}
             </span>
 
             <strong>
               ${money(value)}
             </strong>
 
           `;
 
 
           list.appendChild(
             item
           );
 
         }
       );
 
   }
 
 
   const insights =
     document.querySelector(
       "#reportInsights"
     );
 
 
   if (insights) {
 
     const analysis =
       getSmartAnalysis();
 
 
     insights.innerHTML = `
 
       <div class="insight-item">
         🧠 ${escapeHTML(
           analysis.title
         )}
       </div>
 
       <div class="insight-item">
         💡 ${escapeHTML(
           analysis.details
         )}
       </div>
 
     `;
 
   }
 
 }
 
 
 document
   .querySelector(
     "#exportDataBtn"
   )
   ?.addEventListener(
     "click",
     exportData
   );
 
 
 document
   .querySelector(
     "#exportReportBtn"
   )
   ?.addEventListener(
     "click",
     exportData
   );
 
 
 document
   .querySelector(
     "#quickReportBtn"
   )
   ?.addEventListener(
     "click",
     () => {
 
       showPage(
         "reports"
       );
 
     }
   );
 
 
 function exportData() {
 
   const data = {
 
     app:
       "Home Provider",
 
     version:
       "2.0",
 
     exportedAt:
       new Date().toISOString(),
 
     transactions,
 
     members,
 
     goals,
 
     debts,
 
     recurring,
 
     challenges,
 
     receipts,
 
     budget
 
   };
 
 
   const blob =
     new Blob(
       [
         JSON.stringify(
           data,
           null,
           2
         )
       ],
       {
         type:
           "application/json"
       }
     );
 
 
   const url =
     URL.createObjectURL(
       blob
     );
 
 
   const link =
     document.createElement(
       "a"
     );
 
 
   link.href =
     url;
 
   link.download =
     "home-provider-backup.json";
 
 
   document.body.appendChild(
     link
   );
 
   link.click();
 
   link.remove();
 
 
   URL.revokeObjectURL(
     url
   );
 
 
   showToast(
     "تم تصدير النسخة الاحتياطية 📤"
   );
 
 }
 
 
 /* =========================================================
    IMPORT
    ========================================================= */
 
 document
   .querySelector(
     "#importDataBtn"
   )
   ?.addEventListener(
     "click",
     () => {
 
       document
         .querySelector(
           "#importFile"
         )
         ?.click();
 
     }
   );
 
 
 document
   .querySelector(
     "#importFile"
   )
   ?.addEventListener(
     "change",
     event => {
 
       const file =
         event.target.files?.[0];
 
 
       if (!file) return;
 
 
       const reader =
         new FileReader();
 
 
       reader.onload =
         () => {
 
           try {
 
             const data =
               JSON.parse(
                 reader.result
               );
 
 
             transactions =
               Array.isArray(
                 data.transactions
               )
                 ? data.transactions
                 : [];
 
             members =
               Array.isArray(
                 data.members
               )
                 ? data.members
                 : members;
 
             goals =
               Array.isArray(
                 data.goals
               )
                 ? data.goals
                 : [];
 
             debts =
               Array.isArray(
                 data.debts
               )
                 ? data.debts
                 : [];
 
             recurring =
               Array.isArray(
                 data.recurring
               )
                 ? data.recurring
                 : [];
 
             challenges =
               Array.isArray(
                 data.challenges
               )
                 ? data.challenges
                 : [];
 
             receipts =
               Array.isArray(
                 data.receipts
               )
                 ? data.receipts
                 : [];
 
             budget =
               Number(
                 data.budget
               ) || 0;
 
 
             saveData();
 
             renderAll();
 /* =========================================================
   📷 SMART RECEIPT OCR
   قراءة الفاتورة بالكاميرا
   ========================================================= */

(function () {

  const scanBtn = document.querySelector("#scanReceiptBtn");
  const modalScanBtn = document.querySelector("#modalScanReceiptBtn");
  const cameraInput = document.querySelector("#receiptCamera");

  if (!cameraInput) return;

  function openReceiptCamera() {
    cameraInput.value = "";
    cameraInput.click();
  }

  scanBtn?.addEventListener("click", openReceiptCamera);
  modalScanBtn?.addEventListener("click", openReceiptCamera);

  cameraInput.addEventListener("change", async function (event) {

    const file = event.target.files?.[0];

    if (!file) return;

    const status = document.querySelector("#ocrStatus");
    const progress = document.querySelector("#ocrProgress");

    status?.classList.remove("hidden");

    if (progress) {
      progress.textContent = "جاري تجهيز الصورة...";
    }

    try {

      if (typeof Tesseract === "undefined") {
        throw new Error("Tesseract غير موجود");
      }

      const result = await Tesseract.recognize(
        file,
        "ara+eng",
        {
          logger: function (info) {

            if (
              info.status === "recognizing text" &&
              progress
            ) {

              const percent =
                Math.round((info.progress || 0) * 100);

              progress.textContent =
                `جاري قراءة الفاتورة... ${percent}%`;

            }

          }
        }
      );

      const text = result?.data?.text || "";

      console.log("OCR RECEIPT:", text);

      const data = extractReceiptInformation(text);

      /*
       * تعبئة نموذج الفاتورة
       */

      const storeInput =
        document.querySelector("#receiptStore");

      const amountInput =
        document.querySelector("#receiptAmount");

      const dateInput =
        document.querySelector("#receiptDate");

      const noteInput =
        document.querySelector("#receiptNote");


      if (storeInput) {
        storeInput.value = data.store || "";
      }

      if (amountInput && data.amount) {
        amountInput.value = data.amount;
      }

      if (dateInput && data.date) {
        dateInput.value = data.date;
      }

      /*
       * إضافة النص المقروء للملاحظة
       * إذا لم تكن الملاحظة موجودة
       */

      if (noteInput && !noteInput.value.trim()) {

        noteInput.value =
          "تمت قراءة الفاتورة تلقائيًا.\n\n" +
          text.trim();

      }


      /*
       * افتح نافذة الفاتورة
       */

      document
        .querySelector("#receiptModal")
        ?.classList.remove("hidden");


      status?.classList.add("hidden");


      showToast?.(
        "تمت قراءة الفاتورة 📷🧾"
      );


    } catch (error) {

      console.error(
        "Receipt OCR Error:",
        error
      );

      status?.classList.add("hidden");

      showToast?.(
        "ما قدرت أقرأ الفاتورة، جرّب صورة أوضح 📷"
      );

    }

  });


  /* =======================================================
     استخراج بيانات الفاتورة
     ======================================================= */

  function extractReceiptInformation(text) {

    const cleanText =
      String(text || "")
        .replace(/\r/g, "\n");


    const lines =
      cleanText
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);


    /*
     * ============================
     * اسم المحل
     * ============================
     */

    let store = "";

    const storeKeywords = [
      "store",
      "market",
      "supermarket",
      "carrefour",
      "cozmo",
      "smart buy",
      "سامح مول",
      "كارفور",
      "كوستكو",
      "سوبرماركت",
      "ماركت",
      "مول"
    ];


    for (const line of lines) {

      const lower =
        line.toLowerCase();

      if (
        storeKeywords.some(
          keyword =>
            lower.includes(keyword)
        )
      ) {

        store = line;
        break;

      }

    }


    /*
     * إذا ما وجد اسم واضح،
     * خذ أول سطر مناسب.
     */

    if (!store) {

      for (const line of lines) {

        if (
          line.length >= 2 &&
          line.length <= 50 &&
          !/^[\d\s.,:/\-]+$/.test(line)
        ) {

          store = line;
          break;

        }

      }

    }


    /*
     * ============================
     * المبلغ
     * ============================
     */

    let amount = "";


    const amountPatterns = [

      /(?:grand\s*total|total|amount\s*due|net\s*total|subtotal)\s*[:\-]?\s*(?:jd|jod|د\.?\s*أ)?\s*([0-9]+(?:[.,][0-9]{1,2})?)/i,

      /(?:الإجمالي|المجموع|المبلغ|الصافي|المجموع\s*الكلي)\s*[:\-]?\s*([0-9]+(?:[.,][0-9]{1,2})?)/,

      /([0-9]+[.,][0-9]{2})\s*(?:jd|jod|د\.?\s*أ)/i,

      /(?:jd|jod|د\.?\s*أ)\s*([0-9]+[.,][0-9]{2})/i

    ];


    for (
      const pattern of amountPatterns
    ) {

      const match =
        cleanText.match(pattern);

      if (match) {

        amount =
          match[1]
            .replace(",", ".");

        break;

      }

    }


    /*
     * إذا ما وجدنا Total،
     * ابحث عن أكبر رقم عشري منطقي.
     */

    if (!amount) {

      const numbers =
        cleanText.match(
          /\b\d+[.,]\d{2}\b/g
        ) || [];


      const values =
        numbers
          .map(value =>
            Number(
              value.replace(",", ".")
            )
          )
          .filter(
            value =>
              value > 0 &&
              value < 100000
          );


      if (values.length) {

        amount =
          Math.max(...values)
            .toFixed(2);

      }

    }


    /*
     * ============================
     * التاريخ
     * ============================
     */

    let date = "";


    const datePatterns = [

      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,

      /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/

    ];


    for (
      const pattern of datePatterns
    ) {

      const match =
        cleanText.match(pattern);

      if (!match) continue;


      let day;
      let month;
      let year;


      if (
        match[1].length === 4
      ) {

        year = match[1];
        month = match[2];
        day = match[3];

      } else {

        day = match[1];
        month = match[2];
        year = match[3];

      }


      if (year.length === 2) {

        year = "20" + year;

      }


      date =
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      break;

    }


    return {
      store,
      amount,
      date
    };

  }

})();
             showToast(
               "تم استيراد البيانات ✅"
             );
 
           } catch {
 
             showToast(
               "الملف غير صالح ❌"
             );
 
           }
 
         };
 
 
       reader.readAsText(
         file
       );
 
     }
   );
 
 
 /* =========================================================
    DARK MODE
    ========================================================= */
 
 const themeBtn =
   document.querySelector(
     "#themeBtn"
   );
 
 
 function loadTheme() {
 
   const theme =
     localStorage.getItem(
       "hp_theme"
     );
 
 
   if (
     theme === "dark"
   ) {
 
     document.body.classList.add(
       "dark"
     );
 
   }
 
 
   updateThemeButton();
 
 }
 
 
 function updateThemeButton() {
 
   if (!themeBtn) return;
 
 
   themeBtn.textContent =
     document.body.classList.contains(
       "dark"
     )
       ? "الوضع النهاري ☀️"
       : "الوضع الليلي 🌙";
 
 }
 
 
 themeBtn?.addEventListener(
   "click",
   () => {
 
     document.body.classList.toggle(
       "dark"
     );
 
 
     const dark =
       document.body.classList.contains(
         "dark"
       );
 
 
     localStorage.setItem(
       "hp_theme",
       dark
         ? "dark"
         : "light"
     );
 
 
     updateThemeButton();
 
     showToast(
       dark
         ? "تم تشغيل الوضع الليلي 🌙"
         : "تم تشغيل الوضع النهاري ☀️"
     );
 
   }
 );
 
 
 /* =========================================================
    CLEAR DATA
    ========================================================= */
 
 document
   .querySelector(
     "#clearData"
   )
   ?.addEventListener(
     "click",
     () => {
 
       const confirmed =
         confirm(
           "⚠️ سيتم حذف جميع بيانات التطبيق. هل أنت متأكد؟"
         );
 
 
       if (!confirmed)
         return;
 
 
       transactions = [];
 
       members = [
         {
           id: 1,
           name: "أنا",
           emoji: "👤"
         }
       ];
 
       goals = [];
 
       debts = [];
 
       recurring = [];
 
       challenges = [];
 
       receipts = [];
 
       budget = 0;
 
 
       saveData();
 
       renderAll();
 
       showToast(
         "تم حذف جميع البيانات 🗑️"
       );
 
     }
   );
 
 
 /* =========================================================
    VIEW ALL
    ========================================================= */
 
 document
   .querySelector(
     "#viewAllTransactions"
   )
   ?.addEventListener(
     "click",
     () => {
 
       showPage(
         "transactions"
       );
 
     }
   );
 
 
 /* =========================================================
    MODAL OUTSIDE CLICK
    ========================================================= */
 
 document
   .querySelectorAll(
     ".modal"
   )
   .forEach(modal => {
 
     modal.addEventListener(
       "click",
       event => {
 
         if (
           event.target ===
           modal
         ) {
 
           modal.classList.add(
             "hidden"
           );
 
         }
 
       }
     );
 
   });
 
 
 /* =========================================================
    ESCAPE CLOSE
    ========================================================= */
 
 document.addEventListener(
   "keydown",
   event => {
 
     if (
       event.key !==
       "Escape"
     ) {
 
       return;
 
     }
 
 
     document
       .querySelectorAll(
         ".modal:not(.hidden)"
       )
       .forEach(modal => {
 
         modal.classList.add(
           "hidden"
         );
 
       });
 
   }
 );
 
 
 /* =========================================================
    RENDER ALL
    ========================================================= */
 
 function renderAll() {
 
   updateMemberSelect();
 
   updateMemberFilter();
 
   updateCategoryFilter();
 
   renderDashboard();
 
   renderAllTransactions();
 
   renderStatistics();
 
   renderGoals();
 
   renderDebts();
 
   renderRecurring();
 
   renderChallenges();
 
   renderReceipts();
 
   renderReports();
 
 }
 
 
 /* =========================================================
    START
    ========================================================= */
 
 loadTheme();
 
 renderAll();
 