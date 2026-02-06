import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface SplashScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const cardAnim1 = new Animated.Value(0);
  const cardAnim2 = new Animated.Value(0);

  useEffect(() => {
    // Staggered animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
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
          delay: 150,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>₦</Text>
          </View>
          <Text style={styles.logoText}>Next Pay</Text>
        </View>

        {/* Credit Cards */}
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

        {/* Main Content */}
        <View style={styles.textContent}>
          <Text style={styles.mainTitle}>Manage Your Money</Text>
          <Text style={styles.mainTitle}>Smarter</Text>
          <Text style={styles.subtitle}>
            Take control of your finances with insights that help you spend
            wisely and save more effortlessly.
          </Text>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate("Registration")}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        {/* Already Have Account */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.haveAccountText}>I Have an account</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
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
  cardsContainer: {
    width: width * 0.85,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
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
    height: 180,
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
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 2,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontStyle: "italic",
  },
  textContent: {
    alignItems: "center",
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  getStartedButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#FF6B6B",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
    color: "#FF6B6B",
    fontWeight: "600",
  },
});
