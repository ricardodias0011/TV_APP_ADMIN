import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Button, Dimensions, Text, ActivityIndicator, Image } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import Slider from '@react-native-community/slider';
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from 'expo-status-bar';

import { Theme } from '../../../theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useRoute } from '@react-navigation/native';
import { MovieTypes } from '../../types/movie';
import { LinkIMGSTDBM } from '../../utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Genre from "../../services/tmdb/genre.json"
import { AntDesign } from '@expo/vector-icons';
export default function ContentPlay({ navigation }: any) {



  const { params } = useRoute();
  const videoRef = useRef<any>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [showControls, setShowControls] = useState(true);
  const [timeoutId, setTimeoutId] = useState<any>(null);

  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const [FiledVideoSouce, setFiledVideoSouce] = useState(false);

  const [Content, setContent] = useState<MovieTypes | null>(null);

  const [controlsV, setControlsV] = useState(true);

  const [orientation, setOrientation] = useState(1);

  useEffect(() => {
    if (params) {
      setContent(params as MovieTypes)
    }
  }, [params])

  React.useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    NavigationBar.setVisibilityAsync("hidden");

    return () => {
      NavigationBar.setVisibilityAsync("visible");
      ScreenOrientation.unlockAsync();
      setContent(null);
      setCurrentTime(0);
      setTotalDuration(0);
      setOrientation(1);
      setFiledVideoSouce(false)
    };

  }, [])

  useEffect(() => {
    CurrentOrientation();
  }, [])

  const CurrentOrientation = async () => {
    const currentOrientation = await ScreenOrientation.getOrientationAsync();
    setOrientation(currentOrientation)
  }

  useEffect(() => {
    const handleControlsTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        setShowControls(false);
      }, 3500); // 3.5 segundos

      setTimeoutId(newTimeoutId);
    };

    if (showControls) {
      handleControlsTimeout();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showControls, controlsV]);

  const handlePlayPause = async () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setControlsV(!controlsV)
    const status = await videoRef.current.getStatusAsync();
    if (status?.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(status?.isPlaying)
  };

  const handleVideoProgress = (progress: any) => {
    if (progress.isLoaded) {
      setIsVideoLoading(false);
    } else {
      setIsVideoLoading(true);
    }
    setCurrentTime(progress.positionMillis);
    setTotalDuration(progress.durationMillis);
  };

  const onSliderValueChange = (value: any) => {
    if (videoRef.current && totalDuration) {
      const newPosition = value * totalDuration;
      videoRef.current.setPositionAsync(newPosition);
    }
  };

  const formatTime = (time: any) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${hours ?? 0}:${minutes < 10 ? '0' : ''}${minutes ?? 0}:${seconds < 10 ? '0' : ''}${seconds ?? 0}`;
  };

  const handleJumpForward = async () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setControlsV(!controlsV)
    if (videoRef.current) {
      const position = await videoRef.current.getStatusAsync();
      const newPosition = position.positionMillis + 10000;
      videoRef.current.setPositionAsync(newPosition);
    }
  };

  const handleJumpBackward = async () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setControlsV(!controlsV)
    if (videoRef.current) {
      const position = await videoRef.current.getStatusAsync();
      const newPosition = Math.max(0, position.positionMillis - 10000);
      videoRef.current.setPositionAsync(newPosition);
    }
  };

  if (FiledVideoSouce) {
    return (
      <View style={[styles.container]}>
        <StatusBar hidden />
        <LottieView
          loop={true}
          autoPlay
          style={styles.playAnimation}
          source={require('../../assets/animations/errornet.json')}
        />
        <Text style={{ color: '#fff', fontSize: 22 }}>Não foi possível reproduzir video</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, borderRadius: 5, backgroundColor: 'white', marginTop: 10, minWidth: 150 }}>
          <Text style={{ fontSize: 22, textAlign: 'center' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[styles.container]}>
      <StatusBar hidden />
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => setShowControls(!showControls)}>
        <Video
          ref={videoRef}
          style={[styles.video, {
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height
          }]}
          source={{
            uri: Content?.url ?? 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
            // uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          }}
          useNativeControls={false}
          shouldPlay
          resizeMode={ResizeMode.CONTAIN}
          hasTVPreferredFocus
          focusable
          onError={() => setFiledVideoSouce(true)}
          onLoadStart={() => console.log("start")}
          onLoad={(status: AVPlaybackStatus) => console.log(status.isLoaded)}
          isLooping
          // @ts-ignore
          isFullscreen={true}
          onPlaybackStatusUpdate={handleVideoProgress}
        />
        {isVideoLoading &&
          <View style={styles.overlay}>
            <View style={styles.btnContainer}>
              <LottieView
                loop={true}
                autoPlay
                style={styles.playAnimation}
                source={require('../../assets/animations/loading.json')}
              />
            </View>
          </View>
        }
        {
          (showControls && !isVideoLoading) ?
            <>
              <View style={styles.overlay}>
                <TouchableOpacity onPress={handleJumpBackward} style={styles.btnContainer}>
                  <Feather name="rotate-ccw" size={35} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlayPause} style={styles.btnContainer}>
                  {!isPlaying ? <MaterialCommunityIcons name="pause" size={75} color="white" /> : <AntDesign name="caretright" size={75} color="white" />}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleJumpForward} style={styles.btnContainer}>
                  <Feather name="rotate-cw" size={35} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.controls}>
                <View style={styles.containerInfos}>
                  <Image
                    style={styles.imageBackdrop}
                    source={{
                      uri: LinkIMGSTDBM[780] + Content?.backdrop_path
                    }}
                  />
                  <View>
                    <Text
                      style={styles.textInfos}>{Content?.title}</Text>
                    <View style={styles.relevantInformation}>

                      {Content?.genre_ids?.map((id) => {
                        return (
                          <Text key={id} style={[styles.relevantInformationText, { color: Theme.success }]}>
                            {Genre.genres.find(a => a.id === id)?.name}
                          </Text>
                        )
                      })}
                      <Text style={[styles.relevantInformationText, { color: Theme.gray[100] }]}>
                        -  {Content?.release_date?.slice(0, 4)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.timeText}>{formatTime(currentTime)} / {formatTime(totalDuration)}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={currentTime / totalDuration}
                  minimumTrackTintColor={Theme.secundary}
                  maximumTrackTintColor="#d3d3d3"
                  thumbTintColor={Theme.secundary}
                  onValueChange={onSliderValueChange}
                />
              </View>
              <LinearGradient
                colors={['transparent', Theme.bgcolor]}
                style={styles.background}
              />
            </> : <></>
        }
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: '#000',
    alignItems: 'center'
  },
  video: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 10,
    width: '100%',
    marginHorizontal: 15,
    zIndex: 2
  },
  slider: {
    flex: 1
  },
  timeText: {
    color: 'white',
    fontWeight: '700',
    marginHorizontal: 15
  },
  overlay: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 40,
    zIndex: 100
  },
  playAnimation: {
    width: 200,
    height: 200,
    zIndex: 10
  },
  btnContainer: {
    padding: 8,
    borderRadius: 75,
    backgroundColor: '#00000050',
    zIndex: 60
  },
  imageBackdrop: {
    width: 100,
    height: 80
  },
  containerInfos: {
    flexDirection: 'row',
    gap: 5,
    margin: 15
  },
  textInfos: {
    color: 'white',
    fontWeight: '700',
    maxWidth: Dimensions.get('screen').width * .3
  },
  relevantInformation: {
    flexDirection: 'row',
    gap: 10
  },
  relevantInformationText: {
    fontSize: 14,
    fontWeight: "600"
  },
  buttonArrow: {
    position: 'absolute',
    zIndex: 135,
    top: 0
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: Dimensions.get('screen').height * .3,
    zIndex: 0
  }
});
