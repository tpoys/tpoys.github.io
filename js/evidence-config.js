let evidenceList = [];

// const colorPresets = ['rgb(110, 203, 105)','rgb(107, 143, 219)','rgb(255, 200, 100)'];

document.getElementById('add-evidence-btn').addEventListener('click', function() {
    addNewDefaultEvidence();
    stateHasChanged();
    // alert('Button clicked!');
});

function addNewDefaultEvidence(id=null) {
    // const colorPresets = ['#ffffff','#f54e4e'];
    // const colorPresets = ['rgba(250, 250, 250, 1)','rgba(243, 75, 75, 1)'];
    // const symbolPresets = ['-','+'];
    // const symbolPresets = [];

    let numbers = evidenceList.map(e => parseInt(e.split("-")[1])).sort((a, b) => a - b);
    
    // Find the smallest missing number
    let n = 1;
    if(id == null){
        for (let num of numbers) {
            if (num !== n) break;
            n++;
        }
    }
    else{
        n = id
    }

    // Add the new event
    const evidenceBase = `evidence-${n}`;
    evidenceList.push(evidenceBase);

    // Get events parent container
    const parent = document.getElementById("evidence-container");
    
    // Find the "Add Event" button (this is our reference point)
    const addEvidenceBtn = document.getElementById("add-evidence-btn");

    // Set event-specific color variable (use passed color or default)
    // if(evidenceList.length<=colorPresets.length){
    //     color=colorPresets[evidenceList.length-1];
    // }
    // else{
    //     color = getRandomColor();
    // }
    color = getRandomColor();

    document.documentElement.style.setProperty(`--${evidenceBase}-color`, color);
    document.documentElement.style.setProperty(`--${evidenceBase}-object-color`, color);
    document.documentElement.style.setProperty(`--${evidenceBase}-object-border-size`, '6px');
    document.documentElement.style.setProperty(`--${evidenceBase}-object-text`, '');
    // document.documentElement.style.setProperty(`--${evidenceBase}-object-text-color`, '#ffffff');
    document.documentElement.style.setProperty(`--${evidenceBase}-object-font-size`, '40px');
    document.documentElement.style.setProperty(`--${evidenceBase}-object-font-weight`, 'normal');
    

    // if(evidenceList.length<=symbolPresets.length){
    //     symbol=symbolPresets[evidenceList.length-1];
    // }
    // else{
    //     symbol = '';
    // }
    // document.documentElement.style.setProperty(`--${evidenceBase}-symbol`, `"${symbol}"`);

    
    // Set event-specific label (use passed label or default)
    const evidenceLabel =`Evidence ${n}`; // Use provided label or default to "Event n"

    // Create event container div
    const evidenceContainer = document.createElement("div");
    evidenceContainer.classList.add("sub-control-container");
    evidenceContainer.id = `${evidenceBase}-container`;

    // Create inner div for the label
    const labelContainer = document.createElement("div");

    // Create label (h2)
    const labelElement = document.createElement("h2");
    labelElement.id = `${evidenceBase}-label`;
    labelElement.textContent = evidenceLabel;

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";        // Enable Flexbox for button alignment
    buttonContainer.style.alignItems = "center";   // Align buttons vertically if needed
    buttonContainer.style.gap = "6px";            // Optional: Adds space between the buttons

    // Create Rename button
    const renameBtn = document.createElement("button");
    renameBtn.classList.add("control-btn");
    renameBtn.id = `rename-${evidenceBase}-btn`;
    renameBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Rename`;
    renameBtn.onclick = function() {renameLabel(`${evidenceBase}`);};

    // Create Select button
    const selectBtn = document.createElement("button");
    selectBtn.classList.add("control-btn");
    selectBtn.id = `make-selection-${evidenceBase}-btn`;
    selectBtn.innerHTML = `<i class="fa-solid fa-hand-pointer"></i> Select`;
    selectBtn.style.backgroundColor = `var(--${evidenceBase}-color)`;
    selectBtn.style.color = `var(--dark-grey-1)`;
    selectBtn.onclick = function() {enterSelectionMode(evidenceBase);};

    // Create Customise button
    const customiseBtn = document.createElement("button");
    customiseBtn.classList.add("control-btn");
    customiseBtn.id = `customise-${evidenceBase}-btn`;
    customiseBtn.innerHTML = `<i class="fa-solid fa-palette"></i> Customise`;
    customiseBtn.style.color = `var(--${evidenceBase}-color)`;
    customiseBtn.onclick = function() {customiseEvidence(evidenceBase);};


    // Create Delete button (positioned to the right)
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("control-btn");
    deleteBtn.id = `delete-${evidenceBase}-btn`;
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteBtn.style.backgroundColor = 'transparent';
    deleteBtn.style.color = `grey`;
    deleteBtn.style.fontSize = '16px';
    deleteBtn.style.marginLeft = "auto";  // This pushes the delete button to the right
    deleteBtn.onclick = function() {
        deleteEvidence(evidenceBase);
        stateHasChanged();
    };

    const style = document.createElement("style");
    style.innerHTML = `
            .${evidenceBase}-object {
                border: solid;
                border-color: var(--${evidenceBase}-object-color);
                border-width: var(--${evidenceBase}-object-border-size);
                box-sizing: border-box;
                position: relative;
            }
            .${evidenceBase}-object::before{
                content: var(--${evidenceBase}-object-text);
                position: absolute;
                color: var(--${evidenceBase}-color);
                font-size: var(--${evidenceBase}-object-font-size); 
                font-weight: var(--${evidenceBase}-object-font-weight);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none; 
                transition: all ease .15s;
            }
        `;
    document.head.appendChild(style);

    // Append elements together
    labelContainer.appendChild(labelElement);
    evidenceContainer.appendChild(labelContainer);

    buttonContainer.appendChild(renameBtn);
    buttonContainer.appendChild(customiseBtn);
    buttonContainer.appendChild(selectBtn);
    // if (n > 1) {
    //     buttonContainer.appendChild(deleteBtn);
    // }
    buttonContainer.appendChild(deleteBtn);

    evidenceContainer.appendChild(buttonContainer);

    parent.insertBefore(evidenceContainer, addEvidenceBtn);
    updateProbabilityLabels();

    // assign evidence to any objects without evidence
    document.querySelectorAll('.object').forEach(element => {
        const hasValidClass = Array.from(element.classList).some(cls => 
            /^evidence-\d+-object$/.test(cls)
        );
        
        if (!hasValidClass) {
            element.classList.add(`${evidenceBase}-object`);
        }
    });

}

function deleteEvidence(evidenceBase){
    console.log(`Delete evidence: ${evidenceBase}`);
    evidenceList = evidenceList.filter(str => str !== evidenceBase);
    console.log(`Remaining evidence: ${evidenceList}`);

    // remove the event control widget
    document.getElementById(`${evidenceBase}-container`).remove();

    // set all objects of that event to a random event from remaining events
    document.querySelectorAll('.object').forEach(el => {
        const targetClass = `${evidenceBase}-object`;
        if (el.classList.contains(targetClass)) {
            el.classList.remove(targetClass);
            const randEvent = evidenceList[Math.floor(Math.random() * evidenceList.length)];
            el.classList.add(`${randEvent}-object`);
        }
    });
    updateProbabilityLabels();

}

function deleteAllEvidence(){
    while(evidenceList.length > 0){
        deleteEvidence(evidenceList[0]);
    }

}
