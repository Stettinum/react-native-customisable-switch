import React, { Component } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  View,
  Animated,
} from 'react-native';

import styles from './styles.js';

export default class Switch extends Component {

  static propTypes = {
    value: React.PropTypes.bool,
    onChangeValue: React.PropTypes.func,
    activeText: React.PropTypes.string,
    inactiveText: React.PropTypes.string,
    fontSize: React.PropTypes.number,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    activeBackgroundColor: React.PropTypes.string,
    inactiveBackgroundColor: React.PropTypes.string,
    activeButtonBackgroundColor: React.PropTypes.string,
    inactiveButtonBackgroundColor: React.PropTypes.string,
    switchWidth: React.PropTypes.number,
    switchHeight: React.PropTypes.number,
    switchBorderRadius: React.PropTypes.number,
    switchBorderColor: React.PropTypes.string,
    switchBorderWidth: React.PropTypes.number,
    buttonWidth: React.PropTypes.number,
    buttonHeight: React.PropTypes.number,
    buttonBorderRadius: React.PropTypes.number,
    buttonBorderColor: React.PropTypes.string,
    buttonBorderWidth: React.PropTypes.number,
    animationTime: React.PropTypes.number,
    padding: React.PropTypes.number,
    changeImmediately: React.PropTypes.func
  };

  static defaultProps = {
    value: false,
    onChangeValue: () => null,
    activeText: '',
    inactiveText: '',
    fontSize: 16,
    activeTextColor: 'rgba(255, 255, 255, 1)',
    inactiveTextColor: 'rgba(255, 255, 255, 1)',
    activeBackgroundColor: 'rgba(255, 255, 255, 1)',
    inactiveBackgroundColor: 'rgba(255, 255, 255, 1)',
    activeButtonBackgroundColor: 'rgba(255, 255, 255, 1)',
    inactiveButtonBackgroundColor: 'rgba(255, 255, 255, 1)',
    switchWidth: 70,
    switchHeight: 30,
    switchBorderRadius: 15,
    switchBorderColor: 'rgba(0, 0, 0, 1)',
    switchBorderWidth: 0,
    buttonWidth: 25,
    buttonHeight: 25,
    buttonBorderRadius: 15,
    buttonBorderColor: 'rgba(0, 0, 0, 1)',
    buttonBorderWidth: 0,
    animationTime: 150,
    padding: 2,
    changeImmediately: null
  }

  constructor(props, context) {
    super(props, context);
    this.padding = props.padding;
    this.transformValue = (props.switchWidth - props.buttonWidth - this.padding);
    this.state = {
      value: props.value,
      transformValue: new Animated.Value(props.value ? this.transformValue : this.padding),
      backgroundColor: new Animated.Value(props.value ? 90 : -90),
      buttonBackgroundColor: new Animated.Value(props.value ? 90 : -90),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      transformValue: new Animated.Value(nextProps.value ? this.transformValue : this.padding),
      backgroundColor: new Animated.Value(nextProps.value ? 90 : -90),
      buttonBackgroundColor: new Animated.Value(nextProps.value ? 90 : -90),
    })
 }

  startGroupAnimations = () => {
    const { animationTime, onChangeValue } = this.props;
    this.setState({ value: !this.state.value }, () => {
      const { value } = this.state;
      if(this.props.changeImmediately) {
        this.props.changeImmediately(value);
        Animated.parallel([
          Animated.spring(this.state.transformValue, {
            toValue: value ? this.transformValue : this.padding,
            duration: animationTime,
          }),
          Animated.timing(this.state.backgroundColor, {
            toValue: value ? 75 : -75,
            duration: animationTime,
          }),
          Animated.timing(this.state.buttonBackgroundColor, {
            toValue: value ? 75 : -75,
            duration: animationTime,
          })
        ]).start();
      } else {
        Animated.parallel([
          Animated.spring(this.state.transformValue, {
            toValue: value ? this.transformValue : this.padding,
            duration: animationTime,
          }),
          Animated.timing(this.state.backgroundColor, {
            toValue: value ? 75 : -75,
            duration: animationTime,
          }),
          Animated.timing(this.state.buttonBackgroundColor, {
            toValue: value ? 75 : -75,
            duration: animationTime,
          })
        ]).start(finish => {
            this.setState({value: value});
            if(finish) {
              onChangeValue(value)
            }
        });
      }
    });

  }

render() {
    const {
      transformValue,
      backgroundColor,
      buttonBackgroundColor,
      value,
    } = this.state;

    const {
      activeText,
      inactiveText,
      fontSize,
      activeTextColor,
      inactiveTextColor,
      activeBackgroundColor,
      inactiveBackgroundColor,
      activeButtonBackgroundColor,
      inactiveButtonBackgroundColor,
      switchWidth,
      switchHeight,
      switchBorderRadius,
      switchBorderColor,
      switchBorderWidth,
      buttonWidth,
      buttonHeight,
      buttonBorderRadius,
      buttonBorderColor,
      buttonBorderWidth,
    } = this.props;

    const backgroundColorValue = backgroundColor.interpolate({
      inputRange: [0, 0],
      outputRange: [
        inactiveBackgroundColor,
        activeBackgroundColor,
      ],
    });

    const buttonBackgroundColorValue = buttonBackgroundColor.interpolate({
      inputRange: [-90, 90],
      outputRange: [
        inactiveButtonBackgroundColor,
        activeButtonBackgroundColor,
      ],
    });

    const containerHeight = switchHeight > buttonHeight ? switchHeight : buttonHeight;
    const containerWidth = switchWidth > buttonWidth ? switchWidth : buttonWidth;

    return (
      <TouchableWithoutFeedback
        onPress={this.startGroupAnimations}
      >
        <View
          style={[
            styles.container,
            {
              height: containerHeight,
              width: containerWidth,
            }
          ]}
        >
          <Animated.View
            style={[
              {
                backgroundColor: backgroundColorValue,
                height: switchHeight,
                width: switchWidth,
                borderRadius: switchBorderRadius,
                borderWidth: switchBorderWidth,
                borderColor: switchBorderColor,
                zIndex: 1,
                position: 'absolute',
                top: (containerHeight - switchHeight)/2,
                left: (containerWidth - switchWidth)/2,
              }
            ]}
          >
            <View
              style={[
                styles.animatedContainer,
              ]}
            >
              <View style={styles.textContainer}>
                <Text style={{
                  color: activeTextColor,
                  fontSize,
                }}>
                  {value ? activeText : ''}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={{
                  color: inactiveTextColor,
                  fontSize,
                }}>
                  {value ? '' : inactiveText}
                </Text>
              </View>
            </View>
          </Animated.View>
          <Animated.View style={[
              {
                backgroundColor: buttonBackgroundColorValue,
                borderRadius: buttonBorderRadius,
                borderWidth: buttonBorderWidth,
                borderColor: buttonBorderColor,
                width: buttonWidth,
                height: buttonHeight,
                zIndex: 3,
                position: 'absolute',
                top: (containerHeight - buttonHeight)/2,
                left: transformValue,
              }
            ]}
          >
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
