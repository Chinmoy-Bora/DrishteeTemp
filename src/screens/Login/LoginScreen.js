// import React, { useState } from 'react';
// import { View, StatusBar, Text, TextInput, TouchableOpacity, Image, Alert, Linking, SafeAreaView } from 'react-native';
// import { Checkbox } from 'expo-checkbox';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import * as SecureStore from 'expo-secure-store';
// import styles from './LoginScreenStyle';
// import CardView from '../../components/CardView';
// import LoadingPopup from '../../components/LoadingPopup';
// import { handleLogin } from './loginApi'; // Import the handleLogin function
// import { PRIVACY_POLICY_URL, FORGOT_PASSWORD_URL } from '@env';
// import { CommonActions } from '@react-navigation/native';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isPasswordVisible, setPasswordVisibility] = useState(false);
//   const [isSelected, setSelection] = useState(false);
//   const [errors, setErrors] = useState({ email: false, password: false, checkbox: false });
//   const [loading, setLoading] = useState(false);

//   const togglePasswordVisibility = () => setPasswordVisibility(!isPasswordVisible);

//   const validateInputs = () => {
//     const emailValid = !!email;
//     const passwordValid = !!password;
//     const checkboxValid = isSelected;
//     setErrors({ email: !emailValid, password: !passwordValid, checkbox: !checkboxValid });

//     return emailValid && passwordValid && checkboxValid;
//   };

//   const handleLoginPress = async () => {
//     if (!validateInputs()) return;
//     setLoading(true);

//     try {
//       const response = await handleLogin(email, password);

//       if (response.success) {
//         console.log("Merged Data", response.data);

//         navigation.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [{ name: 'Tab' }],
//           })
//         );
//       } else {
//         Alert.alert('Login Failed', response.message || 'Please enter a valid username and password', [{ text: 'OK' }]);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred. Please try again.', [{ text: 'OK' }]);
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openLink = async (url, errorMsg) => {
//     try {
//       await Linking.openURL(url);
//     } catch (error) {
//       console.error(errorMsg, error);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1,backgroundColor:"#000" }}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
//     <View style={styles.container}>
//       <Image source={require('../../assets/loginbgi.png')} style={styles.backgroundImage} />
//       <View style={styles.logoContainer}>
//         <Image source={require('../../assets/logo.png')} style={styles.logo} />
//       </View>
//       <View style={styles.overlay} />
//       <CardView>

//         <Text style={styles.title}>
//           Bring smile to <Text style={styles.highlight}>each</Text> family!
//         </Text>
        
//         <TextInput
//           style={styles.input}
//           placeholder="drishtee@gmail.com"
//           placeholderTextColor="#aaa"
//           value={email}
//           onChangeText={(text) => { setEmail(text); setErrors(prev => ({ ...prev, email: false })); }}
//         />
//         {errors.email && <Text style={styles.warnText}>Enter a valid email</Text>}

//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             placeholderTextColor="#aaa"
//             secureTextEntry={!isPasswordVisible}
//             value={password}
//             onChangeText={(text) => { setPassword(text); setErrors(prev => ({ ...prev, password: false })); }}
//           />
//           <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
//             <Icon name={isPasswordVisible ? 'visibility-off' : 'visibility'} size={24} color="#aaa" />
//           </TouchableOpacity>
//         </View>
//         {errors.password && <Text style={styles.warnText2}>Enter a valid password</Text>}

//         <View style={styles.checkboxContainer}>
//           <Checkbox
//             value={isSelected}
//             onValueChange={setSelection}
//             style={styles.checkbox}
//           />
//           <View style={styles.checkboxtextcontain}>
//             <Text style={styles.checkboxLabel}>I accept to all </Text>
//             <TouchableOpacity onPress={() => openLink(PRIVACY_POLICY_URL, "Failed to open privacy policy link")}>
//               <Text style={styles.checkboxLabel1}>terms and conditions</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         {errors.checkbox && <Text style={styles.warnText3}>You must accept the terms and conditions</Text>}

//         <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
//           <Text style={styles.loginButtonText}>Login</Text>
//           <LoadingPopup visible={loading} message="Logging in..." />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => openLink(FORGOT_PASSWORD_URL, "Failed to open forgot password link")}>
//           <Text style={styles.forgotPassword}>Forgot password?</Text>
//         </TouchableOpacity>

//       </CardView>
//     </View>
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;


import React, { useState } from 'react';
import { View, StatusBar, Text, TextInput, TouchableOpacity, Image, Alert, Linking, SafeAreaView } from 'react-native';
import Checkbox from 'expo-checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as SecureStore from 'expo-secure-store';
import styles from './LoginScreenStyle';
import CardView from '../../components/CardView';
import LoadingPopup from '../../components/LoadingPopup';
import { handleLogin } from '../../services/authServices'; // Updated import path for handleLogin
import { PRIVACY_POLICY_URL, FORGOT_PASSWORD_URL } from '@env';
import { CommonActions } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false, checkbox: false });
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisibility(!isPasswordVisible);

  const validateInputs = () => {
    const emailValid = !!email;
    const passwordValid = !!password;
    const checkboxValid = isSelected;
    setErrors({ email: !emailValid, password: !passwordValid, checkbox: !checkboxValid });

    return emailValid && passwordValid && checkboxValid;
  };

  const handleLoginPress = async () => {
    if (!validateInputs()) return;
    setLoading(true);

    try {
      const response = await handleLogin(email, password);

      if (response.success) {
        console.log("Merged Data", response.data);

        // Navigate to home or main tab screen
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Tab' }],
          })
        );
      } else {
        Alert.alert('Login Failed', response.message || 'Please enter a valid username and password', [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.', [{ text: 'OK' }]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openLink = async (url, errorMsg) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error(errorMsg, error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        <Image source={require('../../assets/loginbgi.png')} style={styles.backgroundImage} />
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <View style={styles.overlay} />
        <CardView>

          <Text style={styles.title}>
            Bring smile to <Text style={styles.highlight}>each</Text> family!
          </Text>

          <TextInput
            style={styles.input}
            placeholder="drishtee@gmail.com"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={(text) => { setEmail(text); setErrors(prev => ({ ...prev, email: false })); }}
          />
          {errors.email && <Text style={styles.warnText}>Enter a valid email</Text>}

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={(text) => { setPassword(text); setErrors(prev => ({ ...prev, password: false })); }}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Icon name={isPasswordVisible ? 'visibility-off' : 'visibility'} size={24} color="#aaa" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.warnText2}>Enter a valid password</Text>}

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={isSelected}
              onValueChange={setSelection}
              style={styles.checkbox}
            />
            <View style={styles.checkboxtextcontain}>
              <Text style={styles.checkboxLabel}>I accept to all </Text>
              <TouchableOpacity onPress={() => openLink(PRIVACY_POLICY_URL, "Failed to open privacy policy link")}>
                <Text style={styles.checkboxLabel1}>terms and conditions</Text>
              </TouchableOpacity>
            </View>
          </View>
          {errors.checkbox && <Text style={styles.warnText3}>You must accept the terms and conditions</Text>}

          <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
            <Text style={styles.loginButtonText}>Login</Text>
            <LoadingPopup visible={loading} message="Logging in..." />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openLink(FORGOT_PASSWORD_URL, "Failed to open forgot password link")}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>

        </CardView>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
