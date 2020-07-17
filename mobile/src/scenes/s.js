import React from "react";
import styled from "styled-components";
import { PanResponder, Animated } from "react-native";
import Project from "./tes/Project";


class Projects extends React.Component {

  state = {
    pan: new Animated.ValueXY()
  };
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        // We'll take care of this later.
        },
        onPanResponderMove: Animated.event([
          null,
          { dx: this.state.pan.x, dy: this.state.pan.y }
          ]),
          onPanResponderRelease: () => {
            Animated.spring(this.state.pan, { toValue: { x: 0, y: 0 } }).start();
          }
    });
  }


  render() {
    return (
      <Animated.View
          style={{
            transform: [
              { translateX: this.state.pan.x },
              { translateY: this.state.pan.y }
            ]
          }}
          {...this._panResponder.panHandlers}
        >
        <Project title="Price Tag"
           image={require("../../assets/icon.png")}
           author="Liu Yi"
           text="Thanks to Design+Code, I improved my design skill and learned to do animations for my app Price Tag, a top news app in China."
         />
        </Animated.View>
    );
  }
}

export default Projects;

const Container = styled.View`
  width: 315px;
  height: 460px;
  border-radius: 14px;
  background-color: blue;
`;