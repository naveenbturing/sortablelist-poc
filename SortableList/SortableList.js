import React, {useState, useRef, useCallback, useMemo} from 'react';
import {Animated, LayoutAnimation, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';

import DraggableFlatList from 'react-native-draggable-flatlist';
// import Animated from 'react-native-reanimated';

import Row from './Row';

const NUM_ITEMS = 20;

const getColor = (i, numItems = 25) => {
  const multiplier = 255 / (numItems - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
};

const mapIndexToData = (_d, index, arr) => {
  const backgroundColor = getColor(index, arr.length);
  return {
    text: `${index}`,
    key: `key-${index}`,
    backgroundColor,
    height: 50,
  };
};

const initialData = [...Array(NUM_ITEMS)].fill(0).map(mapIndexToData);

const styles = StyleSheet.create({
  headerStyle: {
    zIndex: 10,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
  container: {
    flex: 1,
  },
});

const SortableList = props => {
  const {headerComponent, headerHeight, headerStyle, onScroll} = props;

  const [data, setData] = useState(initialData);
  const itemRefs = useRef(new Map());

  const translation = useRef(new Animated.Value(-64, {useNativeDriver: true}));
  const headerVisible = useRef(false);
  const _contentOffset = useRef({x: 0, y: 0});

  const renderItem = useCallback(params => {
    const onPressDelete = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setData(prev => prev.filter(item => item !== params.item));
    };

    return (
      <Row {...params} itemRefs={itemRefs} onPressDelete={onPressDelete} />
    );
  }, []);

  const showHeader = useCallback(() => {
    if (!headerVisible.current) {
      Animated.timing(translation.current, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        headerVisible.current = true;
      });
    }
  }, []);

  const hideHeader = useCallback(() => {
    if (headerVisible.current) {
      Animated.timing(translation.current, {
        toValue: -headerHeight,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        headerVisible.current = false;
      });
    }
  }, [headerHeight]);

  const handleHeaderOnScroll = useCallback(
    offset => {
      console.log('handleHeaderOnScroll', offset);

      const diff = offset - (_contentOffset.y || 0);
      const scrollDiff = Math.abs(diff);

      const closeToTop = offset <= 0;

      const scrollingUp = (diff < 0 && scrollDiff > 10) || closeToTop;
      const scrollingDown = diff > 0 && scrollDiff > 3;

      if (scrollingUp) {
        showHeader();
        // const closeToBottom =
        //   contentOffset.y + scrollContainerHeight >= scrollContentHeight - 20;
        // if (!closeToBottom) {
        //   showHeader();
        // }
      } else if (scrollingDown) {
        hideHeader();
      }
    },
    [showHeader, hideHeader],
  );

  const _onScroll = useCallback(
    offset => {
      if (headerComponent) {
        handleHeaderOnScroll(offset);
      }

      _contentOffset.current = offset;

      onScroll && onScroll(offset);
    },
    [headerComponent, handleHeaderOnScroll, onScroll],
  );

  const contentContainerStyle = useMemo(() => {
    if (headerComponent) {
      return {paddingTop: 64};
    }

    return {};
  }, [headerComponent]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={StyleSheet.flatten([
          styles.headerStyle,
          headerStyle,
          {
            height: headerHeight,
            transform: [
              {
                translateY: translation.current,
              },
            ],
          },
        ])}
        useNativeDriver>
        {headerComponent}
      </Animated.View>
      <DraggableFlatList
        contentContainerStyle={contentContainerStyle}
        onScrollOffsetChange={_onScroll}
        keyExtractor={item => item.key}
        data={data}
        renderItem={renderItem}
        onDragEnd={({data: d}) => setData(d)}
        activationDistance={20}
      />
    </View>
  );
};

SortableList.propTypes = {
  order: PropTypes.arrayOf(PropTypes.any),
  style: PropTypes.object,
  headerStyle: PropTypes.object,
  rowHeight: PropTypes.number,
  sortingEnabled: PropTypes.bool,
  scrollEnabled: PropTypes.bool,
  refreshControl: PropTypes.element,
  autoscrollAreaSize: PropTypes.number,
  rowActivationTime: PropTypes.number,
  manuallyActivateRows: PropTypes.bool,
  showSyncWallet: PropTypes.bool,
  showSyncOption: PropTypes.bool,
  syncWalletText: PropTypes.string,
  renderRow: PropTypes.func.isRequired,
  handleSyncWalletPress: PropTypes.func,
  handleSyncOptionPress: PropTypes.func,
  onChangeOrder: PropTypes.func,
  onActivateRow: PropTypes.func,
  onReleaseRow: PropTypes.func,
  onAdd: PropTypes.func,
  isKeyIndex: PropTypes.bool,
  disableAdd: PropTypes.bool,
  deleteDisabled: PropTypes.bool,
  keyField: PropTypes.string,
  onScroll: PropTypes.func,
  header: PropTypes.number,
  beginScrolling: PropTypes.func,
  endScrolling: PropTypes.func,
  headerComponent: PropTypes.any,
  footerComponent: PropTypes.any,
  headerHeight: PropTypes.number,
};

SortableList.defaultProps = {
  headerStyle: {},
  showSyncOption: false,
  rowHeight: 56,
  sortingEnabled: true,
  scrollEnabled: true,
  get autoscrollAreaSize() {
    return this.rowHeight;
  },
  manuallyActivateRows: false,
  isKeyIndex: false,
  disableAdd: false,
  header: 0,
  headerComponent: null,
  footerComponent: null,
  headerHeight: 56,
};

export default SortableList;
