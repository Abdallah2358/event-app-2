// utils/eventStyles.js

export const eventPropGetter = (event) => {
    let backgroundColor = ''; // Default color

    if (event.on_wait_list) {
        backgroundColor = 'orange'; // Waitlisted events → Orange
    } else if (event.joined) {
        backgroundColor = 'darkgreen'; // Joined events → Green
    }

    return {
        style: {
            backgroundColor,
            borderRadius: '5px',
            padding: '5px',
        },
    };
};
