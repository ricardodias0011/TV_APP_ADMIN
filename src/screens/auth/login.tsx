import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Theme } from '../../../theme';
import { useState } from 'react';

import toastConfig from '../../components/toast';
import useAuth from '../../contexts/auth';
import Toast from 'react-native-toast-message';
import { browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, inMemoryPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';

export default function LoginScreen() {
  const { Authenticate } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    signInWithEmailAndPassword(auth, email?.toLocaleLowerCase()?.replace(' ', ''), password)
    .then((data) => {
      Authenticate(data)
      Toast.show({
        type: 'success',
        text1: 'Login',
        text2: "Login realizado com successo!"
      })
    })
    .catch((err) => {
      console.log(JSON.stringify(err))
      if(err?.code === "auth/invalid-email"){
        Toast.show({
          type: 'error',
          text1: 'Login',
          text2: "Email ou senha inválidos!"
        })
        return
      }
      Toast.show({
        type: 'error',
        text1: 'Login',
        text2: "Error ao realizar login!"
      })
    })
    .finally(() => setLoading(false))
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.containerLogin}>
        <View style={styles.containerLogo}>
          <Image
            style={styles.logo}
            resizeMode='contain'
            source={require("../../assets/images/logoMD.png")}
          />
          <Text style={styles.textLogo}>NEST PLAY</Text>
        </View>

        <View style={styles.inputsConteiner}>
          <TextInput
            value={email}
            onChangeText={(val) => setEmail(val)}
            placeholderTextColor={Theme.gray[400]}
            selectionColor={Theme.secundary}
            placeholder='Email'
            style={styles.inputText}
          />
          <TextInput
            value={password}
            onChangeText={(val) => setPassword(val)}
            placeholderTextColor={Theme.gray[400]}
            placeholder='Senha'
            selectionColor={Theme.secundary}
            style={styles.inputText}
          />
        </View>
        <TouchableOpacity onPress={handleLogin} style={[styles.btnLogin, { backgroundColor: loading ? Theme.gray[600] : Theme.secundary  }]}>
        {loading ? <ActivityIndicator color={Theme.secundary} /> : <Text style={styles.btnloginText}>Entrar</Text>}
        </TouchableOpacity>
      </View>
      <Toast
        config={toastConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.bgcolor,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%'
  },
  inputText: {
    padding: 15,
    minWidth: 300,
    marginTop: 15,
    width: "100%",
    borderRadius: 5,
    backgroundColor: Theme.gray[600],
    color: 'white'
  },
  btnLogin: {
    backgroundColor: Theme.primary,
    width: '100%',
    minWidth: 300,
    padding: 15,
    marginTop: 15,
    borderRadius: 10
  },
  containerLogin: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15
  },
  inputsConteiner: {

  },
  btnloginText: {
    color: 'white',
    textAlign: 'center'
  },
  logo: {
    height: 80,
    width: 80
  },
  containerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  textLogo: {
    color: 'white',
    fontSize: 42,
    fontWeight: '800'
  }
});
