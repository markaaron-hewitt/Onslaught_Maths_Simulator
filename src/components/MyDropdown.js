import { useEffect, useRef } from "react"

function MyDropdown(props){

    useEffect(() => {setOptions()})
    const selectRef = useRef(null);

    function setOptions(){
        let selector = selectRef.current;
        selector.replaceChildren()
        let opt = null
        for(let i = 0; i<props.optionList.length; i++) { 
            opt = document.createElement('option')
            opt.value = props.optionList[i]
            opt.innerHTML = props.optionList[i]
            selector.appendChild(opt)
        }
        selector.value = props.selectedOption;
    }

    return(
            <select ref={selectRef} onChange={() => props.setOption(selectRef.current.value)}></select>
    )
}

export default MyDropdown
