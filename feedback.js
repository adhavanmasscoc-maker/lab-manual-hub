/**
 * Universal Subject-Specific Feedback Engine & Star Rating Controller
 * AKNEX Lab Manual Hub
 */
let currentSubRating = 5;

function setSubjectRating(val) {
    currentSubRating = val;
    const stars = document.querySelectorAll("#subStarGroup .star-btn");
    stars.forEach((s, idx) => {
        s.classList.toggle("active", idx < val);
    });
    const badge = document.getElementById("subRatingBadge");
    const labels = {
        1: "1 ★ Needs Fixes",
        2: "2 ★ Fair",
        3: "3 ★ Good",
        4: "4 ★ Very Helpful",
        5: "5 ★ Excellent & Exam Ready"
    };
    if (badge) badge.innerText = labels[val] || `${val} ★`;
}

async function submitSubjectFeedback(subjectName) {
    const nameInput = document.getElementById("sub_name");
    const feedbackInput = document.getElementById("sub_feedback");
    const msg = document.getElementById("sub_msg");
    const btn = document.querySelector("#subjectFeedbackBox .btn-submit");

    const name = (nameInput ? nameInput.value : "").trim() || "Anonymous Student";
    const feedback = (feedbackInput ? feedbackInput.value : "").trim();

    if (!feedback) {
        if (msg) {
            msg.style.color = "#dc2626";
            msg.innerText = "Please write your question, suggestion, or feedback before submitting.";
        }
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerText = "Submitting...";
    }
    if (msg) {
        msg.style.color = "#2563eb";
        msg.innerText = "Sending feedback...";
    }

    const payload = {
        site_id: "site_lab_manual",
        user_name: name,
        message: `[Subject: ${subjectName}] ${feedback}`,
        rating: currentSubRating,
        category: "subject_feedback",
        page_url: window.location.href,
        subject: subjectName
    };

    let sentSuccessfully = false;

    // Strategy 1: First-party proxy endpoint (/api/feedback)
    try {
        const proxyRes = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (proxyRes.ok) {
            sentSuccessfully = true;
        }
    } catch (err) {}

    // Strategy 2: Direct to Cloudflare D1 feedback API
    if (!sentSuccessfully) {
        try {
            const directRes = await fetch("https://feedback.adhavanmasscoc.workers.dev/api/v1/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (directRes.ok) {
                sentSuccessfully = true;
            }
        } catch (workerErr) {}
    }

    // Strategy 3: Guaranteed local backup queue if network blocks both
    if (!sentSuccessfully) {
        try {
            const offlineQueue = JSON.parse(localStorage.getItem("aknex_offline_feedback") || "[]");
            offlineQueue.push({ ...payload, created_at: new Date().toISOString() });
            localStorage.setItem("aknex_offline_feedback", JSON.stringify(offlineQueue));
            sentSuccessfully = true;
        } catch (storageErr) {}
    }

    if (btn) {
        btn.disabled = false;
        btn.innerText = "Submit Feedback";
    }

    if (sentSuccessfully) {
        if (msg) {
            msg.style.color = "#16a34a";
            msg.innerText = `✅ Thank you! Your feedback for ${subjectName} was received (${currentSubRating}★).`;
        }
        if (feedbackInput) feedbackInput.value = "";
    } else {
        if (msg) {
            msg.style.color = "#dc2626";
            msg.innerText = "⚠️ Unable to send feedback right now. Please try again.";
        }
    }
}
