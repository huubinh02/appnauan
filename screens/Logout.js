import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useMyContextController } from '../context';

const Logout = ({ navigation }) => {
    const [, , logout] = useMyContextController();

    const handleLogout = async () => {
        try {
            await auth().signOut(); 
            navigation.navigate('Login');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.textButton}
                onPress={handleLogout}>
                <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Đăng Xuất</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    textButton: {
        margin: 1,
        padding: 15,
        borderRadius: 20,
        backgroundColor: '#FFB90F',
    },
});

export default Logout;
