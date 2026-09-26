import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { act, useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ui/ScreenWrapper'
import Typo from '@/components/ui/Typo'
import SegmentControl from '@react-native-segmented-control/segmented-control';
import { colors, radius, spacingX, spacingY } from '@/constants/Theme';
import { scale, verticalScale } from '@/Utilites/Styles';
import Header from '@/components/Header';
import { BarChart } from "react-native-gifted-charts";
import Loading from '@/components/ui/Loading';
import { useAuth } from '@/contexts/authContext';
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from '@/service/transactionService';
import TransactionList from '@/components/TransactionList';

const Statistics = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    if (!user?.uid) return;
    if (activeIndex == 0) {
      getWeeklyStats();
    }
    if (activeIndex == 1) {
      getMonthlyStats();
    }
    if (activeIndex == 2) {
      getYearlyStats();
    }
  }, [activeIndex, user?.uid]);
  const getWeeklyStats = async () => {
    setChartLoading(true);
    let res = await fetchWeeklyStats(user?.uid as string)
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats)
      setTransactions(res?.data?.transactions)
    } else {
      Alert.alert("Error", res.msg);
    }
  };
  const getMonthlyStats = async () => {
    setChartLoading(true);
    let res = await fetchMonthlyStats(user?.uid as string)
    setChartLoading(false);
    if (res.success) {
      //  console.log("Chart data about to render:", JSON.stringify(res?.data?.stats));
      setChartData(res?.data?.stats)
      setTransactions(res?.data?.transactions)
    } else {
      Alert.alert("Error", res.msg);
    }

  };
  const getYearlyStats = async () => {
    setChartLoading(true);
    let res = await fetchYearlyStats(user?.uid as string)
    setChartLoading(false);
    if (res.success) {
      //  console.log("Chart data about to render:", JSON.stringify(res?.data?.stats));
      setChartData(res?.data?.stats)
      setTransactions(res?.data?.transactions)
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  return (
    <ScreenWrapper>

      <View style={styles.container}>
        <View style={styles.header}>
          <Header title='Statistics' />

        </View>
        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentControl
            values={['Weekly', 'Monthly', 'Yearly']}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex)
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance='dark'
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
          >

          </SegmentControl>
          <View style={styles.chartContainer}>

            {
              chartData.length > 0 ? (
                <BarChart

                  data={chartData}
                  barWidth={scale(12)}
                  spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                  roundedBottom
                  roundedTop
                  hideRules
                  yAxisLabelSuffix='৳'
                  yAxisThickness={0}
                  xAxisThickness={0}
                  yAxisLabelWidth={[1, 2].includes(activeIndex) ? scale(60) : scale(50)}
                  // hideYAxisText
                  yAxisTextStyle={{ color: colors.neutral350 }}
                  xAxisLabelTextStyle={{
                    color: colors.neutral350,
                    fontSize: verticalScale(12)
                  }}
                  // xAxisLabelsHeight={scale(60)}
                  noOfSections={3}
                  minHeight={5}
                // maxValue={100}
                // isAnimated={true}

                />

              ) : (
                <View style={styles.noChart}></View>
              )
            }
          </View>
          {
            chartLoading && (
              <View style={styles.chartLoadingContainer}>
                <Loading color={colors.white} />
              </View>
            )
          }

          {/* Transactions */}
          <View>
            <TransactionList
              title='Transactions'
              emptyListMessage='No Transactions Found'
              data={transactions}
            />


          </View>

        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default Statistics

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",

  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",



  },
  header: {


  },
  noChart: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    height: verticalScale(210),

  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous",

  },
  segmentStyle: {
    height: scale(37)

  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black

  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10
  }
})