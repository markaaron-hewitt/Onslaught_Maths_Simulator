const IMG_CARD = (cardName) => {
    return require(`../images/card_images/${cardName}.jpg`)
}

function CardImage(props){
    return (
        <img 
            src = { props.cardName == "" ? IMG_CARD("Default") : IMG_CARD(props.cardName.replace(' ', '')) } 
            className = "Card-image"
            alt = "Card image"
        />
    )
}

export default CardImage
