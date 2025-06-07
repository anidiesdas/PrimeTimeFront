export const genreEmojiMap = {
    Action: '💥',
    Adventure: '🌼',
    Animation: '🐭',
    Comedy: '🤣',
    Crime: '🔪',
    Documentary: '🎥',
    Drama: '😶‍🌫️',
    Family: '👨‍👩‍👧‍👦',
    Fantasy: '🧚‍♀️',
    Horror: '👻',
    Music: '🎵',
    Mystery: '🕵️',
    Romance: '❤️‍🔥',
    'Science Fiction': '👽',
    Thriller: '💀',
}

export function getGenreEmoji(genre) {
    return genreEmojiMap[genre] || '🎬'; // Fallback
}
