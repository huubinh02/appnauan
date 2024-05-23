import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, Alert, TextInput, Pressable, FlatList } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, collection, onSnapshot, query, addDoc, orderBy, serverTimestamp } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { ScrollView } from 'react-native-virtualized-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconMT from 'react-native-vector-icons/MaterialCommunityIcons';
import auth, { firebase } from '@react-native-firebase/auth';

const FoodsDetail = ({ route }) => {
    const [initializing, setInitializing] = useState(true);
    const { name, ingredient, instruct, imageUrl, foods } = route.params;
    const [status, setStatus] = useState();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState(auth().currentUser);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');
    useEffect(() => {
    // console.log(user.email);
    }, []);
    const HandleLike = async () => {
        try {
            const user = auth().currentUser;
            if (user) {
                const userEmail = user.email;
                const favoritesRef = firestore().collection('favorites');
                await favoritesRef.add({
                    userEmail: userEmail,
                    name: name,
                    imageUrl: imageUrl,
                    ingredient: ingredient,
                    instruct: instruct
                });
                Alert.alert("Thông báo!", "Đã thêm vào yêu thích!")
            } else {
            }
        } catch (error) {
        }
    }

    // Function to handle adding a new comment
    const handleAddComment = async () => {
        try {
            const user = auth().currentUser;
            if (user) {
                const userEmail = user.email;
                const commentData = {
                    userEmail: userEmail,
                    comment: comment,
                    timestamp: firestore.FieldValue.serverTimestamp() // Add timestamp to the comment
                };
                const commentsRef = firestore().collection('comments').doc(name).collection('comments');
                await commentsRef.add(commentData);
                setComment(''); // Clear the comment input after adding
            } else {
                // Handle if user is not logged in
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Function to fetch comments from Firestore
    const fetchComments = async () => {
        try {
            const commentsRef = firestore().collection('comments').doc(name).collection('comments');
            const querySnapshot = await commentsRef.orderBy('timestamp', 'desc').get();
            const fetchedComments = [];
            querySnapshot.forEach(doc => {
                fetchedComments.push({ id: doc.id, ...doc.data() });
            });
            setComments(fetchedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    // Function to handle deleting a comment
    const handleDeleteComment = async (commentId) => {
        try {
            await firestore().collection('comments').doc(name).collection('comments').doc(commentId).delete();
            fetchComments(); // Fetch comments again after deleting
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Function to handle editing a comment
    // const handleEditComment = async (commentId, updatedComment) => {
    //     try {
    //         await firestore().collection('comments').doc(name).collection('comments').doc(commentId).update({ comment: updatedComment });
    //         fetchComments(); // Fetch comments again after editing
    //     } catch (error) {
    //         console.error('Error editing comment:', error);
    //     }
    // };
    const handleEditComment = (commentId, currentComment) => {
        setEditingCommentId(commentId); // Set the id of the comment being edited
        setEditedComment(currentComment); // Set the current comment content to the input field
    };
    // Function to handle updating a comment
    const handleUpdateComment = async (commentId) => {
        try {
            await firestore().collection('comments').doc(name).collection('comments').doc(commentId).update({
                comment: editedComment, // Update the comment with the edited content
            });
            setEditingCommentId(null); // Reset the editing state after updating
            setEditedComment(''); // Clear the edited comment
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };


    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(user => {
            setUser(user);
            if (initializing) setInitializing(false);
        });
        return subscriber;
    }, [initializing]);

    useEffect(() => {
        fetchComments(); // Fetch comments when component mounts
    }, []);

    return (
        <View style={{ backgroundColor: '#fff', height: '100%' }}>
            <ScrollView style={{ height: "89%" }}>
                <Image
                    source={{ uri: imageUrl }}
                    style={{ width: "400", height: 200, borderRadius: 10, margin: 10 }}
                />
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>{name}</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Nguyên liệu:</Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>{ingredient}</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Hướng dẫn thực hiện:</Text>
                    <Text style={{ fontSize: 16, color: 'black' }}> {instruct}</Text>
                </View>

                {/* Display comments */}
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    // Render item function of FlatList with delete and edit buttons
                    renderItem={({ item }) => (
                        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{item.userEmail}</Text>
                            {editingCommentId === item.id ? ( // Render TextInput if the comment is being edited
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 5, marginRight: 10 }}
                                        value={editedComment}
                                        onChangeText={setEditedComment}
                                    />
                                    <Pressable onPress={() => handleUpdateComment(item.id)}>
                                        <Text style={{ color: 'blue' }}>Cập nhật</Text>
                                    </Pressable>
                                </View>
                            ) : (
                                <>
                                    <Text>{item.comment}</Text>
                                    {(user && user.email == item.userEmail ) ? (
                                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                            <Pressable onPress={() => handleDeleteComment(item.id)} style={{ marginRight: 10 }}>
                                                <Text style={{ color: 'red' }}>Xoá</Text>
                                            </Pressable>
                                            <Pressable onPress={() => handleEditComment(item.id, item.comment)}>
                                                <Text style={{ color: 'blue' }}>Chỉnh sửa</Text>
                                            </Pressable>
                                        </View>
                                     ) 
                                    // : user.email != item.userEmail && user.email != 'ntthao6722@gmail.com' ?
                                    //     (
                                    //     <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                    //         <Pressable onPress={() => handleDeleteComment(item.id)} style={{ marginRight: 10 }}>
                                    //             <Text style={{ color: 'red' }}>Thích</Text>
                                    //         </Pressable>
                                    //         <Pressable onPress={() => handleEditComment(item.id, item.comment)}>
                                    //             <Text style={{ color: 'blue' }}>Trả lời</Text>
                                    //         </Pressable>
                                    //     </View>
                                    // )
                                    :user.email == "ntthao6722@gmail.com"?
                                    (
                                       
                                         <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                            {/* <Pressable onPress={() => handleDeleteComment(item.id)} style={{ marginRight: 10 }}>
                                                <Text style={{ color: 'red' }}>Thích</Text>
                                            </Pressable>
                                            <Pressable onPress={() => handleEditComment(item.id, item.comment)}>
                                                <Text style={{ color: 'blue' }}>Trả lời</Text>
                                            </Pressable> */}
                                            <Pressable onPress={() => handleDeleteComment(item.id)} style={{ marginRight: 10 }}>
                                                <Text style={{ color: 'red' }}>Xoá</Text>
                                            </Pressable>
                                        </View>
                                    ):null
                                }
                                </>
                            )}
                        </View>
                    )}
                />



            </ScrollView>
            <View style={{}}>
                {user && user.email !== 'ntthao6722@gmail.com' ? (
                    <TouchableOpacity style={{
                        padding: 15,
                        backgroundColor: '#FFB90F',
                        borderRadius: 15,
                        margin: 10
                    }}
                        onPress={HandleLike}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <IconMT name="heart" size={25} color="#fff" />
                            <Text style={{
                                marginLeft: 5,
                                alignItems: 'center',
                                fontWeight: 'bold',
                                fontSize: 15,
                                color: '#fff',
                                alignSelf: 'center'
                            }}>Thêm vào yêu thích</Text>

                        </View>

                    </TouchableOpacity>
                ) : null}

                {/* Input for adding comments */}
                {user && user.email !== 'ntthao6722@gmail.com' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                    <TextInput
                        style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginRight: 10 }}
                        placeholder="Nhập bình luận..."
                        value={comment}
                        onChangeText={setComment}
                    />
                    <Pressable
                        style={{ padding: 10, backgroundColor: '#FFB90F', borderRadius: 5 }}
                        onPress={handleAddComment}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Gửi</Text>
                    </Pressable>
                </View>
                ) : null}
            </View>
        </View>
    );
};

export default FoodsDetail;
