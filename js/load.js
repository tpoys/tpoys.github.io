window.onload = function () {
    loadPresets();

    const savedState = localStorage.getItem('current-state');
    let stateToLoad = savedState;

    // for first time opening site:
    // if 'current-state' doesn't exist, use 'saved_state_Medical_Diagnosis'
    if (!savedState) {
        stateToLoad = localStorage.getItem('saved_state_Medical Diagnosis');
    }

    if (stateToLoad) {
        try {
            const parsedState = JSON.parse(stateToLoad);
            loadState(parsedState);
        } catch (error) {
            console.error('Error parsing state:', error);
        }
    }

    setTimeout(() => {
        infoPopup('<b>Left-click + Drag</b> to Pan<br><b>Scroll</b> to Zoom', 5);
    }, 2000);
};


function loadPresets() {
    const medicalDiagnosisPreset = 'saved_state_Medical Diagnosis';

    if (!localStorage.getItem(medicalDiagnosisPreset)) {
        fetch('data/medical_diagnosis_visualisation.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch the JSON file');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem(medicalDiagnosisPreset, JSON.stringify(data));
                console.log('Preset data loaded into localStorage.');
            })
            .catch(error => console.error('Error loading presets:', error));
    } else {
        console.log('Presets already exist in localStorage.');
    }
}
