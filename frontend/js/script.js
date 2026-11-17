const API_URL = "http://localhost:8080/api/donors";


// =====================================
// HELPER: PREVENT HTML INJECTION
// =====================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}


// =====================================
// DONOR REGISTRATION
// =====================================

document.getElementById("donorForm")?.addEventListener("submit", async function (event) {

    event.preventDefault();

    const form = event.target;
    const message = document.getElementById("message");
    const submitButton = form.querySelector("button[type='submit']");

    const donor = {
        name: document.getElementById("name").value.trim(),
        age: Number(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        mobile: document.getElementById("mobile").value.trim(),
        bloodGroup: document.getElementById("bloodGroup").value,
        city: document.getElementById("city").value.trim(),
        district: document.getElementById("district").value.trim(),
        lastDonationDate: document.getElementById("lastDonationDate").value || null,
        available: document.getElementById("available").value === "true",
        contactConsent: document.getElementById("contactConsent").checked
    };

    submitButton.disabled = true;
    submitButton.textContent = "Registering...";

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(donor)
        });

        if (!response.ok) {
            throw new Error("Registration failed");
        }

        const result = await response.json();

        message.className = "mt-3 text-center text-success";
        message.textContent =
            "Registration successful! Your Donor ID is " + result.id;

        form.reset();

    } catch (error) {

        console.error(error);

        message.className = "mt-3 text-center text-danger";
        message.textContent =
            "Unable to register. Please check the backend connection.";

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Register as Donor";

    }

});


// =====================================
// SEARCH DONORS
// =====================================

document.getElementById("searchForm")?.addEventListener("submit", async function (event) {

    event.preventDefault();

    const bloodGroup = document.getElementById("searchBloodGroup").value;
    const city = document.getElementById("searchCity").value.trim();

    const results = document.getElementById("results");

    results.innerHTML = `
        <div class="col-12 text-center">
            <div class="spinner-border text-danger"></div>
            <p class="mt-2">Searching for donors...</p>
        </div>
    `;

    try {

        const url = `${API_URL}/search?bloodGroup=${encodeURIComponent(bloodGroup)}&city=${encodeURIComponent(city)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Search failed");
        }

        const donors = await response.json();

        results.innerHTML = "";

        if (donors.length === 0) {

            results.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning text-center p-4">
                        <h5>No donors found!</h5>
                        <p class="mb-0">
                            No available donors found for ${escapeHTML(bloodGroup)}
                            in ${escapeHTML(city)}.
                            Try another city or blood group.
                        </p>
                    </div>
                </div>
            `;

            return;
        }

        donors.forEach(donor => {

            // Only show contact details when consent is true.
            const hasConsent = donor.contactConsent === true;
            const mobile = String(donor.mobile || "").replace(/\D/g, "");

            let contactButton = "";

            if (hasConsent && mobile.length === 10) {

                const whatsappMessage =
                    `Hello ${donor.name}, I found your donor profile on BloodConnect. Are you available to donate blood?`;

                const whatsappURL =
                    `https://wa.me/91${mobile}?text=${encodeURIComponent(whatsappMessage)}`;

                contactButton = `
                    <a href="${whatsappURL}"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="btn whatsapp-btn w-100 mt-3">
                        Contact via WhatsApp
                    </a>
                `;

            } else {

                contactButton = `
                    <p class="text-muted mt-3">
                        Contact details unavailable.
                    </p>
                `;

            }

            results.innerHTML += `
                <div class="col-md-4">

                    <div class="donor-card">

                        <h5>${escapeHTML(donor.name)}</h5>

                        <div class="donor-blood-group">
                            ${escapeHTML(donor.bloodGroup)}
                        </div>

                        <p>
                            <strong>City:</strong>
                            ${escapeHTML(donor.city)}
                        </p>

                        <p>
                            <strong>District:</strong>
                            ${escapeHTML(donor.district)}
                        </p>

                        <p>
                            <strong>Age:</strong>
                            ${escapeHTML(donor.age)}
                        </p>

                        <p>
                            <strong>Gender:</strong>
                            ${escapeHTML(donor.gender)}
                        </p>

                        <span class="badge bg-success">
                            Available
                        </span>

                        ${contactButton}

                    </div>

                </div>
            `;

        });

    } catch (error) {

        console.error(error);

        results.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center">
                    Unable to search donors. Please check the backend connection.
                </div>
            </div>
        `;

    }

});