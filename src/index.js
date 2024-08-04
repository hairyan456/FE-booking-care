import React from 'react';
import ReactDOM from 'react-dom';
import './styles/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";

import { Provider } from 'react-redux';
import reduxStore, { persistor } from './redux';

const renderApp = () => {
    ReactDOM.render(
        <Provider store={reduxStore}>
            <IntlProviderWrapper>
                <App persistor={persistor} />
            </IntlProviderWrapper>
        </Provider>,
        document.getElementById('root')
    );
};

renderApp();

serviceWorker.unregister();
