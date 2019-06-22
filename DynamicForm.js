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
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import DatePicker from "react-native-datepicker";
import { Formik } from "formik";

const CheckBox = props => {
  const { formikProps, field, ...rest } = props;
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label}>{field.label + ":"}</Text>
        <Switch
          onChangeText={value => formikProps.setFieldValue(field.name, value)}
          {...rest}
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
      <View style={styles.row}>
        <Text style={styles.label}>{field.label + ":"}</Text>
        <DatePicker
          style={styles.input}
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
      <View style={styles.row}>
        <Text style={styles.label}>{field.label + ":"}</Text>
        <Picker
          selectedValue={field.value}
          style={styles.input}
          //onChangeText={formikProps.handleChange(field.name)}
          onValueChange={(itemValue, itemIndex) =>
            formikProps.setFieldValue(field.name, itemValue)
          }
        >
          {field.options.map(option => (
            <Picker.Item label={option.label} value={option.value} />
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

  return (
    <Formik
      onSubmit={props.onSubmit}
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      {formikProps => {
        return (
          <KeyboardAvoidingView behavior="padding">
            <ScrollView>
              {fields.map(field => {
                if (field.type === "select") {
                  return (
                    <Select
                      formikProps={formikProps}
                      field={field}
                      key={field.name}
                    />
                  );
                }

                if (field.type === "checkbox") {
                  return (
                    <CheckBox
                      formikProps={formikProps}
                      field={field}
                      key={field.name}
                    />
                  );
                }

                if (field.type === "password") {
                  return (
                    <Password
                      formikProps={formikProps}
                      field={field}
                      key={field.name}
                    />
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <TextArea
                      formikProps={formikProps}
                      field={field}
                      key={field.name}
                    />
                  );
                }

                if (field.type === "date") {
                  return (
                    <MyDatePicker
                      formikProps={formikProps}
                      field={field}
                      key={field.name}
                    />
                  );
                }

                return (
                  <Common
                    formikProps={formikProps}
                    field={field}
                    key={field.name}
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
                  <Button
                    style={styles.input}
                    title="Back"
                    onKeyPress={() => props.navigation.goBack()}
                  >
                    Back
                  </Button>
                  <Text style={styles.error}>
                    {formikProps.errors.submitError}
                  </Text>
                </Fragment>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
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
    borderBottomWidth: 1
  }
});

export default DynamicForm;
