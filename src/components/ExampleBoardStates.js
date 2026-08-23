let blankBoardState = [
    [
        [new Card(), new Card(), new Card(), new Card()],
        [new Card(), new Card(), new Card(), new Card()],
        [new Card(), new Card(), new Card(), new Card()]
    ],
    [
        [new Card(), new Card(), new Card(), new Card()],
        [new Card(), new Card(), new Card(), new Card()],
        [new Card(), new Card(), new Card(), new Card()]
    ]
]
let blankLocations = ["Ruins","Ruins","Ruins"]

let blankBoard = {
    name: "Blank board",
    boardState: blankBoardState,
    locations: blankLocations
}

let TribunalBoardState = [
    [
        [new Card("Magik"), new Card("Jubilee"), new Card("Sera"), new Card()],
        [new Card("Luna Snow"), new Card("Ice Cube"), new Card(), new Card()],
        [new Card(("Iron Man")), new Card("Onslaught"), new Card("Onslaught"), new Card("Living Tribunal")]
    ],
    [
        [new Card(), new Card(), new Card(), new Card()],
        [new Card(), new Card(), new Card(), new Card()],
        [new Card(), new Card(), new Card(), new Card()]
    ]
]
let TribunalLocations = ["Limbo","Nova Roma","Stark Tower"]
let TribunalBoard = {
    name: "Living Tribunal",
    boardState: TribunalBoardState,
    locations: TribunalLocations
}

let mrFantasticBoardState = [
    [
        [new Card("Black Cat"), new Card("Adam Warlock"), new Card("Sera"), new Card("Onslaught")],
        [new Card("Mr Fantastic"), new Card("Moonstone"), new Card("Onslaught"), new Card("Onslaught")],
        [new Card("Luna Snow"), new Card("Ice Cube"), new Card("Magik"), new Card()]
    ],
    [
        [new Card(), new Card(), new Card(), new Card()],
        [new Card(), new Card(), new Card(), new Card()],
        [new Card(), new Card(), new Card(), new Card()]
    ]
]
let mrFantasticLocations = ["Fogwell's Gym","Baxter Building","Limbo"]
let mrFantasticBoard = {
    name: "Mr Fantastic combo",
    boardState: mrFantasticBoardState,
    locations: mrFantasticLocations
}

let exampleBoards = [blankBoard, tribunalBoard, mrFantastic]
export default exampleBoards