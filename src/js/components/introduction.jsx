import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { findDOMNode } from 'react-dom';

import { AlternateChannels } from './alternate-channels';
import { DefaultAppIcon } from './default-app-icon';

import { setIntroHeight } from '../actions/app-state-actions';

import { createMarkup } from '../utils/html';
import { getAppChannelDetails } from '../utils/app';
import { WIDGET_STATE } from '../constants/app';

export class IntroductionComponent extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        appState: PropTypes.object.isRequired
    };

    static contextTypes = {
        ui: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        app: PropTypes.object.isRequired
    };

    constructor(...args) {
        super(...args);
        this._debounceHeightCalculation = debounce(this.calculateIntroHeight.bind(this), 150);
    }

    componentDidMount() {
        setTimeout(() => this.calculateIntroHeight());
        window.addEventListener('resize', this._debounceHeightCalculation);
    }

    componentWillUpdate() {
        this._debounceHeightCalculation();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._debounceHeightCalculation);
    }

    calculateIntroHeight() {
        const {appState: {introHeight, widgetState}, dispatch} = this.props;

        // don't recalculate height if widget is closed or closing
        if (widgetState === WIDGET_STATE.OPENED) {
            const node = findDOMNode(this);

            const nodeRect = node.getBoundingClientRect();
            const nodeHeight = Math.floor(nodeRect.height);

            if (introHeight !== nodeHeight) {
                dispatch(setIntroHeight(nodeHeight));
            }
        }
    }

    render() {
        const {app, ui: {text}} = this.context;
        const channelDetailsList = getAppChannelDetails(app.integrations);

        const channelsAvailable = channelDetailsList.length > 0;
        const introText = channelsAvailable ? `${text.introductionText} ${text.introAppText}` : text.introductionText;

        return <div className='sk-intro-section'>
                   { app.iconUrl ? <img className='app-icon'
                                        src={ app.iconUrl } />
                         : <DefaultAppIcon /> }
                   <div className='app-name'>
                       { app.name }
                   </div>
                   <div className='intro-text'
                        dangerouslySetInnerHTML={ createMarkup(introText) } />
                   { channelsAvailable ?
                         <AlternateChannels items={ channelDetailsList } />
                         : null }
               </div>;
    }
}

export const Introduction = connect(({appState: {introHeight, widgetState}}) => {
    return {
        appState: {
            introHeight,
            widgetState
        }
    };
})(IntroductionComponent);
