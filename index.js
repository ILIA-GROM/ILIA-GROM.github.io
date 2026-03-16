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
    6: [32, 22, 17, 12, 9, 8],
    7: [29, 20, 16, 12, 9, 8, 6],
    8: [27, 19, 15, 11, 9, 7, 6, 6],
    9: [25, 18, 14, 11, 9, 7, 6, 5, 5],
    10: [23, 17, 14, 11, 9, 7, 6, 5, 4, 4],
    11: [22, 16, 13, 11, 9, 7, 6, 5, 4, 4, 3],
    12: [21, 16, 13, 10, 9, 7, 6, 5, 4, 3, 3, 3],
    13: [20, 15, 12, 10, 9, 7, 6, 5, 4, 4, 3, 3, 2],
    14: [19, 15, 12, 10, 9, 7, 6, 5, 4, 4, 3, 2, 2, 2],
    15: [18, 14, 12, 10, 9, 7, 6, 5, 4, 4, 3, 2, 2, 2, 2]
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
        return "Введите число";
    }
    if (paidInt < 1 || paidInt > 15) {
        return "Доделаю, если на турнир придёт больше 30 человек!";
    }
    return undefined;
}

/**
 * @returns {object}
 */
function getPayoutRatio() {
    return payoutRatio;
}

