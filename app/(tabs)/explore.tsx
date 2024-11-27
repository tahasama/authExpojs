import { useAuth } from "@/context/AuthContext";
import { StyleSheet, View, Text } from "react-native";

export default function TabTwoScreen() {
  const { user, login, logout } = useAuth();
  return (
    <View>
      <Text style={styles.title}>
        {user ? "Explore" : "no user please login"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ddd",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 80,
  },
});
