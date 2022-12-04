import React from 'react';
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from "@/util/history";

import './index.css';
import store, {persistor} from '@/service/redux/store'
import {PersistGate} from 'redux-persist/lib/integration/react';

import App from './App';


ReactDOM.render(
    <Provider store={store}>
        {/*<ErrorBoundary>//todo react的错误处理机制*/}
        {/*redux持久化配置*/}
        <PersistGate loading={null} persistor={persistor}>
            <Router history={history}>
                <App/>
            </Router>
        </PersistGate>
        {/*</ErrorBoundary>*/}
    </Provider>,
    document.getElementById('root')
)
