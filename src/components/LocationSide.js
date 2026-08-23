import '../styling/LocationSide.css'
import CardDisplay from "./CardDisplay";

// props needs to contain the game side to display cards in the correct position
function LocationSide(props) {

    return (
        <div className="locationSide">
            <div className="cardRow">
                <CardDisplay
                    cardDetails={props.cardsAtLocation[props.side ? 3:0]}
                    setCard={(newCard) => props.setCard(newCard, props.side ? 3:0)}
                    setCardAbilityClass={(newAbilityClass) => props.setCardAbilityClass(newAbilityClass, props.side ? 3:0)}
                />
                <CardDisplay
                    cardDetails={props.cardsAtLocation[props.side ? 2:1]}
                    setCard={(newCard) => props.setCard(newCard, props.side ? 2:1)}
                    setCardAbilityClass={(newAbilityClass) => props.setCardAbilityClass(newAbilityClass, props.side ? 2:1)}
                />
            </div>
            <div className="cardRow">
                <CardDisplay
                    cardDetails={props.cardsAtLocation[props.side ? 1:2]}
                    setCard={(newCard) => props.setCard(newCard, props.side ? 1:2)}
                    setCardAbilityClass={(newAbilityClass) => props.setCardAbilityClass(newAbilityClass, props.side ? 1:2)}
                />
                <CardDisplay
                    cardDetails={props.cardsAtLocation[props.side ? 0:3]}
                    setCard={(newCard) => props.setCard(newCard, props.side ? 0:3)}
                    setCardAbilityClass={(newAbilityClass) => props.setCardAbilityClass(newAbilityClass, props.side ? 0:3)}
                />
            </div>
        </div>
    )
}

export default LocationSide;
