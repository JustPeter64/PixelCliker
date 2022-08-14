let game = {
    pixels: 0,
    upgrades: {
        autoClicker: {
            amount: 0,
            cost: 100,
            pps: 1, //pixels per second
            hasun: false, //has unlocked
            unlocked: 1,
            name: "Auto Clicker"
        },
        pixelFactory: {
            amount: 0,
            cost: 300,
            pps: 5,
            hasun: false,
            unlocked: 100,
            name: "Pixel Factory"
        },
        pixelWorld: {
            amount: 0,
            cost: 600,
            pps: 10,
            hasun: false,
            unlocked: 300,
            name: "Pixel World"
        },
        turboclicker: {
            amount: 0,
            cost: 10000,
            pps: 50,
            hasun: false,
            unlocked: 600,
            name: "Turbo Clicker"
        },
        insaneclicker: {
            amount: 0,
            cost: 50000,
            pps: 100,
            hasun: false,
            unlocked: 10000,
            name: "Insane Clicker"
        },
        ultimateclicker: {
            amount: 0,
            cost: 7500000,
            pps: 1500,
            hasun: false,
            unlocked: 50000,
            name: "Ultimate Clicker"
        }
    },
    acheivs: [{ req: "game.pixels>0", gotten: false, text: "<p>You have made one Pixel!</p>" },
     { req: "game.pixels>99", gotten: false, text: "<p>You have made 100 Pixels!</p>" },
    { req: "game.pixels>999", gotten: false, text: "<p>You have made 1000 Pixels!</p>" },
    { req: "game.pixels>9999", gotten: false, text: "<p>You have made 10000 Pixels!</p>" },
    { req: "game.pixels>99999", gotten: false, text: "<p>You have made 100000 Pixels!</p>" },
    { req: "game.pixels>999999", gotten: false, text: "<p>You have made 1000000 Pixels!</p>" }]
};

let delay = 0;
let pps = 0;

function buttonClicked(currency) {
    if (game.upgrades[currency].cost <= game.pixels) {
        game.pixels -= game.upgrades[currency].cost;
        game.upgrades[currency].amount++
        game.upgrades[currency].cost += Math.round(game.upgrades[currency].cost * 0.15); //cost gets 15% highter afther you buy
        update_upgrades();
    }
}

function update_upgrades() {
    document.querySelector("#upgrades").innerHTML = "";
    let d = 0;
    for (i in game.upgrades) {
        if (game.upgrades[i].hasun) {
            document.querySelector("#upgrades").innerHTML += `<br> <button onclick="buttonClicked('${i}')">${game.upgrades[i].name}</button> <p>You have ${numberformat.format(game.upgrades[i].amount)}. Cost: ${numberformat.format(game.upgrades[i].cost)} </p><br>`;
            d += game.upgrades[i].pps * game.upgrades[i].amount;
        }
    }
    pps = d;
}

function updateCount() {
    if (Cookies.get("game") != null && Cookies.get("game") != "undefinded") {
        let game1 = JSON.parse(Cookies.get("game"));
        for (i in game.upgrades) {
            if (game1.upgrades[i] == null) {
                game1.upgrades[i] == game.upgrades[i];
            }
        }
        game = game1;

        for (i in game.acheivs) {
            if (game1.acheivs[i] == null || game.acheivs[i].text != game1.acheivs[i].text) {
                game1.acheivs[i] = game.acheivs[i];
            }
        }
        game = game1;
    }
    update_upgrades();
    if (Cookies.get("lasttime") != null) {
        let lastsavedate = Number(Cookies.get("lasttime"));
        lastsavedate = Date.now() - lastsavedate;
        lastsavedate = Math.round(lastsavedate / 1000);
        if (lastsavedate / 60 >= 1) { // after 60 seconds
            game.pixels += lastsavedate * pps / 1.8;
            document.querySelector("#acheivs").innerHTML += `<br>While you where gone...<br> you got ${numberformat.format(lastsavedate * pps / 1.8)} Pixels`;
        }
    }
    setInterval(() => {
        for (i in game.upgrades) {
            game.pixels += game.upgrades[i].amount * game.upgrades[i].pps / 20 //per 20 seconds
        }
        for (i in game.acheivs) {
            let b = new Function('return ' + game.acheivs[i].req);
            if (b() && !game.acheivs[i].gotten) {
                game.acheivs[i].gotten = true;
                document.querySelector("#acheivs").innerHTML += `<br> <h3>✧ ACHEIVMENT UNLOCKED ✧</h3> <br> ${game.acheivs[i].text}`;
            }
        }
        document.querySelector("#pixels").innerHTML = "You have " + numberformat.format(Number(String(game.pixels).split(".")[0])) + " Pixels";
        for (i in game.upgrades) {
            if (!game.upgrades[i].hasun && game.upgrades[i].unlocked <= game.pixels) {
                game.upgrades[i].hasun = true;
                update_upgrades();
            }
        }
        // save game
        delay++;
        if (delay >= 40) {
            Cookies.set("game", JSON.stringify(game), { expires: 100000 });
            Cookies.set("lasttime", Date.now(), { expires: 100000 })
            delay = 0;
        }
    }, 50);
}