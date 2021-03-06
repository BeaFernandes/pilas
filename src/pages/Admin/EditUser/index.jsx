import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Keyboard,
  Switch,
} from "react-native";
import { React, useState } from "react";
import useList from "hooks/useList";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function EditUser({ route, navigation }) {
  const user = route.params.user;
  const users = useList("users");

  const [name, onChangeName] = useState(user.name);
  const [email, onChangeEmail] = useState(user.email);
  const [department, onChangeDepartment] = useState(user.department);
  const [balance, onChangeBalance] = useState(user.balance);
  const [isActive, setIsActive] = useState(user.isActive);
  const [isMayor, setIsMayor] = useState(user.isMayor);
  const toggleSwitchActive = () =>
    setIsActive((previousState) => !previousState);
  const toggleSwitchMayor = () => setIsMayor((previousState) => !previousState);

  if (!users) return <Text>Carregando...</Text>;

  const handleUpdate = () => {
    if (name && email && department && balance) {
      Keyboard.dismiss();
      users.update(user.key, {
        userId: user.userId,
        name: name,
        email: email,
        department: department,
        balance: balance,
        isAdmin: false,
        isMayor: isMayor,
        isActive: isActive,
      });
      Alert.alert("Sucesso", "Usuário atualizado com sucesso", [
        {
          text: "Ok",
          onPress: () => navigation.navigate("Users"),
        },
      ]);
    } else {
      Alert.alert("Erro", "Existem campos vazios", [
        {
          text: "Ok",
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={onChangeName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={onChangeEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Departamento"
          value={department}
          onChangeText={onChangeDepartment}
        />
        <TextInput
          style={styles.input}
          placeholder="Saldo em pila"
          value={balance}
          onChangeText={onChangeBalance}
        />
        <View style={styles.buttonsRow}>
          <View>
            <BouncyCheckbox
              fillColor="#36A7D0"
              text="Prefeito"
              iconStyle={{ borderColor: "#36A7D0", borderRadius: 5 }}
              textStyle={{ textDecorationLine: "none" }}
              isChecked={isMayor}
              onPress={(val) => {
                setIsMayor(val);
              }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.text}>Desativado</Text>
            <Switch
              trackColor={{ false: "#8D8D8D", true: "#36A7D0" }}
              thumbColor={isActive ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchActive}
              value={isActive}
            />
            <Text style={styles.text}>Ativo</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  form: {
    width: "90%",
    alignItems: "stretch",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    color: "#8D8D8D",
  },
  text: {
    color: "#8D8D8D",
  },
  button: {
    marginTop: 30,
    padding: 10,
    height: 60,
    backgroundColor: "#36A7D0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    minWidth: "45%",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
