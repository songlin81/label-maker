import { Text, View, StyleSheet, Image, TextInput, Pressable, Platform } from 'react-native';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import IconButton from '@/components/IconButton';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import domtoimage from 'dom-to-image';
import { ScrollView } from 'react-native';

export default function PostsScreen() {

    const [maker, setMaker] = useState('')
    const fetchLabelMaker = async (
      origin_text:string,
      pack_text:string,
      variant_text:string,
      vo_text:string,
      label_part_number:string,
      description_text:string,
      content:string,
      secret:string
    ) => {
      const url='https://labelmaker-api.azurewebsites.net/v1/label';

      var bodyFormData = new FormData();
      bodyFormData.append('origin_text', origin_text);
      bodyFormData.append('pack_text', pack_text);
      bodyFormData.append('variant_text', variant_text);
      bodyFormData.append('vo_text', vo_text);
      bodyFormData.append('label_part_number', label_part_number);
      bodyFormData.append('content', content);
      bodyFormData.append('secret', secret);
      bodyFormData.append('description_text', description_text);
      bodyFormData.append('format', '1');

      try{
        await axios({
          method: "post",
          url: url,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        }).then((Response)=>{
          setMaker(Response.data.img)
        })

      }catch (error){
        console.error(error);
      }
    }

    // useEffect(() => {
    //     fetchLabelMaker();
    // }, []);

    const [votext, onChangeVOText] = React.useState('VO 123 45 678')
    const [packtext, onChangePackText] = React.useState('Pack of: 10 Pcs')
    const [descriptiontext, onChangeDescriptionText] = React.useState('Parts description')
    const [varianttext, onChangeVariantText] = React.useState('E - 25 00')
    const [origintext, onChangeOriginText] = React.useState('Made in United Kingdom')
    const [labelpartnumbertext, onChangeLabelPartNumberText] = React.useState('label part 1234')
    const [contenttext, onContentText] = React.useState('https://www.volvogroup.com')
    const [secrettext, onSecretText] = React.useState('volvo energy')

    const generateLabel = () => {
      fetchLabelMaker(origintext, packtext, varianttext, votext, labelpartnumbertext, descriptiontext, contenttext, secrettext)
    };

    const imageRef = useRef(null);
    
    const onSaveImageAsync = async () => {
      if (Platform.OS !== 'web') {
        try {
          const localUri = await captureRef(imageRef, {
            height: 330,
            quality: 1,
          });
  
          await MediaLibrary.saveToLibraryAsync(localUri);
          if (localUri) {
            alert('Saved!');
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          if(imageRef.current){
            const dataUrl = await domtoimage.toJpeg(imageRef.current, {
              quality: 0.95,
              width: 330,
              height: 330,
            });
            let link = document.createElement('a');
            link.download = 'label.png';
            link.href = dataUrl;
            link.click();
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    const onReset = () => {
      setMaker('');
      onChangeVOText('');
      onChangePackText('');
      onChangeDescriptionText('');
      onChangeVariantText('');
      onChangeOriginText('');
      onChangeLabelPartNumberText('');
      onContentText('');
      onSecretText('');
    };
    
    const [show, onShow] = React.useState(true)
    const onToggleSecret = () => {
      onShow(!show)
    }
    
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View>
        {maker == '' ?
          <>
            <Text>Public content:</Text>
            <TextInput style={styles.input} editable numberOfLines={1} maxLength={80} onChangeText={text => onContentText(text)} value={contenttext} />
            <Text onPress={onToggleSecret}>Secret content (Click me to show):</Text>
            <TextInput style={styles.input} secureTextEntry={show} editable numberOfLines={1} maxLength={80} onChangeText={text => onSecretText(text)} value={secrettext} />
            <Text>VO:</Text>
            <TextInput style={styles.input} editable numberOfLines={1} maxLength={80} onChangeText={text => onChangeVOText(text)} value={votext} />
            <Text>Package</Text>
            <TextInput style={styles.input} editable numberOfLines={1} maxLength={80} onChangeText={text => onChangePackText(text)} value={packtext} />
            <Text>Description:</Text>
            <TextInput style={styles.input} editable numberOfLines={1} maxLength={80} onChangeText={text => onChangeDescriptionText(text)} value={descriptiontext} />
            <Text>Variant:</Text>
            <TextInput style={styles.input} editable numberOfLines={1} maxLength={80} onChangeText={text => onChangeVariantText(text)} value={varianttext} />
            <Text>Place:</Text>
            <TextInput style={styles.input} editable numberOfLines={1} maxLength={80} onChangeText={text => onChangeOriginText(text)} value={origintext} />
            <Text>Label number:</Text>
            <TextInput style={styles.input} editable numberOfLines={1} maxLength={80} onChangeText={text => onChangeLabelPartNumberText(text)} value={labelpartnumbertext} />

            <Pressable style={styles.button} onPress={generateLabel}>
              <Text style={styles.text}>Generate label</Text>
            </Pressable>
          </>
        :
          <>
            <View collapsable={false} >
              <Image ref={imageRef} source={{ uri: 'data:image/png;base64,'+maker }} style={{width: 330, height: 330, margin: 5, padding: 5 }} />
            </View>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
            </View>
          </>
          }
          </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent:'center',
      alignItems:'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    item: {
      backgroundColor: '#f5f5f5',
      padding: 10,
      marginVertical: 8,
      borderRadius: 8,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'black',
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    input: {
      height: 25,
      width: 350,
      borderWidth: 1,
      padding: 2
    },
    optionsContainer: {
      position: 'absolute',
      bottom: 5,
    },
    optionsRow: {
      flexDirection: 'row',
      justifyContent: "space-between",
      marginHorizontal: 30
    },
  });