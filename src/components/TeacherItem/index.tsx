import React, { useState } from 'react';
import { View, Image, Text, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Teacher } from '../../pages/TeacherList';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';
import api from '../../services/api';

interface Props {
  teacher: Teacher;
  favorited: boolean;
}

const TeacherItem: React.FC<Props> = ({ teacher, favorited }) => {
  const [isFavorited, setIsFavorited] = useState(favorited);

  function handleLinkToWhatsapp() {
    createNewConnection();
    Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`);
  }

  function createNewConnection() {
    api.post('/connections', {
      user_id: teacher.id,
    });
  }

  async function handleToggleFavorite() {
    const favorities = await AsyncStorage.getItem('favorites');
    let favoritiesArray = [];
    if (favorities) {
      favoritiesArray = JSON.parse(favorities);
    }

    if (isFavorited) {
      const favoriteIndex = favoritiesArray.findIndex(
        (teacherItem: Teacher) => {
          return teacherItem.id === teacher.id;
        }
      );
      favoritiesArray.splice(favoriteIndex, 1);
      setIsFavorited(false);
    } else {
      favoritiesArray.push(teacher);
      setIsFavorited(true);
    }

    await AsyncStorage.setItem('favorites', JSON.stringify(favoritiesArray));
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image source={{ uri: teacher.avatar }} style={styles.avatar} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.subject}>{teacher.subject}</Text>
        </View>
      </View>

      <Text style={styles.bio}>{teacher.bio}</Text>

      <View style={styles.footer}>
        <Text style={styles.price}>
          Preço/hora {'   '}
          <Text style={styles.priceValue}>{teacher.cost}</Text>
        </Text>

        <View style={styles.buttonsContainer}>
          <RectButton
            onPress={handleToggleFavorite}
            style={[styles.favoriteButton, isFavorited ? styles.favorited : {}]}
          >
            {isFavorited ? (
              <Image source={unfavoriteIcon} />
            ) : (
              <Image source={heartOutlineIcon} />
            )}
          </RectButton>

          <RectButton
            onPress={handleLinkToWhatsapp}
            style={styles.contactButton}
          >
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
        </View>
      </View>
    </View>
  );
};

export default TeacherItem;
