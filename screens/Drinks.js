import 'react-native-gesture-handler';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconMT from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFirestore, collection, query, onSnapshot } from '@react-native-firebase/firestore';
import { createStackNavigator } from '@react-navigation/stack';
import AddFoods from './Add';
import { Searchbar } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-virtualized-view';
import { MyContextControllerProvider, useMyContextController, MyContext } from '../context';
import auth from '@react-native-firebase/auth';

const Foods = ({ navigation }) => {
    const currentUser = auth().currentUser
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const userEmail = currentUser ? currentUser.email : null;
    const [foods, setFoods] = useState([]);
    const [foodsList, setfilterFoods] = useState([]);
    const { login } = useMyContextController();
    const [showLike, setShowLike] = useState(false);
    const toggleShowLike = () => {
        setShowLike(!showLike);
    };

    


    useEffect(() => {
        if (currentUser) {
            console.log(currentUser.email);
        }
    }, [currentUser]);
    const onAuthStateChanged = user => {
        setUser(user);
        if (initializing) setInitializing(false);
    };
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);
    const db = getFirestore();
    useEffect(() => {
        Icon.loadFont();
    
        const foodsRef = collection(db, 'foods');
        const unsubscribe = onSnapshot(query(foodsRef), (querySnapshot) => {
            const foodsList = [];
            if (querySnapshot) {
                querySnapshot.forEach((doc) => {
                    if (doc && doc.data() && doc.data().category === "Đồ uống" && doc.data().email === userEmail) {
                        const foodsData = { ...doc.data(), id: doc.id };
                        foodsList.push(foodsData);
                    }
                });
            }
    
            setFoods(foodsList);
            setfilterFoods(foodsList);
        });
        return () => unsubscribe();
    }, [db]);
    


    const handleSearch = (query) => {
        const filterData = foods.filter((food) =>
            food.name.toLowerCase().includes(query.toLowerCase())
        );
        setfilterFoods(filterData);
    };
    const handleDetails = (foods) => {
        navigation.navigate('FoodsDetail', {
            name: foods.name,
            ingredient: foods.ingredient,
            instruct: foods.instruct,
            imageUrl: foods.imageUrl,
          
        },{ foods });
    };
  
    const handleDelete = (itemId) => {
        Alert.alert(
            'Xác nhận xoá',
            'Bạn có chắc chắn muốn xoá không?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',

                },
                {
                    text: 'Xoá',
                    onPress: async () => {
                        try {
                            await db.collection('foods').doc(itemId).delete();
                            Alert.alert("Thông báo !", "Món đã được xóa thành công!")

                        } catch (error) {
                            console.error('Lỗi khi xóa món:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };
    const handleEdit = (itemId, category ) => {
        navigation.navigate('EditFoods', { foodId: itemId, category });
    };

    return (
        <View style={{ backgroundColor: '#fff', height:'100%' }}>
            <View style={{ width: "95%", alignItems: 'center', alignSelf: 'center', margin: 10 }}>
                <Searchbar
                    style={{
                        ...styles.item,
                        padding: 2,
                        backgroundColor: 'transparent',
                        margin: 0,
                        height: 60,
                        justifyContent: 'center',
                    }}
                    placeholder="Tìm kiếm..."
                    onChangeText={handleSearch}
                />
            </View>
            <View style={styles.container}>
                <View>
                    <Text style={{ fontWeight: 'bold', color: '#FF6666', fontSize: 22 }}>Hôm Nay Bạn Uống Gì?</Text>
                </View>
               <TouchableOpacity onPress={() => navigation.navigate('AddFoods')}>
                    <Text>
                        <Icon name="playlist-add" size={35} color="#20B2AA" />
                    </Text>
                </TouchableOpacity>

            </View>
            <ScrollView>
                <FlatList
                    style={{ marginBottom: 150 }}
                    data={foodsList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', margin: 5 }}>
                            <View style={styles.item}>
                                <TouchableOpacity onPress={() => handleDetails(item)}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                            {item.imageUrl !== "" ? (<Image source={{ uri: item.imageUrl }}
                                                style={{
                                                    width: 120,
                                                    height: 135,
                                                    objectFit: 'cover',
                                                    borderRadius: 20
                                                }} />) : null}
                                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF6666', flexWrap: 'wrap', width: 150 }}>{item.name}</Text>
                                            </View>

                                        </View>
                                       
                                     

                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                                                <TouchableOpacity
                                                    style={{ padding: 5, backgroundColor: 'green', borderRadius: 100, margin: 5 }}
                                                    onPress={() => handleEdit(item.id)}>
                                                    <Icon name="edit" size={24} color="#fff" />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{ padding: 5, backgroundColor: 'red', borderRadius: 100, margin: 5 }}
                                                    onPress={() => handleDelete(item.id)}>
                                                    <Icon name="delete" size={24} color="#fff" />
                                                </TouchableOpacity>
                                            </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    item: {
        width: '100%',
        borderWidth: 1,
        padding: 5,
        height: 155,
        borderColor: '#FFB90F',
        borderRadius: 20,
        justifyContent: 'center'
    }
});
export default Foods;


