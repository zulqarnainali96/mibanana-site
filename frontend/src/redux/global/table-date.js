export function getDate(localDate) {
    const date = new Date(localDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    let ampm = "AM";

    // Convert to 12-hour format and set AM/PM
    if (hours >= 12) {
      ampm = "PM";
      if (hours > 12) {
        hours -= 12;
      }
    }
    hours = String(hours).padStart(2, "0");
    let formatedDate = [`${hours}:${minutes}:${seconds} ${ampm}`,`${day}-${month}-${year}`]
    return { formatedDate }
  }