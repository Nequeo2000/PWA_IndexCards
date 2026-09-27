const display_area_element = document.body.querySelector("#display_area");
const question_area_element = display_area_element.querySelector("#question_area");
const answer_area_element = display_area_element.querySelector("#answer_area");
const toolbar_element = document.body.querySelector("#toolbar");
const timer_display_element = toolbar_element.querySelector("#timer_display");
const input_file_element = toolbar_element.querySelector("#input_file");
const settings_dialog_element = document.body.querySelector("#settings_dialog");
const case_sensitivity_element = settings_dialog_element.querySelector("#case_sensitivity");
const random_mode_element = settings_dialog_element.querySelector("#random_mode");

const serve_question_generator = serve_question();

// Variables for settings
let random_index = false;
let case_sensitivity = false;

let question_json_string = null;
let question_json_object = null;
let questions_length = null;
let answered_correctly = 0;
let index_array = null;
const inital_json_string = localStorage.getItem("json_string");

init_event_listeners();
if(inital_json_string) {
    load_from_json_string(inital_json_string);
}

function* serve_question() {
    let index = 0;
    while(true) {
        // Get question data at index
        const question = question_json_object.questions[index_array[index]]
        const question_string = question.q;
        const answer = question.a;
        let time = 1000 * question.time;
        
        // Get references to the relevant textarea's
        const question_textarea = question_area_element.querySelector("textarea");
        const answer_textarea = answer_area_element.querySelector("textarea");
        const ansers_correct_counter = answer_area_element.querySelector(".counter_p");
        
        // Calculate the index of the next question
        if(index == 0) {
            answered_correctly = 0;
            console.log("reset");
            ansers_correct_counter.innerText = "";
        }
        index = (index + 1) % questions_length;
        
        // Display information
        question_textarea.value = question_string;
        //answer_textarea.value = answer;
        
        // Update and display the timer
        const timer_interval_id = setInterval(()=>{
            time -= 100;
            timer_display_element.innerText = Math.round(time/1000);
        }, 100);

        // Check the answer periodically
        const check_answer_interval_id = setInterval(()=>{
            if( (!case_sensitivity && answer_textarea.value.trim() == answer)
            || (!case_sensitivity && answer_textarea.value.toLocaleLowerCase().trim() == answer.toLocaleLowerCase() ) ) {
                clearTimeout(timeout_id);
                clearInterval(timer_interval_id);
                clearInterval(check_answer_interval_id);
                answer_textarea.value = "";
                
                answered_correctly++;
                console.log(answered_correctly);
                ansers_correct_counter.innerText = `${answered_correctly} / ${questions_length}`;
                if(answered_correctly == questions_length) {
                    window.alert("All ansers were correct!");
                }
                
                serve_question_generator.next();
            }
        }, 100);

        // Timout for serving the next question
        const timeout_id = setTimeout(()=>{
            clearInterval(timer_interval_id);
            clearInterval(check_answer_interval_id);
            answer_textarea.value = "The correct answer was : " + answer;
            setTimeout(()=>{
                answer_textarea.value = "";
                serve_question_generator.next();
            }, 1000 * 5);
        }, time);
        
        yield;
    }
}

async function load_from_json_string(question_json_string) {
    // Load settings from localStorage
    random_index = localStorage.getItem("random_index").toLocaleLowerCase() == "true" ? true : false;
    case_sensitivity = localStorage.getItem("case_sensitivity").toLocaleLowerCase() == "true" ? true : false;

    random_mode_element.checked = random_index;
    case_sensitivity_element.checked = case_sensitivity;
    
    // Set variables
    question_json_object = JSON.parse(question_json_string);
    questions_length = question_json_object.questions.length;
    index_array = new Array(questions_length).fill(0).map((i, index)=>{return index;});
    if(random_index)
        index_array = index_array.sort((a,b)=>{return Math.random()-0.5;});
    
    // Start the questioning
    serve_question_generator.next();
}

function init_event_listeners() {
    if(case_sensitivity_element) {
        case_sensitivity_element.onchange = (event)=>{
            case_sensitivity = case_sensitivity_element.checked;
            localStorage.setItem("case_sensitivity", `${case_sensitivity}`);
        };
    }
    if(random_mode_element) {
        random_mode_element.onchange = (event)=>{
            random_index = random_mode_element.checked;
            localStorage.setItem("random_index", `${random_index}`);
        };
    }
    if(input_file_element) {
        input_file_element.onchange = (event)=>{
            input_file_element.files[0].text().then((text)=>{
                load_from_json_string(text);
                localStorage.setItem("json_string", text);
                // Reload window
                window.location.href = window.location.href;
            });
        };
    }
}


// Register the service worker for installation
const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
        try {
            navigator.serviceWorker.register("./servieWorker.js").then(e => { console.log(e) });

        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};
registerServiceWorker();