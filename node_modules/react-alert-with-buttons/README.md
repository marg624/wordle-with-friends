# react-alert-with-buttons
This is a react library that creates alerts. 

You can customize your alerts with additional buttons.

### Example

![alert-modal-high](https://user-images.githubusercontent.com/57612141/185776075-ec22547b-a53e-4152-8e46-38dc97d893bc.gif)


<hr/>

## Prerequisite

You must have `react` and `react-dom` already installed in your project.
If you have not installed them, please install them by

`$ npm install --save react react-dom`

or

`$ yarn add react react-dom` 

<hr/>

## Installation

`$ npm install --save react-alert-with-buttons`

or

`$ yarn add react-alert-with-buttons`

<hr/>

## Quickstart

#### 1. (First Step) Wrap your App with AlertProvider

You must wrap your whole React app with AlertProvider.

Go to index.js and wrap it with AlertProvider

```js
// index.js
import React from 'react'
import { render } from 'react-dom'
import { AlertProvider } from 'react-alert-with-buttons'
import App from './App'


const Root = () => (
  <AlertProvider>
    <App />
  </AlertProvider>
)

render(<Root />, document.getElementById('root'))
```

#### 2. (Second Step) Import useAlert hook and use `open({message: ""})` method

After you have wrapped the AlertProvider in index.js, you can import useAlert hook anywhere in your page or component and show alerts.

You can show alerts using the open method(A message is required for opening an alert)

```js
// App.js
import React from 'react'
import { useAlert } from 'react-alert-with-buttons'

const App = () => {
  const alert = useAlert()

  return (
    <button
          onClick={() => {
            alert.open({
              message: "This is an alert",
            });
          }}
    >
      Show Alert
    </button>
  )
}
```

<hr/>

## Customization

#### Customize the alert container

Currently you can customize the `containerStyle`, the `defaultConfirmText`, and the `buttonStyle`

You can change the default styles and text by adding properties to the AlertProvider

```js
// index.js
import React from 'react'
import { render } from 'react-dom'
import { AlertProvider } from 'react-alert-with-buttons'
import App from './App'


const Root = () => (
  <AlertProvider 
          containerStyle={{ backgroundColor: "green" }}
          defaultConfirmText="네"
          buttonStyle={{ backgroundColor: "yellow" }}>
    <App />
  </AlertProvider>
)

render(<Root />, document.getElementById('root'))
```

The above code will result in 

<img width="800" alt="Screen Shot 2022-08-21 at 1 44 54 PM" src="https://user-images.githubusercontent.com/57612141/185775897-5b63ea6a-c207-4d11-8b50-02618459682a.png">


For your information there are only three properties that you can change in the AlertProvider for now. 

##### AlertProvider Props
```ts
interface Props {
  containerStyle?: CSSProperties;
  defaultConfirmText?: string;
  buttonStyle?: CSSProperties;
}
```

#### Customize buttons

By default, there is one confirm button for the alert.

You may add other buttons by adding buttons property in the open method.



```js
// App.js
import React from 'react'
import { useAlert } from 'react-alert-with-buttons'

const App = () => {
  const alert = useAlert()

  return (
    <button
       onClick={() => {
            alert.open({
              message: "This is an alert",
              buttons: [
                {
                  label: "button1",
                  onClick: () => {
                    //implement your function here for the button1 click
                    alert.close() //Remeber that customly created button does not close the alert by default! 
                    //You must add the close function manually!
                  },
                },
                {
                  label: "button2",
                  onClick: () => {
                    //implement your function here for the button2 click
                    alert.close() //Remeber that customly created button does not close the alert by default! 
                    //You must add the close function manually!
                  },
                },
              ],
            });
          }}
    >
      Show Alert
    </button>
  )
}
```

<img width="800" alt="Screen Shot 2022-08-21 at 2 24 02 PM" src="https://user-images.githubusercontent.com/57612141/185776838-5f91a247-d624-4c66-a6db-23b717019c5e.png">


The buttons container is responsive. If the screen width is below 576px the buttons are algined vertically


<img width="200" alt="Screen Shot 2022-08-21 at 2 25 27 PM" src="https://user-images.githubusercontent.com/57612141/185776880-ec48f9be-333f-468b-b996-48bd8a302f4f.png">

The parameters of the open method are the following. 

```ts
interface AlertProps {
  message: string; 
  buttons?: AlertButtonProps[]; //optional, Array of AlertButtonProps
}
```

The following are the properties an element in the buttons array. 

```ts
interface AlertButtonProps {
  label: string;
  onClick: Function;
  style?: CSSProperties;
}
```


You can style your buttons if you want, adding style props in the button array allows you to style each button

```js
// App.js
import React from 'react'
import { useAlert } from 'react-alert-with-buttons'

const App = () => {
  const alert = useAlert()

  return (
    <button
          onClick={() => {
            alert.open({
              message: "This is an alert",
              buttons: [
                {
                  label: "button1",
                  onClick: () => {
                    //implement your function here for the button1 click
                    alert.close() //Remeber that customly created button does not close the alert by default! 
                    //You must add the close function manually!
                  },
                  style: { opacity: 0.5 },
                },
                {
                  label: "button2",
                  onClick: () => {
                    //implement your function here for the button2 click
                    alert.close() //Remeber that customly created button does not close the alert by default! 
                    //You must add the close function manually!
                  },
                  style: {
                    backgroundColor: "green",
                    borderRadius: 15,
                    color: "white",
                  },
                },
              ],
            });
          }}
    >
      Show Alert
    </button>
  )
}
```

<img width="800" alt="Screen Shot 2022-08-21 at 2 30 15 PM" src="https://user-images.githubusercontent.com/57612141/185776990-491fa67c-27d9-4c54-bb06-136340d06fb6.png">



<hr/>

## Caution!!

The buttons that are customized do not close the alert when clicked! If you want to close the alert when you click the buttons, you must add the close function manually. The context returned by the useAlert hook gives you two methods: `open`, `close`. Calling `close` will close the opened alert.

```js
//Inside the React Component
const alert = useAlert()
...
alert.close() //There are no parameters required in the close method
```


<hr/>

Happy Coding!



