import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import { Section } from '@react-email/section';
import { Container } from '@react-email/container';

interface verificationCodeParams {
  code: string;
}

export default function verificationCodeTemplate({
  code,
}: verificationCodeParams) {
  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>your verification code is: {code}</Text>
        </Container>
      </Section>
    </Html>
  );
}

// Styles for the email template
const main = {
  backgroundColor: '#ffffff',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#000000',
};
