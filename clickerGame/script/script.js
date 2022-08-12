let game = {
    pixels: 0,
    upgrades: {
        autoClicker: {
            amount: 0,
            cost: 10,
            pps: 1,
            name: "Auto Clicker"
        },
        pixelFactory: {
            amount: 0,
            cost: 20,
            pps: 10,
            name: "Pixel Factory"
        },
        pixelWorld: {
            amount: 0,
            cost: 50,
            pps: 20,
            name: "Pixel World"
        }
    }
};

let delay = 0;

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
    for (i in game.upgrades) {
        document.querySelector("#upgrades").innerHTML += `<br> <button onclick="buttonClicked('${i}')">${game.upgrades[i].name}</button> you have ${game.upgrades[i].amount}. Cost: ${game.upgrades[i].cost}`;
    }
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
    }
    update_upgrades();
    setInterval(() => {
        for (i in game.upgrades) {
            game.pixels += game.upgrades[i].amount * game.upgrades[i].pps / 20 //per 20 seconds
        }
        document.querySelector("#pixels").innerHTML = "you have " + String(game.pixels).split(".")[0] + " Pixels";
        //save game
        delay++;
        if (delay >= 40) {
            Cookies.set("game", JSON.stringify(game), { expires: 100000 });
            delay = 0;
        }
    }, 50);
}