import '../styling/CardDetailsDisplay.css'
import { useRef } from 'react';

function CardDetailsDisplay(props) {

    const inputSide = useRef(null);
    const inputLocation = useRef(null);
    const inputPosition = useRef(null);

    // function getDisplayNamesOfDisplayedCard(){
    //     let sideString = ""
    //     switch(props.displayedCard.boardPosition[0]){
    //         case(0):
    //         default:
    //             sideString = "My"
    //             break
    //         case(1):
    //             sideString = "Their"
    //             break
    //     }
    //     let locationString = ""
    //     switch(props.displayedCard.boardPosition[1]){
    //         case(0):
    //         default:
    //             locationString = "left"
    //             break
    //         case(1):
    //             locationString = "mid"
    //             break
    //         case(2):
    //             locationString = "right"
    //             break
    //     }
    //     let positionString = String(props.displayedCard.boardPosition[2] + 1)
    //     return [sideString, locationString, positionString]
    // }

    // function getDisplayPositionOfDisplayedCard(){
    //     let BoardPositionDisplayNames = getDisplayNamesOfDisplayedCard()
    //     return BoardPositionDisplayNames[0] + " side, " + BoardPositionDisplayNames[1] + " location, card " + BoardPositionDisplayNames[2]
    // }

    function displayCardDetails(){
        let side = 0
        switch(inputSide.current.value){
            case("My"):
            default:
                side = 0
                break
            case("Their"):
                side = 1
                break
        }
        let location = 0
        switch(inputLocation.current.value){
            case("left"):
            default:
                location = 0
                break
            case("mid"):
                location = 1
                break
            case("right"):
                location = 2
                break
        }
        let position = parseInt(inputPosition.current.value[inputPosition.current.value.length-1]) - 1
        props.setDisplayedCardBoardPosition([side,location,position])
    }

    return (
        <div className="DetailsDisplay">
            <h5>
                Display card details
            </h5>
            <div className="Inputs">
                <div className = "SelectDiv">
                <select
                    id="inputSideSelect"
                    ref={inputSide}
                    onChange={displayCardDetails}
                >
                    <option>My</option>
                    <option>Their</option>
                </select>
                </div>

                <p>side, </p>

                <div className = "SelectDiv">
                    <select
                        id="inputLocationSelect"
                        ref={inputLocation}
                        onChange={displayCardDetails}
                    >
                        <option>left</option>
                        <option>mid</option>
                        <option>right</option>
                    </select>
                </div>

                <p>location, card</p>

                <div className = "SelectDiv">
                    <select
                        id="inputPositionSelect"
                        ref={inputPosition}
                        onChange={displayCardDetails}
                    >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>
                </div>
            </div>

            <div className="Outputs">
                <p className='DetailsTitle'><b>{props.displayedCard.name === "" ? "Blank card selected" : props.displayedCard.name}</b></p>
                <p>Ongoing multiplier: <b>{props.displayedCard.onslaughtMultiplierReceived}</b></p>
                <p>On Reveal multiplier: <b>{props.displayedCard.wongMultiplierReceived}</b></p>
                <p> ============================== </p>
                <p className='DetailsTitle'><b>Under the hood:</b></p>
                <p>Ongoing multiplier for contained Onslaughts: <b>{props.displayedCard.onslaughtMultiplierReceivedForOnslaughts}</b></p>
                <p>Onslaughts contained: <b>{props.displayedCard.onslaughtsContained}</b></p>
                <p>Wongs contained: <b>{props.displayedCard.wongsContained}</b></p>
                <p>Ongoing multiplier output: <b>{props.displayedCard.onslaughtMultiplierOutput}</b></p>
                <p>On Reveal multiplier output: <b>{props.displayedCard.wongMultiplierOutput}</b></p>
            </div>
        </div>
    )
}

export default CardDetailsDisplay;

//              <p className='DetailsTitle'>[{getDisplayPositionOfDisplayedCard()}]</p>