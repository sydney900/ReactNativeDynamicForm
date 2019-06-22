import React from "react";
import { View, Button } from "react-native";

import * as yup from "yup";
import DynamicForm from "./DynamicForm";

const fields = [
  {
    label: "Email",
    placeholder: "Please input email",
    type: "email",
    name: "email",
    value: ""
  },
  {
    label: "Password",
    placeholder: "Password",
    type: "password",
    name: "password",
    value: ""
  }
];

const schema = yup.object().shape({
  password: yup
    .string()
    .required()
    .min(3)
    .max(30),
  email: yup
    .string()
    .required()
    .email()
});

const Login = props => (
  <View>
    <DynamicForm
      fields={fields}
      validationSchema={schema}
      onSubmit={(data, actions) => {
        console.log("Submited", data);
        setTimeout(() => {
          actions.setSubmitting(false);
          actions.setFieldError("submitError", "Oops, something wrong");
        }, 1000);
      }}
    />
    <Button
      title="Sign Up"
      onPress={() => props.navigation.navigate("CreateUserScreen")}
    />
  </View>
);

export default Login;
