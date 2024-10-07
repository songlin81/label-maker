import { Text, View, StyleSheet, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import i18n from 'i18next';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export default function PostsScreen() {

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(API_URL);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const lngs : any= {
      en: { nativeName: 'English' },
      pl: { nativeName: 'Polish' }
    };
    
    return (
        <View style={styles.container}>
          <div>
            {Object.keys(lngs).map((lng) => (
              <button key={lng} 
                style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }}
                type="submit" 
                onClick={() => i18n.changeLanguage(lng)}>
                {lngs[lng].nativeName}
              </button>
            ))}
          </div>
          <Text style={styles.title}>Making Label Maker API Requests</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>{item?.title}</Text>
              </View>
            )}
          />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      marginTop:70,
      flex: 1,
      justifyContent:'center',
      alignItems:'center',
      padding: 16,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    item: {
      backgroundColor: '#f5f5f5',
      padding: 10,
      marginVertical: 8,
      borderRadius: 8,
    },
  });