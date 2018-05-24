class ProtoDecoder {
    constructor() {
        this.types = [
            ['B', 'BYTES'],
            ['z', 'BASE64STRING'],
            ['s', 'STRING'],
            ['m', 'MESSAGE'],
            ['b', 'BOOL'],
            ['e', 'ENUM'],
            ['o', 'SINT64'],
            ['n', 'SINT32'],
            ['h', 'SFIXED64'],
            ['g', 'SFIXED32'],
            ['y', 'FIXED64'],
            ['x', 'FIXED32'],
            ['v', 'UINT64'],
            ['u', 'UINT32'],
            ['j', 'INT64'],
            ['i', 'INT32'],
            ['f', 'FLOAT'],
            ['d', 'DOUBLE'],
        ];
    }

    getLength(input) {
        if (input.hasOwnProperty('type'))
            return 1;

        let blocks = 1;
        for (let key in input) {
            blocks += this.getLength(input[key]);
        }
        return blocks;
    }

    encode(input, key) {
        let result = '';
        let name = key ? key.substring(key.indexOf('_') + 1) : '';
        if (input.hasOwnProperty('type')) {
            let typeChar = this.types.find(t => t[1] === input.type)[0];
            let value = input.value;
            if (input.type === 'STRING')
                value = input.value.replace(/\*/g, '*2A').replace(/!/g, '*21');
            result += name + typeChar + value;
        } else {
            if (name !== '')
                result += name + 'm' + (this.getLength(input) - 1);
            for (let key in input)
                result += '!' + this.encode(input[key], key);
        }
        return result;
    }

    decode(input) {
        let lines = input.split('!').join('\n').replace(/\*21/g, '!').split('\n').slice(1).map(l => {
            let typeChar = l.replace(/[0-9]/g, '')[0];
            let type = this.types.find(t => t[0] === typeChar)[1];
            let values = [l.substring(0, l.indexOf(typeChar)), l.substring(l.indexOf(typeChar) + 1)];
            return [values[0], type, values[1]];
        });

        let indentation = 1;
        let downIndices = [];
        let result = '() => {return {\n';
        for (let i = 0; i < lines.length; i++) {
            let [lValue, type, rValue] = lines[i];

            while (downIndices.includes(i)) {
                indentation--;
                downIndices.splice(downIndices.indexOf(i), 1);
                result += '\t'.repeat(indentation) + '},\n';
            }
            if (type === 'MESSAGE') {
                result += '\t'.repeat(indentation) + `"${i}_${lValue}": {\n`;
                indentation++;
                let downIndex = i + Number(rValue) + 1;
                if (downIndex >= lines.length)
                    downIndex = lines.length - 1;
                downIndices.push(downIndex);
            } else {
                if (type === 'STRING')
                    rValue = '"' + rValue + '"';
                result += '\t'.repeat(indentation) + `"${i}_${lValue}": {"type": "` + type + '", "value": ' + rValue + '},\n';
            }
        }
        result += '}}';
        try {
            return eval(result)();
        } catch (e) {
            console.warn("Failed to evaluate", e.message);
            return result;
        }
    }
}