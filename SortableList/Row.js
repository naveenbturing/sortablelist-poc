import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

import {ScaleDecorator} from 'react-native-draggable-flatlist';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import SwipeableItem, {
  useSwipeableItemParams,
} from 'react-native-swipeable-item';

const OVERSWIPE_DIST = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    height: 64,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  underlayRight: {
    flex: 1,
    backgroundColor: 'teal',
    justifyContent: 'flex-start',
  },
  underlayLeft: {
    flex: 1,
    backgroundColor: 'tomato',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    padding: 10,
  },
});

const UnderlayLeft = ({onPressDelete}) => {
  const {percentOpen} = useSwipeableItemParams();
  const animStyle = useAnimatedStyle(
    () => ({
      opacity: percentOpen.value,
    }),
    [percentOpen],
  );

  return (
    <Animated.View
      style={[styles.row, styles.underlayLeft, animStyle]} // Fade in on open
    >
      <TouchableOpacity onPress={onPressDelete}>
        <Text style={styles.text}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Row = ({item, itemRefs, drag, onPressDelete}) => {
  return (
    <ScaleDecorator>
      <SwipeableItem
        key={item.key}
        item={item}
        ref={ref => {
          if (ref && !itemRefs.current.get(item.key)) {
            itemRefs.current.set(item.key, ref);
          }
        }}
        onChange={params => {
          const {openDirection} = params;
          if (openDirection === 'left') {
            // Close all other open items
            [...itemRefs.current.entries()].forEach(([key, ref]) => {
              if (key !== item.key && ref) {
                ref.close();
              }
            });
          }
        }}
        overSwipe={OVERSWIPE_DIST}
        renderUnderlayLeft={() => (
          <UnderlayLeft drag={drag} onPressDelete={onPressDelete} />
        )}
        renderUnderlayRight={() => null}
        snapPointsLeft={[70]}>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          style={[
            styles.row,
            {backgroundColor: item.backgroundColor, height: item.height},
          ]}>
          <Text style={styles.text}>{item.text}</Text>
        </TouchableOpacity>
      </SwipeableItem>
    </ScaleDecorator>
  );
};

export default Row;
