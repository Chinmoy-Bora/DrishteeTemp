import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const ExpensePieChart = ({ data = {}, selectedTab,onSliceClick , OnOutsideClicked}) => {

  console.log("Data",data)
  
  const totalExpense = (data?.['Travel']?.[selectedTab]?.totalAmount || 0) + 
                       (data?.['Local']?.[selectedTab]?.totalAmount || 0) + 
                       (data?.['Other']?.[selectedTab]?.totalAmount || 0);
      
    

  const [selectedData, setSelectedData] = useState({ label: 'Total Expense', value: totalExpense });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showTravelCard, setShowTravelCard] = useState(false);
  
  useEffect(() => {
    setSelectedData({ label: 'Total Expense', value: totalExpense });
    setShowTravelCard(false);
  }, [totalExpense]); 

  
  const animatedRadius = useRef(new Animated.Value(90)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const animatedLegendHighlight = useRef(new Animated.Value(1)).current;

  
  const pieData = [
    {
      value: data?.['Travel']?.[selectedTab]?.totalAmount || 0.01,
      color: '#177AD5',
      gradientCenterColor: '#006DFF',
      label: 'Travel',
    },
    {
      value: data?.['Local']?.[selectedTab]?.totalAmount || 0.01,
      color: '#79D2DE',
      gradientCenterColor: '#3BE9DE',
      label: 'Local',
    },
    {
      value:data?.['Other']?.[selectedTab]?.totalAmount || 0.01,
      color: '#ED6665',
      gradientCenterColor: '#FF7F97',
      label: 'Other',
    },
  ];

  
  const animateSelection = (isSelected) => {
    Animated.timing(animatedRadius, {
      toValue: isSelected ? 100 : 90,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedOpacity, {
      toValue: isSelected ? 0.5 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedLegendHighlight, {
      toValue: isSelected ? 1.2 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSlicePress = (item, index) => {
    setSelectedData({ label: item.label, value: item.value });
    setSelectedIndex(index);
    animateSelection(true);
    onSliceClick(item)

    if (item.label === 'Travel') {
      setShowTravelCard(true);
    } else {
      setShowTravelCard(false);
    }
  };

  const handleOutsidePress = () => {
    setSelectedData({ label: 'Total Expense', value: totalExpense });
    setSelectedIndex(null);
    animateSelection(false); 
    setShowTravelCard(false);
    OnOutsideClicked();
  };

  const renderDot = (color) => <View style={[styles.dot, { backgroundColor: color }]} />;

  const renderLegend = () => (
    <View style={styles.legendContainer}>
      {pieData?.map((item, index) => {
        const isSelected = selectedIndex === index;

        return (
          <Animated.View
            key={index}
            style={[
              styles.legendItem,
              isSelected && {
                backgroundColor: '#e0f7fa',
                transform: [{ scale: animatedLegendHighlight }],
              },
            ]}
          >
            {renderDot(item.color)}
            <Text style={[styles.legendText, isSelected && styles.selectedLegendText]}>
              {item.label}: ₹{item.value===0.01 ? 0 : item.value}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );

  const calculatePercentage = (amount, total) => {
    if (total === 0) return 0;
    return ((amount / total) * 100).toFixed(1);
  };
  const renderTravelCard = () => {
    if (!showTravelCard || !data?.Travel) return null;
  
    const totalAmount = data?.['Travel']?.[selectedTab]?.totalAmount || 0;
    const individualExpenses = data?.['Travel']?.[selectedTab]?.individualExpenses || {};

    console.log("Travel",individualExpenses)
  
    
    const expenseCategories = [
      { label: 'Food', icon: require('../../assets/Expense/breakfast.png') },
      { label: 'Accommodation', icon: require('../../assets/Expense/office.png') },
      { label: 'Conveyance', icon: require('../../assets/Expense/taxi.png') },
      { label: 'Other', icon: require('../../assets/Expense/other.png') },
    ];
  
    return (
      <View style={styles.cardContainer}>
        {expenseCategories.map((category, index) => {
          const amount = individualExpenses[category.label]?.totalAmount || 0;
          const percentage = calculatePercentage(amount, totalAmount);
  
          return (
            <View key={index} style={styles.cardRow}>
              <Image source={category.icon} style={styles.icon} />
              <Text style={styles.expenseLabel}>{category.label}</Text>
              <View style={styles.percentageRow}>
                <Text style={styles.expensePercentage}>{percentage}%</Text>
                <Text style={styles.expenseAmount}>₹{amount.toFixed(2)}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  

  return (
    <TouchableOpacity style={styles.container} onPress={handleOutsidePress} activeOpacity={1}>
      <Text style={styles.title}>Expense Distribution</Text>
      <View style={styles.pieContainer}>
        <Animated.View style={{ transform: [{ scale: animatedRadius.interpolate({
            inputRange: [90, 100],
            outputRange: [1, 1.1], 
          }) }] }}>
          <PieChart
            data={pieData}
            donut
            showGradient
            sectionAutoFocus
            radius={90}
            innerRadius={60}
            innerCircleColor={'#232B5D'}
            onPress={handleSlicePress}
            centerLabelComponent={() => (
              <View style={styles.centerLabel}>
                <Text style={styles.centerValue}>₹{selectedData.value===0.01 ? 0 : selectedData.value}</Text>
                <Text style={styles.centerLabelText}>{selectedData.label}</Text>
              </View>
            )}
          />
        </Animated.View>
      </View>
      {renderLegend()}
      {renderTravelCard()}
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
  },
  title: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  pieContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerValue: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  centerLabelText: {
    fontSize: 14,
    color: 'white',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize:12
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  selectedLegendText: {
    color: '#177AD5',
    fontWeight: 'bold',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginVertical: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  expenseLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expensePercentage: {
    fontSize: 14,
    color: '#555',
    marginRight: 10,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ExpensePieChart;
