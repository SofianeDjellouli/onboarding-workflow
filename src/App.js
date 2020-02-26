import React, { useState, useCallback, Fragment } from "react";
import { Grid, Message, Icon, List, Form, Button } from "semantic-ui-react";
import { Header, Input } from "./components";
import "semantic-ui-css/semantic.min.css";
import { defaultForm, fields, firebase, useToggle, handlePromise } from "./utils";
import "./style.css";

const App = _ => {
  const [form, setForm] = useState(defaultForm);
  const [admin, setAdmin] = useState("");
  const [admins, setAdmins] = useState([]);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  const toggleLoading = useToggle();

  const handleStep = useCallback(
    ({
      currentTarget: {
        dataset: { next }
      }
    }) => {
      if (next) {
        let errors = {};
        for (let i = 0; i < fields[step].length; i++) {
          const field = fields[step][i];
          if (!form[field].value) errors[field] = { value: "", error: "This field is required" };
        }
        if (Object.keys(errors).length) setForm({ ...form, ...errors });
        else setStep(step + 1);
      } else setStep(step - 1);
    },
    [form, step]
  );

  const handleChange = useCallback(
    ({ target: { name, value } }) => setForm(form => ({ ...form, [name]: { value, error: "" } })),
    []
  );

  const handleName = useCallback(
    name => {
      const { error, value } = form[name];
      return {
        name,
        error,
        value,
        "aria-label": name,
        id: name,
        onChange: handleChange
      };
    },
    [handleChange, form]
  );

  const handleAdminChange = useCallback(({ target: { value } }) => setAdmin(value), []);

  const handleAdmins = useCallback(
    e => {
      e.preventDefault();
      setAdmins(admins => [...admins, admin]);
      setAdmin("");
    },
    [admin]
  );

  const handleRemove = useCallback(
    ({
      currentTarget: {
        dataset: { i }
      }
    }) =>
      setAdmins(admins => {
        let _admins = [...admins];
        _admins.splice(i, 1);
        return _admins;
      }),
    []
  );

  const handleSubmit = useCallback(
    async e => {
      if (!/\S+@\S+\.\S+/.test(form.email.value)) {
        setForm(({ email, ...form }) => ({
          ...form,
          email: { ...email, error: "Email must to be in the format john@doe.com" }
        }));
        setStep(0);
        return;
      }
      if (!admins.length) setError("Please choose at least one admin.");
      else {
        let data = {};
        let formKeys = Object.keys(form);
        for (let i = 0; i < formKeys.length; i++) {
          const key = formKeys[i];
          data[key] = form[key].value;
        }
        data.admins = admins;
        await handlePromise(
          firebase
            .database()
            .ref("users")
            .push(data)
            .then(_ => {
              setForm(defaultForm);
              setAdmins("");
              setError("");
              setStep(0);
              window.alert("Thanks!");
            }),
          toggleLoading.toggle,
          setError
        ).catch(setError);
      }
    },
    [toggleLoading.toggle, admins, form]
  );

  return (
    <Grid container centered verticalAlign="middle" as="main">
      <Grid.Column computer={8} mobile={16}>
        <Message floating className="wrapper">
          {(_ => {
            switch (step) {
              case 0:
                return (
                  <Fragment>
                    <div>
                      <Grid>
                        <Grid.Column width={16}>
                          <Header>Hi there.</Header>
                        </Grid.Column>
                        <Grid.Column computer={8} mobile={16}>
                          <Input autoFocus label="First name" {...handleName("firstName")} />
                        </Grid.Column>
                        <Grid.Column computer={8} mobile={16}>
                          <Input label="Last name" {...handleName("lastName")} />
                        </Grid.Column>
                        <Grid.Column width={16}>
                          <Input label="Email" type="email" {...handleName("email")} />
                        </Grid.Column>
                      </Grid>
                    </div>
                    <Grid>
                      <Grid.Column width={16}>
                        <Button fluid primary onClick={handleStep} data-next>
                          PROCEED
                        </Button>
                      </Grid.Column>
                    </Grid>
                  </Fragment>
                );
              case 1:
                return (
                  <Fragment>
                    <div>
                      <Grid verticalAlign="middle">
                        <Grid.Column width={16}>
                          <Header>{`Hi ${form.firstName.value}`}</Header>
                        </Grid.Column>
                        <Grid.Column width={16}>What are your main goals with Slayte?</Grid.Column>
                        {[1, 2, 3].map(e => (
                          <Fragment key={e}>
                            <Grid.Column width={2}>{e}</Grid.Column>
                            <Grid.Column width={14}>
                              <Input autoFocus={e === 1} {...handleName(`goal${e}`)} />
                            </Grid.Column>
                          </Fragment>
                        ))}
                      </Grid>
                    </div>
                    <Grid>
                      <Grid.Column width={8}>
                        <Button fluid onClick={handleStep}>
                          Back
                        </Button>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <Button fluid primary onClick={handleStep} data-next>
                          PROCEED
                        </Button>
                      </Grid.Column>
                    </Grid>
                  </Fragment>
                );
              case 2:
                return (
                  <Fragment>
                    <div>
                      <Grid verticalAlign="middle">
                        <Grid.Column width={16}>
                          <Header>Way to go!</Header>
                        </Grid.Column>
                        <Grid.Column width={16}>
                          Let us know who should be admins in your setup, and then you're on your
                          way!
                        </Grid.Column>
                        {admins && admins.length > 0 && (
                          <Grid.Column as={List} width={16}>
                            {admins.map((e, i) => (
                              <List.Item key={e + i}>
                                <List.Content floated="right">
                                  <Icon
                                    name="minus circle"
                                    color="blue"
                                    data-i={i}
                                    onClick={handleRemove}
                                  />
                                </List.Content>
                                <List.Content>{e}</List.Content>
                              </List.Item>
                            ))}
                          </Grid.Column>
                        )}
                        <Grid.Column width={16} as={Form} onSubmit={handleAdmins}>
                          <Input
                            required
                            autoFocus
                            type="email"
                            onChange={handleAdminChange}
                            value={admin}
                          />
                          <div className="justify-center">
                            <Form.Button icon type="submit">
                              <Icon name="plus circle" size="big" color="blue" />
                            </Form.Button>
                          </div>
                        </Grid.Column>
                        {error && (
                          <Grid.Column width={16}>
                            <Message negative>
                              <Message.Header>{error}</Message.Header>
                            </Message>
                          </Grid.Column>
                        )}
                      </Grid>
                    </div>
                    <Grid>
                      <Grid.Column width={8}>
                        <Button fluid onClick={handleStep}>
                          Back
                        </Button>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <Button
                          fluid
                          positive
                          onClick={handleSubmit}
                          {...(toggleLoading.toggled
                            ? {
                                icon: true,
                                disabled: true,
                                children: <Icon loading name="spinner" />
                              }
                            : { content: "Finish" })}
                        />
                      </Grid.Column>
                    </Grid>
                  </Fragment>
                );
              default:
                return;
            }
          })()}
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default App;
