import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Animated, Easing, Text} from 'react-native';
import WaveTitle from '../components/WaveTitleText';
import {navigate} from '../navigation/NavigationUtil';
import {COLORS} from '../constants/colors';
import { normalizeModerately } from '../constants/Scalling';

const LandingScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      fadeAnim.setValue(0);
      translateY.setValue(20);
    };
  }, [fadeAnim, translateY]);

  const autoNavigate = () => {
    navigate('Home');
  };

  useEffect(() => {
    const timer = setTimeout(autoNavigate, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Animated.View
      style={[
        styles.container,
        {opacity: fadeAnim, transform: [{translateY}]},
      ]}>
      <WaveTitle title="Todo List" rise={14} duration={420} stagger={120} />

      <Text style={styles.subtitle}>Organize your day — simply</Text>
    </Animated.View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalizeModerately(24),
  },
  subtitle: {
    color: '#9aa4bf',
    fontSize: normalizeModerately(20),
    marginTop: normalizeModerately(10),
    textAlign: 'center',
  },
});
