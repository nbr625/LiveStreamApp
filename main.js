import React, { Component } from 'react'
import { Platform } from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  getUserMedia
} from 'react-native-webrtc';

class Main extends Component {
  //install State
  state = {
    videoURL: null,
    isFront: true
  }
  componentDidMount() {
    const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
    const pc = new RTCPeerConnection(configuration);
    const { isFront } =  this.state;
    MediaStreamTrack.getSources(sourceInfos => {
      console.log("MediaStreamTrack.getSources", sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if(sourceInfo.kind === "video" && sourceInfo.facing === (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }

      getUserMedia({
        audio: true,
        // For simulator
        video: Platform.OS === 'ios' ?  false :  {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30
          },
          facingMode: (isFront ? "user" : "environment"),
          optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
        }
      }, (stream) => {
        console.log('dddd', stream);
        this.setState({
          videoURL: stream.toURL()
        });
        callback(stream);
      }, (error) => {
        console.log(error.message);
        throw error;
      });
    });
  }

  render () {
    return (
      <RTCView streamURL={this.state.videoURL} style={style.container} />
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ccc'
    borderColor: '#000'
  }
}

export default Main
