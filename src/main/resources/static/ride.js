const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first.");
    window.location.href = "index.html";
}

// Offer Ride
document.getElementById("offerRideForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const ride = {
        from: document.getElementById("from").value,
        to: document.getElementById("to").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        seatsAvailable: document.getElementById("seats").value
    };

    const response = await fetch("http://localhost:8081/api/rides/offer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(ride)
    });

    if (response.ok) {
        alert("Ride offered successfully!");
        document.getElementById("offerRideForm").reset();
    } else {
        alert("Failed to offer ride.");
    }
});

document.getElementById("searchForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const from = document.getElementById("searchFrom").value;
    const to = document.getElementById("searchTo").value;

    const response = await fetch(`http://localhost:8081/api/rides/search?from=${from}&to=${to}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        const rides = await response.json();
        const resultsList = document.getElementById("searchResults");
        resultsList.innerHTML = "";

        if (rides.length === 0) {
            resultsList.innerHTML = "<li>No rides found.</li>";
            return;
        }

        rides.forEach(ride => {
            const li = document.createElement("li");
            li.textContent = `From: ${ride.from}, To: ${ride.to}, Date: ${ride.date}, Time: ${ride.time}, Seats: ${ride.seatsAvailable}`;
            resultsList.appendChild(li);
        });
    } else {
        alert("Error searching for rides.");
    }
});