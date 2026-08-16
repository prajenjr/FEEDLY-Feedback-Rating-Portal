const API_URL = "http://localhost:5000/api";

const feedbackForm = document.getElementById("feedbackForm");
const message = document.getElementById("message");
const loadFeedbackButton = document.getElementById("loadFeedback");
const feedbackList = document.getElementById("feedbackList");

const searchFeedback = document.getElementById("searchFeedback");
const subjectFilter = document.getElementById("subjectFilter");
const resultCount = document.getElementById("resultCount");

const averageRating = document.getElementById("averageRating");
const totalFeedback = document.getElementById("totalFeedback");
const totalSubjects = document.getElementById("totalSubjects");

let allFeedback = [];


/* =========================================
   SUBMIT FEEDBACK
========================================= */

feedbackForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const selectedRating = document.querySelector(
        'input[name="rating"]:checked'
    );

    if (!selectedRating) {
        showMessage("⚠️ Please select a rating.", "#f59e0b");
        return;
    }

    const feedbackData = {
        studentName: document
            .getElementById("studentName")
            .value
            .trim(),

        studentEmail: document
            .getElementById("studentEmail")
            .value
            .trim(),

        subject: document
            .getElementById("subject")
            .value,

        rating: Number(selectedRating.value),

        comment: document
            .getElementById("comment")
            .value
            .trim()
    };


    if (
        !feedbackData.studentName ||
        !feedbackData.studentEmail ||
        !feedbackData.subject ||
        !feedbackData.comment
    ) {
        showMessage(
            "⚠️ Please fill all fields.",
            "#f59e0b"
        );
        return;
    }


    showMessage(
        "⏳ Submitting feedback...",
        "#c4b5fd"
    );


    const submitButton =
        feedbackForm.querySelector(".submit-button");


    if (submitButton) {
        submitButton.disabled = true;
        submitButton.style.opacity = "0.6";
    }


    try {

        const response = await fetch(
            `${API_URL}/feedback`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(feedbackData)
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to submit feedback"
            );
        }


        showMessage(
            "✅ Feedback submitted successfully!",
            "#22c55e"
        );


        feedbackForm.reset();


        await loadFeedback();


        document
            .getElementById("reviews")
            ?.scrollIntoView({
                behavior: "smooth"
            });


    } catch (error) {

        console.error(
            "Submit Error:",
            error
        );

        showMessage(
            "❌ Unable to submit feedback. Please check the backend.",
            "#ef4444"
        );

    } finally {

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = "1";
        }
    }

});


/* =========================================
   MESSAGE
========================================= */

function showMessage(text, color) {

    if (!message) return;

    message.textContent = text;
    message.style.color = color;

}


/* =========================================
   REFRESH BUTTON
========================================= */

if (loadFeedbackButton) {

    loadFeedbackButton.addEventListener(
        "click",
        loadFeedback
    );

}


/* =========================================
   SEARCH
========================================= */

if (searchFeedback) {

    searchFeedback.addEventListener(
        "input",
        applyFilters
    );

}


/* =========================================
   SUBJECT FILTER
========================================= */

if (subjectFilter) {

    subjectFilter.addEventListener(
        "change",
        applyFilters
    );

}


/* =========================================
   LOAD FEEDBACK
========================================= */

async function loadFeedback() {

    feedbackList.innerHTML = `
        <div class="loading">
            ⏳ Loading feedback...
        </div>
    `;


    if (resultCount) {
        resultCount.textContent = "";
    }


    try {

        const response = await fetch(
            `${API_URL}/feedback`
        );


        const feedbacks =
            await response.json();


        if (!response.ok) {

            throw new Error(
                "Unable to load feedback"
            );

        }


        allFeedback =
            Array.isArray(feedbacks)
                ? feedbacks
                : [];


        updateStatistics(
            allFeedback
        );


        updateSubjectFilter(
            allFeedback
        );


        applyFilters();


    } catch (error) {

        console.error(
            "Load Error:",
            error
        );


        allFeedback = [];


        updateStatistics([]);


        if (resultCount) {
            resultCount.textContent = "";
        }


        feedbackList.innerHTML = `
            <div class="feedback-item">

                <p style="
                    color:#ef4444;
                    text-align:center;
                ">
                    ❌ Unable to load feedback.
                </p>

                <p style="
                    color:#64748b;
                    font-size:12px;
                    margin-top:8px;
                    text-align:center;
                ">
                    Make sure the backend is running
                    on port 5000.
                </p>

            </div>
        `;

    }

}


/* =========================================
   SUBJECT FILTER OPTIONS
========================================= */

function updateSubjectFilter(feedbacks) {

    if (!subjectFilter) return;


    const currentValue =
        subjectFilter.value;


    const subjects = [
        ...new Set(
            feedbacks
                .map(
                    feedback =>
                        feedback.subject
                )
                .filter(Boolean)
        )
    ];


    subjects.sort(
        (a, b) =>
            String(a).localeCompare(
                String(b)
            )
    );


    subjectFilter.innerHTML = `
        <option value="all">
            All Subjects
        </option>
    `;


    subjects.forEach(subject => {

        const option =
            document.createElement(
                "option"
            );


        option.value = subject;

        option.textContent = subject;


        subjectFilter.appendChild(
            option
        );

    });


    if (
        subjects.includes(
            currentValue
        )
    ) {

        subjectFilter.value =
            currentValue;

    } else {

        subjectFilter.value = "all";

    }

}


/* =========================================
   SEARCH + FILTER
========================================= */

function applyFilters() {

    const searchText =
        searchFeedback
            ? searchFeedback.value
                .trim()
                .toLowerCase()
            : "";


    const selectedSubject =
        subjectFilter
            ? subjectFilter.value
            : "all";


    const filteredFeedback =
        allFeedback.filter(
            feedback => {

                const studentName =
                    String(
                        feedback.studentName || ""
                    ).toLowerCase();


                const studentEmail =
                    String(
                        feedback.studentEmail || ""
                    ).toLowerCase();


                const subject =
                    String(
                        feedback.subject || ""
                    ).toLowerCase();


                const comment =
                    String(
                        feedback.comment || ""
                    ).toLowerCase();


                const matchesSearch =
                    !searchText ||
                    studentName.includes(
                        searchText
                    ) ||
                    studentEmail.includes(
                        searchText
                    ) ||
                    subject.includes(
                        searchText
                    ) ||
                    comment.includes(
                        searchText
                    );


                const matchesSubject =
                    selectedSubject === "all" ||
                    feedback.subject ===
                        selectedSubject;


                return (
                    matchesSearch &&
                    matchesSubject
                );

            }
        );


    updateResultCount(
        filteredFeedback.length,
        allFeedback.length
    );


    renderFeedback(
        filteredFeedback
    );

}


/* =========================================
   RESULT COUNT
========================================= */

function updateResultCount(
    visibleCount,
    totalCount
) {

    if (!resultCount) return;


    if (totalCount === 0) {

        resultCount.textContent =
            "No feedback available.";

        return;
    }


    if (
        visibleCount === totalCount
    ) {

        resultCount.textContent =
            `Showing all ${totalCount} feedback${totalCount === 1 ? "" : "s"}.`;

        return;
    }


    resultCount.textContent =
        `Showing ${visibleCount} of ${totalCount} feedback${totalCount === 1 ? "" : "s"}.`;

}


/* =========================================
   RENDER FEEDBACK
========================================= */

function renderFeedback(feedbacks) {

    if (
        !Array.isArray(feedbacks) ||
        feedbacks.length === 0
    ) {

        let text =
            "No feedback available yet.";


        if (
            searchFeedback &&
            searchFeedback.value.trim()
        ) {

            text =
                "No feedback matches your search.";

        }


        if (
            subjectFilter &&
            subjectFilter.value !== "all"
        ) {

            text =
                "No feedback found for this subject.";

        }


        feedbackList.innerHTML = `
            <div class="feedback-item">

                <p style="
                    color:#94a3b8;
                    text-align:center;
                    margin:0;
                ">
                    🔎 ${escapeHTML(text)}
                </p>

            </div>
        `;

        return;
    }


    feedbackList.innerHTML = "";


    feedbacks.forEach(
        feedback => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "feedback-item";


            const rating =
                Number(
                    feedback.rating
                ) || 0;


            const safeRating =
                Math.min(
                    Math.max(
                        rating,
                        0
                    ),
                    5
                );


            const stars =
                "⭐".repeat(
                    safeRating
                );


            const date =
                feedback.createdAt
                    ? new Date(
                        feedback.createdAt
                    ).toLocaleString()
                    : "Recently";


            item.innerHTML = `

                <h3>
                    ${escapeHTML(
                        feedback.subject ||
                        "General Feedback"
                    )}
                </h3>


                <p>
                    👤
                    <strong>
                        ${escapeHTML(
                            feedback.studentName ||
                            "Anonymous"
                        )}
                    </strong>
                </p>


                <p>
                    ${stars || "No rating"}
                </p>


                <p>
                    ${escapeHTML(
                        feedback.comment ||
                        "No comment"
                    )}
                </p>


                <p style="
                    color:#64748b;
                    font-size:12px;
                    margin-top:12px;
                ">
                    🕒 ${escapeHTML(date)}
                </p>

            `;


            feedbackList.appendChild(
                item
            );

        }
    );

}


/* =========================================
   STATISTICS
========================================= */

function updateStatistics(
    feedbacks
) {

    if (
        !averageRating ||
        !totalFeedback ||
        !totalSubjects
    ) {
        return;
    }


    const total =
        feedbacks.length;


    let average = 0;


    if (total > 0) {

        const ratingTotal =
            feedbacks.reduce(
                (
                    sum,
                    feedback
                ) => {

                    return (
                        sum +
                        (
                            Number(
                                feedback.rating
                            ) || 0
                        )
                    );

                },
                0
            );


        average =
            ratingTotal / total;

    }


    const subjects =
        new Set(
            feedbacks
                .map(
                    feedback =>
                        feedback.subject
                )
                .filter(Boolean)
        );


    totalFeedback.textContent =
        total;


    averageRating.textContent =
        average.toFixed(1);


    totalSubjects.textContent =
        subjects.size;

}


/* =========================================
   SECURITY
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


/* =========================================
   INITIAL LOAD
========================================= */

loadFeedback();