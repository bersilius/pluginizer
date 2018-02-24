# pfun

A tool to create plugins or middlewares for different Javascript tools, frameworks, servers.

This tools helps to keep the implementation free of Hemera or Seneca keywords, which may be problematic in case of migration or running the code in multiple containers with different toolkits.

## Installation

Run the install command:

    npm install --save pfun

## Usage

Consider we have a function like this (which can be wrapped in a Seneca or Hemera plugin):
```javascript
const businessLogic = (msg, cb) => {
    // actual business implementation
}

module.exports = myFunction
```

Create Hemera plugin:
```javascript
const pluginizer = require('pfun')

const pluginizedLogic = pluginizer.createHemeraPlugin(businessLogic, options)

// next step is loading the plugin with the Hemera instance as usual.
// hemera.use(hp(pluginizedLogic.plugin, pluginizedLogic.options)
```

Create Seneca plugin:
```javascript
const pluginizer = require('pfun')

const pluginizedLogic = pluginizer.createHemeraPlugin(businessLogic, options)

// next step is loading the plugin with the Seneca instance as usual.
// seneca.use(pluginizedLogic)
```

## Options

There are two typical way to create a module that contains function(s) which can be used in Hemera and Seneca.

Note: If you use curry or a factory it is also possible using the 'curry' option described later.

### Type single function
Export a simple function like:
```javascript
module.exports = (msg, cb) => { ... }
```

- Set the 'pattern' to route messages to this handler.
- Set the plugin name which will be registered internally in the toolkit.

Options will look like this:
```javascript
const options = {
    pattern: {
        topic: 'someTopic',
        cmd: 'someCmd'
    },
    pluginName: 'somePluginName'
}
```

Your microservice will listen for the pattern and execute the wrapped business logic implementation as handler.

### Type object of functions
Note: in this case the exported object property keys will be mapped as 'cmd' in the pattern automatically. In the example below add, subtract, ... will be mapped as cmd(s).

Export an object of functions like this:
```javascript
module.exports = {
    add: (msg, cb) => { ... },
    subtract: (msg, cb) => { ... },
    multiply: (msg, cb) => { ... },
    divide: (msg, cb) => { ... }
}
```

- Set the 'pattern' to route messages to this handler.
- Set the plugin name which will be registered internally in the toolkit.

Options will look like this:
```javascript
const options = {
    pattern: {
        topic: 'calculator'
    },
    pluginName: 'calculatorPlugin'
}
```

Your microservice will listen on topic 'calculator' and execute the wrapped business logic implementations as handlers respectively to the cmd<->key pairs.

### Curry option

It is also common to use curry technique to call a function that will return the actual function that will be used as the handler.

```javascript
module.exports = someCurryObject => (msg, cb) => {
    // actual business implementation
}
```

In this case the 'someCurryObject' is available in the scope of the handler. It can be useful to pass some context that can be called inside the script. Like if we want call another service, we can pass the container's communication interface as a curry object.

```javascript
module.exports = ({ container }) => (msg, cb) => {
    // actual business implementation
    container.act({ topic: 'someTopic', cmd: 'someCmd', ...payload }, (err, res) => cb)
}
```

Example:

```javascript
const options = {
    pattern: {
        topic: 'topicName',
        cmd: 'someCmd'
    },
    curry: {
        container: hemeraInstance // or senecaInstance
    }
}
```

So in your logic you can reference to your container instance and use the `container.act(...)` call to communicate to other services.

## Notes

Although this library can be used alone, it is one of the artifacts of a proof-of-concept project, which is focusing to seperate the business logic implementation from the infrastructure logic to keep it as independent/adaptive/pure as possible.

If you are interested please also check the repositories listed below which can be used together to achieve the greater goal:

- [wfun](https://github.com/bersilius/wfun) - Wrap your plain JS functions into different functions, based on common patterns for plugins and middlewares.
- [npac](https://github.com/tombenke/npac) - A lightweight Ports and Adapters Container for applications running on Node.js platform.
