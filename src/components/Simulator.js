import GameBoard from "./GameBoard"
import CardDetailsDisplay from "./CardDetailsDisplay"
import '../styling/Simulator.css'
import { useState, useEffect } from "react"


// Ability Class enum
const AbilityClass = {
    DEFAULT: "Default",
    ONSLAUGHT: "Onslaught",
    WONG: "Wong",
    SUPERSKRULL: "Super Skrull",
    MOONSTONE: "Moonstone",
    ODIN: "Odin",
    JOCASTA: "Jocasta",
    REMOVED: "Removed"
};

// Temporary map of card name -> 3 cost or less (to make Moonstone functional)
const ThreeOrLessMap = {
    "": false,
    "Onslaught": false,
    "Wong": false,
    "Super Skrull": false,
    "Moonstone": false,
    "Mystique": true,
    "Mr Fantastic": true,
    "Blue Marvel": false,
    "Forge": true,
    "Rock": true,

    "Chameleon": true,
    "Prodigy": true,
    "Iron Man": false,
    "The Living Tribunal": false,
    "Luna Snow": true,
    "Ice Cube": true,
    "Sera": false,
    "Magik": true,
    "Adam Warlock": true
}

// Card class
class Card {
    legacyCalculations = false
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
    onslaughtMultiplierReceivedForOnslaughts = 1
    onslaughtMultiplierReceived = 1
    // Wong multiplier received = how many times do On Reveal effects of this card proc?
    wongMultiplierReceived = 1
    // Output = What is the total multiplier of this type that this card outputs? Generally Output = Contained * Multiplier Received
    onslaughtMultiplierOutput = 0
    wongMultiplierOutput = 0
    odinProcs= {Forge:"23", Shuri:"24"}  //TODO: make this {}

    constructor(name, abilityClass) {
        // Set name
        if (name) {
            this.name = name
        }
        // If custom ability class selected, use it
        if (Object.values(AbilityClass).includes(abilityClass) && abilityClass != "") {
            this.abilityClass = abilityClass
        }
        // If no custom ability class selected, check if the card name inherently has an ability class
        if (Object.values(AbilityClass).includes(name)) {
            this.abilityClass = name
        }
        // If no other ability class is found, set it as default
        else {
            this.abilityClass = AbilityClass.DEFAULT
        }
    }

    getName(){
        return this.name
    }

    setName(name){
        this.name = name
    }

    getAbilityClass(){
        return this.abilityClass
    }

    setAbilityClass(abilityClass){
        this.abilityClass = abilityClass
    }

    setIsThreeOrLess(){
        if (this.name in ThreeOrLessMap){
            this.isThreeOrLess = ThreeOrLessMap[this.name]
        }
    }

    logDetails(){
        console.log("=======================================================")
        console.log(`Name: ${this.name}`)
        console.log(`Use legacy calculations: ${this.legacyCalculations}`)  
        console.log(`Ability Class: ${this.abilityClass}`)
        console.log(`Position: ${this.boardPosition}`)
        console.log(`Onslaughts contained: ${this.onslaughtsContained}`)
        console.log(`Wongs contained: ${this.wongsContained}`)
        console.log(`Onslaught multiplier received for Onslaughts: ${this.onslaughtMultiplierReceivedForOnslaughts}`)
        console.log(`Onslaught multiplier output: ${this.onslaughtMultiplierOutput}`)
        console.log(`Onslaught multiplier received: ${this.onslaughtMultiplierReceived}`)
        console.log(`Wong multiplier output: ${this.wongMultiplierOutput}`)
        console.log(`Wong multiplier received: ${this.wongMultiplierReceived}`)
        if (this.abilityClass === AbilityClass.ODIN){
            for (let i=0; i<Object.keys(this.odinProcs).length; i++){
                let currentKey = Object.keys(this.odinProcs)[i]
                console.log(`After playing this Odin, ${currentKey} triggers a total of ${this.odinProcs[currentKey]} times`)
            }
        }
        console.log("=======================================================")
    }

    setBoardPosition(boardPosition) {
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
                let sideToCheck
                if (this.boardPosition[0] === 0) {
                    sideToCheck = 1
                }
                else {
                    sideToCheck = 0
                }
                this.onslaughtsContained = 0
                this.wongsContained = 0
                for (let j=0; j < boardState[sideToCheck].length; j++) {
                    for (let k=0; k < boardState[sideToCheck][j].length; k++) {
                        let cardToCheck = boardState[sideToCheck][j][k]
                        if (cardToCheck.abilityClass === AbilityClass.ONSLAUGHT) {
                            this.onslaughtsContained += 1
                        }
                        else if (cardToCheck.abilityClass === AbilityClass.WONG) {
                            this.wongsContained += 1
                        }
                    }
                }
                break;
            case AbilityClass.MOONSTONE:
                let locationToCheck = this.boardPosition.slice(0,2)
                this.onslaughtsContained = 0
                this.wongsContained = 0
                for (let k=0; k < boardState[locationToCheck[0]][locationToCheck[1]].length; k++) {
                    let cardToCheck = boardState[locationToCheck[0]][locationToCheck[1]][k]
                    // Ensure Moonstone's condition is met
                    // Moonstones ignore any (other) Moonstones so this will automatically ignore itself
                    if (cardToCheck.isThreeOrLess) {
                        if (cardToCheck.abilityClass === AbilityClass.ONSLAUGHT) {
                            this.onslaughtsContained += 1
                        }
                        else if (cardToCheck.abilityClass === AbilityClass.WONG) {
                            this.wongsContained += 1
                        }
                    }
                }
                break;
            default:
                this.onslaughtsContained = 0
                this.wongsContained = 0
        }
        return [this.onslaughtsContained, this.wongsContained]
    }

    calculateOnslaughtMultiplierReceivedForOnslaughts(boardState, locations){
        let locationToCheck = this.boardPosition.slice(0,2)
        let inOnslaughtsCitadel = false
        if (locations[this.boardPosition[1]] === "Onslaught's Citadel"){
            inOnslaughtsCitadel = true
        }
        // Loop through all cards in this location up to this card and add together their Multipliers
        let sumOfMultipliers = 0
        if (this.legacyCalculations === false)
            sumOfMultipliers = 1
        // Onslaught's Citadel is the equivalent of having an extra Onslaught
        if (inOnslaughtsCitadel){
            if (this.legacyCalculations)
                sumOfMultipliers += 2
            else
                sumOfMultipliers += 1
        }
        for (let k=0; k < this.boardPosition[2]; k++) {
            let cardToCheck = boardState[locationToCheck[0]][locationToCheck[1]][k]
            sumOfMultipliers += cardToCheck.onslaughtMultiplierOutput
        }
        // If no Onslaught abilities are received, the base multiplier is 1
        if (sumOfMultipliers === 0){
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
        if (this.onslaughtsContained === 0){
            this.onslaughtMultiplierOutput = 0
        }
        else{
            if (this.legacyCalculations)
                // LEGACY Onslaught multiplier output is 2 x [Number of Onslaughts contained] x [Onslaught multiplier received]
                this.onslaughtMultiplierOutput = 2 * this.onslaughtsContained * this.onslaughtMultiplierReceivedForOnslaughts
            else
                // CURRENT Onslaught multiplier output is [Number of Onslaughts contained] x [Onslaught multiplier received]
                this.onslaughtMultiplierOutput = this.onslaughtsContained * this.onslaughtMultiplierReceivedForOnslaughts
        }
        return this.onslaughtMultiplierOutput
    }

    // Once all Onslaught multipliers have been calculated, we can now calculate the multipliers received for non-Onslaught abilities
    calculateOnslaughtMultiplierReceived(boardState, locations){
        let locationToCheck = this.boardPosition.slice(0,2)
        let inOnslaughtsCitadel = false
        if (locations[this.boardPosition[1]] === "Onslaught's Citadel"){
            inOnslaughtsCitadel = true
        }
        // Loop through all cards in this location up to this card and add together their Multipliers
        let sumOfMultipliers = 0
        if (this.legacyCalculations === false)
            sumOfMultipliers = 1
        // Onslaught's Citadel is the equivalent of having an extra Onslaught
        if (inOnslaughtsCitadel){
            if (this.legacyCalculations)
                sumOfMultipliers += 2
            else
                sumOfMultipliers += 1
        }
        // This time we look at all Onslaughts in a lane (other than this card), it doesn't matter the order
        for (let k=0; k < boardState[locationToCheck[0]][locationToCheck[1]].length; k++) {
            let cardToCheck = boardState[locationToCheck[0]][locationToCheck[1]][k]
            // Don't include this card's own multiplier
            if (k !== this.boardPosition[2]){
                sumOfMultipliers += cardToCheck.onslaughtMultiplierOutput
            }
        }
        // If no Onslaught abilities are received, the base multiplier is 1
        if (sumOfMultipliers === 0){
            this.onslaughtMultiplierReceived = 1
        }
        else{
            this.onslaughtMultiplierReceived = sumOfMultipliers
        }
        return this.onslaughtMultiplierReceivedForOnslaughts
    }

    calculateWongMultiplierOutput() {
        if (this.wongsContained === 0){
            this.wongMultiplierOutput = 0
            return this.wongMultiplierOutput
        }
        if (this.legacyCalculations)
            // LEGACY Wong multiplier output is 2 x [Number of Wongs contained] x [Onslaught multiplier received]
            this.wongMultiplierOutput = 2 * this.wongsContained * this.onslaughtMultiplierReceived
        else
            // CURRENT Wong multiplier output is [Number of Wongs contained] x [Onslaught multiplier received]
            this.wongMultiplierOutput = this.wongsContained * this.onslaughtMultiplierReceived
        return this.wongMultiplierOutput
    }

    calculateWongMultiplierReceived(boardState, locations){
        let locationToCheck = this.boardPosition.slice(0,2)
        let inKamarTaj = locations[this.boardPosition[1]] === "Kamar-Taj"
        if (locations[this.boardPosition[1]] === "Kamar-Taj"){
            inKamarTaj = true
        }
        // Loop through all cards in this location up to this card and add together their Multipliers
        let sumOfMultipliers = 0
        if (this.legacyCalculations === false)
            sumOfMultipliers = 1
        // Kamar-Taj is the equivalent of having an extra Wong
        if (inKamarTaj){
            if (this.legacyCalculations)
                sumOfMultipliers += 2
            else
                sumOfMultipliers += 1
        }
        for (let k=0; k < boardState[locationToCheck[0]][locationToCheck[1]].length; k++) {
            let cardToCheck = boardState[locationToCheck[0]][locationToCheck[1]][k]
            // Don't include this card's own multiplier
            if (k !== this.boardPosition[2]){
                sumOfMultipliers += cardToCheck.wongMultiplierOutput
            }
        }
        // If no Wong abilities are received, the base multiplier is 1
        if (sumOfMultipliers === 0){
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
// Could include extra locations like Deep Space etc. for flavour but probs not useful.
// 
// Board is only part of screen, some should be results/information
// Ability to select cards to show info for?
// Default or ability to bring up data table for O/W on other side
// Warning colours and tooltip if I expect it to crash - Red/Amber/Green (Roughly it should start to crash after around 600 procs on an On Reveal card)
// 
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
// Activates (Jocasta) 
// 

function Simulator(){

    const [visualBoardState, setVisualBoardState] = useState(
        [
            [
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}]
            ],
            [
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}]
            ],
        ]
    )

    // Array of two arrays (for each side), each containing 3 arrays (for each location), each containing 4 cards
    const [boardState, setBoardState] = useState(
        [
            [
                [new Card("Maximus"), new Card("Luna Snow"), new Card("Nakia"), new Card("")],
                [new Card("Mr Fantastic"), new Card("Moonstone"), new Card("Onslaught"), new Card("Onslaught")],
                [new Card("King Eitri"), new Card("Magik"), new Card(""), new Card("")]
            ],
            [
                [new Card("Maximus"), new Card("Wong"), new Card("Wong"), new Card("Leader")],
                [new Card("Rock"), new Card("Rock"), new Card("Rock"), new Card("Rock")],
                [new Card("Korg"), new Card("Sera"), new Card("Onslaught"), new Card("Onslaught")]
            ]
        ]
    )

    const [locations, setLocations] = useState(["Ruins","Ruins","Ruins"])

    const [useLegacyCalculations, setUseLegacyCalculations] = useState(false)

    const [displayedCardBoardPosition, setDisplayedCardBoardPosition] = useState([0,0,0])

    useEffect(
        () => {
            simulateBoard()
        }, [displayedCardBoardPosition, visualBoardState, locations, useLegacyCalculations]
    );

//displayedCardBoardPosition, visualBoardState, locations, useLegacyCalculations

    function toggleUseLegacyCalculations(){
        setUseLegacyCalculations(!useLegacyCalculations)
    }

    function setBoardStateFromVisualBoardState(){
        for (let i=0; i < boardState.length; i++) {
            for (let j=0; j < boardState[i].length; j++) {
                for (let k=0; k < boardState[i][j].length; k++) {
                    boardState[i][j][k].setName(visualBoardState[i][j][k].name)

                    // If custom ability class selected, use it
                    if (Object.values(AbilityClass).includes(visualBoardState[i][j][k].abilityClass)) {
                        boardState[i][j][k].abilityClass = visualBoardState[i][j][k].abilityClass
                    }
                    // If no custom ability class selected, check if the card name inherently has an ability class
                    else if (Object.values(AbilityClass).includes(visualBoardState[i][j][k].name)) {
                        boardState[i][j][k].abilityClass = visualBoardState[i][j][k].name
                    }
                    // If no other ability class is found, set it as default
                    else {
                        boardState[i][j][k].abilityClass = AbilityClass.DEFAULT
                    }
                }
            }
        }
    }

    function resetBoard(){
        let emptyBoardState =         
        [
            [
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}]
            ],
            [
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}]
            ],
        ]
        let emptyLocations = ["Ruins","Ruins","Ruins"]
        setVisualBoardState(emptyBoardState)
        setLocations(emptyLocations)
    }

    function setExampleBoardTheLivingTribunal(){
        let exampleBoardState = 
        [
            [
                [{name: "Magik", abilityClass: ""},{name: "Jubilee", abilityClass: ""},{name: "Sera", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "Luna Snow", abilityClass: ""},{name: "Ice Cube", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "Iron Man", abilityClass: ""},{name: "Onslaught", abilityClass: "Onslaught"},{name: "Onslaught", abilityClass: "Onslaught"},{name: "The Living Tribunal", abilityClass: ""}]
            ],
            [
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}]
            ],
        ]
        let exampleLocations = ["Limbo","Nova Roma","Stark Tower"]
        setVisualBoardState(exampleBoardState)
        setLocations(exampleLocations)
    }

    function setExampleBoardMrFantasticCombo(){
        let exampleBoardState = 
        [
            [
                [{name: "Black Cat", abilityClass: ""},{name: "Adam Warlock", abilityClass: ""},{name: "Sera", abilityClass: ""},{name: "Onslaught", abilityClass: "Onslaught"}],
                //[{name: "Mr Fantastic", abilityClass: ""},{name: "Moonstone", abilityClass: "Moonstone"},{name: "Onslaught", abilityClass: "Onslaught"},{name: "Onslaught", abilityClass: "Onslaught"}],
                //TODO: remove
                [{name: "Mr Fantastic", abilityClass: ""},{name: "Moonstone", abilityClass: "Moonstone"},{name: "Mystique", abilityClass: "Onslaught"},{name: "Chameleon", abilityClass: "Onslaught"}],
                [{name: "Luna Snow", abilityClass: ""},{name: "Ice Cube", abilityClass: ""},{name: "Magik", abilityClass: ""},{name: "", abilityClass: ""}]
            ],
            [
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}],
                [{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""},{name: "", abilityClass: ""}]
            ],
        ]
        let exampleLocations = ["Fogwell's Gym","Baxter Building","Limbo"]
        setVisualBoardState(exampleBoardState)
        setLocations(exampleLocations)
    }

    function setCardName(cardName, position){
        let newVisualBoardState = visualBoardState.slice()
        newVisualBoardState[position[0]][position[1]][position[2]].name = cardName
        setVisualBoardState(newVisualBoardState)
    }

    function setCardAbilityClass(abilityClass, position){
        let newVisualBoardState = visualBoardState.slice()
        newVisualBoardState[position[0]][position[1]][position[2]].abilityClass = abilityClass
        setVisualBoardState(newVisualBoardState)
    }

    function setLocationName(locationName, position){
        let newLocations = locations.slice()
        newLocations[position] = locationName
        setLocations(newLocations)
    }

    function loggerFunction(side,location,position){
        side = parseInt(side)
        location = parseInt(location)
        position = parseInt(position)

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

    function setBoardPositions(){
        for (let i=0; i < boardState.length; i++) {
            for (let j=0; j < boardState[i].length; j++) {
                for (let k=0; k < boardState[i][j].length; k++) {
                    boardState[i][j][k].setBoardPosition([i,j,k])
                }
            }
        }
    }

    function setLegacyCalculationsBooleans(){
        function functionToExecute (card) {
            card.legacyCalculations = useLegacyCalculations
        }
        executeFunctionOnAllCards(functionToExecute)
    }

    function setIsThreeOrLessProperties(){
        function functionToExecute (card) {
            card.setIsThreeOrLess()
        }
        executeFunctionOnAllCards(functionToExecute)
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
        setBoardStateFromVisualBoardState()
        setBoardPositions()
        setLegacyCalculationsBooleans()
        setIsThreeOrLessProperties()
        calculateAbilitiesContained(boardState)
        calculateOnslaughtMultiplierOutputs(boardState, locations)
        calculateOnslaughtMultipliersRecieved(boardState, locations)
        calculateWongMultiplierOutputs()
        calculateWongMultipliersReceived(boardState, locations)
        calculateFullOdinProcs(boardState)
        setBoardState([...boardState])
        loggerFunction(...displayedCardBoardPosition)
    }

    return (
    <div className="Simulator">
        <div className = "horizontalContent">
            <div className = "leftMenu">
                <p>Legacy calculations?</p>
                <label className="switch">
                    <input type="checkbox" value={useLegacyCalculations} onChange={() => toggleUseLegacyCalculations()} />
                    <span className="slider round"></span>
                </label>
                <p className = "clarifier">(Pre 30 Apr 2026)</p>
                <p>Example Boards</p>
                <button onClick={setExampleBoardTheLivingTribunal}>The Living Tribunal</button>
                <button onClick={setExampleBoardMrFantasticCombo}>Mr Fantastic Combo</button>
                <button className = "resetButton" onClick={resetBoard}>Reset board</button>
            </div>
            <GameBoard
                visualBoardState = {visualBoardState}
                locationNames = {locations}
                setCard = {(cardName, position) => setCardName(cardName, position)}
                setCardAbilityClass = {(newAbilityClass, position) => setCardAbilityClass(newAbilityClass, position)}
                setLocation = {(locationName, position) => setLocationName(locationName, position)}
            />
            <div className = "verticalContent">
                <CardDetailsDisplay
                    displayedCard = {boardState[displayedCardBoardPosition[0]][displayedCardBoardPosition[1]][displayedCardBoardPosition[2]]}
                    setDisplayedCardBoardPosition={setDisplayedCardBoardPosition}
                />
            </div>
        </div>
    </div>
    )
}

export default Simulator
