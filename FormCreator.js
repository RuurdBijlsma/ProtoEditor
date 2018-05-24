class FormCreator {
    fromObject(object) {
        let form = document.createElement('form');
        this.recurseObject(form, object);
        return form;
    }

    recurseObject(element, object) {
        if (object.hasOwnProperty('type')) {
            let type = document.createElement('span');
            type.setAttribute('contenteditable', 'true');
            type.setAttribute('class', 'type');
            type.innerText = object.type;

            let value = document.createElement('span');
            value.setAttribute('contenteditable', 'true');
            value.setAttribute('class', 'value');
            if(typeof value==="number")
            	value.setAttribute('number');
            value.innerText = object.value;

            element.appendChild(type);
            element.appendChild(value);
        } else {
            for (let prop in object) {
                let ul = document.createElement('ul');
                let span = document.createElement('span');
                span.setAttribute('contenteditable', 'true');
                span.setAttribute('class', 'message');
                span.innerText = prop;
                ul.appendChild(span);
                element.appendChild(ul);

                this.recurseObject(ul, object[prop]);
            }
        }
    }
}