import { Component } from 'react';
import {
    Manager as InteractionManager
} from 'domains/interaction';

export default class ContainerComponent extends Component {
    componentWillMount() {
        this.keyMap && InteractionManager.bindKeys(this.keyMap);
    }

    componentDidMount() {
        this.modalKeyMap && InteractionManager.bindKeys(this.modalKeyMap);
    }

    componentWillUnmount() {
        this.keyMap && InteractionManager.unbindKeys(this.keyMap);
        this.modalKeyMap && InteractionManager.unbindKeys(this.modalKeyMap);
        this.keyMap = null;
    }
}
