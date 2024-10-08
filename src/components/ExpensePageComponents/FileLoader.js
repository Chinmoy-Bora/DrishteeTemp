import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text, Alert, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import theme from "../../utils/theme";

const FileLoader = ({ onUpload, error, initialFiles = [],documentToken,isUpdateMode = false }) => {
  const initializeUploadedFiles = (files) => {
    const filledArray = [...files]; // Copy initialFiles array
    while (filledArray.length < 4) {
      filledArray.push(null); // Fill with null until the array has 4 items
    }
    return filledArray;
  };

  const [uploadedFiles, setUploadedFiles] = useState(
    initializeUploadedFiles(initialFiles)
  );
  const [showPickerOptions, setShowPickerOptions] = useState(false);
  const [fileIndex, setFileIndex] = useState(null);
  const [compressedFileSize, setCompressedFileSize] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); 
  const [pdfPreview, setPdfPreview] = useState(null);
  
  const addTokenToUri = (uri) => {
    return isUpdateMode && documentToken ? `${uri}?${documentToken}` : uri;
  };
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      } else {
        console.log('Permission granted');
      }
    })();
  }, []);

  const handleFileUpload = async (type) => {
    setShowPickerOptions(false);
    
    console.log('File upload type selected:', type);
  
    try {
      if (type === 'photo' || type === 'camera') {
        const pickerResult = type === 'photo'
          ? await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 })
          : await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
  
        console.log('Picker result:', pickerResult);
  
        if (!pickerResult.canceled) {
          const { uri } = pickerResult.assets[0];
          console.log('Selected image URI:', uri);
  
          let compressedUri = uri;
          let compressedImageSize = await fetch(compressedUri).then(res => res.blob()).then(blob => blob.size);
          console.log('Initial image size (KB):', compressedImageSize / 1024);
  
          // Compress the image until it's below 300KB
          let compressionQuality = 0.7; // start with 70% quality
          while (compressedImageSize / 1024 > 300 && compressionQuality > 0.1) {
            const result = await ImageManipulator.manipulateAsync(
              uri,
              [],
              { compress: compressionQuality, format: ImageManipulator.SaveFormat.JPEG }
            );
            compressedUri = result.uri;
            compressedImageSize = await fetch(compressedUri).then(res => res.blob()).then(blob => blob.size);
            console.log(`Compressed image size (KB) at ${compressionQuality * 100}% quality:`, compressedImageSize / 1024);
            compressionQuality -= 0.1; // reduce quality by 10% each iteration
          }
  
          if (compressedImageSize / 1024 > 300) {
            console.log('Could not compress image below 300KB');
          } else {
            console.log('Final compressed image size (KB):', compressedImageSize / 1024);
          }
  
          const updatedFiles = [...uploadedFiles];
          updatedFiles[fileIndex] = compressedUri;
          setUploadedFiles(updatedFiles);
          onUpload(updatedFiles);
        }
      } else if (type === 'pdf') {
        console.log('Opening document picker for PDF');
        const documentResult = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true });
        console.log('Document picker result:', documentResult);
  
        if (!documentResult.canceled && documentResult.assets && documentResult.assets.length > 0) {
          const pdfUri = documentResult.assets[0].uri;
          console.log('Selected PDF URI:', pdfUri);
  
          const updatedFiles = [...uploadedFiles];
          updatedFiles[fileIndex] = pdfUri;
          setUploadedFiles(updatedFiles);
          onUpload(updatedFiles);
        } else {
          console.log('PDF selection was canceled or unsuccessful');
        }
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      Alert.alert('Error', error.message);
    }
  };
  
  
  

  const renderFilePreview = (fileUri) => {
    const uriWithToken = addTokenToUri(fileUri);
    if (fileUri.endsWith('.pdf')) {
      return (
        <View style={styles.pdfContainer}>
          <FontAwesome name="file-pdf-o" size={40} color="#FF0000" />
          <Text style={styles.fileNameText}>PDF</Text>
        </View>
      );
    } else {
      return <Image source={{ uri: uriWithToken }} style={styles.uploadedImage} resizeMode="cover" />;
    }
  };

  return (
    <View>
      <View style={styles.uploadContainer}>
        {uploadedFiles.map((file, index) => (
          <View key={index} style={styles.uploadBoxContainer}>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => {
                if (file) {
                  setImagePreview(file); // Show the image in preview modal
                } else {
                  setFileIndex(index);
                  setShowPickerOptions(true);
                }
              }}
            >
              {file ? (
                renderFilePreview(file)
              ) : (
                <FontAwesome name="plus" size={50} color="#ccc" />
              )}
            </TouchableOpacity>
            {file && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  const updatedFiles = [...uploadedFiles];
                  updatedFiles[index] = null;
                  setUploadedFiles(updatedFiles);
                  onUpload(updatedFiles);
                }}
              >
                <FontAwesome name="times-circle" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {error && (
        <Text style={styles.errorText}>
          Please upload at least one file.
        </Text>
      )}

      {/* Modal for selecting file type */}
      <Modal
        transparent={true}
        visible={showPickerOptions}
        animationType="slide"
        onRequestClose={() => setShowPickerOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPickerOptions(false)}
            >
              <FontAwesome name="times" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Choose one</Text>

            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => handleFileUpload('photo')}
            >
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../assets/Expense/photo.png')}
                  style={styles.iconImage}
                />
              </View>
              <Text style={styles.optionText}>Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => handleFileUpload('camera')}
            >
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../assets/Expense/camera.png')}
                  style={styles.iconImage}
                />
              </View>
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => handleFileUpload('pdf')}
            >
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../assets/Expense/pdf.png')}
                  style={styles.iconImage}
                />
              </View>
              <Text style={styles.optionText}>PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for showing image preview */}
      <Modal
        transparent={true}
        visible={!!imagePreview}
        animationType="fade"
        onRequestClose={() => setImagePreview(null)}
      >
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            style={styles.previewCloseButton}
            onPress={() => setImagePreview(null)}
          >
            <FontAwesome name="times" size={24} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri:  isUpdateMode  ? `${imagePreview}?${documentToken}` : imagePreview }} style={styles.fullImagePreview} resizeMode="contain" />
        </View>
      </Modal>
      
    </View>
  );
};

const styles = StyleSheet.create({
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  uploadBoxContainer: {
    position: 'relative',
  },
  uploadBox: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: theme.colors.borderOne,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  pdfContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  fileNameText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.fonts.fontFive,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: theme.colors.tertiary,
    borderRadius: 15,
    padding: 5,
    zIndex: 10,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: theme.colors.borderOne,
  },
  iconContainer: {
    marginRight: 15,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  fullImagePreview: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
  },
});

export default FileLoader;
