const path = require('path');
const fs = require('fs-nextra');
const { CustomError } = require('advancedjs');

class Command {
    constructor(client, info) {
        Object.defineProperty(this, 'client', { value: client });

        this.name = info.name.toLowerCase();

        this.execute = info.execute.bind(this) || this.default;
        Object.values(info).forEach(val => {
            if (typeof val === 'function') {
                if (val.name !== 'execute') {
                    this[val.name] = val;
                }
            }
        });
    }
    default() {
        throw new CustomError(`The command ${this.name} does not have an execute function`, 'CommandExecuteError');
    }
    _execute(message, ...args) {
        try {
            this.execute(message, ...args);
        } catch (error) {
            message.send(`${error.name}: ${error.message}`);
            return this.client.emit('commandError', this, message, error);
        }
    }
}

module.exports = Command;