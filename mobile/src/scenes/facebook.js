import * as React from 'react';
import { Text, View, StyleSheet, Button, Image } from 'react-native';
import * as Facebook from 'expo-facebook';

export default function App({navigation}) {
  const [img, setIMG] = React.useState('')
    async function logIn() {
        try {
          await Facebook.initializeAsync('2711903542192608', 'host.exp.Exponent');
          const {
            type,
            token,
            expires,
            permissions,
            declinedPermissions,
            
          } = await Facebook.logInWithReadPermissionsAsync('2711903542192608',{
            permissions: ['public_profile', 'email', 'user_link']
          });
          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            //console.log(expires, permissions, declinedPermissions)
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,email,name,birthday,picture.type(large)`);
            setIMG((await response.json()).picture.data.url)
            console.log((await response.json()).picture.data.url)
            alert('Logged in! '+`Hi ${(await response.json())}!`);
          } else {
             //console.log(type)
          }
        } catch ({ message }) {
          alert(`Facebook Login: ${message}`);
        }
      }
      

    return (
      <View style={styles.container}>
        <Button onPress={() => logIn()} title="Login" />
        {img != '' ? <Image style={{borderWidth: 1, borderRadius: 100, height: 200, width: 200, alignSelf: 'center'}} source={{uri: img}} /> : <View/>}
        
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
