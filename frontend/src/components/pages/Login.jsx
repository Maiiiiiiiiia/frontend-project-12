import React from 'react';
import Card from 'react-bootstrap/Card';
import { Button, Form, CardBody } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import ROUTES from '../../utils/router';
import { useLoginMutation } from '../../slices/authSlice';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const { t } = useTranslation();
  const notifyErrorNetwork = () => toast.success(t('toast.errorNetwork'));
  const auth = useAuth();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const handleFormSubmit = async (values, { setErrors }) => {
    const { nickname, password } = values;
    const user = {
      username: nickname,
      password,
    };
    const { data, error } = await login(user);
    if (data) {
      auth.logIn(data.token, nickname);
      navigate(ROUTES.home);
    } if (error) {
      switch (error.status) {
        case 401: {
          setErrors({ password: t('loginPage.error') });
          break;
        }
        case 'FETCH_ERROR': {
          notifyErrorNetwork();
          break;
        }
        default: {
          setErrors({ password: t('loginPage.error') });
        }
      }
    }
  };

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <CardBody className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <Formik
                initialValues={{ nickname: '', password: '' }}
                onSubmit={handleFormSubmit}
              >
                {({
                  handleSubmit, handleChange, values, errors,
                }) => (
                  <Form onSubmit={handleSubmit} className="form">
                    <h1>{t('loginPage.logIn')}</h1>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="nickname">{t('loginPage.nickname')}</Form.Label>
                      <Form.Control
                        id="nickname"
                        required
                        value={values.nickname}
                        onChange={handleChange}
                        type="text"
                        name="nickname"
                        isInvalid={!!errors.password}
                        autoFocus
                      />
                    </Form.Group>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label htmlFor="password">{t('loginPage.password')}</Form.Label>
                      <Form.Control
                        id="password"
                        required
                        value={values.password}
                        onChange={handleChange}
                        type="password"
                        name="password"
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">{t('loginPage.error')}</Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" className="w-100" variant="outline-primary">{t('loginPage.logIn')}</Button>
                  </Form>
                )}
              </Formik>
            </CardBody>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('loginPage.footer.text')}</span>
                <Link to={ROUTES.signup}>{t('loginPage.footer.link')}</Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
