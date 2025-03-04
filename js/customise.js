function renameLabel(eventBase) {
    // Store the current label text
    labelElement = document.getElementById(`${eventBase}-label`);
    const originalText = labelElement.textContent;
    const eventNum = parseInt(eventBase.charAt(eventBase.length - 1));

    // Create an input field and set its value to the current label text
    const input = document.createElement("input");
    input.type = "text";
    input.value = originalText;
    input.classList.add('rename-input')

    // Replace the label with the input field
    labelElement.textContent = '';
    labelElement.appendChild(input);
    input.focus(); // Focus on the input field so user can start typing immediately

    function confirm(){
        labelElement.textContent = input.value.trim() || originalText;
        input.remove();
        updateProbabilityLabels();
        stateHasChanged();
    }

    function cancel(){
        labelElement.textContent = originalText;
        input.remove();
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            confirm(); 
        } else if (event.key === "Escape") {
            cancel();
        }
    });

    document.addEventListener("mousedown", function (event) {
        if (!labelElement.contains(event.target) && 
            !input.contains(event.target)) {
                confirm();
        }
    });
}

// function createEventStyle(base, {color=null, borderRadius=null} = {}){
    
//     return style;
// }

function customiseEvidence(evidenceBase) {
    console.log(`customise ${evidenceBase}`)
    const popup = document.createElement('div');
    // popup.style.zIndex = '900';
    popup.className = 'customise-menu';
    popup.style.position = 'fixed';
    popup.style.zIndex = '99999';
    // popup.style.opacity = '99999';

    // position the popup to the right of the element '#evidence-controls-container'
    const targetElement = document.querySelector('#evidence-controls-container');
    if (targetElement) {
        const rect = targetElement.getBoundingClientRect(); // Get its position
        
        // Position the popup 50px to the right of the element
        popup.style.left = `${rect.right + 10}px`;
        popup.style.top = `${targetElement.offsetHeight/2}px`;
        popup.style.transform = 'translateY(-30%)';

    } else {
        console.warn('Element #evidence-controls-container not found');
        popup.style.left = '10px'; // Fallback position
        popup.style.top = '10px';
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' || event.key === 'Enter') {
            popup.remove();
        }
    });
    
    // Listen for clicks outside the popup to remove it
    document.addEventListener('mousedown', function(event) {
        // Check if the clicked target is outside the popup
        if (!popup.contains(event.target)) {
            popup.remove();
        }
    });

    // const title = document.createElement('h3');
    // title.innerText = `Customise: ${document.getElementById(`${evidenceBase}-label`)?.innerText || evidenceBase}`;
    // popup.appendChild(title);

    const topBar = document.createElement('div');
    topBar.className = 'top-bar draggable';
    topBar.innerText = `Customise: ${document.getElementById(`${evidenceBase}-label`)?.innerText || evidenceBase}`;
    const closeButton = document.createElement('button');
    closeButton.innerText = '✖';
    closeButton.className = 'close-btn';

    closeButton.onclick = function () {
        popup.remove();
    };
    topBar.appendChild(closeButton);
    popup.appendChild(topBar);

    const main = document.createElement('div');
    main.className = 'customise-main';

    // Create the Border Section
    // const borderSection = document.createElement('div');
    // borderSection.innerHTML = '<h4>Border</h4>';

    const rgbaColor = document.documentElement.style.getPropertyValue(`--${evidenceBase}-object-color`);
    const { hex, opacity } = rgbaToHexAndOpacity(rgbaColor);
    // const hexColor = ...
    // const opacity = ...

    // Border Color Picker
    const borderColorLabel = document.createElement('label');
    borderColorLabel.innerText = "Color:";
    main.appendChild(borderColorLabel);
    const borderColorInput = document.createElement('input');
    borderColorInput.type = 'color';
    borderColorInput.id = 'borderColor';
    console.log(`current border color: ${rgbaColor} = ${hex}`);
    borderColorInput.value = hex;
    borderColorInput.addEventListener('input',updateEvidenceCustomisation);
    main.appendChild(borderColorInput);

    // Border Opacity Slider
    const borderOpacityLabel = document.createElement('label');
    borderOpacityLabel.innerText = "Border Opacity:";
    main.appendChild(borderOpacityLabel);
    const borderOpacityInput = document.createElement('input');
    borderOpacityInput.type = 'range';
    borderOpacityInput.min = '0';
    borderOpacityInput.max = '1';
    borderOpacityInput.step = '0.01';
    console.log(`current border opacity: ${opacity}`);
    borderOpacityInput.value = opacity;
    borderOpacityInput.addEventListener('input',updateEvidenceCustomisation);
    main.appendChild(borderOpacityInput);


    // Border Size Slider
    const borderSizeLabel = document.createElement('label');
    borderSizeLabel.innerText = "Border Size:";
    main.appendChild(borderSizeLabel);
    const borderSizeInput = document.createElement('input');
    borderSizeInput.type = 'range';
    borderSizeInput.min = '0';
    borderSizeInput.max = '15';
    console.log(`current border size: ${document.documentElement.style.getPropertyValue(`--${evidenceBase}-object-border-size`)}`);
    borderSizeInput.value = parseInt(document.documentElement.style.getPropertyValue(`--${evidenceBase}-object-border-size`), 10);
    borderSizeInput.addEventListener('input',updateEvidenceCustomisation);
    main.appendChild(borderSizeInput);

    // main.appendChild(borderSection);

    // Create the Text Section
    // const textSection = document.createElement('div');
    // textSection.innerHTML = '<h4>Text</h4>';
    

    // Text Input
    const textLabel = document.createElement('label');
    textLabel.innerText = "Text:";
    main.appendChild(textLabel);
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = 'text';
    console.log(`current text: ${document.documentElement.style.getPropertyValue(`--${evidenceBase}-object-text`)}`);
    // textInput.value = document.documentElement.style.getPropertyValue(`--${evidenceBase}-object-text`);
    textInput.value = document.documentElement.style.getPropertyValue(`--${evidenceBase}-object-text`).slice(1, -1);
    textInput.addEventListener('input',updateEvidenceCustomisation);
    main.appendChild(textInput);

    // Text Color Picker
    // const textColorLabel = document.createElement('label');
    // textColorLabel.innerText = "Text Color:";
    // textSection.appendChild(textColorLabel);
    // const textColorInput = document.createElement('input');
    // textColorInput.type = 'color';
    // console.log(`current text color: ${document.documentElement.style.getPropertyValue(`--${evidenceBase}-text-color`)}`);
    // textColorInput.value = document.documentElement.style.getPropertyValue(`--${evidenceBase}-object-text-color`);
    // textColorInput.addEventListener('input',updateEvidenceCustomisation);
    // textSection.appendChild(textColorInput);

    // Font Size Slider
    const fontSizeLabel = document.createElement('label');
    fontSizeLabel.innerText = "Font Size:";
    main.appendChild(fontSizeLabel);
    const fontSizeInput = document.createElement('input');
    fontSizeInput.type = 'range';
    fontSizeInput.min = '10';
    fontSizeInput.max = '75';
    console.log(`current font size: ${document.documentElement.style.getPropertyValue(`--${evidenceBase}-object-font-size`)}`);
    fontSizeInput.value = parseInt(document.documentElement.style.getPropertyValue(`--${evidenceBase}-object-font-size`), 10);
    fontSizeInput.addEventListener('input',updateEvidenceCustomisation);
    main.appendChild(fontSizeInput);

    // Font Weight Select
    const fontWeightLabel = document.createElement('label');
    fontWeightLabel.innerText = "Font Weight:";
    main.appendChild(fontWeightLabel);
    const fontWeightSelect = document.createElement('select');
    fontWeightSelect.id = 'fontWeight';
    ['lighter', 'normal', 'bold'].forEach(weight => {
        const option = document.createElement('option');
        option.value = weight;
        option.innerText = weight.charAt(0).toUpperCase() + weight.slice(1);
        if (weight === document.documentElement.style.getPropertyValue(`--${evidenceBase}-object-font-weight`)) {
            option.selected = true;
            console.log(`option ${weight} selected`);
        }
        else{
            console.log(`option ${weight}`);
        }
        fontWeightSelect.appendChild(option);
    });
    fontWeightSelect.addEventListener('change',updateEvidenceCustomisation);
    main.appendChild(fontWeightSelect);

    // main.appendChild(textSection);

    function updateEvidenceCustomisation(){
        const hex = borderColorInput.value;
        // const alpha = borderOpacityInput.value;        
        document.documentElement.style.setProperty(`--${evidenceBase}-color`, hexToRgba(hex, 1));
        document.documentElement.style.setProperty(`--${evidenceBase}-object-color`, hexToRgba(hex, borderOpacityInput.value));
        document.documentElement.style.setProperty(`--${evidenceBase}-object-border-size`, borderSizeInput.value + 'px');
        document.documentElement.style.setProperty(`--${evidenceBase}-object-text`, `"${textInput.value}"`);
        // document.documentElement.style.setProperty(`--${evidenceBase}-object-text-color`, `${textColorInput.value}`);
        document.documentElement.style.setProperty(`--${evidenceBase}-object-font-size`, fontSizeInput.value + 'px');
        document.documentElement.style.setProperty(`--${evidenceBase}-object-font-weight`, fontWeightSelect.value);
        stateHasChanged();
    }
    
    popup.appendChild(main);
    document.body.appendChild(popup);
    makeDraggable(popup);
}

function customiseEvent(eventBase) {
    console.log(`customise ${eventBase}`)

    const popup = document.createElement('div');
    popup.className = 'customise-menu';
    popup.style.position = 'fixed';
    
    const targetElement = document.querySelector('#events-controls-container');
    if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        popup.style.left = `${rect.right + 10}px`;
        popup.style.top = `${targetElement.offsetHeight/2}px`;
        // popup.style.transform = 'translateY(-50%)';
    } else {
        console.log("error opening event customisation: customiseEvent() -> #events-controls-container not found")
        return;
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' || event.key === 'Enter') {
            popup.remove();
        }
    });
    
    document.addEventListener('mousedown', function(event) {
        if (!popup.contains(event.target)) {
            popup.remove();
        }
    });

    const topBar = document.createElement('div');
    topBar.className = 'top-bar draggable';
    topBar.innerText = `Customise: ${document.getElementById(`${eventBase}-label`)?.innerText || evidenceBase}`;
    const closeButton = document.createElement('button');
    closeButton.innerText = '✖';
    closeButton.className = 'close-btn';

    closeButton.onclick = function () {
        popup.remove();
    };
    topBar.appendChild(closeButton);
    popup.appendChild(topBar);

    const main = document.createElement('div');
    main.className = 'customise-main';
    // Event color input
    const rgbaColor = document.documentElement.style.getPropertyValue(`--${eventBase}-object-color`);
    const { hex, opacity } = rgbaToHexAndOpacity(rgbaColor);
    console.log(`ALPHA: ${opacity}`);
    const eventColorLabel = document.createElement('label');
    eventColorLabel.innerText = "Color:";
    main.appendChild(eventColorLabel);

    const eventColorInput = document.createElement('input');
    eventColorInput.type = 'color';
    eventColorInput.id = 'borderColor';
    console.log(`current border color: ${rgbaColor} = ${hex}`);
    eventColorInput.value = hex;
    eventColorInput.addEventListener('input',updateEventCustomisation);
    main.appendChild(eventColorInput);

    // Opacity input
    const opacityLabel = document.createElement('label');
    opacityLabel.innerText = "Opacity:";
    main.appendChild(opacityLabel);
    
    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.min = '0';
    opacitySlider.max = '1';
    opacitySlider.step = '0.01';
    opacitySlider.value = opacity;
    opacitySlider.addEventListener('input',updateEventCustomisation);
    main.appendChild(opacitySlider);

    // Event Border Radius Slider
    const borderRadiusLabel = document.createElement('label');
    borderRadiusLabel.innerText = "Border Radius:";
    main.appendChild(borderRadiusLabel);
    
    const borderRadiusInput = document.createElement('input');
    borderRadiusInput.type = 'range';
    borderRadiusInput.min = '0';
    borderRadiusInput.max = '50';
    borderRadiusInput.value = parseInt(document.documentElement.style.getPropertyValue(`--${eventBase}-object-radius`), 10);
    console.log(`current border: ${document.documentElement.style.getPropertyValue(`--${eventBase}-object-radius`)}`);
    borderRadiusInput.addEventListener('input',updateEventCustomisation);
    main.appendChild(borderRadiusInput);

    // Event Image Input
    const imageLabel = document.createElement('label');
    imageLabel.innerText = "Upload Image:";
    main.appendChild(imageLabel);
    
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    imageInput.addEventListener('input',updateEventCustomisation);
    main.appendChild(imageInput);

    // image size
    const imageSizeLabel = document.createElement('label');
    imageSizeLabel.innerText = "Image Size:";
    main.appendChild(imageSizeLabel);
    
    const imageSizeInput = document.createElement('input');
    imageSizeInput.type = 'range';
    imageSizeInput.min = '0';
    imageSizeInput.max = '100';
    imageSizeInput.step = '1';
    imageSizeInput.value = parseInt(document.documentElement.style.getPropertyValue(`--${eventBase}-object-image-size`), 10);
    imageSizeInput.addEventListener('input',updateEventCustomisation);
    main.appendChild(imageSizeInput);

    function updateEventCustomisation(){
        const hex = eventColorInput.value;
        document.documentElement.style.setProperty(`--${eventBase}-object-color`, hexToRgba(hex, opacitySlider.value));
        document.documentElement.style.setProperty(`--${eventBase}-color`, hexToRgba(hex, 1));
        document.documentElement.style.setProperty(`--${eventBase}-object-radius`, `${borderRadiusInput.value}%`);
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const imageUrl = URL.createObjectURL(file);
            document.documentElement.style.setProperty(`--${eventBase}-object-image`, `url('${imageUrl}')`);
        }
        document.documentElement.style.setProperty(`--${eventBase}-object-image-size`, `${imageSizeInput.value}%`);
        stateHasChanged();
    }

    popup.appendChild(main);
    document.body.appendChild(popup);
    makeDraggable(popup);
}

function rgbaToHexAndOpacity(rgba) {
    // Extract values using regex
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/);

    if (!match) return { hex: "#000000", opacity: 1 }; // Default if invalid input

    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    const opacity = match[4] !== undefined ? parseFloat(match[4]) : 1;

    return {
        hex: `#${r}${g}${b}`,
        opacity: opacity
    };
}

function hexToRgba(hex, opacity) {
    // Remove '#' if it exists
    hex = hex.replace(/^#/, '');

    // Convert shorthand hex (e.g. #FFF) to full form (#FFFFFF)
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Extract RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function rgbToRgba(rgb, alpha) {
    // Extract RGB values using regex
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    if (!match) return "rgba(0, 0, 0, 1)"; // Default to black with full opacity if invalid

    const r = match[1];
    const g = match[2];
    const b = match[3];

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}