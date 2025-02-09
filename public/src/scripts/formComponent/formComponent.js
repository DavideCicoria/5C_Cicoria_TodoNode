export const generateFormComponent = (parentElement) => {
    const template = `<div class="input-group mb-3">
        <input type="text" id="%TEXT_ID" class="form-control" placeholder="Inserire una nuova attività" aria-label="Recipient's username" aria-describedby="basic-addon2">
        <div class="input-group-append">
            <button type="button" id="%BUTTON_ID" class="btn btn-primary">Invia</button>
        </div>
    </div>` ;
    let submitCallback ;

    let textID ;
    let buttonID ;

    return {
        build: (text, button) => {
            textID = text ;
            buttonID = button ;
        },
        render: () => {
            let html = template.replace("%TEXT_ID", textID) ;
            html = html.replace("%BUTTON_ID", buttonID) ;

            parentElement.innerHTML = html ;
            //console.log(parentElement.innerHTML) ;
            const submitButton = document.getElementById(buttonID) ;
            submitButton.onclick = () => {
                let textField = document.getElementById(textID) ;

                if (textField.value !== "") {
                    let newTodo = {
                        name: textField.value,
                        completed: false
                    }
                    submitCallback(newTodo) ;
                    textField.value = "" ;
                } else {
                    //aggiungere messaggio di errore
                }
            }
        },
        onsubmit: (inputCallback) => {
            submitCallback = inputCallback ;
        }
    }
}