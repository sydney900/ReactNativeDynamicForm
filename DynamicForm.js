import React, { Fragment, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Switch,
  Picker,
  KeyboardAvoidingView
} from "react-native";
import DatePicker from "react-native-datepicker";
import { Formik } from "formik";
import { ScrollView } from "react-native-gesture-handler";

const CheckBox = props => {
  const { formikProps, field, ...rest } = props;
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label}>{field.label + ":"}</Text>
        <Switch
          {...rest}
          value={formikProps.values[field.name]}
          onValueChange={value => formikProps.setFieldValue(field.name, value)}
        />
      </View>
      <Text style={styles.error}>
        {formikProps.touched[field.name] && formikProps.errors[field.name]}
      </Text>
    </View>
  );
};

const MyDatePicker = props => {
  const { formikProps, field } = props;

  return (
    <View>
      <View style={[styles.row, { alignItems: "center" }]}>
        <Text style={styles.label}>{field.label + ":"}</Text>
        <DatePicker
          style={[styles.datepicker, { borderBottomColor: "transparent" }]}
          customStyles={{
            dateInput: { marginLeft: 3 }
          }}
          name={field.name}
          mode="date"
          date={formikProps.values[field.name]}
          placeholder={field.label}
          onDateChange={formikProps.handleChange(field.name)}
        />
      </View>
      <Text style={styles.error}>
        {formikProps.touched[field.name] && formikProps.errors[field.name]}
      </Text>
    </View>
  );
};

const TextArea = props => {
  const { formikProps, field } = props;
  return (
    <Common
      formikProps={formikProps}
      field={field}
      multiline
      numberOfLines={field.numberOfLines}
    />
  );
};

const Password = props => {
  const { formikProps, field } = props;
  return <Common formikProps={formikProps} field={field} secureTextEntry />;
};

const Select = props => {
  const { formikProps, field } = props;

  return (
    <View>
      <View style={[styles.row, { alignItems: "center" }]}>
        <Text style={styles.label}>{field.label + ":"}</Text>
        <Picker
          style={styles.datepicker}
          selectedValue={formikProps.values[field.name]}
          onValueChange={(itemValue, itemIndex) =>
            formikProps.setFieldValue(field.name, itemValue)
          }
        >
          {field.options.map(option => (
            <Picker.Item
              label={option.label}
              value={option.value}
              key={option.value}
            />
          ))}
        </Picker>
      </View>
      <Text style={styles.error}>
        {formikProps.touched[field.name] && formikProps.errors[field.name]}
      </Text>
    </View>
  );
};

const Common = props => {
  const { formikProps, field, ...rest } = props;

  stateColorStyle = () => {
    if (formikProps.touched[field.name] && formikProps.errors[field.name]) {
      return { borderBottomColor: "red" };
    } else {
      return { borderBottomColor: "grey" };
    }
  };

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label}>{field.label + ":"}</Text>
        <TextInput
          style={[styles.input, stateColorStyle()]}
          name={field.name}
          onChangeText={formikProps.handleChange(field.name)}
          onBlur={formikProps.handleBlur(field.name)}
          placeholder={field.placeholder}
          {...rest}
        />
      </View>
      <Text style={styles.error}>
        {formikProps.touched[field.name] && formikProps.errors[field.name]}
      </Text>
    </View>
  );
};

const DynamicForm = props => {
  const { fields, validationSchema } = props;
  const initialValues = {};
  fields &&
    fields.forEach(
      field =>
        !initialValues[field.name] && (initialValues[field.name] = field.value)
    );

  const lastFieldIndex = !fields ? fields.length - 1 : -1;
  return (
    <Formik
      onSubmit={props.onSubmit}
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      {formikProps => {
        return (
          <ScrollView>
            <KeyboardAvoidingView>
              {fields.map((field, index) => {
                if (field.type === "select") {
                  return (
                    <Select
                      formikProps={formikProps}
                      field={field}
                      key={field.name}
                      returnKeyType={index === lastFieldIndex ? "send" : "next"}
                    />
                  );
                }

                if (field.type === "checkbox") {
                  return (
                    <CheckBox
                      formikProps={formikProps}
                      field={field}
                      key={field.name}
                      returnKeyType={index === lastFieldIndex ? "send" : "next"}
                    />
                  );
                }

                if (field.type === "password") {
                  return (
                    <Password
                      formikProps={formikProps}
                      field={field}
                      key={field.name}
                      returnKeyType={index === lastFieldIndex ? "send" : "next"}
                      autoFocus={index === 0 ? true : false}
                    />
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <TextArea
                      formikProps={formikProps}
                      field={field}
                      key={field.name}
                      returnKeyType={index === lastFieldIndex ? "send" : "next"}
                      autoFocus={index === 0 ? true : false}
                    />
                  );
                }

                if (field.type === "date") {
                  return (
                    <MyDatePicker
                      formikProps={formikProps}
                      field={field}
                      key={field.name}
                      returnKeyType={index === lastFieldIndex ? "send" : "next"}
                    />
                  );
                }

                return (
                  <Common
                    formikProps={formikProps}
                    field={field}
                    key={field.name}
                    returnKeyType={index === lastFieldIndex ? "send" : "next"}
                    autoFocus={index === 0 ? true : false}
                  />
                );
              })}

              {formikProps.isSubmitting ? (
                <ActivityIndicator size="large" />
              ) : (
                <Fragment>
                  <Button
                    style={styles.input}
                    title="Submit"
                    disabled={!formikProps.isValid}
                    onPress={formikProps.handleSubmit}
                  />
                  <Text style={styles.error}>
                    {formikProps.errors.submitError}
                  </Text>
                </Fragment>
              )}
            </KeyboardAvoidingView>
          </ScrollView>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  error: {
    padding: 2,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 10,
    color: "red"
  },
  row: {
    flexDirection: "row"
  },
  label: {
    padding: 2,
    margin: 10,
    marginLeft: 10,
    marginRight: 0,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    color: "grey"
  },
  input: {
    flex: 1,
    padding: 2,
    margin: 10,
    marginLeft: 0,
    marginRight: 10,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    textAlignVertical: "top"
  },
  datepicker: {
    flex: 1,
    padding: 2,
    margin: 10,
    marginLeft: 0,
    marginRight: 10,
    borderBottomColor: "grey",
    borderBottomWidth: 1
  }
});

export default DynamicForm;
