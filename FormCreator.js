class FormCreator {
    toObject(element) {
        let result = {};

        for (let child of element.children) {
            if (child.tagName === 'SPAN') {
                if (child.getAttribute('class') === 'type')
                    result.type = child.innerText;
                if (child.getAttribute('class') === 'value')
                    result.value = child.innerText;
            } else {
                let prop = child.querySelector('.message').innerText;
                result[prop] = this.toObject(child);
            }
        }

        return result;
    }

    fromObject(object) {
        let form = document.createElement('form');
        this.recurseObject(form, object);
        return form;
    }

    createEditableText(text, cssClass, editable = true) {
        let span = document.createElement('span');
        span.setAttribute('contenteditable', editable);
        span.setAttribute('spellcheck', 'false');
        span.setAttribute('class', cssClass);
        span.setAttribute('oninput', 'encodeInput()');
        span.innerText = text;
        return span;
    }

    recurseObject(element, object) {
        if (object.hasOwnProperty('type')) {
            let type = this.createEditableText(object.type, 'type');

            let value = this.createEditableText(object.value, 'value');
            if (typeof object.value === "number")
                value.setAttribute('number', '');
            value.innerText = object.value;

            element.appendChild(type);
            element.appendChild(value);
        } else {
            for (let prop in object) {
                let ul = document.createElement('ul');
                let span = this.createEditableText(prop, 'message', false);
                ul.appendChild(span);
                element.appendChild(ul);

                this.recurseObject(ul, object[prop]);
            }
        }
    }
}