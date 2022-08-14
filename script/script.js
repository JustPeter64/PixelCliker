let game = {
    pixels: 0,
    upgrades: {
        autoClicker: {
            amount: 0,
            cost: 10,
            pps: 1, //pixels per second
            hasun: false, //has unlocked
            unlocked: 1,
            name: "Auto Clicker"
        },
        pixelFactory: {
            amount: 0,
            cost: 20,
            pps: 10,
            hasun: false,
            unlocked: 10,
            name: "Pixel Factory"
        },
        pixelWorld: {
            amount: 0,
            cost: 50,
            pps: 20,
            hasun: false,
            unlocked: 40,
            name: "Pixel World"
        }
    },
    acheivs: [{ req: "game.pixels>0", gotten:false, text: "You have one Pixel!" }, { req: "game.pixels>9", gotten:false, text: "You have 10 Pixels!" }]
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
            document.querySelector("#upgrades").innerHTML += `<br> <button onclick="buttonClicked('${i}')">${game.upgrades[i].name}</button> You have ${numberformat.format(game.upgrades[i].amount)}. Cost: ${numberformat.format(game.upgrades[i].cost)} <br>`;
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
                game1.acheivs[i] = game.acheivs[i]
            }
        }
        game = game1;
    }
    update_upgrades();
    if (Cookies.get("lasttime") != null) {
        let lastsavedate = Number(Cookies.get("lasttime"));
        lastsavedate = Date.now() - lastsavedate;
        lastsavedate = Math.round(lastsavedate / 1000);
        if (lastsavedate / 60 >= 1) {
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
                game.acheivs[i].gotten == true;
                document.querySelector("#acheivs").innerHTML += `<br> ACHEIVMENT UNLOCKED <br> ${game.acheivs[i].text}`;
            }
        }
        document.querySelector("#pixels").innerHTML = "you have " + numberformat.format(Number(String(game.pixels).split(".")[0])) + " Pixels";
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