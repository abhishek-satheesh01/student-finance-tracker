// ==================================================
// STUDENT FINANCE TRACKER
// ==================================================


// ==================================================
// DATA
// ==================================================

let expenses =
    JSON.parse(
        localStorage.getItem("expenses")
    ) || [];


let incomes =
    JSON.parse(
        localStorage.getItem("incomes")
    ) || [];


let debts =
    JSON.parse(
        localStorage.getItem("debts")
    ) || [];


// ==================================================
// ELEMENTS
// ==================================================

const setupScreen =
    document.getElementById("setupScreen");


const loginScreen =
    document.getElementById("loginScreen");


const app =
    document.getElementById("app");


const setupForm =
    document.getElementById("setupForm");


const loginForm =
    document.getElementById("loginForm");


// ==================================================
// STARTUP
// ==================================================

const savedName =
    localStorage.getItem("studentName");


const savedPin =
    localStorage.getItem("studentPin");


if (savedPin && savedName) {

    setupScreen.classList.add("hidden");

    loginScreen.classList.remove("hidden");

} else {

    setupScreen.classList.remove("hidden");

    loginScreen.classList.add("hidden");

}


// ==================================================
// CREATE ACCOUNT
// ==================================================

setupForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "setupName"
            ).value.trim();


        const pin =
            document.getElementById(
                "setupPin"
            ).value;


        const confirmPin =
            document.getElementById(
                "confirmPin"
            ).value;


        // Check name

        if (!name) {

            alert(
                "Please enter your name."
            );

            return;

        }


        // Check PIN

        if (!/^\d{4}$/.test(pin)) {

            alert(
                "PIN must contain exactly 4 numbers."
            );

            return;

        }


        if (pin !== confirmPin) {

            alert(
                "PINs do not match."
            );

            return;

        }


        // Save

        localStorage.setItem(
            "studentName",
            name
        );


        localStorage.setItem(
            "studentPin",
            pin
        );


        // Show login

        setupScreen.classList.add(
            "hidden"
        );

        loginScreen.classList.remove(
            "hidden"
        );


        alert(
            "Account created successfully!"
        );

    }
);


// ==================================================
// LOGIN
// ==================================================

loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const enteredPin =
            document.getElementById(
                "loginPin"
            ).value;


        const correctPin =
            localStorage.getItem(
                "studentPin"
            );


        if (enteredPin === correctPin) {

            loginScreen.classList.add(
                "hidden"
            );


            app.classList.remove(
                "hidden"
            );


            document.getElementById(
                "dashboardName"
            ).textContent =
                localStorage.getItem(
                    "studentName"
                );


            loadProfile();


            updateDashboard();


        } else {

            document.getElementById(
                "loginError"
            ).textContent =
                "Incorrect PIN. Please try again.";

        }

    }
);


// ==================================================
// NAVIGATION
// ==================================================

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


const contentPages =
    document.querySelectorAll(
        ".content-page"
    );


function showPage(pageId) {

    contentPages.forEach(function(page) {

        page.classList.add("hidden");
        page.classList.remove("page-enter");

    });


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {

        selectedPage.classList.remove("hidden");

        void selectedPage.offsetWidth;

        selectedPage.classList.add("page-enter");

    }


    navItems.forEach(function(item) {

        item.classList.remove("active");


        if (item.dataset.page === pageId) {

            item.classList.add("active");

        }

    });


    updateDashboard();

    displayDebts();

    updateAnalysis();

}

// Sidebar navigation

navItems.forEach(
    function(item) {

        item.addEventListener(
            "click",
            function() {

                showPage(
                    item.dataset.page
                );

            }
        );

    }
);


// Quick action buttons

document
    .querySelectorAll(
        ".quick"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    showPage(
                        button.dataset.page
                    );

                }
            );

        }
    );


// ==================================================
// EXPENSE FORM
// ==================================================

document
    .getElementById("expenseForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const category =
                document.getElementById(
                    "expenseCategory"
                ).value;


            const amount =
                Number(
                    document.getElementById(
                        "expenseAmount"
                    ).value
                );


            const date =
                document.getElementById(
                    "expenseDate"
                ).value;


            const description =
                document.getElementById(
                    "expenseDescription"
                ).value.trim();


            if (
                !category ||
                amount <= 0 ||
                !date
            ) {

                alert(
                    "Please enter valid expense details."
                );

                return;

            }


            expenses.push({

                id: Date.now(),

                category: category,

                amount: amount,

                date: date,

                description: description

            });


            saveData();


            event.target.reset();


            updateDashboard();

            alert(
                "Expense saved successfully!"
            );

        }
    );


// ==================================================
// INCOME FORM
// ==================================================

document
    .getElementById("incomeForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const category =
                document.getElementById(
                    "incomeCategory"
                ).value;


            const amount =
                Number(
                    document.getElementById(
                        "incomeAmount"
                    ).value
                );


            const date =
                document.getElementById(
                    "incomeDate"
                ).value;


            const description =
                document.getElementById(
                    "incomeDescription"
                ).value.trim();


            if (
                !category ||
                amount <= 0 ||
                !date
            ) {

                alert(
                    "Please enter valid income details."
                );

                return;

            }


            incomes.push({

                id: Date.now(),

                category: category,

                amount: amount,

                date: date,

                description: description

            });


            saveData();


            event.target.reset();


            updateDashboard();

            alert(
                "Income saved successfully!"
            );

        }
    );


// ==================================================
// DEBT FORM
// ==================================================

document
    .getElementById("debtForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const person =
                document.getElementById(
                    "debtPerson"
                ).value.trim();


            const phone =
                document.getElementById(
                    "debtPhone"
                ).value.trim();


            const amount =
                Number(
                    document.getElementById(
                        "debtAmount"
                    ).value
                );


            const date =
                document.getElementById(
                    "debtDate"
                ).value;


            const reason =
                document.getElementById(
                    "debtReason"
                ).value.trim();


            if (
                !person ||
                !phone ||
                amount <= 0 ||
                !date
            ) {

                alert(
                    "Please enter all debt details."
                );

                return;

            }


            debts.push({

                id: Date.now(),

                person: person,

                phone: phone,

                amount: amount,

                date: date,

                reason: reason

            });


            saveData();


            event.target.reset();


            displayDebts();

            updateDashboard();


            alert(
                "Debt record saved successfully!"
            );

        }
    );


// ==================================================
// SAVE DATA
// ==================================================

function saveData() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    localStorage.setItem(
        "incomes",
        JSON.stringify(incomes)
    );


    localStorage.setItem(
        "debts",
        JSON.stringify(debts)
    );

}


// ==================================================
// MONEY FORMAT
// ==================================================

function money(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",

            currency: "INR",

            maximumFractionDigits: 0
        }
    ).format(amount);

}


// ==================================================
// DATE HELPERS
// ==================================================

function getToday() {

    const date =
        new Date();

    return date
        .toISOString()
        .split("T")[0];

}


function getWeekStart() {

    const date =
        new Date();


    const day =
        date.getDay();


    const difference =
        day === 0
        ? -6
        : 1 - day;


    date.setDate(
        date.getDate() + difference
    );


    return date
        .toISOString()
        .split("T")[0];

}


function getMonthStart() {

    const date =
        new Date();


    return new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    )
    .toISOString()
    .split("T")[0];

}


// ==================================================
// EXPENSE TOTAL
// ==================================================

function expenseTotal() {

    return expenses.reduce(
        function(total, expense) {

            return total + expense.amount;

        },
        0
    );

}


// ==================================================
// INCOME TOTAL
// ==================================================

function incomeTotal() {

    return incomes.reduce(
        function(total, income) {

            return total + income.amount;

        },
        0
    );

}


// ==================================================
// DEBT TOTAL
// ==================================================

function debtTotal() {

    return debts.reduce(
        function(total, debt) {

            return total + debt.amount;

        },
        0
    );

}


// ==================================================
// PERIOD EXPENSE
// ==================================================

function periodExpense(startDate) {

    return expenses.reduce(
        function(total, expense) {

            if (
                expense.date >= startDate
            ) {

                return total +
                    expense.amount;

            }


            return total;

        },
        0
    );

}


// ==================================================
// UPDATE DASHBOARD
// ==================================================

function updateDashboard() {

    const income =
        incomeTotal();


    const expense =
        expenseTotal();


    const debt =
        debtTotal();


    const balance =
        income - expense-debt;


    document.getElementById(
        "totalIncome"
    ).textContent =
        money(income);


    document.getElementById(
        "totalExpenses"
    ).textContent =
        money(expense);


    document.getElementById(
        "balance"
    ).textContent =
        money(balance);


    document.getElementById(
        "totalDebt"
    ).textContent =
        money(debt);


    const today =
        periodExpense(
            getToday()
        );


    const week =
        periodExpense(
            getWeekStart()
        );


    const month =
        periodExpense(
            getMonthStart()
        );


    document.getElementById(
        "todayExpense"
    ).textContent =
        money(today);


    document.getElementById(
        "weekExpense"
    ).textContent =
        money(week);


    document.getElementById(
        "monthExpense"
    ).textContent =
        money(month);


    displayRecentActivity();

}


// ==================================================
// RECENT ACTIVITY
// ==================================================

function displayRecentActivity() {

    const container =
        document.getElementById(
            "recentActivity"
        );


    const activity = [];


    expenses.forEach(
        function(item) {

            activity.push({

                type: "expense",

                title:
                    item.category,

                amount:
                    item.amount,

                date:
                    item.date

            });

        }
    );


    incomes.forEach(
        function(item) {

            activity.push({

                type: "income",

                title:
                    item.category,

                amount:
                    item.amount,

                date:
                    item.date

            });

        }
    );


    activity.sort(
        function(a, b) {

            return (
                new Date(b.date) -
                new Date(a.date)
            );

        }
    );


    const recent =
        activity.slice(0, 8);


    if (recent.length === 0) {

        container.innerHTML =
            '<p class="empty">No transactions yet.</p>';

        return;

    }


    container.innerHTML = "";


    recent.forEach(
        function(item) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "activity-item";


            const sign =
                item.type === "income"
                ? "+"
                : "-";


            const textClass =
                item.type === "income"
                ? "income-text"
                : "expense-text";


            row.innerHTML = `

                <div>

                    <div class="activity-title">
                        ${item.title}
                    </div>

                    <div class="activity-date">
                        ${item.date}
                    </div>

                </div>

                <div class="${textClass}">
                    ${sign}${money(item.amount)}
                </div>

            `;


            container.appendChild(row);

        }
    );

}


// ==================================================
// DISPLAY DEBTS
// ==================================================

function displayDebts() {

    const container =
        document.getElementById(
            "debtList"
        );


    if (debts.length === 0) {

        container.innerHTML =
            '<p class="empty">No debt records yet.</p>';

        return;

    }


    container.innerHTML = "";


    debts.forEach(
        function(debt) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "debt-item";


            const smsMessage =
                `Hi ${debt.person}, this is a reminder about the ${money(debt.amount)} you borrowed. Please let me know when you can return it. Thank you.`;


            const smsLink =
                "sms:" +
                encodeURIComponent(
                    debt.phone
                ) +
                "?body=" +
                encodeURIComponent(
                    smsMessage
                );


            item.innerHTML = `

                <div class="debt-top">

                    <span class="debt-name">
                        ${debt.person}
                    </span>

                    <span class="debt-amount">
                        ${money(debt.amount)}
                    </span>

                </div>


                <div class="debt-details">

                    📱 ${debt.phone}

                    <br>

                    📅 ${debt.date}

                    <br>

                    ${debt.reason || "No reason added"}

                </div>


                <a
                    href="${smsLink}"
                    style="text-decoration:none;"
                >

                    <button
                        type="button"
                        class="sms-button"
                    >
                        📱 Send Reminder
                    </button>

                </a>

            `;


            container.appendChild(item);

        }
    );

}


// ==================================================
// ANALYSIS
// ==================================================

function updateAnalysis() {

    const today =
        periodExpense(
            getToday()
        );


    const week =
        periodExpense(
            getWeekStart()
        );


    const month =
        periodExpense(
            getMonthStart()
        );


    document.getElementById(
        "analysisToday"
    ).textContent =
        money(today);


    document.getElementById(
        "analysisWeek"
    ).textContent =
        money(week);


    document.getElementById(
        "analysisMonth"
    ).textContent =
        money(month);


    displayCategoryAnalysis();

}


// ==================================================
// CATEGORY ANALYSIS
// ==================================================

function displayCategoryAnalysis() {

    const container =
        document.getElementById(
            "categoryAnalysis"
        );


    if (expenses.length === 0) {

        container.innerHTML =
            '<p class="empty">Add expenses to see analysis.</p>';

        return;

    }


    const categories = {};


    expenses.forEach(
        function(expense) {

            if (
                !categories[
                    expense.category
                ]
            ) {

                categories[
                    expense.category
                ] = 0;

            }


            categories[
                expense.category
            ] += expense.amount;

        }
    );


    container.innerHTML = "";


    Object.keys(categories)
        .sort(
            function(a, b) {

                return (
                    categories[b] -
                    categories[a]
                );

            }
        )
        .forEach(
            function(category) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "category-row";


                row.innerHTML = `

                    <span>
                        ${category}
                    </span>

                    <strong>
                        ${money(categories[category])}
                    </strong>

                `;


                container.appendChild(row);

            }
        );

}


// ==================================================
// PROFILE
// ==================================================

function loadProfile() {

    document.getElementById(
        "profileName"
    ).value =
        localStorage.getItem(
            "studentName"
        ) || "";


    document.getElementById(
        "profileCollege"
    ).value =
        localStorage.getItem(
            "college"
        ) || "";

}


document
    .getElementById("saveProfile")
    .addEventListener(
        "click",
        function() {

            const name =
                document.getElementById(
                    "profileName"
                ).value.trim();


            const college =
                document.getElementById(
                    "profileCollege"
                ).value.trim();


            if (name) {

                localStorage.setItem(
                    "studentName",
                    name
                );

            }


            localStorage.setItem(
                "college",
                college
            );


            document.getElementById(
                "dashboardName"
            ).textContent =
                name;


            alert(
                "Profile saved successfully!"
            );

        }
    );


// ==================================================
// LOCK APP
// ==================================================

document
    .getElementById("lockButton")
    .addEventListener(
        "click",
        function() {

            app.classList.add(
                "hidden"
            );


            loginScreen.classList.remove(
                "hidden"
            );


            document.getElementById(
                "loginPin"
            ).value = "";


            document.getElementById(
                "loginError"
            ).textContent = "";

        }
    );


// ==================================================
// DEFAULT DATES
// ==================================================

function setDefaultDates() {

    const today =
        getToday();


    document.getElementById(
        "expenseDate"
    ).value =
        today;


    document.getElementById(
        "incomeDate"
    ).value =
        today;


    document.getElementById(
        "debtDate"
    ).value =
        today;

}


setDefaultDates();
// ==================================================
// FINANCE AI ASSISTANT
// ==================================================


const aiInput =
    document.getElementById("aiInput");


const askAI =
    document.getElementById("askAI");


const aiChat =
    document.getElementById("aiChat");


// --------------------------------------------------
// ADD MESSAGE TO CHAT
// --------------------------------------------------

function addAIMessage(
    message,
    type = "ai"
) {

    const messageBox =
        document.createElement("div");


    if (type === "user") {

        messageBox.className =
            "user-message";

    } else {

        messageBox.className =
            "ai-message";

    }


    messageBox.innerHTML =
        message;


    aiChat.appendChild(
        messageBox
    );


    aiChat.scrollTop =
        aiChat.scrollHeight;

}


// --------------------------------------------------
// GET CURRENT MONTH EXPENSE
// --------------------------------------------------

function getCurrentMonthExpenses() {

    const month =
        new Date()
            .toISOString()
            .slice(0, 7);


    return expenses.filter(
        function(expense) {

            return expense.date.startsWith(
                month
            );

        }
    );

}


// --------------------------------------------------
// CATEGORY TOTAL
// --------------------------------------------------

function getCategoryTotals() {

    const totals = {};


    expenses.forEach(
        function(expense) {

            if (
                !totals[
                    expense.category
                ]
            ) {

                totals[
                    expense.category
                ] = 0;

            }


            totals[
                expense.category
            ] += Number(
                expense.amount
            );

        }
    );


    return totals;

}


// --------------------------------------------------
// FINANCE AI
// --------------------------------------------------

function financeAI(question) {

    const q =
        question.toLowerCase().trim();


    const income =
        incomeTotal();


    const expense =
        expenseTotal();


    const debt =
        debtTotal();


    const balance =
        income - expense;


    const monthlyExpenses =
        getCurrentMonthExpenses();


    const monthlyTotal =
        monthlyExpenses.reduce(
            function(total, item) {

                return total +
                    Number(item.amount);

            },
            0
        );


    const categories =
        getCategoryTotals();


    const sortedCategories =
        Object.entries(categories)
            .sort(
                function(a, b) {

                    return b[1] - a[1];

                }
            );


    /* ---------------------------------------------
       BALANCE
    --------------------------------------------- */

    if (
        q.includes("balance") ||
        q.includes("how much money do i have") ||
        q.includes("how much do i have")
    ) {

        return `
            💰 <strong>Your current balance</strong>

            <br><br>

            You currently have
            <strong>${money(balance)}</strong>
            based on your recorded income
            and expenses.
        `;

    }


    /* ---------------------------------------------
       TOTAL INCOME
    --------------------------------------------- */

    if (
        q.includes("income") ||
        q.includes("earned") ||
        q.includes("earn")
    ) {

        return `
            📈 <strong>Total Income</strong>

            <br><br>

            Your recorded income is
            <strong>${money(income)}</strong>.
        `;

    }


    /* ---------------------------------------------
       TOTAL EXPENSE
    --------------------------------------------- */

    if (
        q.includes("total expense") ||
        q.includes("spent overall") ||
        q.includes("spending overall")
    ) {

        return `
            📉 <strong>Total Expenses</strong>

            <br><br>

            You have recorded
            <strong>${money(expense)}</strong>
            in total expenses.
        `;

    }


    /* ---------------------------------------------
       MONTHLY EXPENSE
    --------------------------------------------- */

    if (
        q.includes("this month") ||
        q.includes("monthly")
    ) {

        return `
            📅 <strong>This Month</strong>

            <br><br>

            You have spent
            <strong>${money(monthlyTotal)}</strong>
            this month.
        `;

    }


    /* ---------------------------------------------
       HIGHEST CATEGORY
    --------------------------------------------- */

    if (
        q.includes("most") ||
        q.includes("highest") ||
        q.includes("largest") ||
        q.includes("where am i spending")
    ) {

        if (
            sortedCategories.length === 0
        ) {

            return `
                🤖 You don't have enough
                expense data yet.
                <br><br>
                Add some expenses first.
            `;

        }


        const highest =
            sortedCategories[0];


        return `
            💸 <strong>Your highest spending
            category is ${highest[0]}.</strong>

            <br><br>

            Total spent:
            <strong>${money(highest[1])}</strong>

            <br><br>

            💡 Consider checking this
            category if you want to
            reduce your spending.
        `;

    }


    /* ---------------------------------------------
       DEBT
    --------------------------------------------- */

    if (
        q.includes("debt") ||
        q.includes("lent") ||
        q.includes("owe") ||
        q.includes("borrow")
    ) {

        return `
            🤝 <strong>Money Lent</strong>

            <br><br>

            People currently owe you
            <strong>${money(debt)}</strong>.
        `;

    }


    /* ---------------------------------------------
       SAVINGS
    --------------------------------------------- */

    if (
        q.includes("save") ||
        q.includes("saving")
    ) {

        if (income <= 0) {

            return `
                💡 Add some income first.
                Then I can estimate your
                savings.
            `;

        }


        const savingsRate =
            (
                (income - expense) /
                income
            ) * 100;


        return `
            🏆 <strong>Savings Overview</strong>

            <br><br>

            Income:
            ${money(income)}

            <br>

            Expenses:
            ${money(expense)}

            <br>

            Remaining:
            <strong>${money(balance)}</strong>

            <br><br>

            Your current saving rate is
            approximately
            <strong>
                ${savingsRate.toFixed(1)}%
            </strong>.
        `;

    }


    /* ---------------------------------------------
       OVERSpending
    --------------------------------------------- */

    if (
        q.includes("overspend") ||
        q.includes("spending too much") ||
        q.includes("too much")
    ) {

        if (
            monthlyTotal === 0
        ) {

            return `
                🤖 I need some expense
                data for this month before
                I can analyze your spending.
            `;

        }


        if (
            income > 0 &&
            monthlyTotal > income * 0.8
        ) {

            return `
                ⚠️ <strong>Spending Alert</strong>

                <br><br>

                Your expenses this month
                are already more than
                <strong>80%</strong> of your
                recorded income.

                <br><br>

                Current monthly spending:
                <strong>${money(monthlyTotal)}</strong>

                <br><br>

                💡 Consider reviewing your
                largest expense categories.
            `;

        }


        return `
            ✅ Your current spending
            doesn't appear to be above
            80% of your recorded income.

            <br><br>

            This month:
            <strong>${money(monthlyTotal)}</strong>

            <br><br>

            Keep tracking your expenses
            to maintain a clear picture.
        `;

    }


    /* ---------------------------------------------
       FOOD
    --------------------------------------------- */

    if (
        q.includes("food")
    ) {

        const food =
            categories["Food"] || 0;


        return `
            🍔 <strong>Food Spending</strong>

            <br><br>

            You have spent
            <strong>${money(food)}</strong>
            on Food.
        `;

    }


    /* ---------------------------------------------
       TRANSPORT
    --------------------------------------------- */

    if (
        q.includes("transport")
    ) {

        const transport =
            categories["Transport"] || 0;


        return `
            🚌 <strong>Transport Spending</strong>

            <br><br>

            You have spent
            <strong>${money(transport)}</strong>
            on Transport.
        `;

    }


    /* ---------------------------------------------
       GENERAL
    --------------------------------------------- */

    return `
        🤖 I can help you analyze:

        <br><br>

        • Your balance
        <br>
        • Income
        <br>
        • Expenses
        <br>
        • Monthly spending
        <br>
        • Highest spending category
        <br>
        • Money lent
        <br>
        • Savings
        <br>
        • Overspending
        <br>
        • Food spending
        <br>
        • Transport spending

        <br><br>

        Try asking:
        <strong>
        "Where am I spending the most?"
        </strong>
    `;

}


// ==================================================
// ASK AI
// ==================================================

askAI.addEventListener(
    "click",
    function() {

        const question =
            aiInput.value.trim();


        if (!question) {

            return;

        }


        addAIMessage(
            question,
            "user"
        );


        const answer =
            financeAI(question);


        setTimeout(
            function() {

                addAIMessage(
                    answer,
                    "ai"
                );

            },
            350
        );


        aiInput.value = "";

    }
);


// ==================================================
// ENTER KEY
// ==================================================

aiInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            askAI.click();

        }

    }
);


// ==================================================
// SUGGESTED QUESTIONS
// ==================================================

document
    .querySelectorAll(".suggestion")
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    aiInput.value =
                        button.dataset.question;

                    askAI.click();

                }
            );

        }
    );