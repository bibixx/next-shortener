import React, { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import copy from 'copy-to-clipboard';
import {
  Form,
  Button,
  Col,
  Container,
  Row,
  Toast,
  ToastContainer,
  Navbar,
} from 'react-bootstrap';
import { basicAuthCheck } from 'utils/basicAuthCheck';
import { makeRequest } from 'utils/makeRequest';
import { isValidSlug } from 'utils/validators/createUrl.utils';
import { CreateUrlResponseDTO } from './api/url';
import { GOOGLE_SHEET_ID } from 'constants/env';

const defaultFormValues = { url: '', customSlug: '' };

const getUrl = (origin: string, slug: string) => `${origin}/${slug}`;

interface Props {
  sheetId: string;
}

const Admin = ({ sheetId }: Props) => {
  const [{ url, customSlug }, setFormData] = useState(defaultFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [origin, setOrigin] = useState('');
  const [createdSlug, setCreatedSlug] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const onChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(undefined);
      setFormData((formData) => ({
        ...formData,
        [name]: e.target.value,
      }));
    };

  const isSlugValid = customSlug === '' || isValidSlug(customSlug);
  const googleSheetsLink = `https://docs.google.com/spreadsheets/d/${sheetId}`;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isSlugValid) {
      return;
    }

    setError(undefined);
    setIsLoading(true);

    try {
      const response = await makeRequest<CreateUrlResponseDTO>(
        '/api/url',
        'POST',
        {
          URL: url.trim(),
          SLUG: customSlug,
        },
      );
      setIsLoading(false);

      setShowToast(true);
      setCreatedSlug(response.SLUG);
      setFormData(defaultFormValues);
      copy(getUrl(origin, response.SLUG));
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Link Shortener Admin</Navbar.Brand>
          <Navbar.Text
            as="a"
            target="_blank"
            href={`https://docs.google.com/spreadsheets/d/${sheetId}`}
          >
            Google Sheets
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container className="pt-3">
        <ToastContainer className="p-3" position="top-center">
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={5000}
            autohide
            bg="success"
          >
            <Toast.Header>
              <strong className="me-auto">An link created successfully!</strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              <div>
                It&apos;s available at{' '}
                <a href={getUrl(origin, createdSlug)} className="text-white">
                  {getUrl(origin, createdSlug)}
                </a>
                .
              </div>
              <div>It was copied to clipboard.</div>
            </Toast.Body>
          </Toast>
        </ToastContainer>
        <Row>
          <Col>
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Url</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="Enter url"
                  value={url}
                  onChange={onChange('url')}
                  disabled={isLoading}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Custom Slug</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Custom Slug"
                  value={customSlug}
                  onChange={onChange('customSlug')}
                  disabled={isLoading}
                  isInvalid={!isSlugValid}
                />
                <Form.Control.Feedback type="invalid">
                  You can only use{' '}
                  <span className="font-monospace">a-z A-Z 0-9 - . _</span> in
                  the slug
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Enter a custom slug that will be used in the link.
                  {customSlug && (
                    <div>
                      The link will look like this: {getUrl(origin, customSlug)}
                    </div>
                  )}
                </Form.Text>
              </Form.Group>
              {error && <div className="text-danger mb-3">{error}</div>}
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Add New Link'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Admin;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await basicAuthCheck(ctx.req, ctx.res);

  return {
    props: {
      sheetId: GOOGLE_SHEET_ID,
    },
  };
};
