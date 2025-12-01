const IMG_LOCATION = (locationName) => {
    return require(`../images/locationImages/${locationName}.webp`)
}

function LocationImage(props){
    let locationName = ""
    if (props.locationName == ""){
        locationName = "Ruins"
    }
    else{
        locationName = props.locationName
    }
    locationName = locationName.toLowerCase()
    locationName = locationName.replace(' ', '-')
    locationName = locationName.replace("'", '')

    return (
        <img 
            src = { IMG_LOCATION(locationName) } 
            className = "Location-image"
            alt = "Location image"
        />
    )
}

export default LocationImage
