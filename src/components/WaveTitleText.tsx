import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, View, StyleSheet} from 'react-native';
import {ANIMATION} from '../constants/animation';
import {COLORS} from '../constants/colors';
import { WaveTitleProps } from '../constants/types';
import { normalizeModerately } from '../constants/Scalling';

const WaveTitle: React.FC<WaveTitleProps> = ({
  title,
  rise = ANIMATION.DEFAULT_RISE,
  duration = ANIMATION.DEFAULT_DURATION,
  stagger = ANIMATION.DEFAULT_STAGGER,
  textStyle,
  containerStyle,
}) => {
  const letters = useMemo(() => title.split(''), [title]);

  // Stable animated values for each letter
  const letterAnimsRef = useRef<Animated.Value[]>([]);
  if (letterAnimsRef.current.length !== letters.length) {
    letterAnimsRef.current = letters.map(
      (_, i) => letterAnimsRef.current[i] ?? new Animated.Value(0),
    );
  }
  const letterAnims = letterAnimsRef.current;

  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Build per-letter sequence (up then down)
    const sequences = letterAnims.map(a =>
      Animated.sequence([
        Animated.timing(a, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(a, {
          toValue: 0,
          duration,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    // Start a staggered looping wave
    loopRef.current = Animated.loop(Animated.stagger(stagger, sequences));
    loopRef.current.start();

    return () => {
      loopRef.current?.stop();
      // reset values to avoid visual artifacts on unmount/hot reload
      letterAnims.forEach(a => a.setValue(0));
    };
  }, [duration, stagger, letterAnims]);

  return (
    <View style={[styles.row, containerStyle]}>
      {letters.map((ch, i) => {
        const translateY = letterAnims[i].interpolate({
          inputRange: [0, 1],
          outputRange: [0, -rise],
        });
        const scale = letterAnims[i].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.08],
        });

        return (
          <Animated.Text
            key={`${ch}-${i}`}
            accessibilityRole="header"
            style={[
              styles.letter,
              textStyle,
              {transform: [{translateY}, {scale}]},
            ]}>
            {ch}
          </Animated.Text>
        );
      })}
    </View>
  );
};

export default WaveTitle;

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'flex-end'},
  letter: {
    color: COLORS.primary,
    fontSize: normalizeModerately(45),
    fontWeight: '700',
  },
});
