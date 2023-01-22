import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';


export default function App() {

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(()=>{

    
    (async () =>{
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();

    
    });

  const fallBackToDefaultAuth = () =>{
      console.log('falling back to default password authentication')

    }

  const alertComponent = (title, mess, btnTxt, btnFunc) =>{
      return Alert.alert(title, mess, [
        {
          text: btnTxt,
          onPress: btnFunc
        }
      ]);
    }

  const TwoButtonAlert =() => {
    Alert.alert('Welcome to my app', 'Subscribe to my app', [
      {
        text: 'Back',
        onPress: ()=>console.log('okay cool'),
        style: 'cancel',
      },
      {
        text:'okay',
        onPress: ()=>console.log('pressed'),
        // style: ''
      }
    ])
  }

  //handle biometric auth
  const handleBiometricAuth = async () => {
    //check if phone can handle biometric auth
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // fall back to default authentication if device does not support biometrics
    if (!isBiometricAvailable){
      return alertComponent(
        'Please Enter Your Lock Screen Password or Pin',
        'Biometrics are not supported',
        'OK',
        () => fallBackToDefaultAuth(),
      );
    }

    // check biometric types availble
    let supporttedBiometrics;
    if (isBiometricAvailable){
      supporttedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

      
    }
    // check saved biometrics
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return alertComponent(
        'Biometric Record empty',
        'Biometrics are not supported',
        'OK',
        () => fallBackToDefaultAuth(),
      );
    
    //authenticate with biometrics
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with biometrics',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });

    //log the user in on success
    if (biometricAuth.success){
      TwoButtonAlert()
    }else{
      alertComponent(
        'Operation cancelled ',
        'Login operation was cancelled',
        'Back',
        ()=>console.log('operation cancelled'),
      );
    }
    console.log({isBiometricAvailable});
    console.log({supporttedBiometrics})
    console.log({savedBiometrics});
    console.log({biometricAuth})
  }


  return (
    <View style={styles.container}>
      <Text style={tw`font-bold`}>
        {isBiometricSupported?'Your Device iscompatible': 'Face or FingerPrint Scanner availble'}
        </Text>
        <TouchableHighlight style={{
          height: 60,
          marginTop:50,
        }}>
          <Button title='Login with biometrics'
          color='black'
          onPress={handleBiometricAuth}
          />
        </TouchableHighlight>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
