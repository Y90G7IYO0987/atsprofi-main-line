const badWords = ["бля", "сука", "хуй", "пизда", "нахуй", "ебал", "пидор", "сын бляди", "иди нахуй"];

let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

function saveReviews() {
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function hasBadWords(text) {
    const lowerText = text.toLowerCase();
    return badWords.some(word => lowerText.includes(word));
}

function renderReviews() {
    const container = document.getElementById("reviewsContainer");
    container.innerHTML = "";
    const approvedReviews = reviews.filter(r => r.approved === true);
    approvedReviews.forEach(review => {
        const card = document.createElement("div");
        card.className = "review-card";
        card.innerHTML = `<h3>${escapeHtml(review.name)}</h3><p>${escapeHtml(review.text)}</p>`;
        container.appendChild(card);
    });
}

document.getElementById("submitReview").addEventListener("click", function () {
    const name = document.getElementById("reviewName").value.trim();
    const text = document.getElementById("reviewText").value.trim();

    if (name === "" || text === "") {
        alert("Fill in the name and review!");
        return;
    }

    if (hasBadWords(name) || hasBadWords(text)) {
        alert("The review contains forbidden words!");
        return;
    }

    reviews.push({ name: name, text: text, approved: false });
    saveReviews();
    alert("The review has been sent for moderation!");

    document.getElementById("reviewName").value = "";
    document.getElementById("reviewText").value = "";
});

window.addEventListener("storage", function (event) {
    if (event.key === "needRefresh" && event.newValue === "true") {
        localStorage.removeItem("needRefresh");
        location.reload(); // обновляем главную страницу
    }
});

renderReviews();