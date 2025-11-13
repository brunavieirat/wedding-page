import Button from "./Button";
import Container from "./Container";


const Hero = ({ names, dateLabel, cityArea }) => (
  <header className="relative text-center text-white overflow-hidden font-sans">
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/IMG_0972.jpg')" }} />
    <div className="absolute inset-0 bg-green-950/40" />
    <Container className="relative z-10 py-24 sm:py-32">
      <div className="inline-block text-emerald-900 px-3 py-8 rounded-full  shadow-sm">
      {/* {dateLabel} */}
      </div>
      <h1 className="font-great-vibes text-5xl sm:text-7xl font-bold tracking-wide mt-4 drop-shadow-lg text-white">{names}</h1>
      <br></br>
      <p className="mt-2 text-sky-100 text-">Com amor, convidamos você para celebrar conosco  <br></br> {cityArea}</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button href="#rsvp" variant="outline">Confirmar presença</Button>
        <Button href="#presentes">Ver presentes</Button>
         {/* <Button href={siteConfig.mapsHref} target="_blank" variant="outline" className="mb-3">Como chegar</Button> */}
      </div>
    </Container>
  </header>
);

export default Hero;