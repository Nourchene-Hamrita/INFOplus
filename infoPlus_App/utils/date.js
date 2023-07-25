export const formatDate = (dateString) => {
    const dateObj = new Date(dateString);

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    };

    return dateObj.toLocaleString(undefined, options);
};
export const convertDate = (dateString) => {
    const dateObj = new Date(dateString);

    // Array of month names
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Extract year, month, and day
    const year = dateObj.getFullYear();
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();

    // Format the date as "MM-DD-YYYY"
    const formattedDate = `${day} ${month}, ${year}`;

    return formattedDate;
};