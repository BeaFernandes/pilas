import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Transaction from "./Transaction";
import currentUser from "../../services/currentUser";
import useList from "hooks/useList";
import listToArray from "../../services/listToArray";
//import { getAuth } from "firebase/auth";

export default function Extract() {
  const [userId, setUserId] = useState("");

  currentUser()
    .getCurrentUser()
    .then((response) => {
      setUserId(JSON.parse(response).userId);
    });

  const { data } = useList(userId + "/extract/");
  const extractRecord = data;

  if (!extractRecord) return <Text>Carregando...</Text>;

  const extractArray = listToArray(extractRecord);

  const renderRecord = ({ item }) => (
    <Transaction
      type={item.type}
      name={item.product}
      price={item.price}
      amount={item.amount}
      total={item.total}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={extractArray}
        renderItem={renderRecord}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    minWidth: "100%",
  },
});
