export const timeComparisons = [
    {
        text: "you could’ve listened to <strong>\"So Close To What\"</strong> <br>AND its bonus track {count} times🙆‍♀️💃!!! Do it now grrr.",
        minutesPerUnit: 45,
    },
    {
        text: "you could’ve binged the first season of <br><strong>Game of Thrones</strong> {count} times👑...",
        minutesPerUnit: 560,
    },
    {
        text: "you could’ve carried {count} <strong>VALORANT</strong> matches >:)💪. <br>...or ended up as botfrag✊😞.",
        minutesPerUnit: 40,
    },
    {
        text: "you could’ve played {count} whole <strong>League</strong> matches... <br> (without getting tilt ofc😇 hehe)",
        minutesPerUnit: 35,
    },
    {
        text: "you could’ve scrolled <strong>TikTok</strong> for {count} hours straight<br>instead🧟.",
        minutesPerUnit: 60,
    },
    {
        text: "you could’ve cried through <strong>Titanic</strong> {count} times🛳️🥹. <br>When are we watching it?!",
        minutesPerUnit: 195,
    },
    {
        text: "you could’ve attended {count} full-length <strong>university<br>lectures</strong>🤓.",
        minutesPerUnit: 90,
    },
    {
        text: "you could’ve baked {count} <strong>frozen pizzas</strong>🍕 <br>...and eaten them all.",
        minutesPerUnit: 15,
    },
    {
        text: "you could’ve earned at least <strong>{count}€</strong> instead. <br> (but watching movies together is priceless 🎬💗).<br>",
        minutesPerUnit: 60,
        calculateValue: (totalMinutes) => 13 * Math.floor(totalMinutes / 60),
    },
    {
        text: "you could’ve finished {count} <strong>anime episodes</strong>!!🧸 <br> Maybe it's time for aot rewatch?:0",
        minutesPerUnit: 22,
    },
    {
        text: "you could’ve brewed {count} cups of <strong>coffee</strong>☕... <br> (smerfyn prolly did it anyway)",
        minutesPerUnit: 5,
    },
    {
        text: "you could’ve listened to Hans Zimmers <strong>\"Day One\"</strong> <br> on repeat for {count} times🎶.",
        minutesPerUnit: 5,
    },
    {
        text: "you could’ve taken {count} <strong>power naps</strong>🛏️💤️. <br>...and still wake up feeling tired lol.",
        minutesPerUnit: 20,
    },
    {
        text: "you could’ve <strong>meditated</strong> for {count} sessions🧘‍♂️. <br>...i think we all need that:D",
        minutesPerUnit: 12,
    },
    {
        text: "you could've stared into your <strong>EMPTY fridge</strong><br> {count} times:((  ...good thing you were here instead😽.",
        minutesPerUnit: 3,
    },
    {
        text: "you could've pretended to be productive while <br>actually doing nothing {count} times🦥.",
        minutesPerUnit: 60,
    },

];

export function getRandomComparison(totalMinutes) {
    const validOptions = timeComparisons.filter(c => {
        const count = Math.floor(totalMinutes / c.minutesPerUnit);
        return count >= 2 || (typeof c.calculateValue === "function");
    });

    if (validOptions.length === 0) {
        return "you could’ve watched a few <strong>TikToks</strong>... maybe.<br>(but not the good ones)";
    }

    const random = validOptions[Math.floor(Math.random() * validOptions.length)];

    const count = typeof random.calculateValue === "function"
        ? random.calculateValue(totalMinutes)
        : Math.floor(totalMinutes / random.minutesPerUnit);

    return `In these <strong>${totalMinutes} minutes</strong>, ` + random.text.replace("{count}", count);
}


// zum testen
// export function getRandomComparison(totalMinutes) {
//     const indexToTest =15;
//     const random = timeComparisons[indexToTest];
//
//     if (!random || totalMinutes < random.minutesPerUnit) {
//         return "Test case not valid for current time.";
//     }
//
//     const count = typeof random.calculateValue === "function"
//         ? random.calculateValue(totalMinutes)
//         : Math.floor(totalMinutes / random.minutesPerUnit);
//
//     return `In these <strong>${totalMinutes} minutes</strong>, ` + random.text.replace("{count}", count);
// }