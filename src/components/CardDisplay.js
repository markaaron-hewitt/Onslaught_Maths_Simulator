import '../styling/CardDisplay.css'
import { useEffect, useRef } from "react"
import CardImage from './CardImage.js'
import MyDropdown from './MyDropdown.js'
const plusIcon = require(`../images/icons/PlusIcon.png`)
const warningIcon = require(`../images/icons/WarningIcon.png`)

const cardList = ["","Onslaught","Wong","Super Skrull","Moonstone","Mystique","Odin","Forge","Mr Fantastic","Blue Marvel", "Firehair", "Carnage", "Venom"]

function CardDisplay(props){

    let cardIsCopyCard = props.cardDetails.name == "Mystique"
    let showCardAbilityOverwrite = props.cardDetails.abilityClass != "Default" && props.cardDetails.name != props.cardDetails.abilityClass

    function setCard(newCard){
        props.setCard(newCard)
    }

    //function setAbilityClass(){
    //    props.setAbilityClass(cardSelectRef.current.value)
    //}

    return (
    <div className="CardDisplay">
        <CardImage cardName={props.cardDetails.name} />
        {cardIsCopyCard && <img src={plusIcon} className='PlusIcon' />}
        {cardIsCopyCard && !showCardAbilityOverwrite && <img src={warningIcon} className='WarningIcon' />}
        <div className='AbilityClassOverlayImage'>
            {showCardAbilityOverwrite && <CardImage cardName={props.cardDetails.abilityClass} />}
        </div>
        <MyDropdown optionList={cardList} setOption={setCard} selectedOption={props.cardDetails.name}/>
    </div>
    )
}

export default CardDisplay;
