import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { GithubProvider } from './context/context'
import { Auth0Provider } from '@auth0/auth0-react'
import { AppProvider } from './context/context'
//domain: dev-g6wv4-mb.us.auth0.com
//client ID: JpgB0Iqp5IKeJho9jpZxk2DVap70hZVo

ReactDOM.render(
  <React.StrictMode>
    <GithubProvider>
      <Auth0Provider
        domain="dev-g6wv4-mb.us.auth0.com"
        clientId="JpgB0Iqp5IKeJho9jpZxk2DVap70hZVo"
        redirectUri={window.location.origin}
        cacheLocation="localstorage"
      >
        <App />
      </Auth0Provider>
    </GithubProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
