export const genreEmojiMap = {
    Action: '💥',
    Animation: '🐭',
    Comedy: '🤣',
    Crime: '🔪',
    Documentary: '🎥',
    Drama: '😶‍🌫️',
    Fantasy: '🪄',
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
