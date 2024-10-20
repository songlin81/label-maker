import { Image, View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import IconButton from '@/components/IconButton';
import { useRef } from 'react';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

const PlaceholderImage = require('../../assets/images/download.png');

export default function PostsScreen() {

  const imageRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [saved, onSaved] = React.useState(false)

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
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

  const sleep = (ms: any) => new Promise(r => setTimeout(r, ms));

  const onProcessLabelAsync = async () => {
    onSaved(true);

    await sleep(2000)

    onSaved(false);
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