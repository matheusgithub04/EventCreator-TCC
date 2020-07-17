import React from 'react';
import { createAppContainer } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

import main from './initial';

const mainNavigation = createAnimatedSwitchNavigator(
  {
    main
  },
  {
    transition: (
      <Transition.Together>
        <Transition.Out
          type="slide-left"
          durationMs={200}
          interpolation="easeIn"
        />
        <Transition.In type="fade" durationMs={300} />
      </Transition.Together>
    ),
  },
);

export default createAppContainer(mainNavigation);