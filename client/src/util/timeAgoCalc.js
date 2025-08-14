function timeAgoCalc(pastDate) {
  const dateNow = new Date();
  const now = Date.now();
  const diffMs = now - pastDate.getTime();

  const secondsAgo = Math.floor(diffMs / 1000);
  const minutesAgo = Math.floor(diffMs / (1000 * 60));
  const hoursAgo = Math.floor(diffMs / (1000 * 60 * 60));
  const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const yearsAgo = dateNow.getFullYear() - pastDate.getFullYear();
  const monthsAgo = yearsAgo * 12 + (dateNow.getMonth() - pastDate.getMonth());

  return filterTimeAgo(
    secondsAgo,
    minutesAgo,
    hoursAgo,
    daysAgo,
    monthsAgo,
    yearsAgo,
  );
}

const filterTimeAgo = (secs, mins, hrs, days, months, yrs) => {
  if (secs < 60) {
    return `${secs}s`;
  } else if (mins < 60) {
    return `${mins}m`;
  } else if (hrs < 24) {
    return `${hrs}h`;
  } else if (days < 7) {
    return `${days}d`;
  } else if (months < 12) {
    return `${months}mo`;
  } else {
    return `${yrs}y`;
  }
};

export default timeAgoCalc;
