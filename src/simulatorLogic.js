const AbilityClass = {
    DEFAULT: "Default",
    ONSLAUGHT: "Onslaught",
    WONG: "Wong",
    SUPERSKRULL: "Super Skrull",
    MOONSTONE: "Moonstone",
    ODIN: "Odin",
};


class Card {
    isOngoing = false
    isOnReveal = false
    abilityClass = AbilityClass.DEFAULT
    abilityResultString = null
    onslaughtsReceived = 0
    wongsRecieved = 0

    constructor() {
        
    }


    calculateOnslaughtsOutput() {
        switch(this.abilityClass){
            case AbilityClass.DEFAULT:
            case AbilityClass.WONG:
            case AbilityClass.ODIN:
                console.log("No Onslaughts output")
                return 0
        }
    }

    calculateWongsOutput() {
        return 0
    }

    calculateOnRevealProcs(){
        return 0
    }

    simulateAbility(){
        return 0
    }

    simulateNetAbility(){
        return 0
    }

    simulateNetAbilityCustom(){
        return 0
    }

}

class SimulatorLogic{
    testFunction() {
        console.log("We in business baby");
    }
}


export default SimulatorLogic