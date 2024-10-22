import { Image, View, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import IconButton from '@/components/IconButton';
import { useRef } from 'react';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
 
export default function PostsScreen() {

  const imageRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [saved, onSaved] = React.useState(false)

  const pickImageAsync = async () => {
    setImgData(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      Alert.alert('Label image', 'You did not select any image.', [
        {text: 'OK', onPress: () => null },
      ]);
    }
  };

  function getFileFromBase64(string64:string, fileName:string) {
    const trimmedString = string64.replace('data:image/png;base64,', '');
    const imageContent = atob(trimmedString);
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer);
  
    for (let n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }
    const type = 'image/png';
    const blob = new Blob([buffer], { type });
    return new File([blob], fileName, { lastModified: new Date().getTime(), type });
  }

  const onProcessLabelAsync = async () => {
      try{
        //setImgData(true);
        if(selectedImage){
          onSaved(true);
          const url='https://labelmaker-api.azurewebsites.net/v1/cryptography';
          var bodyFormData = new FormData();
          if (Platform.OS !== 'web') {
            bodyFormData.append("qrimage", {
                uri: selectedImage,
                name: "image",
                type: "image/png"
            },'qrimage.png');
          }else{
            bodyFormData.append('qrimage', getFileFromBase64(selectedImage as any, 'qrimage.png'));
          }

          await axios({
            method: "post",
            url: url,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          }).then((Response)=>{
            onSaved(false);
            if(Response.data["Decode for secret"]){
              if (Platform.OS !== 'web') {
                Alert.alert('Decrpted secret data', Response.data["Decode for secret"], [{text: 'OK', onPress: () => setImgData(true) },]);
              }else{
                alert('Decrpted secret data: ' + Response.data["Decode for secret"]);
                setImgData(true);
              }
            }else{
              throw new TypeError('missing secret');
            }
          })
        }
      }catch (error){
        if (Platform.OS !== 'web') {
          Alert.alert('Decrpted secret data', 'failure occurred please re-try', 
          [{text: 'OK', onPress: () => {        
            onSaved(false);
            setImgData(true);
          }},]);
        }else{
          alert('Decrpted secret data: failure occurred please re-try');
          onSaved(false);
          setImgData(true);
        }
      }
  };
  
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [ImgData, setImgData] = useState(true);

  const takePicture = async () => {
    if (cameraRef.current) {
      await cameraRef.current?.takePictureAsync()
        .then((photoData:any) => {
          MediaLibrary.saveToLibraryAsync(photoData.uri);
          cameraRef.current?.stopRecording();
          setImgData(false);
          setSelectedImage(photoData.uri);
        });
    }
  };

  const [torchMode, setFTorchMode] = React.useState<boolean>(false)
  const __handleTorchMode = () => {
    setFTorchMode(!torchMode);
  }

  return (
    <>
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <>
          {permission?.granted && ImgData ? (
              <View style={{width: 330, height: 330, flex: 1,}}>
                <CameraView style={styles.camera} ref={cameraRef} enableTorch={torchMode} >
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: torchMode ? '#fff' : '#000',
                        position: 'absolute',
                        left: '2%',
                        top: '6%',
                        borderRadius: 50,
                        height: 25,
                        width: 25
                      }}
                      onPress={__handleTorchMode} >
                      <Text
                        style={{
                          fontSize: 20
                        }}
                      >⚡️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePicture}></TouchableOpacity>
                  </View>
                </CameraView>
              </View>

            ) : (
              <View collapsable={false} >
                <Image ref={imageRef} source={{ uri: selectedImage }} resizeMode="contain"
                  style={{width: 330, height: 330, margin: 5, padding: 5, backgroundColor: 'white' }} />
              </View>
            )
          }
          <ActivityIndicator animating={saved} size="small" color="#000000" />
          <View style={styles.optionsRow}>
            <IconButton icon="camera" label="Pick" onPress={pickImageAsync} />
            <IconButton icon="photo-camera" label="Capture" onPress={requestPermission} />
            <IconButton icon="checklist" label="Decode" onPress={onProcessLabelAsync} />
          </View>
        </>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: 20,
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    margin: 32,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
});