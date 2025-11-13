
import Container from './Container';

const Footer = ({ names, dateLabel }) => (
  <footer className="py-10 text-center text-slate-600">
    <Container>
      <small>Com amor, {names} • {dateLabel}</small>
    </Container>
  </footer>
);
export default Footer;