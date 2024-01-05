import { View, StyleSheet, Dimensions, Text } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { theme } from "@/lib/theme";
import Animated, { useDerivedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import { RootScreensProps, RootScreen } from "@/types/navigation";
import { BlogActionBar } from "../details/BlogActionBar";

export type ProgressBarProps = {
  width: number;
  progress: number;
};

export function ProgressBar({ width, progress }: ProgressBarProps) {
  const progressWidth = useDerivedValue(() => {
    return progress * width;
  }, [progress, width]);

  return (
    <View style={[styles.progressBarWrapper, { width }]}>
      <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
    </View>
  );
}

export type Story = {
  text: string;
  src: string;
};

export type StoriesProps = {
  stories: Story[];
  navigation: RootScreensProps<RootScreen.Story>["navigation"];
};

const UPDATE_INTERVAL = 100;

const windowDimensions = Dimensions.get("window");

const screen = Dimensions.get("screen");

export type StoryStates = "loading" | "loaded";

export type StoriesState = {
  currentStoryIndex: number;
  progress: number;
  state: StoryStates;
};

export type Actions = "playNext" | "playPrevious" | "updateProgress" | "onLoad";

export type Action =
  | {
      action: Exclude<Actions, "updateProgress" | "onLoad">;
      stories: Story[];
      force?: boolean;
    }
  | {
      action: Extract<Actions, "updateProgress">;
      progress: number;
    }
  | {
      action: Extract<Actions, "onLoad">;
    };

function reducer(state: StoriesState, action: Action): StoriesState {
  switch (action.action) {
    case "playNext":
      if (!action.force && state.state === "loading") {
        return state;
      }
      const nextIndex =
        state.currentStoryIndex + 1 >= action.stories.length
          ? 0
          : state.currentStoryIndex + 1;

      return {
        currentStoryIndex: nextIndex,
        state: "loading",
        progress: 0,
      };
    case "playPrevious":
      if (!action.force && state.state === "loading") {
        return state;
      }
      const prevIndex =
        state.currentStoryIndex - 1 < 0
          ? action.stories.length - 1
          : state.currentStoryIndex - 1;

      return {
        currentStoryIndex: prevIndex,
        state: "loading",
        progress: 0,
      };
    case "onLoad":
      return { ...state, state: "loaded" };

    case "updateProgress":
      if (state.state === "loading") {
        return state;
      }
      return { ...state, progress: action.progress };

    default:
      return state;
  }
}

export function Stories({ stories, navigation }: StoriesProps) {
  const [state, dispatch] = useReducer(reducer, {
    currentStoryIndex: 0,
    state: "loading",
    progress: 0,
  });

  const video = useRef<Video>(null);

  const progressBarWidth = useMemo(() => {
    return (
      (windowDimensions.width - theme.spacing(2)) / stories.length -
      theme.spacing(0.5) * 2
    );
  }, [stories.length]);

  useEffect(() => {
    video.current?.unloadAsync().then(async () => {
      await video.current?.loadAsync({
        uri: stories[state.currentStoryIndex]?.src,
      });
      await video.current?.playAsync();
    });
  }, [state.currentStoryIndex]);

  const composed = useMemo(() => {
    const longPressGesture = Gesture.LongPress()
      .runOnJS(true)
      .onStart(() => {
        video.current?.pauseAsync();
      })
      .onEnd(() => {
        video.current?.playAsync();
      });

    const onTap = Gesture.Tap()
      .runOnJS(true)
      .onEnd((event) => {
        if (event.absoluteX > windowDimensions.width / 2) {
          dispatch({ action: "playNext", stories, force: true });
        } else {
          dispatch({ action: "playPrevious", stories, force: true });
        }
      });

    const onFlingDown = Gesture.Fling()
      .runOnJS(true)
      .direction(Directions.DOWN)
      .onEnd(() => {
        navigation.goBack();
      });

    const onFlingUp = Gesture.Fling()
      .runOnJS(true)
      .direction(Directions.UP)
      .onEnd(() => {
        navigation.goBack();
      });

    return Gesture.Race(onFlingDown, onFlingUp, longPressGesture, onTap);
  }, [navigation]);

  const onPlaybackStatusUpdate = useCallback(
    (playbackStatus: AVPlaybackStatus) => {
      if (playbackStatus.isLoaded) {
        if (playbackStatus.isPlaying) {
          const progress =
            playbackStatus.positionMillis /
            (playbackStatus.durationMillis || 1);

          dispatch({ action: "updateProgress", progress });

          if (
            (playbackStatus.didJustFinish || progress >= 1) &&
            !playbackStatus.isLooping
          ) {
            dispatch({ action: "playNext", stories });
          }
        }
      }
    },
    []
  );

  const onLoad = useCallback(() => {
    dispatch({ action: "onLoad" });
  }, []);

  const onClose = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.container}>
        <SafeAreaView
          style={{
            flex: 1,
            position: "relative",
            zIndex: 120,
            flexDirection: "column",
          }}
          edges={{
            bottom: "additive",
            top: "additive",
            left: "additive",
            right: "additive",
          }}
        >
          <View style={styles.progressBarsContainer}>
            {stories.map(({ src }, index) => {
              return (
                <ProgressBar
                  key={src}
                  width={progressBarWidth}
                  progress={
                    index === state.currentStoryIndex
                      ? state.progress
                      : index > state.currentStoryIndex
                      ? 0
                      : 1
                  }
                />
              );
            })}
          </View>
          <View style={styles.contentWrapper}>
            <BlogActionBar onClose={onClose} />
            {stories[state.currentStoryIndex]?.text && (
              <Text style={styles.text}>
                {stories[state.currentStoryIndex]?.text}
              </Text>
            )}
          </View>
        </SafeAreaView>

        <Video
          ref={video}
          style={styles.video}
          isLooping={false}
          resizeMode={ResizeMode.COVER}
          progressUpdateIntervalMillis={UPDATE_INTERVAL}
          onLoad={onLoad}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />
      </View>
    </GestureDetector>
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
    backgroundColor: theme.palette.gray[900],
  },
  contentWrapper: {
    width: "100%",
    position: "relative",
    flex: 1,
    paddingVertical: theme.spacing(2),
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
  },

  text: {
    color: theme.palette.gray[100],
    fontSize: theme.typography.fontSize.base,
    width: "80%",
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(4),
  },

  progressBarsContainer: {
    width: "100%",
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1),
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
    width: 0,
    backgroundColor: theme.palette.gray[100],
  },
});
