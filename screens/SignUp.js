import React, { useState } from 'react';
import { View, StyleSheet, Alert, Pressable, Text, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passrp, setPassrp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleSignUp = async () => {
        if (password === passrp) {
            try {
                const { user } = await auth().createUserWithEmailAndPassword(email, password);
                await firestore().collection('users').doc(user.email).set({
                    email: user.email,
                    age: '0',
                    address: 'abc',
                    role: 'user'
                });
                Alert.alert('Thông báo', 'Đăng ký thành công!');
                navigation.navigate("Login");


            } catch (error) {
                // console.error('Error creating user: ', error);
                // Alert.alert('Error', 'An error occurred while creating the user');
                console.log(error)
            }
        } else {
            //   Alert.alert('Error', 'Passwords do not match');
        }
    };
    const img = "https://png.pngtree.com/template/20190522/ourmid/pngtree-cooking-logo-design-inspiration-image_202856.jpg"
    return (
        <View style={{ flex: 1, height: '100%', justifyContent: "center", alignContent: "center", backgroundColor: 'white', paddingBottom:80 }}>
            <Image
                style={styles.Logo}
                source={{
                    uri: img,
                }}
            />
            <Text style={{ fontSize: 30, fontWeight: "bold", alignSelf: "center", color: "#FFB90F" }}>
                SIGNUP
            </Text>
            <TextInput
                style={styles.textInput}
                label="Email*"
                value={email}
                onChangeText={(email) => setEmail(email)}
                underlineColor='transparent'
            />
            <TextInput
                style={styles.textInput}
                label="Mật khẩu*"
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry={!showPassword}
                right={<TextInput.Icon icon={showPassword ? 'eye' : 'eye-off'} onPress={toggleShowPassword} />}
                underlineColor='transparent'
            />
            <TextInput
                style={styles.textInput}
                label="Nhập lại mật khẩu*"
                value={passrp}
                onChangeText={(passrp) => setPassrp(passrp)}
                secureTextEntry={!showPassword}
                right={<TextInput.Icon icon={showPassword ? 'eye' : 'eye-off'} onPress={toggleShowPassword} />}
                underlineColor='transparent'
            />
            <View style={{ justifyContent: 'center', padding: 10 }}>
                <Pressable
                    style={styles.textButton}
                    onPress={handleSignUp}>
                    <Text style={{alignSelf: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Đăng Ký</Text>
                </Pressable>
            </View>
            <Pressable
                onPress={() => navigation.navigate('Login')}
                style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    marginRight: 10,
                    padding: 10,
                }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#FFB90F' }}>
                    Quay lại đăng nhập
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    textInput: {
        margin: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    textButton: {
        margin: 1,
        padding: 15,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: '#FFB90F',
    },
    Logo: {
        width: 100,
        height: 300,
        marginBottom: 1,
        alignSelf: 'center',
        marginBottom: -20,

    },
})

export default SignUp;
