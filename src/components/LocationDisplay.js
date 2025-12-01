import '../styling/LocationDisplay.css'
import LocationImage from './LocationImage.js'
import MyDropdown from './MyDropdown.js'

const locationList = ["","Onslaught's Citadel","Kamar-Taj","Limbo"]

function LocationDisplay(props){

    function setLocation(newLocation){
        props.setLocation(newLocation)
    }

    return (
    <div className="LocationDisplay">
        <LocationImage locationName={props.locationName} />

        <MyDropdown optionList={locationList} setOption={setLocation} selectedOption={props.locationNameame} />
    </div>
    )
}

export default LocationDisplay;
