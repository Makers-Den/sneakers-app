import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/lib/theme';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList, Screen } from '@/types/navigation';

export function DiscoverScreen({}: BottomTabScreenProps<
  RootTabParamList,
  Screen.DiscoverScreens
>) {
  return (
    <SafeAreaView style={styles.wrapper}>
      <Text>ShHHhYeahh</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.palette.gray[900],
  },
});
