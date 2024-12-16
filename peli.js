let kuviot = ['☕', '🍩', '🍪', '🍫', '🧁'];
let balance = 100;
let lockedReels = [false, false, false, false];
let winnings = 0;
let currentRound = 0;
let lastWinRound = -1;

function spin() {
    currentRound++;

    // Pelipanos
    let bet = parseInt(document.getElementById('betInput').value, 10);
    
    if (isNaN(bet) || bet < 1) {
        alert("Panoksen tulee olla vähintään 1");
        return;
    }

    if (bet > balance) {
        alert("Saldo ei riitä, laita pienempi panos");
        return;
    }

    let reels = document.querySelectorAll('.reel');

    // Pelipanoksen vähentäminen saldosta
    balance -= bet;
    updateBalance();

    // Kuvioiden valinta rullista
    reels.forEach((reel, index) => {
        if (!lockedReels[index]) {
            let symbol = getRandomSymbol();
            reel.textContent = symbol;
        }
    });
    updateRounds();

    // Voittojen tarkistus
    const winAmount = calculateWin(reels, bet);

    balance += winAmount;
    winnings = winAmount;
    updateBalance();
    updateWinnings();

    // Jos voitto on suurempi kuin 0, päivitä viimeisin voittokierros
    if (winAmount > 0) {
        lastWinRound = currentRound;
    }

    // Vapautetaan rullien lukitukset ja palautetaan painikkeet automaattisesti
    resetLockButtons();
}

// Rullien lukitseminen
function toggleLock(reelIndex) {
    const lockButton = document.getElementById(`lock${reelIndex}`);
    const reel = document.getElementById(`reel${reelIndex - 1}`);

    if (!lockedReels[reelIndex - 1]) {
        if (currentRound % 2 === 0 && currentRound !== lastWinRound + 1) {
            lockedReels[reelIndex - 1] = true;
            lockButton.textContent = 'LUKITTU';
            reel.classList.add('locked');
        } else {
            alert('Rullien lukitus mahdollista vain joka toinen kierros, paitsi voittokierroksen jälkeen ei voi lukita.');
        }
    } else {
        alert('Pyöräytä välillä!');
    } 
} 

function resetLockButtons() {
    for (let i = 1; i <= 4; i++) {
        const lockButton = document.getElementById(`lock${i}`);
        const reel = document.getElementById(`reel${i - 1}`);

        // Varmistetaan että kaikki painikkeet ovat käytettävissä
        if (lockButton) {
            lockButton.disabled = false;
            lockButton.textContent = 'LUKITSE';
        }

        // Nollataan lukitukset
        lockedReels[i - 1] = false;

        // Poistetaan lukitukset
        if (reel) {
            reel.classList.remove('locked');
        }
        console.log(`Rulla ${i} vapautettu`);
    }
    console.log('Kaikki rullat ja painikkeet vapautettu');
}

// Kuvioiden hakeminen symbolilistalta
function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * kuviot.length);
    return kuviot[randomIndex];
}

// Voittojen laskeminen
function calculateWin(reels, bet) {
    // Onko kaikissa rullissa sama kuvio?
    const firstSymbol = reels[0].textContent;
    const specificSymbol ='☕'; 

    if (Array.from(reels).every((reel) => reel.textContent === firstSymbol)) {
        // Lasketaan voitot kuvion perusteella
        switch (firstSymbol) {
            case '☕':
                return bet * 10;
            case '🍩':
                return bet * 6;
            case '🍪':
                return bet * 5;
            case '🍫':
                return bet * 4;
            case '🧁':
                return bet * 3;
            default:
                return 0;
        }
    } else if (Array.from(reels).filter((reel) => reel.textContent === specificSymbol).length === 3) {
        switch (specificSymbol) {
            case '☕':
                return bet * 5;
            default:
                return 0;
        }
    } else {
        return 0; 
    }
}

function updateBalance() {
    document.getElementById('balance').textContent = `SALDO: ${balance}`;
}

function updateWinnings() {
    document.getElementById('winnings').textContent = `Tämän kierroksen voitot: ${winnings}`;
}

function updateRounds() {
    document.getElementById('rounds').textContent = ``;
}

function updateLockedrounds() {
    document.getElementById('lockedrounds').textContent = `Lukitut kierrokset: ${lockedReels.filter(locked => locked).length}`;
}
