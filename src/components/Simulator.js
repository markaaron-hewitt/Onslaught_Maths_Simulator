import GameBoard from "./GameBoard"
import CardDetailsLogger from "./CardDetailsLogger"
import '../styling/Simulator.css'
import { useState } from "react"

function extractVisualBoardState(boardState){
    let visualBoardState = [[[{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],[{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],[{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}]],[[{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],[{name: "", abilityClass: ""},{Name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],[{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}]]]
    for (let i=0; i<boardState.length; i++){
        for (let j=0; j<boardState[i].length; j++){
            for (let k=0; k<boardState[i][j].length; k++){
                visualBoardState[i][j][k].name = boardState[i][j][k].name
                visualBoardState[i][j][k].abilityClass = boardState[i][j][k].abilityClass
            }
        }
    }
    return visualBoardState
}

// Ability Class enum
const AbilityClass = {
    DEFAULT: "Default",
    ONSLAUGHT: "Onslaught",
    WONG: "Wong",
    SUPERSKRULL: "Super Skrull",
    MOONSTONE: "Moonstone",
    ODIN: "Odin",
    JOCASTA: "Jocasta"
};

// Card class
class Card {
    revealed = true
    name = ""
    isOngoing = false
    isOnReveal = false
    isThreeOrLess = false
    abilityClass = AbilityClass.DEFAULT
    abilityResultString = null
    // Where is this on the board? Needed to calculate abilities contained. [Side, Location, Position]
    boardPosition = [0,0,0]
    // Contained = how many effects of this type does this card have? E.g. Skrull / Moonstone can have multiple
    onslaughtsContained = 0
    wongsContained = 0
    // Onslaught multiplier received = What is the multiplier acting on this card's Ongoing effects from Onslaught abilities?
    // Onslaughts are not affected by other Onslaughts played after them, so this is different to the total multiplier
    onslaughtMultiplierReceivedForOnslaughts = 0
    onslaughtMultiplierReceived = 0
    // Wong multiplier received = how many times do On Reveal effects of this card proc?
    wongMultiplierReceived = 0
    // Output = What is the total multiplier of this type that this card outputs? Generally Output = Contained * Multiplier Received
    onslaughtMultiplierOutput = 0
    wongMultiplierOutput = 0
    odinProcs= {Forge:"23", Shuri:"24"}  //TODO: make this {}

    constructor(name, abilityClass) {
        if (name) {
            this.name = name
        }
        if (Object.values(AbilityClass).includes(name)) {
            this.abilityClass = name
        }
    }

    logDetails(){
        console.log("=======================================================")
        console.log(`Name: ${this.name}`)
        console.log(`Ability Class: ${this.abilityClass}`)
        console.log(`Position: ${this.boardPosition}`)
        console.log(`Onslaughts contained: ${this.onslaughtsContained}`)
        console.log(`Wongs contained: ${this.wongsContained}`)
        console.log(`Onslaught multiplier received for Onslaughts: ${this.onslaughtMultiplierReceivedForOnslaughts}`)
        console.log(`Onslaught multiplier output: ${this.onslaughtMultiplierOutput}`)
        console.log(`Onslaught multiplier received: ${this.onslaughtMultiplierReceived}`)
        console.log(`Wong multiplier output: ${this.wongMultiplierOutput}`)
        console.log(`Wong multiplier received: ${this.wongMultiplierReceived}`)
        if (this.abilityClass == AbilityClass.ODIN){
            for (let i=0; i<Object.keys(this.odinProcs).length; i++){
                let currentKey = Object.keys(this.odinProcs)[i]
                console.log(`After playing this Odin, ${currentKey} triggers a total of ${this.odinProcs[currentKey]} times`)
            }
        }
        console.log("=======================================================")
    }

    updateBoardPosition(boardPosition) {
        this.boardPosition = boardPosition
    }

    calculateAbilitiesContained(boardState) {
        switch (this.abilityClass){
            case AbilityClass.WONG:
                this.onslaughtsContained = 0
                this.wongsContained = 1
                break;
            case AbilityClass.ONSLAUGHT:
                this.onslaughtsContained = 1
                this.wongsContained = 0
                break;
            case AbilityClass.SUPERSKRULL:
                var sideToCheck
                if (this.boardPosition[0] == 0) {
                    sideToCheck = 1
                }
                else {
                    sideToCheck = 0
                }
                this.onslaughtsContained = 0
                this.wongsContained = 0
                for (let j=0; j < boardState[sideToCheck].length; j++) {
                    for (let k=0; k < boardState[sideToCheck][j].length; k++) {
                        var cardToCheck = boardState[sideToCheck][j][k]
                        if (cardToCheck.abilityClass == AbilityClass.ONSLAUGHT) {
                            this.onslaughtsContained += 1
                        }
                        else if (cardToCheck.abilityClass == AbilityClass.WONG) {
                            this.wongsContained += 1
                        }
                    }
                }
                //console.log(`Super Skrull at position: ${this.boardPosition}`) //TODO: remove
                //console.log(`Onslaughts contained: ${this.onslaughtsContained}`) //TODO: remove
                //console.log(`Wongs contained: ${this.wongsContained}`) //TODO: remove
                break;
            case AbilityClass.MOONSTONE:
                var locationToCheck = this.boardPosition.slice(0,2)
                for (let k=0; k < boardState[locationToCheck[0]][locationToCheck[1]].length; k++) {
                    var cardToCheck = boardState[locationToCheck[0]][locationToCheck[1]][k]
                    // Ensure Moonstone's condition is met
                    // Moonstones ignore any (other) Moonstones so this will automatically ignore itself
                    if (cardToCheck.isThreeOrLess) {
                        if (cardToCheck.abilityClass == AbilityClass.ONSLAUGHT) {
                            this.onslaughtsContained += 1
                        }
                        else if (cardToCheck.abilityClass == AbilityClass.WONG) {
                            this.wongsContained += 1
                        }
                    }
                }
                //console.log(`Moonstone at position: ${this.boardPosition}`) //TODO: remove
                //console.log(`Onslaughts contained: ${this.onslaughtsContained}`) //TODO: remove
                //console.log(`Wongs contained: ${this.wongsContained}`) //TODO: remove
                break;
            default:
                this.onslaughtsContained = 0
                this.wongsContained = 0
        }
        return [this.onslaughtsContained, this.wongsContained]
    }

    calculateOnslaughtMultiplierReceivedForOnslaughts(boardState, locations){
        var locationToCheck = this.boardPosition.slice(0,2)
        var inOnslaughtsCitadel = false
        if (locations[this.boardPosition[1]] == "Onslaught's Citadel"){
            inOnslaughtsCitadel = true
        }
        // Loop through all cards in this location up to this card and add together their Multipliers
        var sumOfMultipliers = 0
        // Onslaught's Citadel is the equivalent of having an extra Onslaught
        if (inOnslaughtsCitadel){
            sumOfMultipliers += 2
        }
        for (let k=0; k < this.boardPosition[2]; k++) {
            var cardToCheck = boardState[locationToCheck[0]][locationToCheck[1]][k]
            sumOfMultipliers += cardToCheck.onslaughtMultiplierOutput
        }
        // If no Onslaught abilities are received, the base multiplier is 1
        if (sumOfMultipliers == 0){
            this.onslaughtMultiplierReceivedForOnslaughts = 1
        }
        // If there are Onslaught abilities received, the multiplier is the sum of Onslaught multipliers received
        else{
            this.onslaughtMultiplierReceivedForOnslaughts = sumOfMultipliers
        }
        return this.onslaughtMultiplierReceivedForOnslaughts
    }

    calculateOnslaughtMultiplierOutput() {
        // If no Onslaughts contained, no Onslaught effects are output
        if (this.onslaughtsContained == 0){
            this.onslaughtMultiplierOutput = 0
        }
        // Onslaught multiplier output is 2 x [Number of Onslaughts contained] x [Onslaught multiplier received]
        else{
            this.onslaughtMultiplierOutput = 2 * this.onslaughtsContained * this.onslaughtMultiplierReceivedForOnslaughts
        }
        return this.onslaughtMultiplierOutput
    }

    // Once all Onslaught multipliers have been calculated, we can now calculate the multipliers received for non-Onslaught abilities
    calculateOnslaughtMultiplierReceived(boardState, locations){
        var locationToCheck = this.boardPosition.slice(0,2)
        var inOnslaughtsCitadel = false
        if (locations[this.boardPosition[1]] == "Onslaught's Citadel"){
            inOnslaughtsCitadel = true
        }
        // Loop through all cards in this location up to this card and add together their Multipliers
        var sumOfMultipliers = 0
        // Onslaught's Citadel is the equivalent of having an extra Onslaught
        if (inOnslaughtsCitadel){
            sumOfMultipliers += 2
        }
        // This time we look at all Onslaughts in a lane (other than this card), it doesn't matter the order
        for (let k=0; k < boardState[locationToCheck[0]][locationToCheck[1]].length; k++) {
            var cardToCheck = boardState[locationToCheck[0]][locationToCheck[1]][k]
            // Don't include this card's own multiplier
            if (k != this.boardPosition[2]){
                sumOfMultipliers += cardToCheck.onslaughtMultiplierOutput
            }
        }
        // If no Onslaught abilities are received, the base multiplier is 1
        if (sumOfMultipliers == 0){
            this.onslaughtMultiplierReceived = 1
        }
        else{
            this.onslaughtMultiplierReceived = sumOfMultipliers
        }
        return this.onslaughtMultiplierReceivedForOnslaughts
    }

    calculateWongMultiplierOutput() {
        if (this.wongsContained == 0){
            this.wongMultiplierOutput = 0
            return this.wongMultiplierOutput
        }
        // Wong multiplier output is 2 x [Number of Wongs contained] x [Onslaught multiplier received]
        this.wongMultiplierOutput = 2 * this.wongsContained * this.onslaughtMultiplierReceived
        return this.wongMultiplierOutput
    }

    calculateWongMultiplierReceived(boardState, locations){
        var locationToCheck = this.boardPosition.slice(0,2)
        var inKamarTaj = locations[this.boardPosition[1]] == "Kamar-Taj"
        if (locations[this.boardPosition[1]] == "Kamar-Taj"){
            inKamarTaj = true
        }
        // Loop through all cards in this location up to this card and add together their Multipliers
        var sumOfMultipliers = 0
        // Kamar-Taj is the equivalent of having an extra Wong
        if (inKamarTaj){
            sumOfMultipliers += 2
        }
        for (let k=0; k < boardState[locationToCheck[0]][locationToCheck[1]].length; k++) {
            var cardToCheck = boardState[locationToCheck[0]][locationToCheck[1]][k]
            // Don't include this card's own multiplier
            if (k != this.boardPosition[2]){
                sumOfMultipliers += cardToCheck.wongMultiplierOutput
            }
        }
        // If no Wong abilities are received, the base multiplier is 1
        if (sumOfMultipliers == 0){
            this.wongMultiplierReceived = 1
        }
        else{
            this.wongMultiplierReceived = sumOfMultipliers
        }
        return this.wongMultiplierReceived
    }

    calculateFullOdinProcs(boardState){
        
        //TODO#
        return 0
    }

    simulateAbility(){
        //TODO
        return 0
    }

    simulateNetAbility(){
        //TODO
        return 0
    }

    simulateNetAbilityCustom(){
        //TODO
        return 0
    }

}

// Simulator logic:
// First, calculate how many Onslaughts and Wongs each card contains
// Second, loop through the cards in each location and work out the Onslaught multiplier that each card outputs
// Third, loop through the cards in each location and work out the Onslaught multiplier that each card is affected by (for it's non-Onslaught Ongoings)

// For On Reveal calculations:
// Fourth, work out the Wong multiplier that each card outputs
// Seventh, calculate the the Wong multiplier that each card receives
// Eigth, calculate and Odins ...TODO

// For Ongoing calculations:
// Fourth, work out ...TODO

// Array of two arrays (for each side), each containing 3 arrays (for each location), each containing 4 cards
//const boardState = [[[new Card, new Card, new Card, new Card],[new Card, new Card, new Card, new Card],[new Card, new Card, new Card, new Card]],
//[[new Card, new Card, new Card, new Card],[new Card, new Card, new Card, new Card],[new Card, new Card, new Card, new Card]]]

//const boardState = [[[new Card("Wong", "Wong"), new Card("Wong", "Wong"), new Card("Onslaught", "Onslaught"), new Card("Moonstone", AbilityClass.MOONSTONE)],[new Card("Maximus",AbilityClass.DEFAULT), new Card("Magik",AbilityClass.DEFAULT), new Card("Crystal",AbilityClass.DEFAULT), new Card("Adam Warlock",AbilityClass.DEFAULT)],[new Card("Super Skrull", AbilityClass.SUPERSKRULL), new Card, new Card, new Card]],
//[[new Card("Onslaught", AbilityClass.ONSLAUGHT), new Card("Super Skrull", AbilityClass.SUPERSKRULL), new Card("Wong", AbilityClass.WONG), new Card("Super Skrull", AbilityClass.SUPERSKRULL)],[new Card("Wong", AbilityClass.WONG), new Card, new Card, new Card],[new Card, new Card, new Card, new Card]]]
//TODO: reset temp intital board ^^

//const locations = ["Ruins","Ruins","Ruins"]

// For dev purposes only
//const boardStateTemp = [[[new Card("Wong", "Wong"), new Card("Wong", "Wong"), new Card("Onslaught", "Onslaught"), new Card("Sera", "Default")],[new Card("Maximus",AbilityClass.DEFAULT), new Card("Magik",AbilityClass.DEFAULT), new Card("Crystal",AbilityClass.DEFAULT), new Card("Adam Warlock",AbilityClass.DEFAULT)],[new Card, new Card, new Card, new Card]],
//[[new Card, new Card, new Card, new Card("Super Skrull", AbilityClass.SUPERSKRULL)],[new Card("Wong", AbilityClass.WONG), new Card, new Card, new Card],[new Card, new Card, new Card, new Card]]]

function testFunction() {
    console.log("Let the testing commence")
    //simulateBoard()
}
//TODO: remove above testFunction


// Visual design:
// 
// Ability to select cards - dropdown with names that we can filter?
// Override to allow <3 cost for Moonstone interaction
// Checkbox to pin information on this card's procs
// 
// Ability to overwrite ability on cards (any card as Tao Mandala exists)
// Secondary card appears small on top of og card
// Warning icon on Mystique / Prodigy / etc. if no secondary card added
// 
// Choice of card backs for unrevealed cards
// 
// Ability to select locations
// Only locations that matter are: Onslaughts Citadel/Kamar-Taj? Could include Deep Space etc. for flavour but probs not useful.
// Unselected locations show as unrevealed? Ruins?
// 
// Board is only part of screen, some should be results/information
// Ability to select cards to show info for?
// Default or ability to bring up data table for O/W on other side
// Warning colours and tooltip if I expect it to crash - Red/Amber/Green (Roughly it should start to crash after around 600 procs on an On Reveal card)
// 
// Reset Board button
// 
// Hover over cards for tooltip showing cards contained, number of procs etc. depending on that card's abilityClass
// 
// Dropdown to select full board state or algebraic location state
// 
// 
// Another tab to allow for just a lane view with algebraic results and multiplier arrows
// Another tab for my article
// 
// 

// Functionality to add:
// Locations
// Activates (Jocasta) 
// 

function Simulator(){

    // Array of two arrays (for each side), each containing 3 arrays (for each location), each containing 4 cards
    const [boardState, setBoardState] = useState([[[new Card("Odin"), new Card("Wong"), new Card("Onslaught"), new Card("Sera")],[new Card("Maximus"), new Card("Magik"), new Card("Crystal"), new Card("Adam Warlock")],[new Card, new Card, new Card, new Card]],
[[new Card, new Card, new Card, new Card("Super Skrull")],[new Card("Wong"), new Card("Sera"), new Card, new Card],[new Card, new Card, new Card, new Card]]]
)

    const [locations, setLocations] = useState(["Ruins","Ruins","Ruins"])

    let visualBoardState = extractVisualBoardState(boardState)

    function setCardName(cardName, position){
        let newBoardState = boardState.slice()
        newBoardState[position[0]][position[1]][position[2]] = new Card(cardName)
        setBoardState(newBoardState)
    }

    function setLocationName(locationName, position){
        let newLocations = locations.slice()
        newLocations[position] = locationName
        setLocations(newLocations)
    }

    function loggerFunction(side,location,position){
        //console.log(side)
        //console.log(location)
        //console.log(position)
        side = parseInt(side)
        location = parseInt(location)
        position = parseInt(position)
        //console.log(side)
        //console.log(location)
        //console.log(position)
        simulateBoard()
        if (!isNaN(side) && !isNaN(location) && !isNaN(position)){
            boardState[side][location][position].logDetails()
        }
        else{
            console.log("Input not valid")
        }
    }


    // functionToExecute should take one parameter, a Card object
    function executeFunctionOnAllCards(functionToExecute){
        for (let i=0; i < boardState.length; i++) {
            for (let j=0; j < boardState[i].length; j++) {
                for (let k=0; k < boardState[i][j].length; k++) {
                    functionToExecute(boardState[i][j][k])
                }
            }
        }
    }

    function updateBoardPositions(){
        for (let i=0; i < boardState.length; i++) {
            for (let j=0; j < boardState[i].length; j++) {
                for (let k=0; k < boardState[i][j].length; k++) {
                    boardState[i][j][k].updateBoardPosition([i,j,k])
                }
            }
        }
    }

    function calculateAbilitiesContained(boardState){
        function functionToExecute (card) {
            card.calculateAbilitiesContained(boardState)
        }
        executeFunctionOnAllCards(functionToExecute)
    }

    function calculateOnslaughtMultiplierOutputs(boardState, locations){
        function functionToExecute (card) {
            card.calculateOnslaughtMultiplierReceivedForOnslaughts(boardState, locations)
            card.calculateOnslaughtMultiplierOutput()
        }
        executeFunctionOnAllCards(functionToExecute)
    }

    function calculateOnslaughtMultipliersRecieved(boardState, locations){
        function functionToExecute (card) {
        card.calculateOnslaughtMultiplierReceived(boardState, locations)
        }
        executeFunctionOnAllCards(functionToExecute)
    }

    function calculateWongMultiplierOutputs(){
        function functionToExecute (card) {
        card.calculateWongMultiplierOutput()
        }
        executeFunctionOnAllCards(functionToExecute)
    }

    function calculateWongMultipliersReceived(boardState, locations){
        function functionToExecute (card) {
        card.calculateWongMultiplierReceived(boardState, locations)
        }
        executeFunctionOnAllCards(functionToExecute)
    }

    function calculateFullOdinProcs(boardState){
        function functionToExecute (card) {
        card.calculateFullOdinProcs(boardState)
        }
        executeFunctionOnAllCards(functionToExecute)
    }

    function simulateBoard(){
        updateBoardPositions()
        calculateAbilitiesContained(boardState)
        calculateOnslaughtMultiplierOutputs(boardState, locations)
        calculateOnslaughtMultipliersRecieved(boardState, locations)
        calculateWongMultiplierOutputs()
        calculateWongMultipliersReceived(boardState, locations)
        calculateFullOdinProcs(boardState)
    }

    //TODO: remove:
    const locationOptions = [
        { value: "", label: ""},
        { value: "Onslaught's Citadel", label: "Onslaught's Citadel"},
        { value: "Kamar-Taj", label: "Kamar-Taj"},
        { value: "Limbo", label: "Limbo"}
    ]

    return (
    <div className="Simulator">
        <div className = "horizontalContent">
            <GameBoard
                visualBoardState = {visualBoardState}
                locationNames = {locations}
                setCard = {(cardName, position) => setCardName(cardName, position)}
                setLocation = {(locationName, position) => setLocationName(locationName, position)}
            />
            <div className = "verticalContent">
                <button onClick={testFunction}> Test Button </button>
                <CardDetailsLogger
                    logCardDetailsAtPosition={loggerFunction}
                />
            </div>
        </div>
    </div>
    )
}

export default Simulator
