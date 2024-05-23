import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const Reset = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [errorState, setErrorState] = useState('');

    const handleSendPasswordResetEmail = () => {

        auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert('Thông báo', 'Gửi yêu cầu thành công!');
            })
            .catch(error => {
                setErrorState(error.message);
                Alert.alert('Lỗi', 'Không tìm thấy tài khoản!');
            });
    }



    const img = "https://png.pngtree.com/template/20190522/ourmid/pngtree-cooking-logo-design-inspiration-image_202856.jpg"
    return (
        <View style={{ flex: 1, height: '100%', justifyContent: "center", alignContent: "center", backgroundColor: 'white', paddingBottom: 80 }}>
            <Image
                style={styles.Logo}
                source={{ uri: img }}
            />
            <View>
                <TextInput
                    style={styles.textInput}
                    label="Nhập vào Email*"
                    value={email}
                    underlineColor='transparent'
                    onChangeText={email => setEmail(email)}
                />
            </View>

            <View>
                <TouchableOpacity
                    onPress={handleSendPasswordResetEmail}
                    style={styles.textButton}>
                    <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                        Yêu cầu đặt lại mật khẩu
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        marginRight: 10,
                        padding: 10,
                    }}
                >
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#FFB90F' }}>
                        Quay lại đăng nhập
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white'


    },
    textInput: {
        margin: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,

    },
    textButton: {
        margin: 10,
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

export default Reset;
