import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Platform, TouchableOpacity, Linking } from 'react-native';
import theme from '../../utils/theme';
import { NOTIFICATION_ACCESS_TOKEN, NOTIFICATION_FOLDER_ID } from '@env';


export default function Notification() {
  const [folderFiles, setFolderFiles] = useState([]);
  const [loading, setLoading] = useState(false);


  async function fetchFolderFiles() {
    setLoading(true);
    try {
      const response = await fetch(
       `https://www.googleapis.com/drive/v3/files?q='${NOTIFICATION_FOLDER_ID}'+in+parents&access_token=${NOTIFICATION_ACCESS_TOKEN}&fields=files(id,name,mimeType,description,modifiedTime)`
      );
      const result = await response.json();
      console.log("Folder files",result)
      setFolderFiles(result.files)
    } catch (error) {
      console.error('Error fetching folder files:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFolderFiles(); 
  }, []);

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('image')) {
      return require('../../assets/imagesfile.png'); // Use your own image icon
    } else if (mimeType.includes('pdf')) {
      return require('../../assets/Expense/pdf.png'); // Use your own pdf icon
    } else {
      return require('../../assets/folder.png'); // Default file icon
    }
  };
  const convertDateTime = (dateString) => {
    const date = new Date(dateString);
  
    // Get day, month, and year in desired format
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero (months are 0-indexed)
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of year
  
    // Get hours and minutes in 24-hour format
    const hours = String(date.getHours()).padStart(2, '0'); // Add leading zero
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Add leading zero
  
    // Combine for date and time separately
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}`;
  
    return { formattedDate, formattedTime };
  };
  

  const handleFilePress = (fileId) => {
    const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
    Linking.openURL(fileUrl).catch(err => console.error("Failed to open URL:", err));
  };
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.secondary} />
        ) : (
          <ScrollView
            nestedScrollEnabled={Platform.OS === 'android'}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {folderFiles?.map((file) => (
              <TouchableOpacity key={file.id} onPress={() => handleFilePress(file.id)}>
                <View style={styles.notification}>
                  <View style={styles.header}>
                    <Image source={getFileIcon(file.mimeType)} style={styles.icon} />
                    <View style={styles.headerText}>
                      <Text style={styles.description}>
                        {file.description || 'No description available'} {/* Show description or fallback text */}
                      </Text>
                      <Text style={styles.fileName}>{file.name}</Text>

                    </View>
                  </View>
                  <View style={styles.datecontainer}>
                  <Text style={styles.date}>{convertDateTime(file.modifiedTime).formattedDate}</Text>
                  <Text style={styles.date}>{convertDateTime(file.modifiedTime).formattedTime}</Text>
                  </View>
                </View> 
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '90%',
    alignItems: 'center',
    backgroundColor:'white',
    shadowColor: theme.colors.backgroundThree,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    
    borderRadius: 10,
    backgroundColor:theme.colors.backgroundFive,
    marginBottom:30
  },
  card: {
    width: '100%',

  },
  datecontainer:{
    flexDirection:'row',
    justifyContent:'space-between',
  },
  notification: {
    alignContent:'center',
    justifyContent:'center',
    verticalAlign:'middle',
    paddingBottom: 10,
    padding: 15,
    borderBottomColor:theme.colors.borderThree,
    borderBottomWidth:0.2,


  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    
    marginRight: 10,
  },
  headerText: {
    flexDirection: 'column',
  },
  description: {
    fontSize: 14,
    fontFamily:'AbhayaLibre-Bold',
    color: theme.fonts.fontThree,
    marginTop: 5,
  },
  fileName: {
    fontSize: 11,
    color: theme.fonts.fontNine,
   fontWeight:'600',
    },
    date:{
      paddingTop:10,
      fontSize: 11,
      color: theme.fonts.fontNine,
     fontWeight:'600',
    }
});