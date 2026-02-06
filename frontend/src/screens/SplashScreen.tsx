import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

interface SplashScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get("window");

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  cards: boolean;
  transactions?: boolean;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Manage Your Money",
    subtitle:
      "Take control of your finances with insights that help you spend wisely and save more effortlessly.",
    cards: true,
  },
  {
    id: 2,
    title: "Track. Analyze. Grow.",
    subtitle:
      "Get a clear view of your spending, track every cash flow, and reach your financial goals with smart insights.",
    cards: false,
  },
  {
    id: 3,
    title: "Your Finance, Simplified.",
    subtitle:
      "Experience effortless money management with a modern design that keeps everything organized.",
    transactions: true,
  },
];

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const cardAnim1 = useRef(new Animated.Value(1)).current;
  const cardAnim2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate when component first mounts
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(cardAnim1, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(cardAnim2, {
          toValue: 1,
          delay: 100,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeAnim, slideAnim, cardAnim1, cardAnim2]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlide(currentIndex);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    scrollViewRef.current?.scrollTo({ x: width * index, animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoIcon}>₦</Text>
        </View>
        <Text style={styles.logoText}>Finexa</Text>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        style={styles.carousel}
      >
        {slides.map((slide, slideIndex) => (
          <View key={slide.id} style={styles.slide}>
            <Animated.View
              style={[
                styles.slideContent,
                slideIndex === 0 && {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Cards Section */}
              {slide.cards && (
                <View style={styles.cardsContainer}>
                  <Animated.View
                    style={[
                      styles.cardWrapper,
                      {
                        opacity: cardAnim1,
                        transform: [
                          {
                            translateX: cardAnim1.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-50, 0],
                            }),
                          },
                          {
                            rotate: cardAnim1.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["-5deg", "-8deg"],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={["#1a1a1a", "#4a4a4a", "#8B4513"]}
                      style={styles.card}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.cardTop}>
                        <View style={styles.contactlessIcon}>
                          <View style={styles.waveIcon} />
                        </View>
                      </View>
                      <Text style={styles.cardNumber}>3455 4562 7</Text>
                      <View style={styles.cardBottom}>
                        <View>
                          <Text style={styles.cardLabel}>Card Holder</Text>
                          <Text style={styles.cardInfo}>John Doe</Text>
                        </View>
                        <Text style={styles.visa}>VISA</Text>
                      </View>
                    </LinearGradient>
                  </Animated.View>

                  <Animated.View
                    style={[
                      styles.cardWrapper,
                      styles.cardSecond,
                      {
                        opacity: cardAnim2,
                        transform: [
                          {
                            translateX: cardAnim2.interpolate({
                              inputRange: [0, 1],
                              outputRange: [50, 0],
                            }),
                          },
                          {
                            rotate: cardAnim2.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["5deg", "8deg"],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={["#FF6B6B", "#FF8E53"]}
                      style={styles.card}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.cardTop}>
                        <View style={styles.contactlessIcon}>
                          <View style={styles.waveIcon} />
                        </View>
                      </View>
                      <Text style={styles.cardNumber}>3455 1422 0710 9217</Text>
                      <View style={styles.cardBottom}>
                        <View>
                          <Text style={styles.cardLabel}>Card Holder</Text>
                          <Text style={styles.cardInfo}>John Doe</Text>
                        </View>
                        <View>
                          <Text style={styles.cardLabel}>Expires</Text>
                          <Text style={styles.cardInfo}>12/26</Text>
                        </View>
                        <Text style={styles.visa}>VISA</Text>
                      </View>
                    </LinearGradient>
                  </Animated.View>
                </View>
              )}

              {/* Transactions Section */}
              {slide.transactions && (
                <View style={styles.transactionsContainer}>
                  <View style={styles.transactionItem}>
                    <View style={styles.transactionIcon}>
                      <Text style={styles.txIcon}>💳</Text>
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.txName}>Dribble</Text>
                      <Text style={styles.txType}>Subscribe</Text>
                      <Text style={styles.txTypeSmall}>Transfer</Text>
                    </View>
                    <Text style={styles.txAmount}>- $100.00</Text>
                  </View>

                  <View style={styles.transactionItem}>
                    <View style={styles.transactionIcon}>
                      <Text style={styles.txIcon}>🏦</Text>
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.txName}>Bank Transfer</Text>
                      <Text style={styles.txType}>Yesterday</Text>
                    </View>
                    <Text style={styles.txAmount}>-$90.90</Text>
                  </View>
                </View>
              )}

              {/* Chart Section (Slide 2) */}
              {slide.id === 2 && (
                <View style={styles.chartContainer}>
                  <View style={styles.chartBar}>
                    <View style={[styles.bar, { height: "40%" }]} />
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.bar, { height: "60%" }]} />
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.bar, { height: "45%" }]} />
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.bar, { height: "75%" }]} />
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.bar, { height: "55%" }]} />
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.bar, { height: "85%" }]} />
                  </View>
                </View>
              )}

              {/* Text Content */}
              <View style={styles.textContent}>
                <Text style={styles.mainTitle}>{slide.title}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
              </View>
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, currentSlide === index && styles.dotActive]}
            onPress={() => goToSlide(index)}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate("Registration")}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.haveAccountText}>I have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoIcon: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  carousel: {
    flex: 1,
    minHeight: 1,
  },
  slide: {
    width: width,
    minHeight: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  slideContent: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardsContainer: {
    width: width * 0.85,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  chartContainer: {
    flexDirection: "row",
    height: 120,
    alignItems: "flex-end",
    justifyContent: "space-around",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  chartBar: {
    width: 24,
    height: 100,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    backgroundColor: "#FF6B6B",
    borderRadius: 4,
  },
  transactionsContainer: {
    width: "100%",
    marginBottom: 30,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE4E4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  txIcon: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  txName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  txType: {
    fontSize: 12,
    color: "#999999",
    marginTop: 2,
  },
  txTypeSmall: {
    fontSize: 10,
    color: "#CCCCCC",
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  cardWrapper: {
    position: "absolute",
    width: "85%",
  },
  cardSecond: {
    zIndex: -1,
  },
  card: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    padding: 20,
    justifyContent: "space-between",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  contactlessIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  waveIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 2,
  },
  cardInfo: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  visa: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontStyle: "italic",
  },
  textContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDDDDD",
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: "#FF6B6B",
    width: 24,
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  getStartedButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#FF6B6B",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  haveAccountText: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "600",
    textAlign: "center",
  },
});
