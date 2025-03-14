let evidenceList = [];


document.getElementById('add-evidence-btn').addEventListener('click', function() {
    addNewDefaultEvidence();
    stateHasChanged();
});

function addNewDefaultEvidence(id=null) {
    let numbers = evidenceList.map(e => parseInt(e.split("-")[1])).sort((a, b) => a - b);
    
    // find the smallest missing number
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

    const evidenceBase = `evidence-${n}`;
    evidenceList.push(evidenceBase);

    const parent = document.getElementById("evidence-container");
    const addEvidenceBtn = document.getElementById("add-evidence-btn");
    color = getRandomColor();

    document.documentElement.style.setProperty(`--${evidenceBase}-color`, color);
    document.documentElement.style.setProperty(`--${evidenceBase}-object-color`, color);
    document.documentElement.style.setProperty(`--${evidenceBase}-object-border-size`, '6px');
    document.documentElement.style.setProperty(`--${evidenceBase}-object-text`, '');
    document.documentElement.style.setProperty(`--${evidenceBase}-object-font-size`, '40px');
    document.documentElement.style.setProperty(`--${evidenceBase}-object-font-weight`, 'normal');
    
    const evidenceLabel =`Evidence ${n}`;

    const evidenceContainer = document.createElement("div");
    evidenceContainer.classList.add("sub-control-container");
    evidenceContainer.id = `${evidenceBase}-container`;

    const labelContainer = document.createElement("div");

    const labelElement = document.createElement("h2");
    labelElement.id = `${evidenceBase}-label`;
    labelElement.textContent = evidenceLabel;

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.alignItems = "center";
    buttonContainer.style.gap = "6px";

    const renameBtn = document.createElement("button");
    renameBtn.classList.add("control-btn");
    renameBtn.id = `rename-${evidenceBase}-btn`;
    renameBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Rename`;
    renameBtn.onclick = function() {renameLabel(`${evidenceBase}`);};

    const selectBtn = document.createElement("button");
    selectBtn.classList.add("control-btn");
    selectBtn.id = `make-selection-${evidenceBase}-btn`;
    selectBtn.innerHTML = `<i class="fa-solid fa-hand-pointer"></i> Select`;
    selectBtn.style.backgroundColor = `var(--${evidenceBase}-color)`;
    selectBtn.style.color = `var(--dark-grey-1)`;
    selectBtn.onclick = function() {enterSelectionMode(evidenceBase);};

    const customiseBtn = document.createElement("button");
    customiseBtn.classList.add("control-btn");
    customiseBtn.id = `customise-${evidenceBase}-btn`;
    customiseBtn.innerHTML = `<i class="fa-solid fa-palette"></i> Customise`;
    customiseBtn.style.color = `var(--${evidenceBase}-color)`;
    customiseBtn.onclick = function() {customiseEvidence(evidenceBase);};

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("control-btn");
    deleteBtn.id = `delete-${evidenceBase}-btn`;
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteBtn.style.backgroundColor = 'transparent';
    deleteBtn.style.color = `grey`;
    deleteBtn.style.fontSize = '16px';
    deleteBtn.style.marginLeft = "auto";
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

    labelContainer.appendChild(labelElement);
    evidenceContainer.appendChild(labelContainer);

    buttonContainer.appendChild(renameBtn);
    buttonContainer.appendChild(customiseBtn);
    buttonContainer.appendChild(selectBtn);
    buttonContainer.appendChild(deleteBtn);

    evidenceContainer.appendChild(buttonContainer);

    parent.insertBefore(evidenceContainer, addEvidenceBtn);
    updateProbabilityLabels();

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
    evidenceList = evidenceList.filter(str => str !== evidenceBase);

    document.getElementById(`${evidenceBase}-container`).remove();

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
