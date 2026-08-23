import '../styling/CardDisplay.css'
import CardImage from './CardImage.js'
import MyDropdown from './MyDropdown.js'
const warningIcon = require(`../images/icons/WarningIcon.png`)
const cancelIcon = require(`../images/icons/CancelIcon.png`)

const cardList = ["","Onslaught","Wong","Super Skrull","Moonstone","Mystique","Mr Fantastic","Blue Marvel","Forge","Rock"]
cardList.sort()

function CardDisplay(props){

    let cardIsCopyCard = ["Mystique", "Chameleon", "Prodigy", "Absorbing Man"].includes(props.cardDetails.name)
    let showCardAbilityOverwrite = (props.cardDetails.abilityClass !== "") && (props.cardDetails.abilityClass !== props.cardDetails.name)

    function setCard(newCard){
        props.setCard(newCard)
    }

    function setAbilityClass(newAbilityClass){
        props.setCardAbilityClass(newAbilityClass)
    }

    return (
    <div className="CardDisplay">
        <CardImage cardName={props.cardDetails.name} />
        {cardIsCopyCard && !showCardAbilityOverwrite && 
            <div className="popupDropdown" id="popupDropdown">
                <MyDropdown optionList={cardList} setOption={setAbilityClass} selectedOption={props.cardDetails.name}/>
            </div>
        }
        {cardIsCopyCard && !showCardAbilityOverwrite && 
            <img 
                alt="Warning Icon"
                src={warningIcon}
                className='WarningIcon'
            />
        }
        <div className='AbilityClassOverlayImage'>
            {showCardAbilityOverwrite && <CardImage cardName={props.cardDetails.abilityClass}/>}
            {showCardAbilityOverwrite && <img alt="Remove Icon" src={cancelIcon} className='removeAbilityIcon' onClick={() => setAbilityClass("")}
            />}
        </div>
        <MyDropdown optionList={cardList} setOption={setCard} selectedOption={props.cardDetails.name}/>
    </div>
    )
}

export default CardDisplay;
