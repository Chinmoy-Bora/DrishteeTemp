import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import theme from '../../utils/theme';

const NotificationCardView = () => {
  const notifications = [
    {
      id: 1,
      message: 'Your order has been shipped!',
      description: 'Your order #12345 has been shipped and is on its way.',
      from: 'Amazon',
      date: '2024-08-14',
      time: '10:00 AM',
      icon: require('../../assets/info.png'),
    },
    {
      id: 2,
      message: 'New message from John Doe',
      description: 'John Doe: "Hey, can we meet up tomorrow?"',
      from: 'John Doe',
      date: '2024-08-14',
      time: '09:30 AM',
      icon: require('../../assets/info.png'),
    },
    {
      id: 3,
      message: 'Your password has been updated',
      description: 'Your account password has been successfully updated.',
      from: 'Security',
      date: '2024-08-13',
      time: '05:00 PM',
      icon: require('../../assets/info.png'),
    },
    {
      id: 4,
      message: 'New comment on your post',
      description: 'Alice: "Great post! Keep it up!"',
      from: 'Alice',
      date: '2024-08-13',
      time: '04:15 PM',
      icon: require('../../assets/info.png'),
    },
    {
      id: 5,
      message: 'You have a new friend request',
      description: 'You received a new friend request from Bob.',
      from: 'Bob',
      date: '2024-08-12',
      time: '02:45 PM',
      icon: require('../../assets/info.png'),
    },
  ];

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <ScrollView
          nestedScrollEnabled={Platform.OS === 'android'} 
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {notifications.map((notification) => (
            <View key={notification.id} style={styles.notification}>
              <View style={styles.header}>
                <View style={styles.headerText}>
                  <Text style={styles.message}>{notification.message}</Text>
                  <Text style={styles.from}>From: {notification.from}</Text>
                </View>
              </View>
              <Text style={styles.description}>{notification.description}</Text>
              <Text style={styles.timestamp}>
                {notification.date} at {notification.time}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '90%',
    alignItems: 'center',
    marginVertical: 10,
  },
  card: {
    width: '100%',
    maxHeight: 250, // Set maxHeight to constrain the height of the card
    padding: 15,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.tertiary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  notification: {
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerText: {
    flexDirection: 'column',
  },
  message: {
    fontSize: 16,
    color: theme.fonts.fontTwo,
    fontWeight: 'bold',
  },
  from: {
    fontSize: 14,
    color: '#555',
  },
  description: {
    fontSize: 14,
    color: theme.fonts.fontSix,
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});

export default NotificationCardView;
