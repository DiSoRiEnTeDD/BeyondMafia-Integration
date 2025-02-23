const Card = require("../../Card");
const { PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class GiveTurkeyOnDeath extends Card {

    constructor(role) {
        super(role);
        
        this.meetings = {
            "Turkey Meeting": {
                states: ["Night"],
                flags: ["group", "speech"]
            }
        };

        this.listeners = {
            "rolesAssigned": function () {
                for (let player of this.game.players) {
                    if (player.role.name === "Turkey") {
                        continue;
                    }

                    let items = player.items.map(a => a.name);
                    let breadCount = 0;
                    for (let item of items) {
                        if (item == "Bread")
                            breadCount++;
                    }
                    while (breadCount < 4) {
                        player.holdItem("Bread");
                        breadCount++;
                    }
                    if (!player.hasEffect("Famished")) {
                        player.giveEffect("Famished");
                    }
                }
            },
            "death": function (player, killer, deathType) {
                if (player == this.player) {
                    this.game.queueAlert("The town cooks the Turkey and turns it into 2 meals for everyone!");
                    for (let person of this.game.players) {
                        if (person.alive && person.role.name !== "Turkey") {
                            person.holdItem("Turkey");
                            person.holdItem("Turkey");
                        }
                    }
                }
            },
            "start": function () {
                for (let player of this.game.players) {
                    if (
                        player.role.name === "Turkey" &&
                        player != this.player
                    ) {
                        this.revealToPlayer(player);
                    }
                }
            }
        };
        
    }

}