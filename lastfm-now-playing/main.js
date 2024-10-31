// get your own last.fm api key from https://www.last.fm/api/account/create
const LASTFM_API_KEY = "2d4a24c489dfdd8823c995cfb5646122";
const username = "Syirezz"; // change username here
const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&extended=true&api_key=${LASTFM_API_KEY}&limit=1&user=${username}`;

// make API call
async function httpGet(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// converts unix time to relative time text (eg. 2 hours ago)
function relativeTime(time, time_text) {
  const time_now = Math.round(Date.now() / 1000);
  const time_diff = time_now - time;

  console.log(`Current time: ${time_now}, Event time: ${time}, Time difference: ${time_diff}`);

  const SEC_IN_MIN = 60;
  const SEC_IN_HOUR = SEC_IN_MIN * 60;
  const SEC_IN_DAY = SEC_IN_HOUR * 24;

  if (time_diff < SEC_IN_HOUR) {
    const minutes = Math.round(time_diff / SEC_IN_MIN);
    console.log(`Time in minutes: ${minutes}`);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  if (time_diff >= SEC_IN_HOUR && time_diff < SEC_IN_DAY) {
    const hours = Math.round(time_diff / SEC_IN_HOUR);
    console.log(`Time in hours: ${hours}`);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  if (time_diff >= SEC_IN_DAY) {
    console.log(`Time is more than a day, using provided time text: ${time_text}`);
    return time_text;
  }
}

async function updateNowPlaying() {
  // console.log("Fetching data from Last.fm...");
  const json = await httpGet(url);
  // console.log("Data fetched successfully:", json);

  const last_track = json.recenttracks.track[0];
  const track = last_track.name;
  const trackLink = last_track.url;
  const artistLink = last_track.artist.url;
  const artist = last_track.artist.name;
  let relative_time = null;

  if (last_track.date) {
    const unix_date = last_track.date.uts;
    const date_text = last_track.date["#text"];
    console.log(`Track date available: unix_date=${unix_date}, date_text=${date_text}`);
    relative_time = relativeTime(unix_date, date_text);
  } else {
    // console.log("Now playing track detected.");
  }

  const now_playing = last_track["@attr"] !== undefined;
  const imageLink = last_track.image[1]["#text"];
  const loved = last_track.loved === "1";

  // console.log(`Track: ${track}, Artist: ${artist}, Image: ${imageLink}, Loved: ${loved}`);

  const trackElem = document.getElementById('track');
  const artistElem = document.getElementById('artist');
  const dateElem = document.getElementById('date');
  const albumcoverElem = document.getElementById('album-cover');
  const reloadElem = document.getElementById('reload');

  trackElem.innerHTML = '';
  artistElem.innerHTML = '';
  dateElem.innerHTML = '';
  reloadElem.innerHTML = '';

  const trackLinkElem = document.createElement('a');
  trackLinkElem.id = "track";
  trackLinkElem.href = trackLink;
  trackLinkElem.target = "_blank";
  trackLinkElem.textContent = track;

  const artistLinkElem = document.createElement('a');
  artistLinkElem.id = 'artist';
  artistLinkElem.href = artistLink;
  artistLinkElem.target = "_blank";
  artistLinkElem.textContent = artist;

  const heartSpan = document.createElement('span');
  heartSpan.id = 'heart';
  heartSpan.textContent = loved ? " " : "";

  const userLinkElem = document.createElement('a');
  userLinkElem.href = `https://www.last.fm/user/${username}`;
  userLinkElem.target = "_blank";
  userLinkElem.textContent = relative_time != null ? relative_time : "Now playing...";

  const reloadSpan = document.getElementById('reload');
  const seconds = 60;
  const intervalId = setInterval(() => {
    seconds--;
    reloadSpan.textContent = `${seconds} seconds`;
    if (seconds === 0) {
      clearInterval(intervalId);
    }
  }, 1000);

  trackElem.appendChild(trackLinkElem);
  trackElem.appendChild(heartSpan);
  artistElem.appendChild(artistLinkElem);
  dateElem.appendChild(userLinkElem);
  albumcoverElem.src = imageLink;
  reloadElem.appendChild(reloadSpan);

  // console.log(
    // `Artist: ${artist}\nTrack: ${track}\nDate: ${relative_time}\nNow playing: ${now_playing}\nLoved: ${loved}`
  // );
  // console.log("Update complete.");
}

// Live update every minute
setInterval(updateNowPlaying, 3000);

// Initial call
updateNowPlaying();

