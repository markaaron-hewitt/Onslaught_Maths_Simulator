import '../styling/CardDisplay.css'
import { useEffect, useRef } from "react"
import CardImage from './CardImage.js'
import MyDropdown from './MyDropdown.js'
import { Popover, IconButton } from '@mui/material'
const plusIcon = require(`../images/icons/PlusIcon.png`)
const warningIcon = require(`../images/icons/WarningIcon.png`)
const cancelIcon = require(`../images/icons/CancelIcon.png`)

const cardList = ["","Onslaught","Wong","Super Skrull","Moonstone","Mystique","Mr Fantastic","Blue Marvel","Forge","Rock"]
cardList.sort()

//,"Shuri","Leader","Firehair","Carnage","Venom","Luna Snow","Nakia","Chameleon","Prodigy","Odin","Maximus","Magik"

function CardDisplay(props){

    let cardIsCopyCard = ["Mystique", "Chameleon", "Prodigy", "Absorbing Man"].includes(props.cardDetails.name)
    let showCardAbilityOverwrite = (props.cardDetails.abilityClass != "") && (props.cardDetails.abilityClass != props.cardDetails.name)

    function setCard(newCard){
        props.setCard(newCard)
    }

    function setAbilityClass(newAbilityClass){
        props.setCardAbilityClass(newAbilityClass)
    }

    //function setAbilityClass(){
    //    props.setAbilityClass(cardSelectRef.current.value)
    //}

    //img src={plusIcon}

//showCardAbilityOverwrite && <CardImage cardName={props.cardDetails.abilityClass}
// TODO: correct the below with this ^^
//{props.cardDetails.name == "Mystique" &&  <CardImage cardName={"Wong"}/>} 

//TODO: Do I want to add back the add button?
        // {false && cardIsCopyCard &&
        //     //<IconButton
        //     <img src={plusIcon}
        //         className='PlusIcon'
        //         onClick={() => console.log("CardDisplay: plusIcon img clicked")}
        //     />
        // }

    return (
    <div className="CardDisplay">
        <CardImage cardName={props.cardDetails.name} />
        {cardIsCopyCard && !showCardAbilityOverwrite && 
            <div className="popupDropdown" id="popupDropdown">
                <MyDropdown optionList={cardList} setOption={setAbilityClass} selectedOption={props.cardDetails.name}/>
            </div>
        }
        {cardIsCopyCard && !showCardAbilityOverwrite && 
            <img src={warningIcon}
            className='WarningIcon'
            />
        }
        <div className='AbilityClassOverlayImage'>
            {showCardAbilityOverwrite && <CardImage cardName={props.cardDetails.abilityClass}/>}
            {showCardAbilityOverwrite && <img src={cancelIcon} className='removeAbilityIcon' onClick={() => setAbilityClass("")}
            />} 
        </div>
        <MyDropdown optionList={cardList} setOption={setCard} selectedOption={props.cardDetails.name}/>
    </div>
    )
}

export default CardDisplay;
