const colorPickerBtn = document.querySelector("#color_picker");
const colorList = document.querySelector(".all_colors");
const clearAll = document.querySelector(".clear_all");

const pickedColors = JSON.parse(localStorage.getItem("picked_colors") || "[]");

const copyColor = elem => {
    navigator.clipboard.writeText(elem.dataset.color);
    elem.innerText = "Copied";
    setTimeout(() => elem.innerText = elem.dataset.color, 1000);
}

const showColors = () => {
    if(!pickedColors.length) return;  //Returning if there are no picked colors
    colorList.innerHTML = pickedColors.map(color =>
        `<li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${color == "#ffffff" ? "#ccc" : color}"></span>
            <span class="value" data-color="${color}">${color}</span>
         </li>`
    ).join(""); // Genetating li for the picked color and adding it to the colorList 
    document.querySelector(".picked_colors").classList.remove("hide");
    // add a click event listener to each color element to coply the color code
    document.querySelectorAll(".color").forEach(li => {
        li.addEventListener("click",e => copyColor(e.currentTarget.lastElementChild));
    });
}
showColors();

const activateEyeDropper = () => {
    document.body.style.display = "none";
    setTimeout(async () => {
        try {
            // Opening the eye dropper and getting the selected color
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            navigator.clipboard.writeText(sRGBHex);
    
            // Adding the color to the list if it doesn't already exist
            if(!pickedColors.includes(sRGBHex)){
            pickedColors.push(sRGBHex);
            localStorage.setItem("picked_colors", JSON.stringify(pickedColors));
            showColors();
        }
    
        } catch (error) {
            console.log("Failed to copy the color code!");
        }
        document.body.style.display = "block";
    },10)
    
}
// Clearing all picked colors and updating localstorage,and hiding the pickedColors element
const clearAllColors = () => {
    pickedColors.length = 0;
    localStorage.setItem("picked_colors", JSON.stringify(pickedColors));
    document.querySelector(".picked_colors").classList.add("hide");
}

colorPickerBtn.addEventListener("click", activateEyeDropper);
clearAll.addEventListener("click",clearAllColors)
