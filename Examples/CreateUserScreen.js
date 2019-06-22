import React from "react";
import { View, Button } from "react-native";
import * as yup from "yup";
import DynamicForm from "./DynamicForm";

const fields = [
  {
    label: "Name",
    placeholder: "You name will be displayed",
    name: "name",
    value: ""
  },
  {
    label: "Birthdate",
    placeholder: "birthdate",
    type: "date",
    name: "birthdate",
    value: ""
  },
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
  },
  {
    label: "Confirm password",
    placeholder: "Confirm password",
    type: "password",
    name: "confirmPassword",
    value: ""
  },
  {
    label: "Notes",
    placeholder: "Notes",
    type: "textarea",
    name: "notes",
    value: "",
    numberOfLines: 3
  },
  { label: "agree terms", type: "checkbox", name: "agreeTerm", value: false },
  {
    label: "Language",
    type: "select",
    name: "preferLanguage",
    value: "",
    options: [{ label: "English", value: 1 }, { label: "Spanish", value: 2 }]
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
    .email(),
  confirmPassword: yup
    .string()
    .required()
    .test(
      "passwords-match",
      "Confirm password must matches the password",
      function(value) {
        return this.parent.password === value;
      }
    ),
  birthdate: yup.date().default(function() {
    return new Date();
  }),
  preferLanguage: yup
    .number()
    .min(0)
    .max(10)
});

const CreateUserScreen = props => (
  <View>
    <DynamicForm
      fields={fields}
      validationSchema={schema}
      onSubmit={(data, actions) => {
        console.log("Submited", data);
        setTimeout(() => {
          actions.setSubmitting(false);
        }, 1000);
      }}
    />
    <Button
      title="Sign up"
      onPress={props.navigation.navigate("CreateUserScreen")}
    />
  </View>
);

export default CreateUserScreen;
