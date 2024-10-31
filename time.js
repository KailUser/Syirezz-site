function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeString = `${hours}:${minutes} ${amOrPm}`;
    document.querySelector('.time').textContent = timeString;
}

// Call updateTime function every second to update the time
setInterval(updateTime, 1000);

