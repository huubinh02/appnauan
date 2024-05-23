import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AdminScreen = ({ navigation }) => {
    const handleUnapprovedFoods = () => {
        navigation.navigate('Approve');
    };

    const handleApprovedFoods = () => {
        navigation.navigate('ApprovedFoodsScreen');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.item} onPress={handleUnapprovedFoods}>
                <Text style={styles.text}>Danh sách món ăn chưa duyệt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={handleApprovedFoods}>
                <Text style={styles.text}>Danh sách món ăn đã duyệt</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    item: {
        width: '80%',
        height: 50,
        marginBottom: 20,
        backgroundColor: '#FFB90F',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default AdminScreen;
