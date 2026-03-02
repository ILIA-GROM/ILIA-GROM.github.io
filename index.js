/* Only register a service worker if it's supported */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}

const payoutRatio = {
    1: [100],
    2: [60, 40],
    3: [50, 30, 20],
    4: [40, 27, 19, 14],
    5: [35, 25, 18, 13, 9],
    6: [32, 22, 16.5, 12.5, 9, 8],
    7: [30, 19, 15, 12, 9, 8, 7],
    8: [29.75, 18.75, 14.75, 11.25, 8.5, 7, 5.5, 4.5]
    9: [29.5, 18.75, 14, 10, 8, 6.75, 5.5, 4.25, 3.25]
    10: [19, 18.65, 13.75, 9.50, 7.75, 6.30, 5.25, 4.15, 3.15, 2.50]
    11: [28.75, 18.60, 13.60, 9.60, 7.50, 6, 4.85, 3.80, 2.95, 2.40, 2.30]
    12: [28.50, 18.50, 13.50, 9, 7.25, 5.75, 4.5, 3.5, 2.75, 2.25, 2.25, 2.25]
};

function calculate() {
    const prize = parseInt(document.getElementById("prize").value);
    const placesPaid = parseInt(document.getElementById("paid").value);
    const percentages = payoutRatio[placesPaid];
    const payouts = [];

    percentages.forEach((v, i) => {
        const payout = Math.floor(prize * v / 100);
        payouts[i] = payout;
    });

    const min = parseInt(document.getElementById('minimalPayout').value);
    const round = parseInt(document.getElementById('round').value);
    const roundedPayouts = payouts.map(v => {
        if (v < min) {
            return min;
        } else {
            return Math.round(v / round) * round;
        }
    });
    const roundedPayoutsTotal = roundedPayouts.reduce((prev, cur) => {
        return prev + cur;
    }, 0);
    const delta = prize - roundedPayoutsTotal;
    roundedPayouts[0] += delta

    return roundedPayouts;
}

function showPayouts(payouts) {
    const payouttable = document.getElementById('payouttable');
    payouttable.textContent = '';
    const headTemplate = document.getElementById('headTemplate').content;
    payouttable.appendChild(document.importNode(headTemplate, true));
    const template = document.getElementById('rowtemplate').content;
    payouts.forEach((v, i) => {
        const row = document.importNode(template, true);
        row.querySelector('.place').innerHTML = i + 1;
        row.querySelector('.payout').innerHTML = v;
        payouttable.appendChild(row);
    });
}

/**
 * @param {string} url 
 */
function parseQuery(url) {
    const markIndex = url.indexOf("?");
    if (markIndex === -1) return {};
    const query = url.substring(markIndex + 1);
    const pairs = query.split("&");
    return pairs.map((pair) => {
        return pair.split("=");
    }).reduce((map, kvList) => {
        map[kvList[0]] = kvList[1];
        return map;
    }, {});
}

function changePlacesPaid(paid) {
    const error = validatePlacesPaid(paid);
    if (error) {
        document.getElementById('paid-error').innerHTML = error;
    } else {
        document.getElementById('paid-error').innerHTML = "";
    }
}

function validatePlacesPaid(paid) {
    const paidInt = parseInt(paid);
    if (isNaN(paidInt)) {
        return "Введите число призовых мест";
    }
    if (paidInt < 1 || paidInt > 12) {
        return "Если на турнир придёт 25 человек, то я доделаю!";
    }
    return undefined;
}

/**
 * @returns {object}
 */
function getPayoutRatio() {
    return payoutRatio;
}

