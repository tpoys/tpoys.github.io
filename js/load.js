window.onload = async function () {
    await loadPresets(); // Ensure presets are loaded before continuing

    const savedState = localStorage.getItem('current-state');
    let stateToLoad = savedState;

    if (!savedState) {
        stateToLoad = localStorage.getItem('saved_state_Medical Diagnosis');
        console.log("No saved state. Loading Medical Diagnosis...");
    }

    if (stateToLoad) {
        try {
            const parsedState = JSON.parse(stateToLoad);
            console.log("Parsing Medical Diagnosis...");
            loadState(parsedState);
        } catch (error) {
            console.error('Error parsing state:', error);
        }
    }

    setTimeout(() => {
        infoPopup('<b>Left-click + Drag</b> to Pan<br><b>Scroll</b> to Zoom', 5);
    }, 2000);
};

async function loadPresets() {
    const dictionary = {
        "saved_state_Medical Diagnosis": "data/medical_diagnosis_visualisation.json",
        "saved_state_Advanced Medical Diagnosis": "data/adv_medical_diagnosis_visualisation.json",
        "saved_state_Spam Email Filtering": "data/email_filtering_visualisation.json",
        "saved_state_Empty": "data/empty_state.json"
    };

    for (const [key, url] of Object.entries(dictionary)) {
        if (!localStorage.getItem(key)) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch ${url}`);

                const data = await response.json();
                localStorage.setItem(key, JSON.stringify(data));
                console.log(`Preset data loaded into localStorage for ${key}.`);
            } catch (error) {
                console.error(`Error loading preset for ${key}:`, error);
            }
        } else {
            console.log(`Preset already exists in localStorage for ${key}.`);
        }
    }
}

