import '../styling/CardDetailsLogger.css'
import { useRef } from 'react';

function CardDetailsLogger({logCardDetailsAtPosition}) {

    const inputSide = useRef(null);
    const inputLocation = useRef(null);
    const inputPosition = useRef(null);

    function logCardDetails(){
        let side = 0
        switch(inputSide.current.value){
            case("Me"):
            default:
                side = 0
                break
            case("Opp"):
                side = 1
                break
        }
        let location = 0
        switch(inputLocation.current.value){
            case("Left"):
            default:
                location = 0
                break
            case("Mid"):
                location = 1
                break
            case("Right"):
                location = 2
                break
        }
        let position = parseInt(inputPosition.current.value[inputPosition.current.value.length-1]) - 1
        logCardDetailsAtPosition(side,location,position)
    }

    return (
        <div className="DetailsLogger">
            <h5>
                Log card details
            </h5>
            <div className="Inputs">

                <select ref={inputSide}>
                    <option>Me</option>
                    <option>Opp</option>
                </select>

                <select ref={inputLocation}>
                    <option>Left</option>
                    <option>Mid</option>
                    <option>Right</option>
                </select>

                <select ref={inputPosition}>
                    <option>Slot 1</option>
                    <option>Slot 2</option>
                    <option>Slot 3</option>
                    <option>Slot 4</option>
                </select>

            </div>
            <button onClick={logCardDetails}>Log card details</button>
        </div>
    )
}

export default CardDetailsLogger;


//                <input placeholder="Side"></input>
//                <input ref={inputLocation} placeholder="Location"></input>
//                <input ref={inputPosition} placeholder="Position"></input>