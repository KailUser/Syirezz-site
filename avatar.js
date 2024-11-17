var url = "https://api.lanyard.rest/v1/users/992006036544290837";
var ImageD = document.getElementById("avatar");


function getAvatar() {
    console.log("Updating status...");
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const avatarUrl = "https://cdn.discordapp.com/avatars/" + data.data.discord_user.id + "/" + data.data.discord_user.avatar + ".png?size=64";
            ImageD.src = avatarUrl;
        })
        .catch(error => {
            ImageD.src = "./assets/avatar.png";
        });
}


getAvatar();