import { View, StyleSheet, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useEffect, useMemo, useRef, useState } from "react";
import { theme } from "@/lib/theme";
import Animated, {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export type ProgressBarProps = {
  width: number;
  progress: number;
};

export function ProgressBar({ width, progress }: ProgressBarProps) {
  const progressWidth = useDerivedValue(() => {
    return progress * width;
  });
  return (
    <View style={[styles.progressBarWrapper, { width }]}>
      <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
    </View>
  );
}

export type StoriesProps = {
  videoSources: string[];
};

const windowDimensions = Dimensions.get("window");

const screen = Dimensions.get("screen");

export function Stories({ videoSources }: StoriesProps) {
  const [videoIndex, setVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const video = useRef<Video>(null);

  const progressBarWidth = useMemo(() => {
    return (
      (windowDimensions.width - theme.spacing(2)) / videoSources.length -
      theme.spacing(0.5) * 2
    );
  }, [videoSources.length]);

  useEffect(() => {
    setProgress(0);
    video.current?.unloadAsync().then(() => {
      video.current?.loadAsync({ uri: videoSources[videoIndex] });
    });
  }, [videoIndex]);

  console.log("videoIndex", videoIndex);

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={{
          position: "relative",
          zIndex: 120,
        }}
        edges={{
          bottom: "off",
          top: "additive",
          left: "additive",
          right: "additive",
        }}
      >
        <View style={styles.progressBarsContainer}>
          {videoSources.map((src, index) => {
            return (
              <ProgressBar
                key={src}
                width={progressBarWidth}
                progress={
                  index === videoIndex ? progress : index < videoIndex ? 1 : 0
                }
              />
            );
          })}
        </View>
      </SafeAreaView>
      <Video
        ref={video}
        style={styles.video}
        shouldPlay
        resizeMode={ResizeMode.COVER}
        progressUpdateIntervalMillis={50}
        onPlaybackStatusUpdate={async (playbackStatus) => {
          if (playbackStatus.isLoaded) {
            if (playbackStatus.isPlaying) {
              const progress =
                playbackStatus.positionMillis /
                (playbackStatus.durationMillis || 1);

              setProgress(progress);

              if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                setVideoIndex((index) => {
                  return index + 1 >= videoSources.length ? 0 : index + 1;
                });
              }
            } else {
              video.current?.playAsync();
            }
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    position: "absolute",
    height: screen.height,
    width: screen.width,
    zIndex: 110,
  },

  progressBarsContainer: {
    width: "100%",
    paddingHorizontal: theme.spacing(2),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressBarWrapper: {
    height: 3,
    backgroundColor: theme.palette.gray[300],
  },

  progressBar: {
    height: "100%",
    backgroundColor: theme.palette.gray[100],
  },
});
