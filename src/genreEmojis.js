export const genreEmojiMap = {
    Action: '💥',
    Adventure: '🌼',
    Animation: '📎',
    Comedy: '🤣',
    Crime: '🔪',
    Documentary: '🎥',
    Drama: '🎭',
    Family: '👨‍👩‍👧‍👦',
    Fantasy: '🧚‍♀️',
    History: '📜',
    Horror: '🫣',
    Music: '🎵',
    Mystery: '🕵️',
    Romance: '🫦',
    'Science Fiction': '👽',
    Thriller: '💀',
    War: '💣',
    Western: '🤠'
};

export function getGenreEmoji(genre) {
    return genreEmojiMap[genre] || '🎬';
}
