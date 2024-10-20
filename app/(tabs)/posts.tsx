import { Image, View, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import IconButton from '@/components/IconButton';
import { useRef } from 'react';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

export default function PostsScreen() {

  const imageRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [saved, onSaved] = React.useState(false)

  const pickImageAsync = async () => {
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
                Alert.alert('Decrpted secret data', Response.data["Decode for secret"], [{text: 'OK', onPress: () => null },]);
              }else{
                alert('Decrpted secret data: ' + Response.data["Decode for secret"]);
              }
            }else{
              throw new TypeError('missing secret');
            }
          })
        }
      }catch (error){
        onSaved(false);
      }
  };
  
  return (
    <>
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <>
          <View collapsable={false} >
            <Image ref={imageRef} source={{ uri: selectedImage }}
              style={{width: 330, height: 330, margin: 5, padding: 5, backgroundColor: 'white' }} />
          </View>
          <View style={styles.optionsRow}>
            <IconButton icon="camera" label="Pick" onPress={pickImageAsync} />
            <ActivityIndicator animating={saved} size="small" color="#000000" />
            <IconButton icon="save-alt" label="Decode" onPress={onProcessLabelAsync} />
          </View>
          {/* <Text>{resData}</Text> */}
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
    marginHorizontal: 30
  },
});