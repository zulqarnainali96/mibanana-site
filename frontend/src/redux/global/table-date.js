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

export function formatMessageDate(msgDate) {
    const date = new Date(msgDate);

    // Format time
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const timeString = `${hours}:${minutes} ${ampm}`;

    // Format date
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    const dateString = `${day}/${month}/${year}`;

    // Combine time and date
    return `${timeString} ${dateString}`;
}