var url = "https://api.lanyard.rest/v1/users/992006036544290837";

function updateStatus() {
    console.log("Updating status...");
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Got data:", data);
            const discordStatus = data.data.discord_status.toUpperCase();
            console.log("Updating status to:", discordStatus);
            document.querySelector(".status").innerHTML = discordStatus;
            document.querySelector(".status").classList.remove("online", "offline", "error", "dnd", "idle");
            document.querySelector(".status").classList.add(discordStatus.toLowerCase());
        })
        .catch(error => {
            console.error("Error updating status:", error.message);
            document.querySelector(".status").innerHTML = "ERROR";
            document.querySelector(".status").classList.remove("online", "offline", "error", "dnd", "idle");
            document.querySelector(".status").classList.add("error");
        });
}

setInterval(updateStatus, 5000);