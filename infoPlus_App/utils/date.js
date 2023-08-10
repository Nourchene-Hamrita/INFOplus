export const formatDate = (dateString) => {
    const dateObj = new Date(dateString);

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    };

    return dateObj.toLocaleString('fr-FR', options); // Specify 'fr-FR' for French locale
};

export const convertDate = (dateString) => {
    const dateObj = new Date(dateString);

    // Array of month names in French
    const months = [
        "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
        "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
    ];

    // Extract year, month, and day
    const year = dateObj.getFullYear();
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();

    // Format the date as "DD Mon, YYYY"
    const formattedDate = `${day} ${month}, ${year}`;

    return formattedDate;
};
