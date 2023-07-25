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

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };

    return dateObj.toLocaleString(undefined, options);
};