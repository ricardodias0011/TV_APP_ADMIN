import React, { useEffect, useRef, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Dimensions, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { Theme } from '../../../../theme';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

import { collection, doc, setDoc } from "firebase/firestore";
import SelectDropdown from 'react-native-select-dropdown'
import Toast from 'react-native-toast-message';
import { API_KEY_GOOGLE, FILE_URL_GOOLE, LinkIMGSTDBM } from '../../../utils';
import { dbFirestor } from '../../../services/firebase';
import { MovieTypes } from '../../../types/movie';

const distributions = [
    { id: 'Nenhum', title: 'Nenhum' },
    { id: 'Marvel', title: 'Marvel' },
    { id: 'DC', title: 'DC' },
    { id: 'DreamWorks ', title: 'DreamWorks ' }
]

interface DetailContent {
    open: boolean;
    handleClose: () => void;
    content: MovieTypes;
}

const Details = (props: DetailContent) => {
    const { open, handleClose, content } = props;

    const [movieURL, setMovieURL] = useState("")
    const [loading, setLoading] = useState(false);

    const [distributed, setDistributed] = useState<string | null>(null);

    const CatalogRef = collection(dbFirestor, "catalog");

    const HandleSubmitFilme = async () => {
        setLoading(true)
        const idPattern = /\/d\/([^/]+)\//;
        const match = movieURL.match(idPattern);
        if (match && match.length > 1) {
            try {
                const fileId = match
                console.log(fileId)
                const FILEURL = FILE_URL_GOOLE + fileId[1] + API_KEY_GOOGLE
                await setDoc(doc(CatalogRef), {
                    ...content,
                    url: FILEURL,
                    title_lowercase: content.title?.toLowerCase(),
                    createdAt: new Date(),
                    distributed: (distributed && distributed !== 'Nenhum') ? distributed : ""
                })
                Toast.show({
                    type: 'success',
                    text1: 'Sucesso!',
                    text2: "O Filme foi postado com sucesso!"
                });
                setMovieURL("")
                handleClose();

            } catch (err) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: "Upload error!"
                });
            }
            finally {
                setLoading(false)
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Success'
            });
        }
    }

    const posterURL = `${LinkIMGSTDBM[500]}${content?.poster_path}`;
    return (
        <Modal
            animationType="fade"
            visible={open}
            transparent={true}
            onRequestClose={() => handleClose()}>
            <ScrollView>
            <View style={[styles.centeredView, { backgroundColor: Theme.bgcolor }]}>
                    <View style={styles.modalView}>
                        <Image source={{ uri: posterURL }} style={{ width: 150, height: 200, borderRadius: 10 }} />
                        <View style={styles.contentContainer}>
                            <Text style={styles.detailTitle}>{content?.title}</Text>
                            <Text style={[styles.detailSubTitle, { color: Theme.gray[100] }]}>
                            {new Date(content?.release_date as string).toLocaleDateString()}
                        </Text>
                            <Text style={styles.detailSubTitle}>{content?.overview}</Text>
                        </View>
                        <TextInput
                            value={movieURL}
                            onChangeText={val => setMovieURL(val)}
                            placeholderTextColor={Theme.gray[400]}
                            style={styles.inputText}
                            selectionColor={Theme.primary}
                            placeholder='LINK DO FILME NO GOOGLE DRIVE'
                        />
                        <SelectDropdown
                        data={distributions}
                        onSelect={(selectedItem, index) => {
                            setDistributed(selectedItem?.id);
                          }}
                          renderButton={(selectedItem, isOpened) => {
                            return (
                              <View style={styles.dropdownButtonStyle}>
                                <Text style={styles.dropdownButtonTxtStyle}>
                                  {(selectedItem && selectedItem.title && selectedItem.title !== 'Nenhum') ? selectedItem.title : 'Distribuidor'}
                                </Text>
                              </View>
                            );
                          }}
                          renderItem={(item, index, isSelected) => {
                            return (
                              <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                              </View>
                            );
                          }}
                          showsVerticalScrollIndicator={false}
                          dropdownStyle={styles.dropdownMenuStyle}
                        >

                        </SelectDropdown>
                        <TouchableOpacity
                            disabled={(loading || !movieURL)}
                            onPress={HandleSubmitFilme} style={[styles.btnFilm, { backgroundColor: (loading || !movieURL) ? Theme.gray[600] : Theme.primary }]}>
                            {(loading) ? <ActivityIndicator /> : <Text style={styles.btnFilmText}>Postar filme</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleClose} style={[styles.btnFilm, { backgroundColor: Theme.text }]}>
                            <Text style={[styles.btnFilmText, { color: Theme.primary }]}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width
    },
    dropdownButtonStyle: {
        width: 300,
        height: 50,
        backgroundColor: Theme.gray[600],
        borderRadius: 2,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
      },
    modalView: {
        margin: 20,
        backgroundColor: Theme.bgcolor,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minWidth: Dimensions.get('screen').width * .7,
        minHeight: Dimensions.get('screen').height * .7,
        justifyContent: 'center'
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: Theme.text,
      },
    contentPlayContainer: {
        width: '100%',
        height: Dimensions.get('window').height * .5,
        position: 'relative'
    },
    contentContainer: {
        padding: 10
    },
    detailSubTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Theme.gray[400],
        marginTop: 10
    },
    detailTitle: {
        fontSize: 27,
        fontWeight: 'bold',
        color: Theme.primary
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    backdropImage: {
        width: '100%',
        height: '100%'
    },
    playBTN: {
        position: 'absolute',
        zIndex: 10,
        top: '50%',
        left: '50%',
        transform: [{ translateX: -40 }, { translateY: -40 }]
    },
    inputText: {
        padding: 15,
        minWidth: 300,
        maxWidth: 330,
        marginTop: 15,
        width: "100%",
        borderRadius: 5,
        backgroundColor: Theme.gray[600],
        color: 'white'
    },
    btnFilmText: {
        color: 'white',
        textAlign: 'center'
    },
    btnFilm: {
        padding: 15,
        minWidth: 300,
        marginTop: 15,
        width: "100%",
        borderRadius: 5,
        backgroundColor: Theme.primary,
        color: 'white'
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
      },
      dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
      dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
      },
      dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
      },
      dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
      },
      dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
});

export default Details;
