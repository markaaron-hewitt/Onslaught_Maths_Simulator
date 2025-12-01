import '../styling/GameBoard.css'
import LocationSide from './LocationSide';
import LocationDisplay from './LocationDisplay';

function GameBoard(props) {
    return (
        <div className="GameBoard">
            <div className='locationColumn'>
            <LocationSide
                side = {1}
                cardsAtLocation = {props.visualBoardState[1][0]}
                setCard = {(newCard, position) => props.setCard(newCard, [1, 0, position])}
            />
            <LocationDisplay
                locationName={props.locationNames[0]}
                setLocation={(newLocation) => props.setLocation(newLocation, 0)}
            />
            <LocationSide
                side = {0}
                cardsAtLocation = {props.visualBoardState[0][0]}
                setCard = {(newCard, position) => props.setCard(newCard, [0, 0, position])}
            />
            </div>
            <div className='locationColumn'>
            <LocationSide
                side = {1}
                cardsAtLocation = {props.visualBoardState[1][1]}
                setCard = {(newCard, position) => props.setCard(newCard, [1, 1, position])}
            />
            <LocationDisplay
                locationName={props.locationNames[1]}
                setLocation={(newLocation) => props.setLocation(newLocation, 1)}
            />
            <LocationSide
                side = {0}
                cardsAtLocation = {props.visualBoardState[0][1]}
                setCard = {(newCard, position) => props.setCard(newCard, [0, 1, position])}
            />
            </div>
            <div className='locationColumn'>
            <LocationSide
                side = {1}
                cardsAtLocation = {props.visualBoardState[1][2]}
                setCard = {(newCard, position) => props.setCard(newCard, [1, 2, position])}
            />
            <LocationDisplay
                locationName={props.locationNames[2]}
                setLocation={(newLocation) => props.setLocation(newLocation, 2)}
            />
            <LocationSide
                side = {0}
                cardsAtLocation = {props.visualBoardState[0][2]}
                setCard = {(newCard, position) => props.setCard(newCard, [0, 2, position])}
            />
            </div>
        </div>
    )
}

export default GameBoard;
