import React from 'react';
import { Dimensions, Platform, StyleSheet, StatusBar, Text, View, Button} from 'react-native';
import { Popover, PopoverController } from 'react-native-modal-popover';

export default class PopoverModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = this.getState(Dimensions.get('window'));
    }

    componentDidMount() {
        Dimensions.addEventListener('change', this.onDimensionsChange);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.onDimensionsChange);
    }

    getState = ({ width, height }) => {
        const [dw, dh] = width > height ? [20, 40] : [40, 20];
        return {
            width: (width - dw) / 3,
            height: (height - dh) / 3,
        };
    }

    onDimensionsChange = ({ window }) => {
        this.setState(this.getState(window));
    }

    render() {
        const { width, height } = this.state;
        const { icon, text, alignItems, justifyContent, popoverStyles } = this.props;
        return (
            <View style={{ width, height, alignItems, justifyContent }}>
                <PopoverController>
                    {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => (
                        <React.Fragment>
                            <Button title='' icon={icon} ref={setPopoverAnchor} onPress={openPopover} />
                            <Popover
                                {...popoverStyles}
                                visible={popoverVisible}
                                onClose={closePopover}
                                fromRect={popoverAnchorRect}
                                supportedOrientations={['portrait', 'landscape']}
                            >
                                <Text>{text}</Text>
                            </Popover>
                        </React.Fragment>
                    )}
                </PopoverController>
            </View>
        );
    }
}